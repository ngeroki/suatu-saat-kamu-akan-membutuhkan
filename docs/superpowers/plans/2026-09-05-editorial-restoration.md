# Rencana Aksi Tunggal Restorasi Editorial & Visual 74 Halaman
**Dokumen Rencana Tunggal (*Single Source of Truth*)**
*Suatu Saat Kamu Akan Membutuhkan — Karya Aldi (@rahwanaconsciousnessroom)*

---

## 1. Ringkasan Eksekutif & Prinsip Panduan

Berdasarkan Full Editorial Audit 74 halaman di `docs/EDITORIAL_AUDIT_REPORT_74_PAGES.md`, naskah `src/data/book-pages.json` membutuhkan restorasi total untuk mengembalikan ketajaman, karakter spiritual Kejawen kontemporer, dan integritas naskah aslinya.

### Prinsip Utama (Mandat Pengguna):
1. **Dilarang Menumpulkan Naskah (*No Nerfing / No AI-Safety Overkill*)**: Jangan netralkan ide radikal, mistis, atau spekulatif dengan disclaimer defensif (*"buku ini bukan..."*, *"hanya metafora..."*, *"tidak ada dasar ilmiah..."*).
2. **Karakter & Suara Penulis Asli**: Pertahankan gaya bahasa Mas Aldi—tajam, puitis, berani, jalanan, dan filosofis.
3. **Naskah Asli Sumber Kebenaran**: Semua rujukan restorasi mengacu langsung ke `r:\flip-book\naskah-buku\`.
4. **Mobile First Tanpa Kompromi**: Kepadatan teks 105–150 kata per halaman (optimal di viewport 390px iPhone).

---

## 2. Gap Hasil Audit & Cakupan Restorasi Lengkap

Dari hasil *self-review* audit dan sinkronisasi naskah:
1. **P0 Bencana Pergeseran Bab 3 (Halaman 38–44)**: Judul bergeser 1 halaman dari teksnya selama 7 halaman berturut-turut, dan teks *Protokol Napas Parasimpatis 4-4-8* hilang. Diselesaikan di Fase 1 (Serial).
2. **P0 Pemulihan Metadata Provenance Bab 3**: Metadata `provenance` pada Halaman 38–44 wajib disinkronkan kembali ke subjudul asli di `naskah-buku/Bab_03...md`.
3. **P0 Infiltrasi Disclaimer di 13 Halaman**: Pembersihan total apologetika pada Hal 3, 4, 5, 7, 9, 17, 24, 25, 43, 51, 63, 64, 70.
4. **P0 Pemulihan Materi Sakral**:
   - Hal 46: Kutipan Mas Aldi mengenai *Manunggaling Kawula Gusti, Tauhid & Quantum Entanglement* dikembalikan utuh.
   - Hal 63–64: *Sacred Sexuality* dan *Cord Cutting* dipulihkan dari sensor korporat.
   - Hal 70: Pemulihan SOP 1 Detoks Bawah Sadar & Garam Krosok.
5. **P0 Koreksi Anomali Visual**:
   - Hal 38–44: Deskripsi visual dan caption disinkronkan dengan topik halaman yang sudah diluruskan.
   - Hal 63: Ganti *environment* visual "meja makan kayu jati dan secangkir teh melati" menjadi "sanctuary hening temaram, siluet dua insan berhadapan dalam meditasi sakral, medan torus emas".
   - Hal 64: Koreksi prompt visual untuk menggambarkan pemutusan ikatan eterik (*cord cutting*).
6. **P1 Eliminasi Teks Tutorial UI**: Hal 1, 16, 31, 46, 60 yang berisi teks chatbot/onboarding (*"Selamat datang di Bab X. Geser tombol..."*) diganti menjadi *Aforisme Orientasi Bab*.
7. **P1 Lokalisasi & Humanisasi Diksi**:
   - Istilah asing *"Present Moment"* (muncul 8x) dilokalkan menjadi *titik saiki / detik niki / hadir wutuh*.
   - Variasikan pengulangan kaku kata "resonansi" dan "frekuensi" dengan padanan rasa: *gema batin, getaran sukma, keselarasan rasa*.

---

## 3. Protokol Eksekusi Bebas Tabrakan (*Zero-Collision Protocol*)

Karena `src/data/book-pages.json` adalah satu berkas JSON monolitik, pengerjaan paralel **TIDAK BOLEH** langsung menyunting berkas utama.

```
                                  [Fase 1: Serial Lead Agent]
                            Perbaikan Pergeseran Bab 3 (Hal 38-44)
                           + Verifikasi scripts/verify-bab3.js
                                              │
                                              ▼
                    ┌─────────────────────────┴─────────────────────────┐
                    │       [Fase 2: Parallel Subagents via Patches]    │
                    ├──────────────┬──────────────┬──────────────┬──────┤
                    ▼              ▼              ▼              ▼      ▼
                Subagent α     Subagent β     Subagent γ     Subagent δ Subagent ε
                  Bab 1          Bab 2          Bab 3          Bab 4      Bab 5
                (Hal 1-15)    (Hal 16-30)   (Hal 31-37,45)  (Hal 46-59) (Hal 60-74)
                    │              │              │              │      │
                    ▼              ▼              ▼              ▼      ▼
               patch-bab1     patch-bab2     patch-bab3     patch-bab4 patch-bab5
                    └──────────────┬──────────────┴──────────────┬──────┘
                                   │
                                   ▼
                    [Fase 3: Deterministic Assembler & QA]
                    Skrip scripts/assemble-book.js menggabungkan patch
                    ke src/data/book-pages.json + Validasi Otomatis
