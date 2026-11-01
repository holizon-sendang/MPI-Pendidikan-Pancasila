# MPI Pendidikan Pancasila SMP

Media Pembelajaran Interaktif (MPI) untuk mata pelajaran **Pendidikan Pancasila** jenjang SMP Kelas 7, 8, dan 9 — Kurikulum Merdeka, Fase D, dengan pendekatan **Pembelajaran Mendalam** (Berkesadaran, Bermakna, Menggembirakan; alur Memahami, Mengaplikasi, Merefleksi).

Situs ini disusun agar nilai Pancasila *dialami*, bukan cuma dihafal: setiap modul dibuka dengan kasus nyata, dibedah, dipraktikkan lewat simulasi, diwujudkan dalam aksi nyata, dan ditutup dengan kuis serta refleksi diri.

> Repo GitHub: `holizon-sendang/MPI-Pendidikan-Pancasila` — situs live: https://holizon-sendang.github.io/MPI-Pendidikan-Pancasila/. **Seluruh 27 modul sudah dibangun** mengikuti template prototipe P.1 (prototipe P.1 terbit lebih dulu; 26 modul sisanya dibangun dalam satu gelombang dan diterbitkan pada pembaruan berikutnya).

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
| P.1 | Pancasila | Sejarah Kelahiran Pancasila | **Aktif** |
| P.2 | Pancasila | Sikap Para Perumus Pancasila | **Aktif** |
| P.3 | Pancasila | Penerapan Nilai-nilai Pancasila | **Aktif** |
| U.1 | UUD NRI 1945 | Norma dan Aturan | **Aktif** |
| B.1 | Bhinneka Tunggal Ika | Keberagaman dalam Bingkai Bhinneka Tunggal Ika | **Aktif** |
| N.1 | NKRI | Wilayah NKRI dan Wawasan Nusantara | **Aktif** |

### Kelas 8 — 13 modul

| Kode | Elemen | Modul | Status |
|---|---|---|---|
| P.4 | Pancasila | Pancasila sebagai Dasar Negara | **Aktif** |
| P.5 | Pancasila | Pancasila sebagai Pandangan Hidup Bangsa | **Aktif** |
| P.6 | Pancasila | Pancasila sebagai Ideologi Negara | **Aktif** |
| P.7 | Pancasila | Bendera, Lagu Kebangsaan, dan Bahasa Indonesia | **Aktif** |
| U.2 | UUD NRI 1945 | Sejarah UUD NRI Tahun 1945 | **Aktif** |
| U.3 | UUD NRI 1945 | Fungsi dan Kedudukan UUD NRI Tahun 1945 | **Aktif** |
| U.4 | UUD NRI 1945 | Menjalankan UUD NRI Tahun 1945 | **Aktif** |
| U.5 | UUD NRI 1945 | Tata Urutan Peraturan Perundang-undangan | **Aktif** |
| B.2 | Bhinneka Tunggal Ika | Pelestarian Tradisi dan Identitas | **Aktif** |
| B.3 | Bhinneka Tunggal Ika | Budaya Nasional sebagai Pemersatu Bangsa | **Aktif** |
| B.4 | Bhinneka Tunggal Ika | Pelestarian Budaya dan Identitas | **Aktif** |
| B.5 | Bhinneka Tunggal Ika | Bhinneka Tunggal Ika sebagai Modal Sosial | **Aktif** |
| N.2 | NKRI | Wawasan Nusantara dan Keutuhan Bangsa | **Aktif** |

### Kelas 9 — 8 modul

| Kode | Elemen | Modul | Status |
|---|---|---|---|
| P.8 | Pancasila | Hubungan Pancasila dengan UUD NRI Tahun 1945 | **Aktif** |
| P.9 | Pancasila | Hubungan Pancasila dengan Bhinneka Tunggal Ika dan NKRI | **Aktif** |
| U.6 | UUD NRI 1945 | Hak dan Kewajiban Warga Negara | **Aktif** |
| U.7 | UUD NRI 1945 | Kemerdekaan Berpendapat di Era Keterbukaan Informasi | **Aktif** |
| B.6 | Bhinneka Tunggal Ika | Menjaga Tradisi dalam Masyarakat Global | **Aktif** |
| B.7 | Bhinneka Tunggal Ika | Menjaga Kearifan Lokal dalam Masyarakat Global | **Aktif** |
| B.8 | Bhinneka Tunggal Ika | Menjaga Budaya dalam Masyarakat Global | **Aktif** |
| N.3 | NKRI | Bela Negara dan ATHG | **Aktif** |

## Struktur folder

