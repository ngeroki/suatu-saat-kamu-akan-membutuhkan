import fs from 'fs';

const patchFile = './scripts/patches/bab-4.json';
const pages = JSON.parse(fs.readFileSync(patchFile, 'utf8'));

const updates = {
  46: {
    badge: "SAMPUL & PEMBUKA",
    title: "Fisika Kuantum, Relativitas & Keterhubungan Semesta",
    subtitle: "Kedai Kopi Malam, Partikel yang Saling Terikat, dan Kidung Jiwa Nusantara",
    paragraphs: [
      "\"Kamu kira kamu hidup terpisah sendirian di dunia ini? Fisika kuantum yang paling canggih membuktikan bahwa di tingkat partikel paling dasar, seluruh atom di tubuhmu pernah menyatu dalam satu titik mula kosmos! Keterpisahan itu cuma ilusi optik matamu. Waktu kamu menyakiti sesama, kamu sesungguhnya sedang melukai dirimu sendiri.\"",
      "Aldi (@rahwanaconsciousnessroom)",
      "Bab ini mengajakmu duduk di bawah temaram kedai kopi malam hari. Kita bedah mengapa firasat bisa tepat sasaran, misteri debu bintang di urat nadimu, bagaimana waktu cuma ilusi jam dinding, hingga rahasia sebelas tembang macapat sebagai kidung perjalanan jiwa."
    ],
    keyTakeaway: "Keterpisahan adalah ilusi biologis; di tingkat kuantum, kamu terikat abadi dengan seluruh isi semesta."
  },
  47: {
    badge: "KEDAI REMANG",
    title: "Kenapa Kita Sering Merasa Sendirian?",
    subtitle: "Temaram lampu gantung, cangkir mendingin, dan kawan lama yang mendadak muncul di layar.",
    paragraphs: [
      "Duduklah di kedai kopi malam-malam begini. Cangkir kopimu sudah dingin, jalanan mulai lengang. Pernah nggak kamu mengalami hal yang ganjil: tiba-tiba kepalamu teringat kawan lama yang bertahun-tahun hilang kontak, lalu lima menit kemudian namanya muncul menelepon di ponselmu?",
      "Atau saat kamu melangkah masuk ke ruangan asing penuh orang baru, dadamu mendadak bergetar akrab dengan seseorang yang belum pernah kamu kenal sebelumnya? Kebanyakan orang langsung nyeletuk: 'Wah, kebetulan banget!' Kebetulan dari mana?",
      "Di alam semesta ini nggak ada dadu yang dilempar secara acak! Ada jala-jala getaran tak kasatmata yang menghubungkan setiap kesadaran. Rasa sepi dan keterasingan yang menyiksa manusia modern cuma ilusi sempit karena kita mengira diri kita berhenti di batas kulit luar tubuh kita!"
    ],
    keyTakeaway: "Tidak ada kebetulan di alam semesta; firasat dan keakraban batin adalah sinyal jala-jala energi yang saling terhubung."
  },
  48: {
    badge: "IKATAN KUANTUM",
    title: "Dua Partikel yang Tak Pernah Berpisah",
    subtitle: "Einstein menyebutnya aksi hantu jarak jauh; semesta menyebutnya jalinan cinta abadi.",
    paragraphs: [
      "Fisikawan sehebat Albert Einstein saja pernah dibuat pusing tujuh keliling sama fenomena fisika kuantum yang dia juluki aksi hantu jarak jauh, atau quantum entanglement!",
      "Bayangkan ada dua partikel kecil pernah saling berinteraksi, lalu yang satu ditaruh di bumi dan satunya lagi dibuang ke ujung galaksi sejauh miliaran tahun cahaya. Begitu partikel di bumi kamu putar ke kanan, detik itu juga partikel di ujung langit merespons berputar ke kiri tanpa jeda waktu sedikit pun, melampaui batas kecepatan cahaya!",
      "Bagaimana mungkin dua partikel yang terpisah jarak kosmik begitu jauh bisa saling tahu tanpa kabel penghubung? Logikanya cuma satu: karena di dimensi yang lebih dalam, kedua partikel itu sesungguhnya nggak pernah terpisah sama sekali! Apa yang pernah terikat di tingkat batin bakal terhubung selamanya."
    ],
    keyTakeaway: "Jalinan kuantum melampaui sekat ruang dan jarak; apa yang pernah bersatu di tingkat batin akan terikat selamanya."
  },
  49: {
    badge: "DEBU BINTANG",
    title: "Darahmu Mengalir dari Tungku Bintang Purba",
    subtitle: "Atom besi di nadimu dan kalsium di tulangmu dimasak dalam fusi kosmos miliaran tahun lalu.",
    paragraphs: [
      "Kita ini sering merasa seperti orang asing di bumi, seolah-olah manusia adalah makhluk telantar yang tiba-tiba jatuh dari langit. Padahal secara sains murni, setiap butir atom di tubuhmu itu debu bintang purba!",
      "Atom besi yang mengalirkan warna merah di darahmu, kalsium yang menegakkan tulang punggungmu, sampai fosfor di untaian DNA-mu, semuanya dimasak di dalam tungku fusi nuklir bintang-bintang raksasa miliaran tahun silam sebelum meledak jadi supernova! Waktu Dentuman Besar bermula, seluruh materi kosmos terhimpun dalam satu titik yang sama.",
      "Tubuhmu tidak cuma hidup menumpang di semesta; seluruh semesta raya ini sedang hidup dan bernapas di dalam dirimu! Kenapa kamu masih merasa kerdil dan sendirian?"
    ],
    keyTakeaway: "Kamu adalah debu bintang yang berkesadaran; seluruh sejarah kosmos terpatri nyata di dalam setiap sel darahmu."
  },
  50: {
    badge: "TITIK SAIKI",
    title: "Waktu Sebenarnya Cuma Kesepakatan Sosial",
    subtitle: "Kemarin cuma rekaman di saraf, besok cuma proyeksi ego, dan pintu gerbangnya ada di detik ini.",
    paragraphs: [
      "Coba tatap jam dinding di depanmu. Detik demi detik berputar teratur. Tapi kamu sadar nggak, waktu berjalan lurus itu sesungguhnya cuma kesepakatan sosial manusia buat mencatat putaran bumi menghadap matahari!",
      "Di alam kuantum, waktu itu elastis dan nisbi. Yang nyata-nyata ada cuma detik ini: titik saiki! Masa lalu itu cuma rekaman neurokimia di saraf dan memori tulang ekormu. Masa depan cuma angan-angan dan ketakutan egomu yang belum tentu kejadian.",
      "Tragedi manusia modern adalah energi hidupnya bocor karena perhatiannya terbelah: separuh terjebak menyesali masa lalu, separuh cemas menatap esok. Akibatnya, nol persen hadir di saat ini! Pintu gerbang medan kuantum cuma terbuka buat orang yang berani hadir utuh di detik sekarang."
    ],
    keyTakeaway: "Hadirlah utuh di titik saiki; masa lalu cuma arsip saraf dan masa depan cuma angan, medan kuantum hanya terbuka di detik ini."
  },
  51: {
    badge: "SEBAB DI BELAKANG",
    title: "Ketika Akibat Mendahului Sebab",
    subtitle: "Hiduplah dalam rasa cukup dan syukur hari ini, maka semesta akan menata materinya menyusul.",
    paragraphs: [
      "Di bangku sekolah, kita dijejali hukum sebab-akibat yang kaku: kamu harus punya harta melimpah dulu di luar, baru batinmu merasa makmur dan tenang di dalam. Kamu menunggu dunia luar berubah baru mengizinkan hatimu bahagia.",
      "Di medan kuantum, hukum ini diputar balik seratus delapan puluh derajat: akibat mendahului sebab! Kamu hidupi dulu rasa ayem, tentrem, bersyukur, dan kecukupan di dalam dadamu saat ini juga, seolah-olah berkah itu sudah nyata hadir di depan matamu.",
      "Semesta itu proyektor yang membaca getaran rasamu. Waktu batinmu memancarkan frekuensi kecukupan tanpa sebutir pun keraguan, medan kuantum bakal menata susunan materi di dunia nyata buat menyesuaikan diri dengan cetak biru rasa yang kamu pancarkan!"
    ],
    keyTakeaway: "Kausalitas kuantum berakar di dada; hidupi getaran rasa cukup sekarang, maka semesta akan mewujudkan bentuk materinya."
  },
  52: {
    badge: "MATA PENGAMAT",
    title: "Realitas Tergantung ke Mana Matamu Menatap",
    subtitle: "Gelombang kemungkinan runtuh menjadi kepastian begitu kesadaranmu mulai mengamatinya.",
    paragraphs: [
      "Pernah dengar eksperimen celah ganda yang bikin para ilmuwan dunia garuk-garuk kepala? Partikel subatomik itu perilakunya seperti gelombang kemungkinan yang ada di mana-mana secara serentak, sampai ada pengamat yang memperhatikannya!",
      "Begitu ada mata pengamat yang hadir, gelombang kemungkinan itu langsung runtuh seketika jadi satu titik partikel materi padat. Inilah Efek Pengamat! Hidupmu saban hari dipenuhi jutaan gelombang kemungkinan: kemungkinan sial, kemungkinan mujur, kemungkinan sakit, kemungkinan sehat.",
      "Ke mana fokus perhatian dan getaran rasamu kamu arahkan setiap jam, ke sanalah gelombang potensi itu bakal memadat jadi kenyataan hidupmu! Kalau matamu cuma sibuk memelototi kekurangan dan ketakutan, ya ketakutan itulah yang memadat jadi nasibmu."
    ],
    keyTakeaway: "Atensimu adalah pencipta realitas; ke mana fokus perhatianmu tertuju, ke sanalah gelombang potensi semesta akan memadat."
  },
  53: {
    badge: "SUWUNG MANUNGGAL",
    title: "Meleburnya Sekat Antara Dirimu dan Sang Maha Ada",
    subtitle: "Bukan menyatu secara jasmani, melainkan lenyapnya ilusi bahwa kamu pernah terpisah dari-Nya.",
    paragraphs: [
      "Banyak orang gagal paham mendengar kalimat Manunggaling Kawula Gusti, lalu menuduhnya sesat seolah-olah manusia mengaku jadi Tuhan secara fisik. Itu pemikiran dangkal dari akal yang masih terkurung kulit luar!",
      "Manunggal sejati itu puncak tauhid murni yang meruntuhkan dinding keakuan egomu. Ia adalah momen waktu kesadaranmu terbangun dan menyadari bahwa keterpisahan antara dirimu dan Sang Pencipta hanyalah ilusi yang diciptakan oleh rasa sombongmu sendiri.",
      "Mirip sebutir tetes embun pagi yang jatuh kembali ke dalam samudra luas: embun itu tidak musnah, tapi sekat pembatasnya lebur menyatu dengan air samudra. Waktu kamu suwung dari keangkuhan diri, yang tersisa hanyalah keagungan Sang Maha Ada yang meliputi segalanya!"
    ],
    keyTakeaway: "Manunggal adalah puncak tauhid murni; luruhkan dinding keakuan egomu agar kesadaran sejati menyatu dengan samudra ilahi."
  },
  54: {
    badge: "PETA NABI",
    title: "Perjalanan Jiwa Menuju Manusia Utuh",
    subtitle: "Dari Adam hingga Muhammad, dari Al-Fatihah hingga An-Nas: puncaknya adalah kembali ke masyarakat.",
    paragraphs: [
      "Kisah para nabi di kitab suci itu jangan cuma dibaca seperti dongeng pengantar tidur masa lalu. Itu peta evolusi kesadaran manusia yang sangat rapi!",
      "Perjalanan jiwa bermula dari Nabi Adam lambang kesadaran raga jasmani awal, mendaki melintasi ujian api Ibrahim lambang pemurnian tauhid, ketabahan Ayyub lambang keruntuhan ego raga, sampai berpuncak pada Nabi Muhammad lambang kesadaran paripurna yang menjadi rahmat bagi semesta alam.",
      "Dan perhatikan rahasia puncaknya: beliau tidak berhenti menetap di langit mikraj yang hening, melainkan turun kembali ke bumi buat berdagang, mendidik anak istri, dan merawat masyarakat! Dari Al-Fatihah pembuka keagungan langit, kitab suci ditutup dengan surat An-Nas: kembali membumi di tengah sesama manusia."
    ],
    keyTakeaway: "Puncak perjalanan spiritual bukanlah menjadi makhluk langit; melainkan kembali membumi sebagai rahmat bagi sesama manusia."
  },
  55: {
    badge: "KIDUNG MACAPAT",
    title: "Sebelas Tembang Siklus Perjalanan Jiwa",
    subtitle: "Dari Maskumambang di rahim ibu hingga Pocung saat kafan membungkus jasad bersahaja.",
    paragraphs: [
      "Orang tua di tanah Jawa menyandikan seluruh lakon perjalanan jiwa manusia ke dalam sebelas tembang Macapat. Indah dan menyentuh hati sekali!",
      "Dimulai dari Maskumambang waktu ruh terapung di air rahim ibu, lalu Mijil waktu bayi lahir menangis ke dunia. Tumbuh remaja dalam Sinom, mendapat tuntunan budi dalam Kinanthi, lalu mabuk asmara dalam Asmaradana. Mengikat janji pernikahan dalam Gambuh, mengecap manisnya rezeki hidup dalam Dhandhanggula, hingga diuji amarah dalam Durma.",
      "Masuk usia senja melantunkan Pangkur buat menyingkirkan nafsu duniawi, menyambut lepasnya sukma dalam Megatruh, dan berakhir bersahaja dalam Pocung waktu kain kafan putih membungkus jasad di liang lahat. Hidup ini tembang yang berganti bait; jangan salah menyanyikannya!"
    ],
    keyTakeaway: "Hidup adalah tembang yang terus berganti bait; kenali fasemu hari ini agar jiwamu melangkah dengan anggun menuju kepulangan."
  },
  56: {
    badge: "HADIR UTUH",
    title: "Menikmati Secangkir Kopi Tanpa Menjajah Masa Depan",
    subtitle: "Energi batinmu bocor bukan karena beban hidup, tapi karena pikiranmu bertamasya ke mana-mana.",
    paragraphs: [
      "Coba sesekali minum kopi dengan kesadaran yang utuh seratus persen. Dekatkan cangkir ke hidungmu, hirup aroma sangrai kopinya yang wangi, rasakan kehangatan keramik cangkir di jemarimu, dan sesap airnya perlahan menyentuh lidah. Rasakan pahit dan manisnya tanpa terburu-buru.",
      "Kebanyakan orang hari ini menyeruput kopi sambil matanya menatap liar layar gawai, mulutnya mengunyah camilan, dan otaknya panik memikirkan target kerjaan esok lusa! Kopinya habis tanpa pernah benar-benar dirasakan nikmatnya.",
      "Itulah potret manusia modern: raganya duduk di warkop, jiwanya tercecer di kantor dan masa depan! Tarik kembali seluruh kepingan jiwamu yang berserakan. Hadirlah utuh di tempat kakimu sedang berpijak hari ini."
    ],
    keyTakeaway: "Hadirlah utuh di setiap tarikan napas; nikmati apa yang ada di depan matamu tanpa membiarkan pikiranmu mencuri kedamaian hari ini."
  },
  57: {
    badge: "KERENTEK MURNI",
    title: "Bisikan Halus di Dasar Hati Tanpa Pamrih",
    subtitle: "Menolong bukan karena haus dipuji pahlawan, melainkan karena panggilan hening dari dalam.",
    paragraphs: [
      "Di dalam pergaulan hidup, kita ini sering terjebak dalam perangkap menolong yang keliru. Kita tergesa-gesa mencampuri urusan orang lain bukan karena cinta murni, tapi karena ego pahlawan yang gila pengakuan: ingin dianggap berjasa, ingin dipuji orang baik!",
      "Campur tangan yang didorong oleh ego semacam itu justru sering merusak proses pendewasaan orang lain dan menyerap beban karma yang bukan hakmu. Leluhur kita mengajarkan kompas batin yang sangat luhur: ikutilah kerentek hati!",
      "Kerentek itu bisikan batin pertama yang sangat lembut, hening, dan bersih dari kalkulasi untung rugi. Kalau dorongan itu hening dan murni, ulurkan tanganmu tanpa banyak cakap, lalu lupakan jasamu seketika layaknya air mengalir ke samudra!"
    ],
    keyTakeaway: "Dengarkan kerentek hati yang hening sebelum menolong; ulurkan tangan tanpa pamrih keakuan dan biarkan kebaikan bekerja dalam senyap."
  },
  58: {
    badge: "PROYEKTOR BATIN",
    title: "Dunia Luar Cuma Layar Bioskop Pikiranmu",
    subtitle: "Jangan marah pada pantulan cermin; bersihkan proyektor getaran yang ada di dalam dadamu.",
    paragraphs: [
      "Bayangkan kamu sedang menonton film horor di gedung bioskop. Waktu monster di layar muncul dan menakutimu, kamu berlari ke depan panggung lalu merobek kain layar bioskop pakai pisau biar monsternya mati! Bukankah kelakuan itu konyol luar biasa?",
      "Tapi begitulah tingkah kebanyakan orang dalam menghadapi kesulitan hidup! Mereka memaki pasangan, menyalahkan bos, atau memusuhi teman waktu hidupnya berantakan. Mereka sibuk merusak layar di luar tanpa pernah menoleh ke bilik proyektor di belakang.",
      "Dunia luar hanyalah layar bioskop pantulan; proyektornya adalah getaran rasa dan rekaman bawah sadarmu sendiri! Kalau kamu ingin adegan di layar berganti jadi indah dan damai, bersihkan pita getaran di proyektor dadamu."
    ],
    keyTakeaway: "Dunia luar hanyalah pantulan layar bioskop batinmu; ubah pita getaran di proyektor dadamu, maka tayangan realitasmu akan berganti."
  },
  59: {
    badge: "TITIK SUWUNG",
    title: "Menatap Seluruh Semesta di Dalam Cangkir Kopi",
    subtitle: "Semua jalinan kuantum berpulang pada keheningan: suwung kang isi, isi kang suwung.",
    paragraphs: [
      "Kita sudah berjalan jauh melintasi jalinan partikel kuantum, relativitas waktu, debu bintang di urat nadi, sampai kidung sebelas tembang macapat. Sekarang, seluruh kerumitan ilmu itu luruh kembali ke dalam secangkir kopi di depanmu.",
      "Tataplah permukaan hitam kopi itu dalam hening. Di sana berpadu mineral bumi, sari tanaman lereng gunung, panasnya api, dan sejuknya udara malam. Semuanya bersumber dari satu titik keheningan purba yang oleh leluhur disebut suwung.",
      "Suwung itu bukan kekosongan mati yang hampa, melainkan samudra hening tempat seluruh kemungkinan semesta tercipta dan berpulang. Masuklah ke dalam keheningan itu. Di sanalah rumah sejatimu bersemayam: damai, abadi, dan tak pernah terjamah oleh riuh rendahnya dunia."
    ],
    keyTakeaway: "Di dalam keheningan suwung, seluruh rahasia semesta berpulang; jadilah saksi yang tenang bagi indahnya sandiwara kosmos."
  }
};

for (const p of pages) {
  if (updates[p.page_number]) {
    const u = updates[p.page_number];
    p.badge = u.badge;
    p.title = u.title;
    p.subtitle = u.subtitle;
    p.paragraphs = u.paragraphs;
    p.keyTakeaway = u.keyTakeaway;
    p.text = `> **${p.badge}**\n\n# ${p.title}\n\n*${p.subtitle}*\n\n${p.paragraphs.join('\n\n')}\n\n> **Intisari Kesadaran:** ${p.keyTakeaway}`;
    p.word_count = p.text.trim().split(/\s+/).filter(Boolean).length;
    console.log(`Updated page ${p.page_number}: ${p.badge} | ${p.title} (${p.word_count} words)`);
  }
}

fs.writeFileSync(patchFile, JSON.stringify(pages, null, 2), 'utf8');
console.log('✅ Bab 4 Patch refreshed with pure Cak Nun stage aroma!');
