# API Specification – SiLaporCloud

## 1. Base URL

- Lokal: `http://localhost:8080/api`
- Produksi (Cloud Run): `https://sistem-pelaporan-backend-760131481707.asia-southeast2.run.app/api`

Selanjutnya:  
`BASE_URL = sistem-pelaporan-760131481707.asia-southeast2.run.app`

Format: JSON, header utama:

- `Content-Type: application/json`
- `Authorization: Bearer <JWT>` 

---

## 2. Autentikasi & Role

- Autentikasi: JWT (`POST /auth/login` → token)
- Role:
  - `USER` : registrasi, login, buat & lihat tiket sendiri
  - `ADMIN`: login, lihat semua tiket, ubah status tiket

---

## 3. Ringkasan Endpoint

| Kelompok | Method | Path                   | Deskripsi                          | Auth | Role       |
|----------|--------|------------------------|------------------------------------|------|------------|
| Umum     | GET    | `/`                    | Cek status API                     | Tidak| -          |
| Auth     | POST   | `/auth/register`       | Registrasi akun baru               | Tidak| -          |
| Auth     | POST   | `/auth/login`          | Login, hasilkan JWT                | Tidak| -          |
| Tiket    | GET    | `/tickets/my`          | Daftar tiket milik user            | Ya   | USER/ADMIN |
| Tiket    | POST   | `/tickets`             | Buat tiket baru                    | Ya   | USER/ADMIN |
| Tiket    | GET    | `/tickets`             | Daftar semua tiket                 | Ya   | ADMIN      |
| Tiket    | PATCH  | `/tickets/{id}/status` | Ubah status tiket tertentu         | Ya   | ADMIN      |
