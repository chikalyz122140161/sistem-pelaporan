# Arsitektur Sistem Pelaporan

## 1. Pendahuluan

Sistem Pelaporan adalah aplikasi web **three-tier (tiga lapis)** yang digunakan untuk mengelola tiket atau permintaan layanan dari pengguna. Sistem ini diimplementasikan dan di-deploy menggunakan **Google Cloud Platform (GCP)** dengan pendekatan container dan layanan terkelola.

Tujuan utama perancangan arsitektur ini adalah:

- Memisahkan tanggung jawab antara **presentation tier**, **application tier**, dan **data tier**.
- Memanfaatkan layanan managed GCP untuk mempermudah deployment, scaling, dan pemeliharaan.
- Meningkatkan keamanan dengan penggunaan **database private IP** dan **Secret Manager**.

---

## 2. Overview Arsitektur

Arsitektur Sistem Pelaporan terdiri dari tiga lapisan utama:

### 2.1 Presentation Tier (Frontend)

Frontend dibangun menggunakan **React (Vite)** dan di-build menjadi aset statis (`dist`). Aplikasi frontend dikemas dalam container dan di-deploy sebagai service pada **Cloud Run**. Frontend bertugas menampilkan antarmuka pengguna seperti form pengajuan tiket, daftar tiket, dan dashboard admin, serta berkomunikasi dengan backend melalui HTTPS.

### 2.2 Application Tier (Backend API)

Backend dikembangkan menggunakan **Node.js + Express** dan di-deploy sebagai service pada **Cloud Run**. Backend berfungsi sebagai REST API yang menangani autentikasi, autorisasi, validasi data, serta operasi CRUD tiket. Backend bersifat stateless dan dapat diskalakan otomatis.

### 2.3 Data Tier (Database)

Data persisten disimpan pada **Cloud SQL for PostgreSQL**. Database dikonfigurasi menggunakan **private IP**, sehingga tidak dapat diakses langsung dari internet publik. Akses database hanya diperbolehkan dari backend melalui jaringan privat.

---

## 3. Komponen Google Cloud yang Digunakan

1. **Cloud Run (Frontend)**

   - Menjalankan container aplikasi React hasil build.
   - Mengekspos endpoint HTTPS publik.
   - Menggunakan variabel lingkungan `VITE_API_BASE_URL` untuk menentukan alamat backend API.

2. **Cloud Run (Backend API)**

   - Menjalankan aplikasi Node.js + Express.
   - Menyediakan endpoint REST seperti `/api/auth` dan `/api/tickets`.
   - Terhubung ke resource privat menggunakan **Serverless VPC Access**.
   - Menggunakan konfigurasi egress `private-ranges-only` untuk membatasi lalu lintas keluar.

3. **Cloud SQL for PostgreSQL (Private IP)**

   - Menyimpan data utama seperti `users`, `tickets`, dan tabel pendukung lainnya.
   - Menggunakan private IP sehingga tidak terekspos ke publik.
   - Diakses oleh backend melalui jaringan VPC.

4. **VPC Network & Private Service Access (PSA)**

   - VPC digunakan sebagai jaringan privat untuk resource internal.
   - PSA digunakan untuk mengaktifkan Cloud SQL private IP di dalam VPC.

5. **Serverless VPC Access Connector**

   - Menghubungkan Cloud Run backend (serverless) ke resource privat di VPC seperti Cloud SQL.
   - Memastikan koneksi database tidak melalui internet publik.

6. **Artifact Registry**

   - Menyimpan Docker image untuk frontend dan backend.
   - Menjadi sumber image saat deployment ke Cloud Run.

7. **Terraform (Infrastructure as Code)**

   - Digunakan untuk mendefinisikan dan mengelola resource GCP seperti Cloud Run, Cloud SQL, VPC, VPC Connector, IAM, dan Secret Manager.
   - Memastikan provisioning infrastruktur konsisten dan terdokumentasi.

8. **Secret Manager**
   - Menyimpan data sensitif seperti `DB_PASSWORD` dan `JWT_SECRET`.
   - Secret di-inject ke Cloud Run backend menggunakan **secret environment variables (`secretKeyRef`)**, sehingga tidak disimpan sebagai plaintext.

---

## 4. Alur Request (Request Flow)

1. **Akses Frontend**  
   Pengguna mengakses URL Cloud Run Frontend melalui browser. Cloud Run mengirimkan file HTML, CSS, dan JavaScript ke client.

2. **Pemanggilan Backend API**  
   Frontend mengirim request HTTPS ke backend API melalui endpoint `/api/...` untuk proses login, pengambilan data tiket, atau pengelolaan tiket.

3. **Proses di Backend**  
   Backend memverifikasi token JWT untuk endpoint yang memerlukan autentikasi. Untuk endpoint admin, backend menerapkan middleware autorisasi (misalnya `isAdmin`).

4. **Akses Database Privat**  
   Backend melakukan query ke Cloud SQL PostgreSQL melalui **private IP** menggunakan Serverless VPC Access Connector. Karena egress diset ke `private-ranges-only`, koneksi database tidak keluar ke internet publik.

5. **Response ke Client**  
   Backend mengembalikan response JSON ke frontend. Frontend memperbarui state aplikasi dan menampilkan hasilnya ke pengguna.

---

## 5. Keamanan dan Akses

- Data sensitif tidak disimpan dalam kode atau environment variable biasa, melainkan di **Secret Manager**.
- Cloud SQL menggunakan **private IP**, sehingga tidak dapat diakses langsung dari internet.
- Backend Cloud Run mengakses database melalui VPC dengan koneksi privat.
- Endpoint backend dilindungi menggunakan **JWT-based authentication** dan kontrol role (admin/non-admin).

---

## 6. Skalabilitas dan Ketersediaan

- **Cloud Run** melakukan autoscaling berdasarkan jumlah request dan bersifat stateless.
- **Cloud SQL** dapat diskalakan secara vertikal dengan upgrade tier, serta mendukung strategi lanjutan seperti read replica jika dibutuhkan.
- Pemisahan frontend dan backend memungkinkan scaling masing-masing komponen secara independen.

---

## 7. Kesimpulan

Arsitektur three-tier pada Sistem Pelaporan memisahkan antarmuka pengguna, logika aplikasi, dan penyimpanan data secara jelas. Dengan memanfaatkan Cloud Run, Cloud SQL private IP, Serverless VPC Access, dan Secret Manager, sistem menjadi lebih aman, skalabel, dan mudah dikelola serta siap dikembangkan pada iterasi berikutnya.
