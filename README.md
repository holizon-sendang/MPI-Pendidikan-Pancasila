# MPI Pendidikan Pancasila SMP

Media Pembelajaran Interaktif (MPI) untuk mata pelajaran **Pendidikan Pancasila** jenjang SMP Kelas 7, 8, dan 9 — Kurikulum Merdeka, Fase D, dengan pendekatan **Pembelajaran Mendalam** (Berkesadaran, Bermakna, Menggembirakan; alur Memahami, Mengaplikasi, Merefleksi).

Situs ini disusun agar nilai Pancasila *dialami*, bukan cuma dihafal: setiap modul dibuka dengan kasus nyata, dibedah, dipraktikkan lewat simulasi, diwujudkan dalam aksi nyata, dan ditutup dengan kuis serta refleksi diri.

> Folder ini adalah calon repo GitHub `MPI-Pendidikan-Pancasila` (rencana situs: holizon-sendang.github.io/MPI-Pendidikan-Pancasila/). Saat README ini ditulis, repo belum dibuat dan belum ada push.

## Sumber kurikulum

- Analisis Capaian Pembelajaran Pendidikan Pancasila Fase D, MGMP Pendidikan Pancasila, menurut SK Kepala BSKAP No. 032/H/KR/2024 tanggal 11 Juni 2024, Tahun Pelajaran 2024/2025.
- ATP (Alur Tujuan Pembelajaran) Pendidikan Pancasila Fase D, dasar yang sama. Alokasi ATP dinyatakan dalam minggu per blok (blok 01 = 4 minggu, blok 02 = 3 minggu), bukan JP.

Catatan sumber: Analisis CP memuat 27 TP rinci, sedangkan ATP menggabungkannya menjadi 15 baris materi. Satu TP Analisis CP (N.3 Bela Negara, Kelas 9) tidak tercantum di ATP, tetapi tetap masuk peta modul agar CP terpenuhi. Kode TP di ATP bukan kode unik per TP (hanya kode blok D-7-01, D-7-02, D-8-01, D-8-02, D-9-01, D-9-02), sehingga MPI memakai kode modulnya sendiri per elemen.

## Keputusan desain yang terkunci (31 Oktober 2026)

- **Palet visual: Biru Samudra**, sama persis dengan MPI Matematika: utama #2563EB, gelap #1E3A8A, lembut #DBEAFE, aksen amber #F59E0B, latar #F8FAFF, teks #0F172A. Aksen per kelas: Kelas 7 biru, Kelas 8 ungu #6D28D9, Kelas 9 amber/oranye.
- **Struktur: per TP** — 1 Tujuan Pembelajaran dari Analisis CP = 1 modul, total **27 modul**.
- **Repo terpisah** dari MPI Matematika, nama `MPI-Pendidikan-Pancasila`.
- **Template modul: 6 sub-bab** — 1 Pemantik (kasus nyata/dilema), 2 Memahami (konsep inti, sejarah, tokoh, dasar hukum), 3 Bedah Kasus (analisis kasus, diskusi nilai, konsekuensi sikap), 4 Simulasi (jenisnya berganti per materi), 5 Aksi Nyata (proyek mini/komitmen), 6 Kuis 10 soal (kunci seimbang A2/B3/C2/D3) + Refleksi diri.
- **Prototipe pertama: P.1** Sejarah Kelahiran Pancasila (Kelas 7).
- Teknis: HTML, CSS, JS terpisah per modul plus aset bersama; responsif HP, tablet, laptop, dan PID; progres tersimpan di localStorage perangkat siswa dengan awalan kunci `mpi-pp-` (modul P.1: `mpi-pp-p1-*`) agar tidak bertabrakan dengan MPI Matematika pada domain github.io yang sama.

Perbaikan dari MPI Matematika yang langsung diterapkan: `section[id]{scroll-margin-top:140px}` di `assets/css/main.css` agar judul sub-bab tidak tertutup pil navigasi lengket.

## Peta 27 modul

### Kelas 7 — 6 modul

| Kode | Elemen | Modul | Status |
|---|---|---|---|
| P.1 | Pancasila | Sejarah Kelahiran Pancasila | **Aktif (prototipe)** |
| P.2 | Pancasila | Sikap Para Perumus Pancasila | Segera |
| P.3 | Pancasila | Penerapan Nilai-nilai Pancasila | Segera |
| U.1 | UUD NRI 1945 | Norma dan Aturan | Segera |
| B.1 | Bhinneka Tunggal Ika | Keberagaman dalam Bingkai Bhinneka Tunggal Ika | Segera |
| N.1 | NKRI | Wilayah NKRI dan Wawasan Nusantara | Segera |