```
MPI-Pendidikan-Pancasila/
├── index.html                  Hub utama (3 kartu kelas + pencarian 27 modul)
├── assets/
│   ├── css/main.css            Gaya bersama (Biru Samudra)
│   └── js/main.js              Navigasi, filter pencarian, ringkasan progres P.1
├── kelas-7/
│   ├── index.html              Daftar 6 modul Kelas 7
│   ├── p1-sejarah-kelahiran-pancasila/
│   ├── p2-sikap-para-perumus-pancasila/
│   ├── p3-penerapan-nilai-nilai-pancasila/
│   ├── u1-norma-dan-aturan/
│   ├── b1-keberagaman-bhinneka-tunggal-ika/
│   └── n1-wilayah-nkri-wawasan-nusantara/
├── kelas-8/
│   ├── index.html              Daftar 13 modul Kelas 8
│   ├── p4-pancasila-sebagai-dasar-negara/
│   ├── p5-pancasila-sebagai-pandangan-hidup/
│   ├── p6-pancasila-sebagai-ideologi-negara/
│   ├── p7-bendera-lagu-kebangsaan-bahasa/
│   ├── u2-sejarah-uud-nri-1945/
│   ├── u3-fungsi-dan-kedudukan-uud-nri-1945/
│   ├── u4-menjalankan-uud-di-lingkungan/
│   ├── u5-tata-urutan-peraturan-perundang-undangan/
│   ├── b2-pelestarian-tradisi-dan-identitas/
│   ├── b3-budaya-nasional-pemersatu-bangsa/
│   ├── b4-pelestarian-budaya-dan-identitas/
│   ├── b5-bhinneka-tunggal-ika-modal-sosial/
│   └── n2-wawasan-nusantara-keutuhan-bangsa/
└── kelas-9/
    ├── index.html              Daftar 8 modul Kelas 9
    ├── p8-hubungan-pancasila-dengan-uud/
    ├── p9-hubungan-pancasila-bhinneka-nkri/
    ├── u6-hak-dan-kewajiban-warga-negara/
    ├── u7-kemerdekaan-berpendapat/
    ├── b6-menjaga-tradisi-masyarakat-global/
    ├── b7-menjaga-kearifan-lokal-masyarakat-global/
    ├── b8-menjaga-budaya-masyarakat-global/
    └── n3-bela-negara-di-era-modern/
```
Setiap folder modul berisi `index.html`, `style.css`, dan `script.js` sendiri.
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
MPI-Pendidikan-Pancasila/
├── index.html                  Hub utama (3 kartu kelas + pencarian 27 modul)
├── assets/
│   ├── css/main.css            Gaya bersama (Biru Samudra)
│   └── js/main.js              Navigasi, filter pencarian, ringkasan progres P.1
├── kelas-7/
│   ├── index.html              Daftar 6 modul Kelas 7
│   ├── p1-sejarah-kelahiran-pancasila/
│   ├── p2-sikap-para-perumus-pancasila/
│   ├── p3-penerapan-nilai-nilai-pancasila/
│   ├── u1-norma-dan-aturan/
│   ├── b1-keberagaman-bhinneka-tunggal-ika/
│   └── n1-wilayah-nkri-wawasan-nusantara/
├── kelas-8/
│   ├── index.html              Daftar 13 modul Kelas 8
│   ├── p4-pancasila-sebagai-dasar-negara/
│   ├── p5-pancasila-sebagai-pandangan-hidup/
│   ├── p6-pancasila-sebagai-ideologi-negara/
│   ├── p7-bendera-lagu-kebangsaan-bahasa/
│   ├── u2-sejarah-uud-nri-1945/
│   ├── u3-fungsi-dan-kedudukan-uud-nri-1945/
│   ├── u4-menjalankan-uud-di-lingkungan/
│   ├── u5-tata-urutan-peraturan-perundang-undangan/
│   ├── b2-pelestarian-tradisi-dan-identitas/
│   ├── b3-budaya-nasional-pemersatu-bangsa/
│   ├── b4-pelestarian-budaya-dan-identitas/
│   ├── b5-bhinneka-tunggal-ika-modal-sosial/
│   └── n2-wawasan-nusantara-keutuhan-bangsa/
└── kelas-9/
    ├── index.html              Daftar 8 modul Kelas 9
    ├── p8-hubungan-pancasila-dengan-uud/
    ├── p9-hubungan-pancasila-bhinneka-nkri/
    ├── u6-hak-dan-kewajiban-warga-negara/
    ├── u7-kemerdekaan-berpendapat/
    ├── b6-menjaga-tradisi-masyarakat-global/
    ├── b7-menjaga-kearifan-lokal-masyarakat-global/
    ├── b8-menjaga-budaya-masyarakat-global/
    └── n3-bela-negara-di-era-modern/
