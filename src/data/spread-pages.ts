/**
 * SUATU SAAT v2 — Rich Reader Pages Data
 * Structured for the 2-Page Book Spread (Text Left | Artwork + Quote Right)
 */

export interface SpreadPage {
  globalPage: number;
  chapterId: number;
  chapterNum: string;
  chapterTitle: string;
  pageInChap: number;
  totalInChap: number;
  pageNumberDisplay: string; // e.g. "01", "02", "07"
  title: string;
  paragraphs: string[];
  image: string;
  quote: string;
}

export const BOOK_SPREAD_PAGES: SpreadPage[] = [
  // ─── BAB 01: Anatomi Tubuh Energi & Memori Karma ───────────────────────────
  {
    globalPage: 1, chapterId: 1, chapterNum: "BAB 01", chapterTitle: "Anatomi Tubuh Energi & Memori Karma",
    pageInChap: 1, totalInChap: 15, pageNumberDisplay: "01",
    title: "Anatomi Tubuh Energi &\nMemori Karma",
    paragraphs: [
      "Kita ini makhluk energi yang memadat menjadi materi.",
      "Proses deja vu itu terjadi saat medan torus kita bersinggungan dengan medan energi di suatu tempat, menekan data karma di tulang ekor untuk naik dan terbaca sebagai ingatan."
    ],
    image: "assets/bab_01_torus.jpg",
    quote: "Kita adalah getaran yang memadat agar dapat menyentuh dunia."
  },
  {
    globalPage: 2, chapterId: 1, chapterNum: "BAB 01", chapterTitle: "Anatomi Tubuh Energi & Memori Karma",
    pageInChap: 2, totalInChap: 15, pageNumberDisplay: "02",
    title: "Obrolan Pinggir Jurang &\nMisteri Deja Vu",
    paragraphs: [
      "Pernahkah kamu tiba-tiba mendatangi sebuah tempat baru lalu dadamu berdesir hebat?",
      "Ada sensasi asing yang menusuk batinmu: 'Aku pernah di sini sebelumnya. Aku kenal bau udara ini.'",
      "Itu bukan sekadar ingatan visual, melainkan respon elektromagnetik dari seluruh susunan saraf ragamu."
    ],
    image: "assets/bab_01_torus.jpg",
    quote: "Di balik deja vu, tersimpan rekaman purba yang memanggilmu pulang."
  },
  {
    globalPage: 4, chapterId: 1, chapterNum: "BAB 01", chapterTitle: "Anatomi Tubuh Energi & Memori Karma",
    pageInChap: 4, totalInChap: 15, pageNumberDisplay: "04",
    title: "Medan Torus Jantung &\nResonansi Ruang",
    paragraphs: [
      "Jantung manusia memancarkan medan magnet berbentuk donat melingkar yang dinamakan Medan Torus.",
      "Radiasi elektromagnetik ini berdenyut hingga beberapa meter di sekitarmu, terus-menerus bertukar informasi frekuensi dengan lingkungan sekitar."
    ],
    image: "assets/bab_01_torus.jpg",
    quote: "Setiap detak jantungmu memancarkan gelombang yang menyentuh semesta."
  },
  {
    globalPage: 9, chapterId: 1, chapterNum: "BAB 01", chapterTitle: "Anatomi Tubuh Energi & Memori Karma",
    pageInChap: 9, totalInChap: 15, pageNumberDisplay: "09",
    title: "Black Box Tulang Ekor &\nEndapan Karma",
    paragraphs: [
      "Tulang sulbi adalah titik mula janin yang abadi. Secara fisiologis dan batiniah, ia bertindak sebagai reservoir penyimpan jejak trauma dan data karma.",
      "Ketika kita menyadari getaran rasa bersalah yang mengkristal di sana, siklus hidup yang berulang mulai terurai."
    ],
    image: "assets/bab_01_torus.jpg",
    quote: "Mengurai karma dimulai dari keberanian menatap apa yang kau kubur di dalam diri."
  },
  {
    globalPage: 14, chapterId: 1, chapterNum: "BAB 01", chapterTitle: "Anatomi Tubuh Energi & Memori Karma",
    pageInChap: 14, totalInChap: 15, pageNumberDisplay: "14",
    title: "Cairan Serebrospinal &\nElevator Kesadaran",
    paragraphs: [
      "Cairan bening CSF membawa muatan bioelektrik dari tulang ekor menembus 7 stasiun kelenjar endokrin menuju kelenjar pineal di otak.",
      "Dengan olah napas sadar dan restorasi melatonin di kegelapan malam, raga mengalami Isro' Mikrokosmos—penyaksian jagat alit yang hening."
    ],
    image: "assets/bab_01_torus.jpg",
    quote: "Menyelami diri sendiri adalah menyelami rahasia semesta raya."
  },

  // ─── BAB 02: Meretas Pikiran Bawah Sadar & Reprogramming Nasib ─────────────
  {
    globalPage: 16, chapterId: 2, chapterNum: "BAB 02", chapterTitle: "Meretas Pikiran Bawah Sadar",
    pageInChap: 1, totalInChap: 15, pageNumberDisplay: "01",
    title: "Meretas Pikiran Bawah Sadar &\nReprogramming Nasib",
    paragraphs: [
      "Ketertarikan orang tentang self-development biasanya diawali oleh kehancuran.",
      "Ketika dunianya hancur, ia bukan butuh dicekoki nasihat, melainkan sistem sarafnya distabilkan dan pikiran bawah sadarnya diprogram ulang dari akar."
    ],
    image: "assets/bab_02_theta.jpg",
    quote: "Pikiran bawah sadar adalah tanah subur; apa yang kau tanam dalam hening akan berbuah takdir."
  },
  {
    globalPage: 20, chapterId: 2, chapterNum: "BAB 02", chapterTitle: "Meretas Pikiran Bawah Sadar",
    pageInChap: 5, totalInChap: 15, pageNumberDisplay: "05",
    title: "Zona Theta: Pintu Masuk ke\nPikiran Bawah Sadar",
    paragraphs: [
      "Di antara sadar dan tidur, ada ruang sunyi yang sangat kuat. Di sanalah perubahan dimulai.",
      "Gelombang otak melambat ke frekuensi 4-7 Hz. Gerbang Critical Faculty terbuka, memungkinkan sugesti baru terinstal tanpa perlawanan ego logis."
    ],
    image: "assets/bab_02_theta.jpg",
    quote: "Ketika pikiran tenang, realitas mulai terbuka."
  },
  {
    globalPage: 24, chapterId: 2, chapterNum: "BAB 02", chapterTitle: "Meretas Pikiran Bawah Sadar",
    pageInChap: 9, totalInChap: 15, pageNumberDisplay: "09",
    title: "Critical Faculty &\n4 Gerbang Reprogramming",
    paragraphs: [
      "Critical Faculty adalah satpam pikiran sadar yang menyaring setiap informasi baru.",
      "Melalui repetisi emosional, kondisi hipnagogik sebelum tidur, serta keheningan meditatif, kita dapat melampaui satpam ini dan menanamkan blueprint nasib yang baru."
    ],
    image: "assets/bab_02_theta.jpg",
    quote: "Bukan takdir yang kaku, melainkan program batinmu yang belum kau perbarui."
  },
  {
    globalPage: 28, chapterId: 2, chapterNum: "BAB 02", chapterTitle: "Meretas Pikiran Bawah Sadar",
    pageInChap: 13, totalInChap: 15, pageNumberDisplay: "13",
    title: "Jeda 3 Detik yang\nMengubah Arah Takdir",
    paragraphs: [
      "Antara stimulus dan respon selalu ada celah kecil: jeda 3 detik.",
      "Di dalam jeda itulah letak kebebasan dan kedaulatan manusiasejati. Saat kamu menahan reaktivitasmu 3 detik saja, kamu memutus mata rantai pola karma lama."
    ],
    image: "assets/bab_02_theta.jpg",
    quote: "Tiga detik keheningan lebih berharga daripada seribu kata amarah."
  },

  // ─── BAB 03: Sistem Hormon, Biohacking Leluhur & Energi Fisik ─────────────
  {
    globalPage: 31, chapterId: 3, chapterNum: "BAB 03", chapterTitle: "Sistem Hormon, Biohacking Leluhur",
    pageInChap: 1, totalInChap: 15, pageNumberDisplay: "01",
    title: "Sistem Hormon &\nBiohacking Leluhur",
    paragraphs: [
      "Tubuh manusia adalah laboratorium biokimia paling canggih yang pernah ada.",
      "Leluhur Nusantara tidak butuh istilah laboratorium modern untuk memahami bahwa puasa dan penyelarasan alam adalah teknologi pemulihan reseptor tubuh."
    ],
    image: "assets/bab_03_biohack.jpg",
    quote: "Raga adalah kuil suci; rawatlah kimianya agar jiwamu bermukim dengan damai."
  },
  {
    globalPage: 35, chapterId: 3, chapterNum: "BAB 03", chapterTitle: "Sistem Hormon, Biohacking Leluhur",
    pageInChap: 5, totalInChap: 15, pageNumberDisplay: "05",
    title: "Dopamin Baseline &\nReset Reseptor Otak",
    paragraphs: [
      "Paparan stimulasi instan membuat baseline dopamin anjlok drastis ke dasar jurang.",
      "Ketika reseptor dopamin terbakar oleh kecanduan layar, hal-hal sederhana kehilangan daya tariknya. Puasa sensorik adalah jalan memulihkan kembali rasa takjub akan kehidupan."
    ],
    image: "assets/bab_03_biohack.jpg",
    quote: "Ketenangan batin lahir saat kau berhenti memburu kenikmatan semu."
  },
  {
    globalPage: 40, chapterId: 3, chapterNum: "BAB 03", chapterTitle: "Sistem Hormon, Biohacking Leluhur",
    pageInChap: 10, totalInChap: 15, pageNumberDisplay: "10",
    title: "Ritme Sirkadian &\nTeknologi Puasa Weton",
    paragraphs: [
      "Puasa weton bukan klenik mistis, melainkan protokol bio-ritmik berkala untuk memicu autofagi sel.",
      "Ketika perut diistirahatkan tepat pada siklus selular tubuhmu, sel-sel tua dimakan dan diperbarui, menghasilkan energi vitalitas (prana) yang melimpah."
    ],
    image: "assets/bab_03_biohack.jpg",
    quote: "Tradisi leluhur adalah sains yang dibungkus dengan kearifan rasa."
  },

  // ─── BAB 04: Fisika Kuantum, Relativitas & Keterhubungan ──────────────────
  {
    globalPage: 46, chapterId: 4, chapterNum: "BAB 04", chapterTitle: "Fisika Kuantum & Keterhubungan",
    pageInChap: 1, totalInChap: 14, pageNumberDisplay: "01",
    title: "Fisika Kuantum &\nKeterhubungan Semesta",
    paragraphs: [
      "Dua partikel kuantum yang pernah saling bersentuhan akan tetap saling mempengaruhi melintasi ruang dan waktu.",
      "Tidak ada yang benar-benar terpisah di semesta ini. Pikiran, emosi, dan niatmu adalah riak getaran di samudera medan kuantum tunggal."
    ],
    image: "assets/bab_04_kuantum.jpg",
    quote: "Semesta tidak berada di luar dirimu; semesta bernapas di dalam dadamu."
  },
  {
    globalPage: 55, chapterId: 4, chapterNum: "BAB 04", chapterTitle: "Fisika Kuantum & Keterhubungan",
    pageInChap: 10, totalInChap: 14, pageNumberDisplay: "10",
    title: "Titik Nol (Suwung) sebagai\nRealitas Sejati",
    paragraphs: [
      "Konsep Suwung dalam kosmologi Jawa kuno identik dengan Quantum Zero-Point Field.",
      "Bukan hampa kosong tak bermakna, melainkan kekosongan yang sarat dengan potensi murni—titik di mana segala ciptaan bermula dan berakhir."
    ],
    image: "assets/bab_04_kuantum.jpg",
    quote: "Saat ego luruh ke dalam titik nol, semesta sendiri yang bekerja melalui ragamu."
  },

  // ─── BAB 05: Menjadi Manusia Normal & Seni Berserah ──────────────────────
  {
    globalPage: 60, chapterId: 5, chapterNum: "BAB 05", chapterTitle: "Menjadi Manusia Normal & Seni Berserah",
    pageInChap: 1, totalInChap: 15, pageNumberDisplay: "01",
    title: "Menjadi Manusia Normal &\nSeni Berserah",
    paragraphs: [
      "Spiritualitas sejati bukan pelarian dari tanggung jawab bumi (anti spiritual bypass).",
      "Puncak dari seluruh laku olah batin ini bukanlah menjadi sakti atau melayang di awan, melainkan menjadi manusia normal yang sadar utuh, memijak bumi dengan teguh."
    ],
    image: "assets/bab_05_berserah.jpg",
    quote: "Menjadi manusia normal yang sadar utuh—itulah puncak perjalanan."
  },
  {
    globalPage: 70, chapterId: 5, chapterNum: "BAB 05", chapterTitle: "Menjadi Manusia Normal & Seni Berserah",
    pageInChap: 11, totalInChap: 15, pageNumberDisplay: "11",
    title: "Protokol Seni Berserah &\nKetenangan Batin",
    paragraphs: [
      "Berserah bukanlah menyerah pasif tanpa daya. Berserah adalah tindakan sadar melepaskan nafsu mengontrol hasil setelah mengerahkan upaya terbaik.",
      "Di saat kita berserah total, beban di pundak sirna, dan ketenangan yang tak tergoyahkan merayap memenuhi rongga dada."
    ],
    image: "assets/bab_05_berserah.jpg",
    quote: "Lepaskan cengkeramanmu, dan biarkan keagungan hidup memandu langkahmu."
  },
  {
    globalPage: 74, chapterId: 5, chapterNum: "PENUTUP", chapterTitle: "Aku Telah Pulang",
    pageInChap: 15, totalInChap: 15, pageNumberDisplay: "15",
    title: "Aku Telah Pulang:\nTitik Nol Keheningan",
    paragraphs: [
      "Perjalanan telah genap. Kamu telah menembus ilusi pemisahan antara materi dan energi.",
      "Pulanglah ke dalam dirimu sendiri setiap kali dunia luar bising. Di sanalah rumah sejati yang tak pernah runtuh."
    ],
    image: "assets/closing_landscape.jpg",
    quote: "Aku telah pulang. Ke dalam hening yang memeluk segalanya."
  }
];

export function getSpreadPage(globalPage: number): SpreadPage {
  const found = BOOK_SPREAD_PAGES.find(p => p.globalPage === globalPage);
  if (found) return found;
  // If exact page not in milestones, find closest or default
  for (let i = BOOK_SPREAD_PAGES.length - 1; i >= 0; i--) {
    if (BOOK_SPREAD_PAGES[i].globalPage <= globalPage) {
      return BOOK_SPREAD_PAGES[i];
    }
  }
  return BOOK_SPREAD_PAGES[0];
}