```

---

## 4. Rincian Perubahan per Modul

### Fase 1: Serial Lead Agent — Perbaikan Cascading Bab 3 (Hal 38–44)
- **Halaman 38**:
  - Judul: *7 Cakra & 7 Wilayah Endokrin: Jalur Bio-Elektrik Saraf (Bagian 1: Cakra 1–3)*
  - Provenance: `Bab_03...md#7-cakra-dan-endokrin`
  - Konten: Cakra 1–3 (Muladhara, Svadhisthana, Manipura)
  - Visual: Medan energi tulang ekor hingga solar plexus, pigmen merah-oranye-kuning bumi
- **Halaman 39**:
  - Judul: *7 Cakra & 7 Wilayah Endokrin: Puncak Mahkota (Bagian 2: Cakra 4–7)*
  - Provenance: `Bab_03...md#7-cakra-dan-endokrin`
  - Konten: Cakra 4–7 (Anahata, Vishuddha, Ajna, Sahasrara)
  - Visual: Aliran cahaya dari dada ke puncak kepala, pendar hijau zamrud, nila, hingga violet
- **Halaman 40**:
  - Judul: *Dekonstruksi Epos Mahabharata dalam Anatomi Saraf: Perang Kurusetra di Dalam Kepala*
  - Provenance: `Bab_03...md#dekonstruksi-epos-mahabharata`
  - Konten: Kurawa (100 cabang amigdala) vs Pandawa (5 panca indera di bawah Kresna/kesadaran)
  - Visual: Siluet medan Kurusetra batin, visualisasi neuro-mitologis
- **Halaman 41**:
  - Judul: *Bukti Simbolisme Mitologi Dunia: Ganesha, Anubis & Sun Go Kong*
  - Provenance: `Bab_03...md#arkeologi-simbolik`
  - Konten: Ganesha (Cerebellum), Anubis (Epiglotis & Penimbang Jantung), Sun Go Kong (Monkey Mind)
  - Visual: Triptych relief batu kuno simbol dewa-dewa penjaga gerbang saraf
- **Halaman 42**:
  - Judul: *Biohacking Kuno: Siklus 35 Hari Selapanan, Puasa Apit Weton & Pati Geni*
  - Provenance: `Bab_03...md#biohacking-kuno-dan-puasa`
  - Konten: Harmonisasi siklus 35 hari, autofagi seluler weton, detoks sensorik pati geni
  - Visual: Kalender Jawa pakuwon melingkar dengan siluet pertapa dalam temaram lilin