```
Setiap folder modul berisi `index.html`, `style.css`, dan `script.js` sendiri.

## Status pembangunan

**27 modul lengkap terbangun** (Kelas 7: 6, Kelas 8: 13, Kelas 9: 8), semuanya mengikuti template 6 sub-bab yang sama: Pemantik (kasus/dilema + polling), Memahami (materi bertahap + cek paham), Bedah Kasus (kasus + 3 skenario sikap), Simulasi interaktif khas materi, Aksi Nyata (proyek mini + komitmen tersimpan), dan Kuis 10 soal + Refleksi 3 pertanyaan tersimpan. Awalan localStorage per modul: `mpi-pp-<kode>-` (mis. `mpi-pp-u5-*`).

Jenis simulasi per modul (Sub-bab 4):

- **Kelas 7** — P.1: lini masa 8 peristiwa + cocokkan tokoh + urutkan sila; P.2: cocokkan sikap–contoh + urutkan langkah musyawarah; P.3: sortir 10 kartu ke 5 sila; U.1: sortir 8 kartu ke 4 jenis norma; B.1: cocokkan keberagaman–contoh + sortir faktor penyebab; N.1: cocokkan istilah wilayah/unsur negara + sortir konstitutif vs deklaratif.
- **Kelas 8** — P.4: sortir kartu ke 4 bidang kehidupan; P.5: sortir 10 kartu ke 5 sila; P.6: sortir ideologi terbuka vs tertutup + cocokkan nilai dasar/instrumental/praksis; P.7: cocokkan simbol–fakta/pasal + urutkan tonggak 1928→1945→2009; U.2: lini masa 7 tonggak konstitusi; U.3: cocokkan fungsi UUD + sortir kedudukan UUD; U.4: sortir menjalankan vs melanggar UUD; U.5: urutkan hierarki 7 tingkat peraturan + cocokkan lembaga pembentuk; B.2: cocokkan tradisi–daerah + sortir pelestarian per lingkungan; B.3: cocokkan budaya nasional + sortir pemersatu vs pemecah; B.4: cocokkan rumah adat–daerah + sortir pelestarian vs ancaman; B.5: urutkan langkah solusi berkeadilan + cocokkan modal sosial; N.2: cocokkan pancagatra + sortir pendukung vs pelemah keutuhan.
- **Kelas 9** — P.8: cocokkan sila–pasal + sortir pernyataan; P.9: sortir Bhinneka Tunggal Ika vs NKRI + cocokkan pasal; U.6: sortir hak vs kewajiban + cocokkan pasal; U.7: urutkan langkah berpendapat + sortir bertanggung jawab vs tidak; B.6: sortir menjaga vs mengikis tradisi + cocokkan tradisi–daerah; B.7: cocokkan kearifan lokal + sortir nilai; B.8: sortir peluang vs ancaman globalisasi + cocokkan diplomasi budaya; N.3: sortir 4 kategori ATHG + cocokkan peran Indonesia antarbangsa.

Catatan modul N.3: TP bela negara tidak ada di ATP, sehingga hero-nya menampilkan penanda "Berdasarkan Analisis CP" dan materinya disusun dari bunyi TP (sistem pertahanan dan keamanan negara, peran Indonesia dalam hubungan antarbangsa, ATHG).

### Verifikasi yang dilakukan (lokal)

- `node --check` lulus untuk seluruh 28 file JS (aset bersama + 27 modul).
- Server HTTP lokal: hub, 3 halaman kelas, dan 27 halaman modul semuanya HTTP 200.
- Pemeriksaan tautan programatik: 778 referensi lokal di 31 file HTML, **nol rusak** (termasuk jangkar `#sub1`–`#sub6`).
- Kuis: untuk setiap modul, kunci diekstrak programatik dari `script.js` — 10 soal × 4 opsi, distribusi kunci tepat **A2/B3/C2/D3** di semua 27 modul; 270 pasangan soal–jawaban benar diperiksa kebenaran faktualnya (sejarah, pasal UUD, dan peraturan perundang-undangan).
- Uji luapan horizontal headless Chrome: hub + 3 modul sampel (P.3, U.5, N.3) pada lebar 360 px dan 1920 px — tidak ada luapan. Uji visual/interaksi peramban nyata di situs live sebelumnya lulus untuk hub, halaman Kelas 7, dan modul P.1; uji klik per modul untuk 26 modul baru belum dilakukan satu per satu (verifikasi JS modul baru bersifat statis/konsistensi struktur + sintaks).
