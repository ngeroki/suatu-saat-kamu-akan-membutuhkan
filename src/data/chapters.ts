/**
 * SUATU SAAT v2 — Chapter & Page Data
 * Source of truth: R:\flip-book\naskah-buku\
 * Structure: 5 Bab, 74 pages total
 */

export interface PageData {
  pageInChapter: number;   // 1-based within chapter
  globalPage: number;      // 1-based across all 74 pages
  badge: string;           // Running header text
  title: string;
  subtitle: string;
  paragraphs: string[];
  keyTakeaway?: string;
  quote?: string;
  quoteAttrib?: string;
}

export interface ChapterData {
  id: number;
  num: string;             // "01" - "05"
  title: string;
  subtitle: string;
  tags: string[];
  image: string;           // path relative to /assets/
  pageStart: number;       // global page where this chapter starts
  pageCount: number;
  pages: PageData[];
}

// ─── BAB 01 — Anatomi Tubuh Energi & Memori Karma ─────────────────────────
const bab01: ChapterData = {
  id: 1,
  num: "01",
  title: "Anatomi Tubuh Energi & Memori Karma",
  subtitle: "Medan Torus, Black Box Tulang Ekor & Kosmologi Kesadaran Nusantara",
  tags: ["Medan Torus", "Memori Karma", "Cairan CSF"],
  image: "assets/bab_01_torus.jpg",
  pageStart: 1,
  pageCount: 15,
  pages: [
    {
      pageInChapter: 1, globalPage: 1,
      badge: "Sampul & Pembuka",
      title: "Anatomi Tubuh Energi & Memori Karma",
      subtitle: "Membedah Misteri Deja Vu, Cairan Otak & Kosmologi Kesadaran Nusantara",
      paragraphs: [],
      quote: "Proses deja vu itu gini: data karma yang kita bawa dari kehidupan sebelumnya itu tersimpan di tulang ekor. Makanya tulang ekor adalah satu-satunya tulang yang tidak akan pernah bisa hancur. Kita ini makhluk energi yang memadat menjadi materi... Ketika elektromagnetik kita, medan torus kita bersinggungan dengan medan torus di suatu tempat, itu akan menekan data karma di tulang ekor untuk naik dan terbaca sebagai ingatan.",
      quoteAttrib: "Aldi (@rahwanaconsciousnessroom)",
      keyTakeaway: "Geser atau klik tombol lanjut untuk membuka lembaran naskah buku utuh.",
    },
    {
      pageInChapter: 2, globalPage: 2,
      badge: "1. Dialog Pemantik",
      title: "Obrolan Pinggir Jurang & Misteri Deja Vu",
      subtitle: "Mengapa tempat baru bisa terasa begitu akrab di dalam dada?",
      paragraphs: [
        "Pernahkah kamu tiba-tiba mendatangi sebuah tempat baru—mungkin sudut gang tua di kota yang belum pernah kamu injak, warung kopi terpencil di lereng gunung, atau sekadar persimpangan jalan—lalu dadamu berdesir hebat?",
        "Ada sensasi asing yang menusuk batinmu: 'Aku pernah di sini sebelumnya. Aku kenal bau udara ini. Aku tahu persis apa yang bakal terjadi setelah tikungan itu.'",
        "Itu bukan sekadar ingatan visual. Terkadang bulu kudukmu merinding, matamu mendadak berkaca-kaca menahan haru atau sesak tanpa alasan yang jelas, seolah ada jutaan memori purba yang melesat dari dasar tulang punggungmu menuju kepala dalam hitungan sepersekian detik.",
        "Kebanyakan orang menyebutnya deja vu dan menganggapnya sekadar korsleting listrik ringan di otak (neurological glitch). Namun, jika ini hanya ilusi visual, mengapa tubuh fisikmu bereaksi begitu emosional? Mengapa detak jantungmu berubah dan ada rasa rindu yang mengendap begitu dalam?",
      ],
      keyTakeaway: "Deja vu melibatkan respon biologis dan emosional nyata dari seluruh sistem saraf raga.",
    },
    {
      pageInChapter: 3, globalPage: 3,
      badge: "2. Hakikat Materi",
      title: "Kita Adalah Makhluk Energi yang Memadat",
      subtitle: "Fisika Kuantum & Radiasi Medan Torus Jantung Manusia",
      paragraphs: [
        "Segala sesuatu di alam semesta ini pada hakikat dasarnya adalah getaran (vibration). Fisika modern melalui mekanika kuantum telah membuktikan bahwa atom bukanlah benda padat mati.",
        "Bila inti atom diperbesar hingga seukuran bola sepak, elektronnya berputar mengelilinginya sejauh beberapa kilometer dalam ruang yang 99,9999999% kosong—berisi medan energi murni.",
        "Tubuh jasmani yang bisa kita raba, cubit, dan cermin ini sebenarnya adalah energi frekuensi rendah yang terkondensasi (memadat) agar mampu berinteraksi dengan dunia material 3 dimensi.",
        "Jantung manusia memompa darah dengan denyut listrik berkekuatan ribuan kali lebih besar daripada aktivitas listrik otak, memancarkan medan magnet berbentuk donat melingkar yang dinamakan Medan Torus (Torus Field). Medan ini memancar keluar hingga radius beberapa meter di sekeliling tubuhmu.",
      ],
      keyTakeaway: "Tubuh raga kita memancarkan medan elektromagnetik melingkar yang berinteraksi dengan lingkungan.",
    },
    {
      pageInChapter: 4, globalPage: 4,
      badge: "2. Resonansi Frekuensi",
      title: "Anatomi Deja Vu & Persinggungan Torus",
      subtitle: "Bagaimana frekuensi tempat memicu lonjakan memori tulang ekor",
      paragraphs: [
        "Setiap ruang fisik—tanah, bangunan tua, hutan, underbridge, hingga warkop—memiliki frekuensi dan medan elektromagnetik bawaannya sendiri akibat mineral tanah, rekaman peristiwa masa lalu, dan muatan emosional manusia yang pernah mendiaminya.",
        "Ketika medan torus tubuhmu melintasi suatu ruang fisik yang memiliki frekuensi identik dengan rekaman energimu di masa lalu, terjadilah fenomena resonansi (persinggungan elektromagnetik).",
        "Persinggungan ini memberikan tekanan mekanis dan energik ke titik pusat penyimpanan data di tubuhmu: tulang ekor. Tekanan tersebut memaksa endapan data masa lalu melonjak naik ke susunan saraf pusat, diterjemahkan oleh otak sebagai deja vu, dan dirasakan oleh tubuh sebagai desiran emosi yang nyata.",
      ],
      keyTakeaway: "Resonansi elektromagnetik menekan data memori di tulang ekor untuk naik ke otak.",
    },
    {
      pageInChapter: 5, globalPage: 5,
      badge: "3. Misteri Tulang Ekor",
      title: "Fakta Fisiologis: Tulang Sulbi yang Abadi",
      subtitle: "Titik mula janin dan penyimpan benih jiwa lintas waktu",
      paragraphs: [
        "Tulang ekor (os coccygis / tulang sulbi) menempati posisi unik dalam literatur sains kedokteran maupun spiritual lintas tradisi:",
        "1. Daya Tahan Fisik: Bagian tulang paling padat dan tahan terhadap degradasi suhu ekstrem, bahkan dalam proses kremasi tinggi. Ia adalah titik mula (primitive streak) janin sekaligus benih jiwa abadi.",
        "2. Penyimpan Memori: Menyimpan jejak memori epigenetik & sistem saraf purba. Secara batin, ia adalah gudang data karma & residu rasa bersalah.",
        "3. Reservoir Cairan Saraf: Titik dasar penampungan kantung dural Cerebrospinal Fluid (CSF) dan gerbang kebangkitan energi murni (Kundalini / Prana).",
      ],
      keyTakeaway: "Tulang ekor adalah black box biologis yang menyimpan memori karma lintas generasi.",
    },
    {
      pageInChapter: 6, globalPage: 6,
      badge: "3. Siklus Karma",
      title: "Anatomi Rasa Bersalah & Endapan Karma",
      subtitle: "Bagaimana perasaan bersalah mengkristal menjadi pola hidup berulang",
      paragraphs: [
        "Karma bukanlah hukuman dari sosok hakim kosmik yang pemarah. Karma adalah hukum fisika aksi-reaksi internal (resonansi medan batin).",
        "Ketika kamu melakukan suatu perbuatan yang bertentangan dengan nurani alam bawah sadarmu, tubuhmu mengalami getaran disonansi (emotional conflict). Getaran ini memproduksi hormon stres dan mengkristal menjadi memori rasa bersalah (guilt blueprint) di tulang ekor.",
        "Bila endapan rasa bersalah ini tidak pernah disadari dan tidak diurai, ia akan terus memancarkan frekuensi elektromagnetik rendah ke semesta. Akibatnya, semesta menangkap frekuensi tersebut dan memantulkannya kembali dalam wujud kejadian berulang (cyclic pattern).",
      ],
      keyTakeaway: "Mengurai rasa bersalah secara sadar adalah cara memutus siklus karma negatif.",
    },
    {
      pageInChapter: 7, globalPage: 7,
      badge: "4. Cairan Serebrospinal",
      title: "CSF & Ledakan DMT Alami",
      subtitle: "Mengapa leluhur kita mewariskan laku kegelapan dan puasa weton",
      paragraphs: [
        "Di dalam rongga tulang belakang dan ventrikel otak mengalir cairan bening berharga yang disebut Cairan Serebrospinal (Cerebrospinal Fluid / CSF).",
        "Cairan ini bukan sekadar pelumas otak. Secara biokimia, CSF adalah larutan kaya protein dan ion bioelektrik yang bertindak sebagai penghantar listrik super (superconducting biological fluid).",
        "Otak memproduksi CSF secara berkala melalui siklus regenerasi alami sekitar 35 hari. Bahan bakar utama pembentukan kualitas cairan ini sangat bergantung pada Melatonin—yang hanya diproduksi maksimal saat mata tidak menerima spektrum cahaya luar dan tubuh berada dalam gelombang otak rileks.",
      ],
      keyTakeaway: "Melatonin dan CSF berkualitas tinggi adalah kunci kebangkitan kesadaran alami.",
    },
    {
      pageInChapter: 8, globalPage: 8,
      badge: "4. Olah Napas",
      title: "Menaikkan Cairan Serebrospinal Lewat Olah Napas",
      subtitle: "Kumbhaka, Mulabandha & 7 Stasiun Kelenjar Endokrin",
      paragraphs: [
        "Ketika seseorang melakukan olah napas mendalam—menarik napas panjang, menahannya (kumbhaka), dan mengunci otot dasar panggul (mulabandha):",
        "1. Tulang ekor akan sedikit tertarik ke belakang, merenggangkan ruas-ruas tulang belakang (spinal column).",
        "2. Tekanan intratekal meningkat, memompa cairan serebrospinal yang kaya muatan bioelektrik untuk naik menembus 7 stasiun kelenjar endokrin (7 Cakra).",
        "3. Saat cairan ini berhasil mencapai bagian tengah otak dan menyentuh kristal kalsit mikro pada Kelenjar Pineal (Epifisis), terjadi fenomena piezoelektrik.",
        "4. Kelenjar pineal mengalami elektrifikasi dan mensekresikan DMT (Dimethyltryptamine) Alami.",
      ],
      keyTakeaway: "Olah napas sadar adalah elevator alami menuju kesadaran lebih tinggi.",
    },
    {
      pageInChapter: 9, globalPage: 9,
      badge: "5. Isro' Mikrokosmos",
      title: "Peristiwa Transendental & Isro' Mikrokosmos",
      subtitle: "Perjalanan menembus 7 lapis langit kesadaran dalam tulang belakangmu",
      paragraphs: [
        "Pelepasan DMT alami dari dalam tubuh sendiri bukanlah halusinasi sintesis. Ini adalah mekanisme bawaan (built-in feature) kesadaran manusia.",
        "Saat DMT alami terlepas di otak: frekuensi tangkapan mata melebar melampaui spektrum normal, frekuensi pendengaran melampaui batas 20Hz-20kHz, dan dinding sekat waktu dan ruang runtuh seketika.",
        "Seseorang mengalami pencerahan langsung (transcendental experience)—melihat keterhubungan seluruh jalinan kehidupan.",
      ],
      quote: "Untuk melihat makrokosmos, kita tidak harus keluar angkasa. Cukup melihat mikrokosmosnya di dalam diri. Dalam budaya Jawa ada Jagat Gedhe dan Jagat Alit. Jagat Alit itulah yang disaksikan saat mengalami Isro' Mikrokosmos.",
      quoteAttrib: "Aldi",
      keyTakeaway: "Perjalanan spiritual sejati adalah perjalanan ke dalam—bukan ke luar.",
    },
    {
      pageInChapter: 10, globalPage: 10,
      badge: "5. Jagat Gedhe vs Jagat Alit",
      title: "Kosmologi Nusantara: Makrokosmos & Mikrokosmos",
      subtitle: "Jagat Gedhe (Alam Semesta Raya) = Jagat Alit (Diri Manusia)",
      paragraphs: [
        "Leluhur kita di tanah Jawa sejak ribuan tahun lalu telah merumuskan kosmologi agung: Jagat Gedhe (Makrokosmos / Alam Semesta Raya) = Jagat Alit (Mikrokosmos / Diri Manusia).",
        "Orang Jawa kuno mengajarkan peta batin ini lewat teka-teki (sanepo) yang sangat indah:",
        "Nggoleki Galehing Kangkung: Mencari inti kayu dari batang kangkung. Jika kamu membelah batang kangkung, apa yang kamu temukan? Kekosongan (suwung). Titik nol kesadaran di mana ego dan nafsu kepemilikan telah lenyap.",
        "Nggoleki Susuhing Angin: Mencari sarang tempat angin beristirahat. Sarang angin ada di dalam dadamu sendiri: napas yang kamu hela setiap detik.",
      ],
      keyTakeaway: "Jagat Alit adalah kunci—menyelami diri adalah menyelami semesta.",
    },
    {
      pageInChapter: 11, globalPage: 11,
      badge: "6. Laku Praktis",
      title: "Latihan 1: Olah Napas Re-kalibrasi",
      subtitle: "Teknik 4-7-8 untuk memompa CSF dan merekalibrasi tulang belakang",
      paragraphs: [
        "Duduk bersila atau duduk tegak di kursi dengan punggung lurus alami (jangan bersandar).",
        "Tarik napas perlahan melalui hidung selama 4 detik, rasakan udara memenuhi perut bagian bawah, mengembang ke dada, dan menegakkan ruas tulang belakangmu.",
        "Tahan napas (hold) selama 7 detik. Saat menahan napas, kencangkan sedikit otot panggul bawahmu (kegel contraction / mula bandha) seolah menarik cairan dari tulang ekor ke arah atas ubun-ubun.",
        "Hembuskan napas perlahan melalui hidung atau mulut selama 8 detik dengan rileks total.",
        "Ulangi siklus ini sebanyak 7–10 putaran setiap sebelum tidur atau setelah bangun tidur.",
      ],
      keyTakeaway: "4-7-8: tarik 4 detik, tahan 7 detik, hembuskan 8 detik.",
    },
    {
      pageInChapter: 12, globalPage: 12,
      badge: "6. Laku Praktis",
      title: "Latihan 2: Detoks Cahaya & Restorasi Melatonin",
      subtitle: "Puasa layar dan kegelapan total untuk memaksimalkan produksi melatonin pineal",
      paragraphs: [
        "Matikan semua lampu kamar saat tidur malam (kondisi gelap gulita 100%).",
        "Hentikan paparan layar ponsel (blue light) minimal 45 menit sebelum tidur. Biarkan kelenjar pinealmu memproduksi melatonin segar untuk membersihkan dan memasak cairan otak.",
        "Sadari bahwa waktu tidur malam bukan sekadar istirahat fisik, melainkan waktu di mana tubuh mereparasi medan energi dan membakar residu stres harian.",
      ],
      keyTakeaway: "Kegelapan total 45 menit sebelum tidur = investasi melatonin tertinggi.",
    },
    {
      pageInChapter: 13, globalPage: 13,
      badge: "6. Laku Praktis",
      title: "Latihan 3: Meretas Respon Saat Terpicu",
      subtitle: "Breaking karmic loops melalui jeda sadar dan perubahan respon",
      paragraphs: [
        "Saat peristiwa yang menyebalkan atau menyakitkan terulang kembali, JANGAN LANGSUNG BEREAKSI.",
        "Sadari: 'Ini adalah data karma lamaku yang sedang naik ke permukaan.'",
        "Ambil napas panjang 3 kali, ubah responmu dari marah/panik menjadi penerimaan sadar (mindful acceptance).",
        "Ketika responmu berubah dari kebencian menjadi ketenangan netral, mata rantai getaran karma lama di tulang ekormu terputus seketika.",
      ],
      keyTakeaway: "Jeda sadar = senjata utama memutus siklus karma negatif.",
    },
    {
      pageInChapter: 14, globalPage: 14,
      badge: "7. Rangkuman",
      title: "Intisari Bab 1: Anatomi Tubuh Energi",
      subtitle: "Lima pokok kesadaran dari bab pertama perjalanan ini",
      paragraphs: [
        "1. Manusia adalah Medan Energi: Kita memancarkan medan elektromagnetik torus yang berinteraksi terus-menerus dengan frekuensi ruang dan lingkungan sekitar.",
        "2. Tulang Ekor adalah Black Box Karma: Tulang ekor (sulbi) menyimpan rekaman rasa bersalah, trauma, dan memori esensial yang memicu fenomena deja vu saat beresonansi dengan lingkungan luar.",
        "3. Cairan Serebrospinal adalah Jalur Transformasi: CSF membawa muatan bioelektrik dari dasar panggul menembus 7 stasiun kelenjar endokrin menuju otak.",
        "4. Pencerahan ada di Tubuh Biologis: Dengan menjaga melatonin dan olah napas sadar, kelenjar pineal mengaktifkan DMT alami yang menghadirkan kejernihan batin transendental.",
        "5. Jagat Alit adalah Kunci: Mengarungi misteri semesta raya dimulai dengan menyelami heningnya napas di dalam diri.",
      ],
      keyTakeaway: "Tubuh kita adalah laboratorium kesadaran paling canggih yang pernah ada.",
    },
    {
      pageInChapter: 15, globalPage: 15,
      badge: "Penutup Bab 1",
      title: "Memasuki Pintu Berikutnya",
      subtitle: "Dari anatomi energi menuju meretas pikiran bawah sadar",
      paragraphs: [
        "Kita telah menjelajahi lapisan paling mendasar dari keberadaan kita sebagai manusia: bahwa kita bukan sekadar raga fisik, melainkan medan energi yang hidup, bergetar, dan terus berinteraksi dengan semesta.",
        "Tulang ekor kita menyimpan sejarah yang jauh lebih panjang dari usia tubuh kita saat ini. Cairan serebrospinal kita adalah kendaraan transformasi yang menunggu untuk diaktifkan.",
        "Di bab berikutnya, kita akan melangkah lebih jauh ke dalam: meretas pikiran bawah sadar, memahami bagaimana nasib manusia sesungguhnya terbentuk, dan menemukan kunci untuk memprogram ulang takdir dari akar terdalamnya.",
      ],
      keyTakeaway: "Perjalanan sesungguhnya baru saja dimulai.",
    },
  ],
};

