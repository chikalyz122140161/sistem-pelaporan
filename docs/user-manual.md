# User Manual – SiLaporCloud

Dokumen ini menjelaskan cara menggunakan aplikasi **SiLaporCloud**, mulai dari registrasi, login, pembuatan tiket, hingga pengelolaan tiket oleh admin.

---

## 1. Akses Aplikasi

Aplikasi dapat diakses melalui URL berikut:

- **Frontend (PWA):**
  `sistem-pelaporan-760131481707.asia-southeast2.run.app`

- **Backend API:**
  `https://sistem-pelaporan-backend-760131481707.asia-southeast2.run.app/api`

Aplikasi mendukung mode **PWA**, sehingga dapat dipasang ke layar utama (Add to Home Screen) pada perangkat pendukung.

---

## 2. Registrasi Pengguna (User Registration)

Pengguna baru harus membuat akun terlebih dahulu.

**Langkah-langkah:**
1. Buka halaman **Daftar / Register**.
2. Isi data yang diminta:
   - Nama lengkap
   - Email
   - Password
3. Klik tombol **Daftar**.
4. Jika berhasil, sistem akan menampilkan pesan sukses dan pengguna dapat langsung login.

**Catatan:**
- Email harus valid dan belum pernah digunakan sebelumnya.
- Password minimal 6 karakter.

---

## 3. Login Pengguna

Akun yang sudah terdaftar dapat masuk ke sistem.

**Langkah-langkah:**
1. Buka halaman **Login**.
2. Masukkan email dan password.
3. Klik **Masuk**.
4. Jika autentikasi berhasil, pengguna diarahkan ke dashboard.

**Jika gagal login:**
- Pastikan email benar.
- Pastikan password sesuai.
- Jika lupa password, hubungi admin (fitur reset belum tersedia).

---

## 4. Dashboard Pengguna (User Dashboard)

Setelah login, pengguna dapat:

- Melihat tiket milik sendiri.
- Membuat tiket baru.
- Melihat status penyelesaian tiket.

---

## 5. Membuat Tiket Baru

Fitur ini digunakan untuk melaporkan masalah atau permintaan layanan.

**Langkah-langkah:**
1. Buka menu **Buat Tiket**.
2. Isi form:
   - **Judul tiket**  
   - **Deskripsi**  
   - **Kategori** (Umum / Teknis / Layanan)  
   - **Prioritas** (Low / Medium / High)
3. Klik **Kirim**.
4. Sistem akan menyimpan tiket dan menampilkannya pada daftar tiket pengguna.

**Status awal tiket:** `OPEN`

---

## 6. Melihat Tiket Sendiri

Untuk melihat tiket yang sudah dibuat:

1. Buka menu **Tiket Saya**.
2. Sistem menampilkan list tiket milik pengguna, lengkap dengan:
   - Judul  
   - Kategori  
   - Prioritas  
   - Status  
   - Tanggal pembuatan  

Pengguna dapat memantau status tiket tanpa harus menghubungi admin.

---

## 7. Peran Admin

Akun admin memiliki akses lebih luas dibanding pengguna biasa.

**Admin dapat:**
- Melihat seluruh tiket dari semua pengguna.
- Mengubah status tiket.
- Mengelola penyelesaian laporan masyarakat.

---

## 8. Melihat Semua Tiket (Admin)

**Langkah-langkah:**
1. Login sebagai Admin.
2. Buka menu **Semua Tiket**.
3. Sistem menampilkan seluruh tiket yang masuk, dengan filter:
   - Status (Open, In Progress, Resolved, Closed)
   - Prioritas
   - Kategori

Admin dapat memantau tiket yang perlu segera direspon.

---

## 9. Mengubah Status Tiket (Admin)

Admin dapat memperbarui progres penyelesaian tiket.

**Status yang tersedia:**
- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

**Cara mengubah status:**
1. Pilih tiket yang ingin diperbarui.
2. Klik tombol **Ubah Status**.
3. Pilih status baru.
4. Simpan perubahan.

Sistem akan memperbarui data dan mengirimkan status terbaru ke pengguna.

---

## 10. Logout

Untuk keluar dari aplikasi:

1. Klik profil atau menu **Logout**.
2. Token autentikasi akan dihapus dari perangkat.
3. Pengguna kembali ke halaman login.

---

## 11. Troubleshooting (Masalah yang Sering Terjadi)

### A. Tidak bisa login
- Email tidak terdaftar.
- Password salah.
- Format email tidak valid.

### B. Tidak bisa membuat tiket
- Form belum lengkap.
- Token pengguna kadaluarsa → lakukan login ulang.

### C. Admin tidak bisa mengubah status tiket
- Token admin tidak valid.
- Endpoint API gagal → periksa koneksi atau ulangi beberapa saat.