### Kelas 8 — 13 modul

| Kode | Elemen | Modul | Status |
|---|---|---|---|
| P.4 | Pancasila | Pancasila sebagai Dasar Negara | Segera |
| P.5 | Pancasila | Pancasila sebagai Pandangan Hidup Bangsa | Segera |
| P.6 | Pancasila | Pancasila sebagai Ideologi Negara | Segera |
| P.7 | Pancasila | Bendera, Lagu Kebangsaan, dan Bahasa Indonesia | Segera |
| U.2 | UUD NRI 1945 | Sejarah UUD NRI Tahun 1945 | Segera |
| U.3 | UUD NRI 1945 | Fungsi dan Kedudukan UUD NRI Tahun 1945 | Segera |
| U.4 | UUD NRI 1945 | Menjalankan UUD NRI Tahun 1945 | Segera |
| U.5 | UUD NRI 1945 | Tata Urutan Peraturan Perundang-undangan | Segera |
| B.2 | Bhinneka Tunggal Ika | Pelestarian Tradisi dan Identitas | Segera |
| B.3 | Bhinneka Tunggal Ika | Budaya Nasional sebagai Pemersatu Bangsa | Segera |
| B.4 | Bhinneka Tunggal Ika | Pelestarian Budaya dan Identitas | Segera |
| B.5 | Bhinneka Tunggal Ika | Bhinneka Tunggal Ika sebagai Modal Sosial | Segera |
| N.2 | NKRI | Wawasan Nusantara dan Keutuhan Bangsa | Segera |

### Kelas 9 — 8 modul

| Kode | Elemen | Modul | Status |
|---|---|---|---|
| P.8 | Pancasila | Hubungan Pancasila dengan UUD NRI Tahun 1945 | Segera |
| P.9 | Pancasila | Hubungan Pancasila dengan Bhinneka Tunggal Ika dan NKRI | Segera |
| U.6 | UUD NRI 1945 | Hak dan Kewajiban Warga Negara | Segera |
| U.7 | UUD NRI 1945 | Kemerdekaan Berpendapat di Era Keterbukaan Informasi | Segera |
| B.6 | Bhinneka Tunggal Ika | Menjaga Tradisi dalam Masyarakat Global | Segera |
| B.7 | Bhinneka Tunggal Ika | Menjaga Kearifan Lokal dalam Masyarakat Global | Segera |
| B.8 | Bhinneka Tunggal Ika | Menjaga Budaya dalam Masyarakat Global | Segera |
| N.3 | NKRI | Bela Negara dan ATHG | Segera |

## Struktur folder

```
MPI-Pendidikan-Pancasila/
├── index.html                  Hub utama (3 kartu kelas + pencarian 27 modul)
├── assets/
│   ├── css/main.css            Gaya bersama (Biru Samudra)
│   └── js/main.js              Navigasi, filter, ringkasan progres
├── kelas-7/
│   ├── index.html              Daftar 6 modul Kelas 7
│   └── p1-sejarah-kelahiran-pancasila/
│       ├── index.html          Modul P.1 (6 sub-bab)
│       ├── style.css
│       └── script.js
├── kelas-8/index.html          Daftar 13 modul Kelas 8 (semua Segera)
└── kelas-9/index.html          Daftar 8 modul Kelas 9 (semua Segera)
```

## Status prototipe P.1

Modul P.1 berisi: polling pemantik tentang 1 Juni vs 18 Agustus 1945; kronologi lima babak yang terbuka bertahap dengan cek paham per babak; bedah kasus perubahan tujuh kata Piagam Jakarta dengan tiga skenario sikap kelas; tiga simulasi (lini masa geser-seret/ketuk 8 peristiwa, cocokkan tokoh–tanggal–usulan Yamin/Soepomo/Soekarno, urutkan rumusan lima asas versi Soekarno 1 Juni 1945 dibandingkan rumusan akhir 18 Agustus 1945); proyek mini lini masa kelas dan komitmen pribadi tersimpan; kuis 10 soal (sebaran 3 kronologi / 3 tokoh / 2 Piagam Jakarta / 2 penetapan, kunci seimbang A2/B3/C2/D3) dan refleksi 3 pertanyaan tersimpan.

Verifikasi lokal yang dilakukan: sintaks JS (`node --check`), semua halaman merespons HTTP 200 lewat server lokal, tidak ada tautan lokal yang rusak, dan kunci kuis diperiksa programatik (distribusi dan kebenaran faktual per soal). Uji visual di peramban nyata (termasuk lebar HP dan PID) masih perlu dilakukan sebelum rilis.