// ─── BAB 02 — Meretas Pikiran Bawah Sadar ─────────────────────────────────
const bab02: ChapterData = {
  id: 2,
  num: "02",
  title: "Meretas Pikiran Bawah Sadar & Reprogramming Nasib",
  subtitle: "Zona Theta, Critical Faculty & Jeda 3 Detik yang Mengubah Takdir",
  tags: ["Zona Theta", "Critical Faculty", "Jeda 3 Detik"],
  image: "assets/bab_02_theta.jpg",
  pageStart: 16,
  pageCount: 15,
  pages: Array.from({ length: 15 }, (_, i) => ({
    pageInChapter: i + 1,
    globalPage: 16 + i,
    badge: i === 0 ? "Sampul & Pembuka" : `Halaman ${i + 1}`,
    title: i === 0 ? "Meretas Pikiran Bawah Sadar & Reprogramming Nasib" : `Halaman ${i + 2} — Bab 02`,
    subtitle: i === 0 ? "Zona Theta, Critical Faculty & Jeda 3 Detik yang Mengubah Takdir" : "",
    paragraphs: i === 0 ? [] : [
      "Di antara sadar dan tidur, ada ruang sunyi yang sangat kuat. Di sanalah perubahan dimulai.",
      "Pikiran sadar hanya menguasai 5-10% dari keseluruhan sistem operasi manusia. Sisanya—90-95%—adalah domain alam bawah sadar yang berjalan di luar kendali pikiran logis.",
    ],
    quote: i === 0 ? "Ketertarikan orang tentang self-development atau spiritualitas itu biasanya karena diawali oleh sebuah kehancuran. Ketika dunianya hancur, dia sebenarnya bukan butuh dijejali ayat atau dalil, tapi tubuhnya di-develop dulu, alam bawah sadarnya di-reprogram." : undefined,
    quoteAttrib: i === 0 ? "Aldi (@rahwanaconsciousnessroom)" : undefined,
    keyTakeaway: i === 0 ? "Nasib manusia terikat erat dengan apa yang terinstal di alam bawah sadarnya." : undefined,
  })),
};

