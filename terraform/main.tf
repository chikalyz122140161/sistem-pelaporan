terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# --- ENABLE API YANG DIBUTUHKAN ---

resource "google_project_service" "run" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "sqladmin" {
  service            = "sqladmin.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "artifactregistry" {
  service            = "artifactregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "servicenetworking" {
  service            = "servicenetworking.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "compute" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "vpcaccess" {
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secretmanager" {
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
}


# --- CLOUD SQL POSTGRES INSTANCE ---

resource "google_sql_database_instance" "db" {
  name             = var.db_instance_name
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = var.db_tier

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }

    backup_configuration {
      enabled = true
    }
  }

  depends_on = [
    google_project_service.sqladmin,
    google_service_networking_connection.psa
  ]
}

resource "google_sql_database" "app_db" {
  name     = var.db_name
  instance = google_sql_database_instance.db.name
}

resource "google_sql_user" "postgres" {
  name     = "postgres"
  instance = google_sql_database_instance.db.name
  password = var.db_password
}

resource "google_sql_database_instance" "db_private" {
  name             = var.db_instance_name_private
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = var.db_tier

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }

    backup_configuration {
      enabled = true
    }
  }

  depends_on = [
    google_project_service.sqladmin,
    google_service_networking_connection.psa
  ]
}

resource "google_vpc_access_connector" "run_connector" {
  name    = "silapor-run-connector"
  region  = var.region
  network = google_compute_network.vpc.name

  ip_cidr_range = "10.8.0.0/28"

  depends_on = [
    google_project_service.vpcaccess,
    google_compute_network.vpc
  ]
}

resource "google_sql_database" "app_db_private" {
  name     = var.db_name
  instance = google_sql_database_instance.db_private.name
}

resource "google_sql_user" "postgres_private" {
  name     = "postgres"
  instance = google_sql_database_instance.db_private.name
  password = var.db_password
}


resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = var.artifact_repo
  format        = "DOCKER"
  description   = "SiLaporCloud images"

  depends_on = [google_project_service.artifactregistry]
}

resource "google_compute_network" "vpc" {
  name                    = "silapor-vpc"
  auto_create_subnetworks = true

  depends_on = [google_project_service.compute]
}

resource "google_compute_global_address" "psa_range" {
  name          = "silapor-psa-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "psa" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.psa_range.name]

  depends_on = [
    google_project_service.servicenetworking
  ]
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "silapor-db-password"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "db_password_v1" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "silapor-jwt-secret"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "jwt_secret_v1" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = var.jwt_secret
}

# --- SERVICE ACCOUNT UNTUK CLOUD RUN ---

resource "google_service_account" "cloud_run_sa" {
  account_id   = "silaporcloud-backend-sa"
  display_name = "SiLaporCloud Backend Service Account"
}

# Cloud Run butuh akses ke Cloud SQL
resource "google_project_iam_member" "cloud_run_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "db_password_access" {
  secret_id = google_secret_manager_secret.db_password.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}

resource "google_secret_manager_secret_iam_member" "jwt_secret_access" {
  secret_id = google_secret_manager_secret.jwt_secret.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloud_run_sa.email}"
}


# --- CLOUD RUN BACKEND SERVICE ---

resource "google_cloud_run_service" "backend" {
  name     = "sistem-pelaporan-backend"
  location = var.region

  template {
    metadata {
      annotations = {
        "run.googleapis.com/vpc-access-connector" = google_vpc_access_connector.run_connector.id
        "run.googleapis.com/vpc-access-egress"    = "private-ranges-only"
      }
    }

    spec {
      service_account_name = google_service_account.cloud_run_sa.email

      containers {
        image = var.cloud_run_image

        env {
          name  = "DB_HOST"
          value = google_sql_database_instance.db_private.private_ip_address
        }

        env {
          name  = "DB_PORT"
          value = "5432"
        }

        env {
          name  = "DB_USER"
          value = google_sql_user.postgres_private.name
        }

        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db_password.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "JWT_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.jwt_secret.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        ports {
          name           = "http1"
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_project_service.run,
    google_sql_database_instance.db,
    google_project_iam_member.cloud_run_sql_client
  ]
}

resource "google_cloud_run_service_iam_member" "public_invoker" {
  location = google_cloud_run_service.backend.location
  project  = var.project_id
  service  = google_cloud_run_service.backend.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