- **Halaman 43**:
  - Judul: *Sains Grounding: Garam Krosok & Daun Kelor — Pembersihan Radiasi & Residu Statis*
  - Provenance: `Bab_03...md#sains-grounding`
  - Konten: Kristal garam krosok menyerap ion positif statis, daun kelor untuk detoks biologis (buang 4 disclaimer medis)
  - Visual: Garam krosok kasar di atas mangkuk tembikar dan rimbun daun kelor berembun
- **Halaman 44**:
  - Judul: *Protokol Eksekusi Malam Ini: Panduan Napas Parasimpatis 4-4-8 & Master Matrix Integrasi*
  - Provenance: `Bab_03...md#protokol-eksekusi-malam-ini`
  - Konten: **Dipulihkan penuh** dari naskah asli (teknik tarikan napas 4 detik, tahan 4 detik, hembus 8 detik untuk aktivasi saraf vagus)
  - Visual: Diagram infografis ritme napas 4-4-8 mengalir lembut di atas kanvas kertas kuno

---

### Fase 2: Paralel Subagents via Patch Files

#### 1. Subagent Alpha (`scripts/patches/bab-1.json` — Hal 1–15)
- **Hal 1**: Ganti tutorial *"Selamat datang di Bab 1..."* dengan aforisme pembuka anatomi sukma.
- **Hal 3**: Hapus disclaimer donat/jantung; tegaskan jantung sebagai generator medan torus terkuat raga.
- **Hal 4**: Hapus kalimat *"tidak ada dasar menyebut tulang ekor..."*; kembalikan resonansi memori seluler tulang ekor (*coccyx*).
- **Hal 5**: Rombak daftar sanggahan medis menjadi narasi sakral *Sacred Anatomy* tulang sulbi (*primitive streak*, Hadits, dan Kundalini).
- **Hal 7**: Hapus 3 bantahan skeptis terhadap CSF; pulihkan pemahaman cairan serebrospinal sebagai konduktor kesadaran murni.
- **Hal 9**: Restorasi total *Isro' Mikrokosmos*: kembalikan narasi tarikan napas yogik yang mendorong CSF ke pineal tanpa nada apologetika.
- **Hal 13**: Bersihkan catatan review editor internal pada takeaway.

#### 2. Subagent Beta (`scripts/patches/bab-2.json` — Hal 16–30)
- **Hal 16**: Ganti tutorial *"Selamat datang di Bab 2..."* dengan aforisme pemrograman realitas.
- **Hal 17**: Pulihkan ketegasan vonis Mas Aldi: bawah sadar mendominasi 100% realitas; afirmasi verbal kalah jika emosi batin masih memancarkan kecemasan.
- **Hal 24**: Bersihkan split-brain antara teks dan intisari; pulihkan keterikatan geometri air tubuh (72%) terhadap getaran kata dan niat.
- **Hal 25**: Bersihkan disclaimer medis dari kisah tiup dompet mobil pengantin ayah Mas Aldi; tegaskan kekuatan *absolute surrender & faith*.

#### 3. Subagent Gamma (`scripts/patches/bab-3.json` — Hal 31–37 & Hal 45)
- **Hal 31**: Ganti tutorial *"Selamat datang di Bab 3..."* dengan aforisme biohacking dan hormon leluhur.
- **Hal 32**: Pulihkan narasi insiden piring pecah Mas Aldi sebagai metafora sentakan simpatis mendadak.
- **Hal 33**: Pulihkan analogi kebocoran baterai DMN (*Default Mode Network*) akibat *overthinking*.
- **Hal 34**: Pulihkan urgensi kalsifikasi kelenjar pineal akibat gaya hidup modern tanpa melemahkan argumen.
- **Hal 37**: Bersihkan kerancuan istilah "Sindrom Sirus" menjadi penjelasan ilmiah/mitologis yang jernih.
- **Hal 45**: Poles kesimpulan Bab 3 agar menjadi jembatan menuju fisika kuantum Bab 4.