// ─── BAB 03 — Sistem Hormon, Biohacking Leluhur ───────────────────────────
const bab03: ChapterData = {
  id: 3,
  num: "03",
  title: "Sistem Hormon, Biohacking Leluhur & Energi Fisik",
  subtitle: "Dopamin Baseline, Ritme Sirkadian & Puasa Weton Sebagai Teknologi Biologis",
  tags: ["Dopamin", "Ritme Sirkadian", "Puasa Weton"],
  image: "assets/bab_03_biohack.jpg",
  pageStart: 31,
  pageCount: 15,
  pages: Array.from({ length: 15 }, (_, i) => ({
    pageInChapter: i + 1,
    globalPage: 31 + i,
    badge: i === 0 ? "Sampul & Pembuka" : `Halaman ${i + 1}`,
    title: i === 0 ? "Sistem Hormon, Biohacking Leluhur & Energi Fisik" : `Halaman ${i + 2} — Bab 03`,
    subtitle: i === 0 ? "Dopamin Baseline, Ritme Sirkadian & Puasa Weton" : "",
    paragraphs: i === 0 ? [] : [
      "Tubuh manusia adalah laboratorium biokimia paling canggih yang pernah ada. Setiap keputusan, setiap emosi, setiap pola pikir—semuanya berakar pada keseimbangan hormonal.",
    ],
    quote: i === 0 ? "Leluhur kita tidak butuh teknologi modern untuk memahami biologi manusia. Mereka memahaminya melalui observasi mendalam selama ribuan tahun dan mewariskannya dalam bentuk laku hidup yang kita sebut 'tradisi'." : undefined,
    quoteAttrib: i === 0 ? "Aldi (@rahwanaconsciousnessroom)" : undefined,
    keyTakeaway: i === 0 ? "Tradisi leluhur adalah teknologi biologis yang telah teruji ribuan tahun." : undefined,
  })),
};

