variable "project_id" {
  description = "ID project GCP"
  type        = string
}

variable "region" {
  description = "Region utama untuk Cloud Run dan Cloud SQL"
  type        = string
  default     = "asia-southeast2"
}

variable "db_instance_name" {
  description = "Nama instance Cloud SQL PostgreSQL"
  type        = string
  default     = "silaporcloud-postgres"
}

variable "db_name" {
  description = "Nama database aplikasi"
  type        = string
  default     = "silaporcloud"
}

variable "db_tier" {
  description = "Tipe mesin Cloud SQL"
  type        = string
  default     = "db-custom-1-3840"
}

variable "db_password" {
  description = "Password user postgres di Cloud SQL"
  type        = string
  sensitive   = true
}

variable "cloud_run_image" {
  description = "URL container image backend (Artifact Registry / Container Registry)"
  type        = string
  # contoh: "asia-southeast2-docker.pkg.dev/PROJECT_ID/silaporcloud-backend/backend:latest"
}

variable "jwt_secret" {
  description = "JWT secret untuk backend"
  type        = string
  sensitive   = true
}

variable "artifact_repo" {
  description = "Artifact Registry repo name"
  type        = string
  default     = "silaporcloud"
}

variable "db_instance_name_private" {
  description = "Nama instance Cloud SQL PostgreSQL (private IP)"
  type        = string
  default     = "silaporcloud-postgres-private"
}
