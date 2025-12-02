# Arsitektur Sistem Pelaporan

## 1. Pendahuluan

Sistem Pelaporan adalah aplikasi web tiga-lapis (three-tier web application) yang digunakan untuk mengelola permintaan layanan dan pengaduan dari pengguna. Aplikasi ini di-deploy di Google Cloud Platform menggunakan layanan berbasis container dan managed database.

Tujuan utama arsitektur ini adalah:
- Memisahkan dengan jelas antara **presentation tier**, **application tier**, dan **data tier**.
- Memanfaatkan layanan terkelola GCP agar deployment dan scaling menjadi lebih sederhana.
- Menyediakan fondasi yang mudah dikembangkan untuk penambahan fitur di iterasi berikutnya.

## 2. Overview Arsitektur

Secara garis besar, arsitektur sistem terdiri dari:

- **Presentation Tier**  
  Aplikasi frontend berbasis React yang di-containerize dan di-deploy sebagai service di Cloud Run. Frontend menangani interaksi pengguna (form tiket, tampilan daftar tiket, dan dashboard admin).

- **Application Tier**  
  Backend API berbasis Node.js + Express yang juga di-deploy di Cloud Run. Layer ini mengimplementasikan logika bisnis, validasi data, autentikasi, dan komunikasi dengan database serta cache.

- **Data Tier**  
  Cloud SQL for PostgreSQL sebagai database relasional utama untuk menyimpan data pengguna dan tiket. Untuk optimasi performa, disediakan opsi in-memory cache menggunakan Memorystore for Redis.

Ketiga tier tersebut berjalan di dalam satu Google Cloud project dan dihubungkan melalui VPC Network.

## 3. Komponen Google Cloud yang Digunakan

1. **Cloud Run (Frontend)**  
   - Menjalankan container aplikasi React yang sudah di-build.
   - Mengekspos endpoint HTTPS publik yang diakses oleh browser pengguna.
   - Mendapatkan konfigurasi ENV seperti base URL API.

2. **Cloud Run (API Layer)**  
   - Menjalankan backend Node.js + Express.
   - Menyediakan endpoint REST seperti `/api/auth` dan `/api/tickets`.
   - Terhubung ke Cloud SQL dan Memorystore melalui Serverless VPC Access.
   - Dapat diskalakan otomatis berdasarkan jumlah request.

3. **Cloud SQL for PostgreSQL**  
   - Menyimpan data persisten: `users`, `tickets`, dan tabel lain yang dibutuhkan.
   - Diletakkan di private VPC dan hanya dapat diakses melalui koneksi terautentikasi dari Cloud Run API Layer.

4. **Memorystore for Redis (opsional)**  
   - Digunakan sebagai cache untuk data yang sering diakses (misalnya daftar tiket).
   - Membantu mengurangi beban query langsung ke database.

5. **VPC Network & Serverless VPC Access**  
   - Menghubungkan Cloud Run (API) ke resource privat seperti Cloud SQL dan Memorystore.
   - Menjaga agar koneksi database tidak diekspos ke internet publik.

6. **Artifact Registry**  
   - Menyimpan Docker image untuk frontend dan backend.
   - Menjadi source image ketika melakukan deploy ke Cloud Run.

7. **Cloud Build (opsional untuk CI/CD)**  
   - Mengotomatisasi proses build dan push Docker image ke Artifact Registry.
   - Dapat di-trigger otomatis dari GitHub ketika ada push ke branch tertentu.

8. **Terraform (Infrastructure as Code)**  
   - Mendefinisikan resource GCP (Cloud Run, Cloud SQL, VPC, dsb) dalam file konfigurasi.
   - Mempermudah provisioning dan pengelolaan infrastruktur secara terotomasi dan terdokumentasi.

9. **Secret Manager**  
   - Menyimpan nilai sensitif seperti database password, JWT secret, atau API key.
   - Diakses oleh Cloud Run service melalui environment variables yang terhubung ke Secret Manager.

## 4. Alur Request (Request Flow)

1. **Client Request**  
   Pengguna mengakses URL Cloud Run Frontend melalui browser. Browser mengirimkan HTTP request ke service frontend.

2. **Frontend Service**  
   Cloud Run frontend merespons request dengan mengirimkan file HTML, CSS, dan JavaScript yang merender tampilan aplikasi di sisi client.

3. **API Layer**  
   Ketika pengguna mengirim data (misalnya membuat tiket baru atau mengambil daftar tiket), frontend mengirimkan request ke Backend API yang berjalan di Cloud Run (API Layer) melalui endpoint `/api/...`.

4. **Cache Check (Memorystore)**  
   Untuk data tertentu yang sering diakses, API Layer terlebih dahulu memeriksa cache di Memorystore for Redis. Jika data tersedia di cache, API mengembalikan respons dari cache tanpa mengakses database.

5. **Database Query (Cloud SQL)**  
   Jika data tidak tersedia di cache atau operasi membutuhkan perubahan data (insert/update), API Layer mengirim query ke Cloud SQL melalui koneksi private di VPC. Setelah operasi database berhasil, API mengembalikan respons ke frontend dan dapat memperbarui cache jika diperlukan.

6. **Response ke Client**  
   Frontend menerima respons dari API, memperbarui state aplikasi (misalnya daftar tiket), dan menampilkan hasilnya kepada pengguna.

## 5. Keamanan dan Akses

- Akses ke Cloud Run API dikontrol melalui konfigurasi IAM dan (opsional) JWT / Identity Platform.
- Cloud SQL tidak diekspos ke publik; hanya dapat diakses melalui koneksi dari Cloud Run API yang menggunakan Serverless VPC Access dan kredensial yang disimpan di Secret Manager.
- Komunikasi antar komponen menggunakan HTTPS/TLS.

## 6. Skalabilitas dan Ketersediaan

- Cloud Run secara otomatis melakukan scaling berdasarkan jumlah request yang masuk.  
- Cloud SQL dapat diskalakan secara vertikal (upgrade machine type) maupun horizontal (read replica, jika dibutuhkan).  
- Dengan pendekatan stateless pada Cloud Run dan penyimpanan state di database, aplikasi relatif mudah diskalakan.

## 7. Kesimpulan

Arsitektur three-tier yang diimplementasikan pada Service Request Platform memisahkan tanggung jawab setiap layer dengan jelas, memanfaatkan layanan managed pada Google Cloud Platform, dan memudahkan proses deployment, pemeliharaan, dan pengembangan fitur di iterasi berikutnya.