// ─── BAB 04 — Fisika Kuantum, Relativitas & Keterhubungan ─────────────────
const bab04: ChapterData = {
  id: 4,
  num: "04",
  title: "Fisika Kuantum, Relativitas & Keterhubungan Semesta",
  subtitle: "Entanglement, Relativitas Waktu & Titik Nol (Suwung) sebagai Realitas Sejati",
  tags: ["Keterhubungan", "Relativitas", "Titik Nol"],
  image: "assets/bab_04_kuantum.jpg",
  pageStart: 46,
  pageCount: 14,
  pages: Array.from({ length: 14 }, (_, i) => ({
    pageInChapter: i + 1,
    globalPage: 46 + i,
    badge: i === 0 ? "Sampul & Pembuka" : `Halaman ${i + 1}`,
    title: i === 0 ? "Fisika Kuantum, Relativitas & Keterhubungan Semesta" : `Halaman ${i + 2} — Bab 04`,
    subtitle: i === 0 ? "Entanglement, Relativitas Waktu & Titik Nol (Suwung)" : "",
    paragraphs: i === 0 ? [] : [
      "Fisika kuantum telah membuktikan bahwa dua partikel yang pernah bersentuhan akan tetap saling mempengaruhi meskipun dipisahkan jarak kosmis—inilah quantum entanglement.",
    ],
    quote: i === 0 ? "Semesta ini bukan kumpulan objek yang terpisah-pisah. Ini adalah jaring keterhubungan yang hidup, di mana setiap getaran batinmu menciptakan riak nyata di realitas." : undefined,
    quoteAttrib: i === 0 ? "Aldi (@rahwanaconsciousnessroom)" : undefined,
    keyTakeaway: i === 0 ? "Keterhubungan kuantum membuktikan bahwa tidak ada yang benar-benar terpisah." : undefined,
  })),
};

