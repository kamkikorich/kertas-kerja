# Penjana Kertas Cadangan PERKESO

Aplikasi web ini bertujuan untuk memudahkan proses pembuatan kertas kerja atau kertas cadangan untuk program-program PERKESO. Berdasarkan contoh yang diberikan, aplikasi ini akan membolehkan pengguna mengisi borang secara interaktif dan menjana dokumen akhir yang kemas dan profesional.

## Keperluan Pengguna (User Review Required)

> [!IMPORTANT]
> Sila semak cadangan teknologi dan reka bentuk ini. Adakah anda bersetuju untuk menggunakan **React (Vite)** untuk membina aplikasi ini bagi memberikan pengalaman pengguna yang pantas dan moden?

## Soalan Terbuka

> [!NOTE]
> 1. Adakah anda ingin fungsi untuk memuat turun kertas kerja ini dalam format PDF (cetakan)?
> 2. Adakah anda mahu membenarkan pengguna menyimpan draf kerja mereka (menyimpan di dalam *local storage* pelayar)?
> 3. Adakah anda mempunyai warna tema spesifik selain warna korporat PERKESO (Kuning, Biru, Hitam)?

## Cadangan Perubahan & Pembangunan

Pembangunan aplikasi web ini akan dibahagikan kepada beberapa komponen utama. Kita akan menggunakan HTML, CSS (Reka bentuk Premium/Moden), dan JavaScript (menggunakan framework Vite + React). Projek ini akan dibina di dalam folder `d:\KertasCadanganPerkeso`.

### 1. Persediaan Projek (Project Setup)
- Membina projek baru menggunakan `vite` di dalam direktori `d:\KertasCadanganPerkeso`.
- Menyediakan struktur fail untuk komponen UI.

### 2. Komponen Antaramuka (UI Components)
Aplikasi ini akan dibahagikan kepada dua bahagian utama (Split View):
- **Panel Kiri (Borang Input):** Mengandungi borang untuk mengisi:
  - Maklumat Asas Program (Tarikh, Tempat, Masa)
  - Bahagian A: Maklumat Program (Objektif, Butiran, Kewangan, Pulangan Pelaburan)
  - Bahagian B: Pengesyoran & Sokongan
  - Bahagian C: Kelulusan Akhir
  - Lampiran & Justifikasi
- **Panel Kanan (Pratonton Langsung - Live Preview):** Menunjukkan paparan masa nyata kertas cadangan yang sedang dibina berdasarkan input di panel kiri. Reka bentuk dokumen akan menyerupai format rasmi.

### 3. Reka Bentuk Estetik
- Menggunakan tema korporat yang profesional (Biru gelap, Putih bersih, dengan aksen Emas/Kuning).
- *Glassmorphism* ringan untuk borang.
- *Micro-animations* apabila pengguna menaip atau menukar bahagian borang.
- Penggunaan tipografi moden seperti 'Inter' atau 'Roboto'.

## Pelan Pengesahan (Verification Plan)

### Ujian Automatik & Pelayar
- Menjalankan *development server* (`npm run dev`).
- Menggunakan ejen pelayar (browser subagent) untuk memastikan borang boleh diisi dan pratonton dikemas kini dengan betul.
- Memastikan butang "Cetak/Muat Turun PDF" berfungsi dan dokumen dipaparkan dengan susun atur yang betul.

### Pengesahan Manual
- Meminta anda (pengguna) mencuba aplikasi tersebut, mengisi contoh data yang anda berikan dan melihat hasil akhirnya.
