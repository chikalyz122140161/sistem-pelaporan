output "cloud_run_backend_url" {
  description = "URL publik Cloud Run backend"
  value       = google_cloud_run_service.backend.status[0].url
}

output "cloud_sql_instance_connection_name" {
  description = "Cloud SQL instance connection name"
  value       = google_sql_database_instance.db.connection_name
}

output "cloud_sql_database_name" {
  description = "Nama database aplikasi"
  value       = google_sql_database.app_db.name
}

output "artifact_registry_repo" {
  value = google_artifact_registry_repository.repo.name
}
