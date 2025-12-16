output "cloud_run_backend_url" {
  value = google_cloud_run_service.backend.status[0].url
}

output "cloud_sql_private_instance" {
  value = google_sql_database_instance.db_private.name
}

output "cloud_sql_private_ip" {
  value = google_sql_database_instance.db_private.private_ip_address
}

output "artifact_registry_repo" {
  value = google_artifact_registry_repository.repo.name
}
