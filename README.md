# Kala's Live Ride (LiveRide Tracker) 🚴‍♂️✨

Aplikasi web interaktif untuk memantau aktivitas bersepeda secara *real-time* (langsung) menggunakan fitur **Strava Beacon**. Aplikasi ini dirancang dengan antarmuka bergaya premium (*dark mode*, *glassmorphism*, animasi latar belakang *Grainient* WebGL) dan memiliki fitur **Challenge Progress** interaktif (contoh: 1 Like = 500 meter).

---

## 📖 Panduan Pengguna (User Guide)

Aplikasi ini tidak memerlukan instalasi rumit bagi pengguna. Anda hanya perlu menggunakan browser web.

### 1. Memulai *Live Tracking*
1. Mulai aktivitas Anda di aplikasi **Strava** pada perangkat seluler (HP) Anda.
2. Aktifkan fitur **Strava Beacon** di aplikasi Strava dan dapatkan tautan (*link*) pelacakan langsungnya. (Biasanya berbentuk seperti `https://www.strava.com/beacon/ABC123XYZ`).
3. Buka halaman web utama **LiveRide** (contoh: `https://kala-ride.vercel.app/`).
4. Pada Halaman **Setup**, tempelkan (*paste*) *link* Strava Beacon tersebut ke dalam kolom **Strava Beacon Link / ID**.
5. (Opsional) Masukkan **Total Likes Awal** yang telah terkumpul sebelum mulai gowes.
6. Klik **Start Live Tracking**.

### 2. Membagikan Link ke Penonton / Audiens
Setelah menekan tombol *Start*, URL pada *browser* Anda akan otomatis berubah (misal menjadi `https://kala-ride.vercel.app/?beacon=ABC123XYZ&likes=100`).
- Salin (*copy*) URL panjang tersebut dan bagikan ke audiens Anda (melalui WhatsApp, Instagram, Twitter, dll).
- Audiens yang membuka link tersebut **tidak perlu** mengisi formulir *setup* lagi. Mereka akan langsung diarahkan ke layar *Dashboard Tracking*.
- Link tersebut juga sudah mendukung **Open Graph (OG)**, sehingga jika dibagikan di media sosial, akan muncul gambar pratinjau (*preview card*) yang elegan!

### 3. Membaca Dashboard Statistik
- **Peta (Map):** Menampilkan posisi dan pergerakan pengendara secara langsung di peta yang akan otomatis mengikuti (*auto-center*).
- **Challenge Progress:** Mengukur pencapaian target jarak berdasarkan jumlah *Likes* (1 Like = 500 Meter). Jika *bar* penuh, banner "CHALLENGE COMPLETE" otomatis muncul.
- **Statistik:** Jarak tempuh (Distance), Waktu berjalan (Moving Time), Kecepatan rata-rata (Avg Speed), dan sisa baterai perangkat (Battery).
- Saat aktivitas **Selesai** (Stopped), fitur baru akan muncul berupa *link* "Lihat Detail Aktivitas ↗" yang mengarahkan audiens ke ringkasan aktivitas lengkap Anda di situs Strava.

---

## 💻 Panduan Pengembang (Developer Guide)

Aplikasi ini dibangun menggunakan tumpukan teknologi modern: **Vite, React, Leaflet (Maps), dan OGL (Shader Background)**. 

### Prasyarat
- [Node.js](https://nodejs.org/) versi terbaru
- Akun [Vercel](https://vercel.com/) untuk melakukan *deployment*.

### Instalasi Lokal
1. Buka terminal (*Command Prompt / PowerShell*).
2. *Clone* repositori ini (atau buka *folder* proyeknya jika sudah ada di PC).
3. Jalankan perintah instalasi dependensi:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Akses `http://localhost:5173/` di browser Anda.

### Arsitektur Singkat
- `src/App.jsx` : File utama yang menangani *State* aplikasi (`isTracking`, pengaturan URL parameter), dan Layout *Header* & *Mobile Menu*.
- `src/components/Map.jsx` : Mengurus komponen peta Leaflet dan *custom marker* GPS.
- `src/components/Dashboard.jsx` : Menampilkan UI statistik samping (*Sidebar*), manipulasi angka *Challenge*, hingga tombol detail Strava.
- `src/services/strava.js` : _Scraper_ fungsional yang mengambil data mentah dari halaman HTML Strava Beacon dan mengubahnya menjadi objek JSON.
- `src/index.css` : Seluruh gaya (*styling*), responsivitas (*media queries*), dan animasi UI.
- `vercel.json` : Konfigurasi *serverless rewrite* khusus agar aplikasi bisa menghindari *CORS Error* saat mengambil data dari Strava secara langsung di tahap *Production*.

### Deployment ke Vercel
Aplikasi ini dioptimasi penuh untuk Vercel karena mengandalkan file `vercel.json` untuk menerjemahkan rute `/api/beacon` menjadi URL asli milik Strava.
1. Sambungkan repositori GitHub Anda ke Vercel.
2. Lakukan *Import Project* (`kala-ride`).
3. Vercel akan otomatis mengenali proyek ini sebagai **Vite**.
4. Klik **Deploy** tanpa perlu mengubah konfigurasi *build* apapun.