#### 4. Subagent Delta (`scripts/patches/bab-4.json` — Hal 46–59)
- **Hal 46**: Ganti tutorial onboarding dengan kutipan vernakular asli Mas Aldi: *"Konsep manunggaling kawula gusti, konsep tauhid itu adalah terbebas dari sekat ilusi keterpisahan... Quantum entanglement..."*
- **Hal 48**: Bersihkan disclaimer skeptis pembuka; hubungkan keterikatan kuantum dengan resonansi rasa ibu-anak.
- **Hal 49**: Rapikan kalimat repetitif di penutup halaman.
- **Hal 50**: Pulihkan retorika dramatis kebocoran energi; ganti istilah *"Present Moment"* menjadi *titik saiki / detik niki*.
- **Hal 51**: Lenyapkan 2 paragraf sanggahan skeptis; pertahankan hukum *Akibat-Sebab Kuantum*.
- **Hal 52**: Hapus penyangkalan *observer effect* di Paragraf 3.
- **Hal 58**: Hapus disclaimer pembuka yang membantah konsep cermin semesta; tegaskan analogi proyektor bioskop batin.

#### 5. Subagent Epsilon (`scripts/patches/bab-5.json` — Hal 60–74)
- **Hal 60**: Ganti tutorial *"Selamat datang di Bab 5..."* dengan aforisme kepulangan menjadi manusia normal.
- **Hal 62**: Hapus frasa apologetika pada takeaway; pulihkan konsep Mas Aldi mengenai "Saklar On/Off Sensitivitas Batin".
- **Hal 63**: Restorasi vokal berani Mas Aldi mengenai seksualitas sakral sebagai *closed energetic loop*; perbaiki metadata visual `environment` dari "meja makan kayu jati" ke "sanctuary hening temaram, siluet dua insan, medan torus emas".
- **Hal 64**: Pulihkan matriks komparatif seksualitas sakral vs transaksional dan laku pemutusan ikatan eterik (*cord cutting*). Koreksi prompt visual.
- **Hal 65**: Hapus kalimat peredam pembuka; padatkan alur Paragraf 4 & 5.
- **Hal 69**: Pulihkan subjudul asli *Hukum Pertukaran Energi Semesta vs Racun Mental Gratisan*; buang kalimat legalistik semesta.
- **Hal 70**: Restorasi total SOP 1: Detoks Bawah Sadar 30 Menit Gelombang Alfa-Teta & Garam Krosok Pembersih Residu Lingkungan; buang kalimat sanggahan.
- **Hal 74**: Poles penutup akhir buku agar megah, kontemplatif, dan berakar pada kepulangan ke dalam rongga dada (*bukan meminta maaf*).

---

## 5. Rencana Verifikasi Kualitas (*Quality Gate*)

### Otomatisasi (Scripts)
1. **Verifikasi Bab 3 (`scripts/verify-bab3.js`)**: Memastikan judul, konten, dan provenance Hal 38–44 sinkron 100%.
2. **Deterministic Merge (`scripts/assemble-book.js`)**: Menggabungkan patch dan memeriksa:
   - Jumlah halaman tepat 74.
   - Zero disclaimer scan (regex scan: `dalam buku ini`, `tidak diperlakukan sebagai fakta`, `bukan superkonduktor biologis`, `tidak ada dasar untuk menyebut`, `hanya dipakai sebagai metafora`, `bukan jaminan bahwa semesta`, `garam tidak perlu dianggap`).
   - Rentang kata: 105–150 kata per halaman.
3. **TypeScript Build**:
   - `npm run typecheck` (`tsc --noEmit`) -> EXIT CODE 0.
   - `npm run build` (`vite build`) -> Sukses tanpa error.

### Verifikasi Visual
- Memeriksa tampilan di browser simulator 390px pada halaman-halaman kunci yang direstorasi (Hal 3, 5, 9, 38, 44, 46, 63, 70).
