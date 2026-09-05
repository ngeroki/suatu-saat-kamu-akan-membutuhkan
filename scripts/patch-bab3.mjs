import fs from 'fs';

const patchFile = './scripts/patches/bab-3.json';
const bookFile = './src/data/book-pages.json';

const allPages = JSON.parse(fs.readFileSync(bookFile, 'utf8'));

// Extract pages 31-45 template
const bab3Pages = [];
for (let i = 31; i <= 45; i++) {
  const p = allPages.find(x => x.page_number === i);
  bab3Pages.push(JSON.parse(JSON.stringify(p)));
}

const updates = {
  31: {
    badge: "SAMPUL & PEMBUKA",
    title: "Sistem Hormon, Biohacking Leluhur & Energi Fisik",
    subtitle: "Di Bawah Deru Kolong Jembatan, Biokimia Batin, dan Mitologi Saraf Raga",
    paragraphs: [
      "\"Banyak orang menuntut batinnya tenang dan sabar, tapi raganya saban hari diracuni candu gawai dan pola hidup yang hancur. Tubuhmu ini pabrik kimiawi yang sangat peka, Bung! Waktu hormon stres kortisol membakar darahmu, kepalamu otomatis melihat dunia sebagai medan perang yang menakutkan. Tapi waktu raga tenang dan saraf rileks memegang kendali, batinmu mekar dalam kejernihan.\"",
      "Aldi (@rahwanaconsciousnessroom)",
      "Bab ini mengajakmu duduk di bawah deru jembatan layang Yogyakarta. Kita bedah kenapa piring pecah bisa bikin rumah tangga cerai, bagaimana otakmu menyamakan sakit hati dengan jempol berdarah, hingga teknologi batin leluhur biar kamu kembali jadi tuan di rumah ragamu sendiri."
    ],
    keyTakeaway: "Raga adalah laboratorium kimiawi jiwamu; seimbangkan hormon dan sarafmu sebelum menuntut batin yang jernih."
  },
  32: {
    badge: "PIRING PECAH",
    title: "Dua Reaksi Berbeda di Depan Lantai Dapur",
    subtitle: "Bukan soal tata krama atau kesabaran palsu; ini perang kimiawi di dalam darahmu.",
    paragraphs: [
      "Coba kamu bayangkan ada dua rumah bertetangga di malam yang sama. Di rumah pertama, suami-istri baru saja berpelukan hangat penuh kasih, darah mereka banjir hormon oksitosin dan endorfin. Tiba-tiba di dapur, piring keramik jatuh dan pecah berkeping-keping: prang! Sang suami menoleh sambil tersenyum tenang: 'Nggak apa-apa sayang, biar aku yang sapu, hati-hati kena beling.'",
      "Sekarang lihat rumah sebelahnya. Pasutri sudah berminggu-minggu dingin, saling mendiamkan, dikejar setoran cicilan, darah mereka pekat oleh hormon stres kortisol. Piring yang sama persis pecah di lantai. Sang suami langsung gebrak meja banting pintu: 'Kamu ini ceroboh banget, selalu bikin repot!'",
      "Lho, peristiwanya sama persis: piring pecah. Tapi kenapa reaksinya bumi dan langit? Ini bukan soal yang satu lebih beradab atau lebih suci; ini soal cairan kimia apa yang sedang membanjiri sel-sel darah mereka saat musibah itu datang!"
    ],
    keyTakeaway: "Reaksimu terhadap masalah ditentukan oleh kondisi hormon darahmu; tenangkan wadah biologis sebelum menata respon hidup."
  },
  33: {
    badge: "LUKA RASA",
    title: "Otak Tidak Mengenal Beda Sakit Fisik dan Patah Hati",
    subtitle: "Sirkuit saraf yang sama menyala saat jempol tersandung dan saat kamu dikhianati.",
    paragraphs: [
      "Pernah nggak kamu kejedot ujung meja, jempol kakimu berdarah, lalu kamu meringis kesakitan? Sekarang coba bandingkan rasa sakit itu dengan waktu kamu dihina di depan umum atau diselingkuhi pasanganmu. Perih mana?",
      "Anehnya, kalau kepalamu dipindai di laboratorium medis, sirkuit saraf yang menyala saat jempolmu berdarah persis sama dengan sirkuit saat batinmu tersayat patah hati! Bagi otakmu, luka fisik dan luka batin itu membakar sekring biologis yang sama persis.",
      "Kebocoran energi manusia modern berakar di sana: pikiran melayang menyesali masa lalu atau mencemaskan masa depan. Terus kenapa kita heran ada orang putus asa sampai mau bunuh diri? Bukan karena masalahnya terlalu rumit, tapi karena energi biologis tubuhnya habis terbakar buat memikirkan masalah itu sampai baterai selnya tekor!"
    ],
    keyTakeaway: "Luka batin membakar energi fisik yang nyata; hentikan kebocoran daya batin agar sel-sel ragamu tidak kehabisan napas."
  },
  34: {
    badge: "PERANG HORMON",
    title: "Pertarungan Pasukan Bertahan Hidup Lawan Pemulih Raga",
    subtitle: "Kortisol yang membakar sel tubuh atau melatonin yang membasuh kelelahan jiwa.",
    paragraphs: [
      "Kamu sadar nggak, di dalam pembuluh darahmu saban hari berlangsung perang sengit antara dua kubu hormon: pasukan darurat bertahan hidup lawan pasukan pemulihan raga!",
      "Waktu kamu panik memikirkan saldo rekening, marah di tengah kemacetan jalanan, atau cemas membaca berita buruk, kelenjar adrenal menyemburkan hormon kortisol dan adrenalin. Detak jantung dipacu, otot menegang, dan sistem imun dimatikan sementara karena ragamu mengira sedang dikejar harimau pemangsa! Kalau kondisi darurat ini dibiarkan berbulan-bulan tanpa henti, tubuhmu bakal terbakar dari dalam.",
      "Sebaliknya, waktu tubuh rileks dalam keheningan, raga memproduksi melatonin dan oksitosin. Hormon-hormon pemulih inilah yang menurunkan radang, memperbaiki sel yang rusak, dan merajut kembali jiwamu yang koyak. Berhentilah hidup dalam mode darurat!"
    ],
    keyTakeaway: "Jangan biarkan tubuhmu terjebak dalam mode darurat berkepanjangan; beri ruang bagi hormon pemulih untuk merajut kembali ragamu."
  },
  35: {
    badge: "KARAT SIRUS",
    title: "Ketika Sel Raga Mulai Berkarat dari Dalam",
    subtitle: "Molekul stres bercampur oksigen melahirkan sindrom keletihan menahun.",
    paragraphs: [
      "Pernah nggak kamu melihat sebatang besi yang dibiarkan kehujanan di halaman rumah, lalu pelan-pelan warnanya berubah cokelat kemerahan dan rapuh dimakan karat? Nah, tubuh manusia yang terus-menerus dicekam rasa cemas itu persis seperti besi berkarat itu!",
      "Di dunia medis batin, proses ini dinamai Sindrom Sirus: oksidasi seluler menahun akibat bercampurnya molekul stres dengan oksigen tanpa sirkulasi napas yang seimbang. Kalau karat ini menumpuk di otak, kamu jadi linglung, cepat lupa, dan gampang cemas.",
      "Kalau karat ini mengendap di pankreas, kepekaan insulin rusak hingga memicu diabetes. Dan kalau menumpuk di lambung, lahirlah maag kronis yang menyiksa. Tubuhmu itu nggak sedang rusak secara acak; dia lagi teriak minta tolong biar kamu berhenti mencemaskan hidup!"
    ],
    keyTakeaway: "Sindrom Sirus adalah karat biologis akibat cemas berkepanjangan; bersihkan sel-selmu dengan napas jernih dan keheningan."
  },
  36: {
    badge: "DOPAMIN TIRAKAT",
    title: "Jebakan Kesenangan Instan yang Mengeringkan Jiwa",
    subtitle: "Lonjakan dopamin murah dari gawai berbanding lurus dengan dalamnya rasa hampa.",
    paragraphs: [
      "Kenapa manusia zaman sekarang makin gampang bosan, gelisah, dan merasa hampa di tengah banjir hiburan? Jawabannya ada pada jebakan dopamin murah!",
      "Waktu kamu asyik menggulir video pendek di medsos, nonton pornografi, atau makan makanan manis berlebih, hormon kepuasan dopaminmu melonjak drastis ke atas. Enak sesaat, kan? Tapi celakanya, sedetik kemudian hormon itu terjun bebas jatuh jauh di bawah batas normalmu! Akibatnya, kamu merasa hampa, lunglai, dan nagih mencari tontonan yang lebih liar.",
      "Leluhur kita dari dulu sudah tahu bahaya candu instan ini. Makanya mereka mengajarkan laku tirakat: berpuasa, berkeringat kerja keras, menekuni karya seni berjam-jam, dan duduk hening. Kepuasannya datang perlahan, tapi fondasinya stabil tinggi di dadamu. Batinmu jadi senantiasa segar dan bersemangat!"
    ],
    keyTakeaway: "Tinggalkan candu kesenangan instan yang menguras batin; pupuk dopamin tirakat yang mengalirkan ketenangan sejati."
  },
  37: {
    badge: "BAYAR DI DEPAN",
    title: "Mencicipi Pahit Sebelum Ditagih Semesta",
    subtitle: "Laku prihatin leluhur adalah seni menabung ketahanan jiwa di masa lapang.",
    paragraphs: [
      "Orang tua zaman dulu punya pegangan hidup yang sangat sakti: bayarlah kepahitan di depan selagi kamu masih sehat dan kuat, jangan menunggu semesta menagihnya dengan paksa di belakang hari!",
      "Itulah hakikat sejati dari laku prihatin dan tirakat. Waktu hidupmu sedang makmur dan lapang, jangan habiskan seluruh waktumu buat berfoya-foya memanjakan nafsu. Sengajalah berpuasa saat makanan melimpah, sengajalah bangun di sepertiga malam saat kasur empuk memanggil, sengajalah mandi air dingin di pagi buta buat menggembleng fisikmu.",
      "Dengan sukarela mencicipi kepahitan kecil setiap hari, sistem sarafmu terlatih jadi tangguh. Waktu badai krisis hidup yang sebenarnya datang menerjang, kamu nggak bakal gampang roboh, karena ragamu sudah terbiasa bersahabat dengan kesulitan!"
    ],
    keyTakeaway: "Laku prihatin adalah investasi ketangguhan jiwa; bayar kepahitan di depan agar batinmu kokoh saat badai tiba."
  },
  38: {
    badge: "TUNGKU BAWAH",
    title: "Tiga Benteng Pertahanan Purba Manusia",
    subtitle: "Gonad, pankreas, dan adrenal: akar naluri bertahan hidup di dasar panggul.",
    paragraphs: [
      "Kamu pernah dengar konsep tujuh cakra tubuh? Jangan buru-buru menganggapnya takhayul mistis, karena dalam biologi kedokteran, ketujuh cakra itu bertepatan persis dengan tujuh kelenjar hormon utama di tubuhmu!",
      "Mari kita tatap tiga kelenjar terbawah. Di dasar panggul ada gonad atau kelenjar reproduksi, pusat energi vital dan naluri kelangsungan hidup. Naik sedikit ke perut bawah, ada pankreas yang mengatur gula darah dan hasrat emosimu. Di atasnya lagi, tepat di pucuk ginjal, bertengger kelenjar adrenal: komandan keberanian dan penentu reaksi bertarung.",
      "Tiga kelenjar bawah ini adalah tungku api pertahanan raga. Kalau energimu tersumbat cuma di tiga stasiun ini, seumur hidupmu bakal habis diperbudak kecemasan materi, perebutan kekuasaan, dan perburuan nafsu biologis semata."
    ],
    keyTakeaway: "Tiga tungku bawah menjaga kelangsungan fisikmu; kendalikan gejolaknya agar energi hidup sanggup mendaki ke stasiun luhur."
  },
  39: {
    badge: "BUNGA MAHKOTA",
    title: "Empat Menara Cahaya Menuju Langit Batin",
    subtitle: "Timus, tiroid, pineal, dan pituitari: jembatan biologis dari welas asih menuju keheningan.",
    paragraphs: [
      "Nah, dari tungku bawah, energi hidupmu seharusnya mendaki melintasi empat menara cahaya di tubuh bagian atas.",
      "Di tengah dadamu ada kelenjar timus, markas sistem imun sekaligus pintu cinta kasih tanpa syarat. Di pangkal leher ada tiroid, pengatur tempo metabolisme dan suara kebenaran jiwamu. Naik ke tengah kepala, kita berjumpa kelenjar pineal, mata ketiga pembuat melatonin dan penangkap frekuensi gaib semesta. Dan di puncak ubun-ubun, mekar kelenjar pituitari sang dirigen seluruh hormon tubuh!",
      "Waktu empat stasiun atas ini aktif tersirami cairan saraf yang jernih, cara pandangmu berubah total: kamu memandang sesama dengan welas asih, berucap dengan jujur, dan hidup dalam naungan kesadaran semesta yang agung. Kamu bukan lagi binatang yang cuma sibuk mencari makan!"
    ],
    keyTakeaway: "Empat stasiun atas membuka gerbang keluhuran budi; dari cinta kasih di dada hingga puncak pencerahan di ubun-ubun raga."
  },
  40: {
    badge: "PERANG DI KEPALA",
    title: "Bharatayuddha yang Berkecamuk di Balik Batok Kepala",
    subtitle: "Sengkuni si amigdala cemas berhadapan dengan Kresna si kesadaran pineal sejati.",
    paragraphs: [
      "Kisah Bharatayuddha di pewayangan itu sesungguhnya bukan sekadar dongeng perang memperebutkan tahta Astina ribuan tahun lalu. Leluhur yang cerdas menyembunyikan peta saraf kepalamu di balik tokoh-tokohnya!",
      "Sengkuni yang pincang dan licik itu gambaran amigdala otakmu: selalu curiga, meniupkan rasa cemas, dan memprovokasimu berperang demi ambisi kerdil. Sedangkan Sri Kresna adalah lambang kelenjar pineal dan kesadaran murni penuntun jalan. Arjuna adalah fokus tajam prefrontal cortex yang harus belajar memanah dengan hening.",
      "Di kubu lawan, berdiri tiga benteng cakra bawah yang harus dilumpuhkan: Karna lambang haus pengakuan status, Drona lambang kesombongan intelektual, dan Bisma lambang keterikatan pada sumpah masa lalu yang sudah usang. Perang itu terjadi di kepalamu saban hari!"
    ],
    keyTakeaway: "Bharatayuddha berkecamuk di dalam kepalamu; biarkan Kresna kesadaran murni menuntun panah fokusmu melumpuhkan ego lama."
  },
  41: {
    badge: "SIMBOL PURBA",
    title: "Ganesha di Balik Leher dan Kera Liar Sun Go Kong",
    subtitle: "Mitologi dunia menyandikan anatomi saraf dalam lambang-lambang agung peradaban.",
    paragraphs: [
      "Coba perhatikan bagaimana peradaban dunia menggambarkan rahasia tubuh manusia dalam mitologi purba mereka. Luar biasa cerdas!",
      "Sosok Dewa Ganesha berkepala gajah dengan belalai panjang sesungguhnya mencerminkan otak kecil di belakang lehermu, tempat belalai batang saraf menjulur mengatur keseimbangan gerak raga. Dalam tradisi Mesir kuno, Dewa Anubis berkepala serigala menimbang jantung di gerbang maut: simbol katup napas di tenggorokan yang menjaga sakratul mautmu.",
      "Di tanah timur, kisah Kera Sakti memotret empat watak batin: Sun Go Kong si kera liar perlambang keliaran pikiran yang harus dikunci cincin penjinak di kepala, Patkai lambang kerakusan perut dan syahwat, Sam Seng lambang kemalasan ragu-ragu, dan Biksu Tong sang kesadaran suci penuntun arah ziarah kehidupan."
    ],
    keyTakeaway: "Mitologi purba adalah peta rahasia saraf raga; jinakkan kera liar pikiranmu agar perjalanan ziarah batinmu sampai ke tujuan."
  },
  42: {
    badge: "DAUR SELAPANAN",
    title: "Ritme Tiga Puluh Lima Hari Pembaruan Diri",
    subtitle: "Puasa apit weton dan kegelapan pati geni meremajakan cairan kehidupan raga.",
    paragraphs: [
      "Dokter modern bangga menemukan siklus biologis tubuh manusia. Padahal orang tua kita di tanah Jawa sejak ratusan tahun lalu sudah memetakan pembaruan seluler raga secara presisi lewat kalender selapanan tiga puluh lima hari!",
      "Setiap tiga puluh lima hari sekali, komposisi kimiawi cairan serebrospinal di tulang punggungmu mencapai puncak kristalisasi alaminya. Pada momentum keramat inilah leluhur berpuasa apit weton tiga hari: sehari sebelum hari kelahiran, hari weton itu sendiri, dan sehari sesudahnya.",
      "Dipadukan dengan tirakat pati geni di kamar gelap gulita tanpa cahaya lilin, tubuh berhenti mencerna makanan berat dan mata diistirahatkan dari silau dunia. Seluruh energi dialihkan buat membersihkan racun memori seluler dan memperbarui kekuatan hidup raga dari dasar terdalam."
    ],
    keyTakeaway: "Kalender selapanan adalah ritme pemulihan seluler raga; sucikan kembali cairan hidupmu dalam momentum hening tiga puluh lima hari."
  },
  43: {
    badge: "GARAM DAN KELOR",
    title: "Sains Pembersih Residu di Sekitarmu",
    subtitle: "Kristal garam krosok menyerap medan statis, daun kelor mencuci racun seluler.",
    paragraphs: [
      "Banyak orang menganggap ritual mandi air garam atau daun kelor itu takhayul mistis orang kampung. Padahal kalau kamu bedah pakai ilmu fisika dan biokimia, masuk akal banget!",
      "Tubuhmu saban hari ditembak radiasi elektromagnetik dari ponsel, laptop, menara pemancar, dan getaran negatif orang di jalanan. Muatan listrik statis positif menumpuk di kulit, bikin saraf tegang dan badan pegal tanpa sebab. Garam krosok kasar itu kristal halit alami yang sarat ion negatif. Waktu kamu mandi air garam krosok, terjadi pertukaran ion yang menyedot muatan listrik statis keluar dari kulitmu seketika!",
      "Begitu juga daun kelor yang kaya antioksidan dan klorofil pembersih racun logam berat. Orang dulu nggak pakai jimat; mereka memanfaatkan fisika mineral bumi buat membasuh kotoran raga."
    ],
    keyTakeaway: "Garam krosok dan daun kelor adalah teknologi alami bumi; manfaatkan mineral pembersih untuk meluruhkan muatan statis racun tubuh."
  },
  44: {
    badge: "HEMBUSAN PANJANG",
    title: "Menarik Rem Darurat Tubuh Lewat Napas Panjang",
    subtitle: "Tarik empat hitungan, tahan empat, lalu hembuskan delapan hitungan perlahan.",
    paragraphs: [
      "Waktu kepanikan melanda dan pikiranmu berputar liar, jangan mencoba menenangkan pikiran dengan pikiran; itu seperti menyiram bensin ke kobaran api! Kendalikan pintu masuk fisikmu: napas.",
      "Pakai kaidah napas parasimpatis empat-empat-delapan. Tarik napas perlahan lewat hidung selama empat hitungan, biarkan rongga perutmu mengembang alami. Tahan napasmu selama empat hitungan dalam keheningan tenang tanpa menegangkan leher.",
      "Lalu kunci rahasianya: hembuskan napasmu lewat celah bibir sangat perlahan selama delapan hitungan penuh sampai perutmu kempis tuntas! Rasio hembusan yang dua kali lebih panjang dari tarikan adalah sinyal biologis mutlak buat menarik rem darurat jantung, menurunkan tekanan darah, dan memadamkan kepanikan di kepalamu seketika."
    ],
    keyTakeaway: "Hembusan napas yang panjang adalah sakelar ketenangan biologis; kuasai ritme napasmu untuk memadamkan badai kepanikan batin."
  },
  45: {
    badge: "KEMBALI KE RAGA",
    title: "Menjadi Tuan di Rumah Diri Sendiri",
    subtitle: "Ketika raga tenang dan hormon seimbang, batin tak lagi mudah diguncang dunia.",
    paragraphs: [
      "Pada akhirnya, seluruh rahasia hormon, kelenjar endokrin, dan mitologi saraf ini bermuara pada satu perintah bersahaja: jadilah tuan yang berdaulat di rumah tubuhmu sendiri!",
      "Jangan biarkan racun gawai merampas dopaminmu, jangan biarkan kecemasan membakar sel-selmu dengan karat kortisol, dan jangan serahkan kemudi hidupmu pada bisikan licik Sengkuni amigdala. Rawatlah wadah ragamu dengan laku prihatin yang jujur, bersihkan residunya dengan mineral bumi, dan tegakkan tiang kesadaranmu lewat helaan napas dalam.",
      "Waktu raga biologismu berada dalam harmoni dan ketenangan sejati, batinmu bakal tegak mirip batu karang di tengah samudra: tidak silau oleh sanjungan semu, dan tidak roboh oleh caci maki dunia."
    ],
    keyTakeaway: "Kuasai ragamu maka kamu menguasai takdirmu; raga yang selaras adalah tahta bagi bersemayamnya jiwa yang merdeka."
  }
};

for (const p of bab3Pages) {
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

fs.writeFileSync(patchFile, JSON.stringify(bab3Pages, null, 2), 'utf8');
console.log(`✅ Bab 3 Patch refreshed with pure Cak Nun stage aroma!`);
