# Platform Sistem Pelaporan

Aplikasi web tiga-lapis (three-tier web application) untuk mengelola permintaan layanan dan pengaduan pengguna. Proyek ini dibangun sebagai tugas implementasi **GCP Jump Start Solution – Three-Tier Web Application** dan di-deploy di Google Cloud Platform menggunakan Cloud Run dan Cloud SQL.

## 1. Fitur Utama

- User dapat:
  - Registrasi dan login
  - Membuat tiket pengaduan / service request
  - Melihat daftar tiket milik sendiri beserta statusnya

- Admin dapat:
  - Login sebagai admin
  - Melihat seluruh tiket yang masuk
  - Mengubah status tiket (OPEN, IN_PROGRESS, RESOLVED, CLOSED)

## 2. Arsitektur Singkat

- **Frontend**: React (Vite) → containerized → Cloud Run (Frontend)
- **Backend API**: Node.js + Express → containerized → Cloud Run (API Layer)
- **Database**: Cloud SQL for PostgreSQL
- **(Opsional)** Caching: Memorystore for Redis
- Infrastruktur didefinisikan menggunakan **Terraform** dan image disimpan di **Artifact Registry**.

Detail arsitektur dijelaskan pada `docs/architecture.md`.

## 3. Teknologi yang Digunakan

- **Frontend**: React, Vite, HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Cloud SQL)
- **Cloud Platform**: Google Cloud Platform  
  - Cloud Run, Cloud SQL, VPC Network, Secret Manager, Artifact Registry, Cloud Build (opsional), Memorystore (opsional)
- **Infrastructure as Code**: Terraform
- **Version Control**: Git + GitHub

## 4. Struktur Repository

```text
sistem-pelaporan/
├── frontend/
├── backend/
├── terraform/
├── docs/
├── scripts/
└── README.md
