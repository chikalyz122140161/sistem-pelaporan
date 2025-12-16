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

# --- CLOUD SQL POSTGRES INSTANCE ---

resource "google_sql_database_instance" "db" {
  name             = var.db_instance_name
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = var.db_tier

    ip_configuration {
      ipv4_enabled    = true
    }

    backup_configuration {
      enabled = true
    }
  }

  depends_on = [
    google_project_service.sqladmin
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

resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = var.artifact_repo
  format        = "DOCKER"
  description   = "SiLaporCloud images"

  depends_on = [google_project_service.artifactregistry]
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

# --- CLOUD RUN BACKEND SERVICE ---

resource "google_cloud_run_service" "backend" {
  name     = "sistem-pelaporan-backend"
  location = var.region

  template {
    metadata {
      annotations = {
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.db.connection_name
      }
    }

    spec {
      service_account_name = google_service_account.cloud_run_sa.email

      containers {
        image = var.cloud_run_image

        env {
          name  = "DB_HOST"
          value = "/cloudsql/${google_sql_database_instance.db.connection_name}"
        }

        env {
          name  = "DB_PORT"
          value = "5432"
        }

        env {
          name  = "DB_USER"
          value = google_sql_user.postgres.name
        }

        env {
          name  = "DB_PASSWORD"
          value = var.db_password
        }

        env {
          name  = "DB_NAME"
          value = var.db_name
        }

        env {
          name  = "JWT_SECRET"
          value = var.jwt_secret
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