// ─── BAB 05 — Menjadi Manusia Normal & Seni Berserah ──────────────────────
const bab05: ChapterData = {
  id: 5,
  num: "05",
  title: "Menjadi Manusia Normal & Seni Berserah",
  subtitle: "Anti Spiritual Bypass, Dunia Fisik sebagai Lapangan & Protokol Seni Berserah",
  tags: ["Anti Spiritual Bypass", "Dunia Fisik", "Seni Berserah"],
  image: "assets/bab_05_berserah.jpg",
  pageStart: 60,
  pageCount: 15,
  pages: Array.from({ length: 15 }, (_, i) => ({
    pageInChapter: i + 1,
    globalPage: 60 + i,
    badge: i === 0 ? "Sampul & Pembuka" : `Halaman ${i + 1}`,
    title: i === 0 ? "Menjadi Manusia Normal & Seni Berserah" : `Halaman ${i + 2} — Bab 05`,
    subtitle: i === 0 ? "Anti Spiritual Bypass, Dunia Fisik & Protokol Seni Berserah" : "",
    paragraphs: i === 0 ? [] : [
      "Spiritualitas sejati bukan pelarian dari dunia fisik. Ia adalah cara baru untuk hadir penuh di dalamnya—dengan kesadaran, dengan ketenangan, dan dengan rasa syukur yang mengakar.",
    ],
    quote: i === 0 ? "Menjadi manusia normal yang sadar utuh—itulah puncak dari seluruh perjalanan ini. Bukan menjadi orang suci yang melayang di awan, tapi menjadi manusia yang hadir sepenuhnya di bumi." : undefined,
    quoteAttrib: i === 0 ? "Aldi (@rahwanaconsciousnessroom)" : undefined,
    keyTakeaway: i === 0 ? "Spiritualitas sejati adalah menjadi manusia normal yang sadar utuh." : undefined,
  })),
};

// ─── MASTER EXPORT ─────────────────────────────────────────────────────────
export const CHAPTERS: ChapterData[] = [bab01, bab02, bab03, bab04, bab05];

export const TOTAL_PAGES = CHAPTERS.reduce((sum, c) => sum + c.pageCount, 0);
// Should be: 15 + 15 + 15 + 14 + 15 = 74

/** Get a page by its global page number (1-based) */
export function getPageByGlobal(globalPage: number): { chapter: ChapterData; page: PageData } | null {
  for (const chapter of CHAPTERS) {
    if (globalPage >= chapter.pageStart && globalPage < chapter.pageStart + chapter.pageCount) {
      const page = chapter.pages[globalPage - chapter.pageStart];
      if (page) return { chapter, page };
    }
  }
  return null;
}

/** Get all pages as a flat array */
export function getAllPages(): Array<{ chapter: ChapterData; page: PageData }> {
  return CHAPTERS.flatMap(chapter =>
    chapter.pages.map(page => ({ chapter, page }))
  );
}
