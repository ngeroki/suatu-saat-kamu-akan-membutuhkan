import fs from 'fs';

const patchFile = './scripts/patches/bab-2.json';
const pages = JSON.parse(fs.readFileSync(patchFile, 'utf8'));

const updates = {
  16: {
    badge: "SAMPUL & PEMBUKA",
    title: "Meretas Pikiran Bawah Sadar & Reprogramming Nasib",
    subtitle: "Bento Kopi Kaliurang, Empat Gerbang Bawah Sadar, dan Zikir Bahasa Ibu",
    paragraphs: [
      "\"Kamu kira kamu hidup digerakkan oleh pikiran sadarmu? Cuma lima persen, Bung! Sembilan puluh lima persen hidupmu disetir oleh samudra bawah sadar. Kalau bibirmu teriak ingin kaya tapi batinmu dicekam ketakutan miskin, bawah sadarmu yang menang seratus persen. Nasibmu hari ini bukan apa yang kamu maui di kepala, melainkan apa yang kamu getarkan di dada!\"",
      "Aldi (@rahwanaconsciousnessroom)",
      "Buku ini mengajakmu duduk santai di Bento Kopi Jalan Kaliurang. Kita bedah kenapa orang rajin berdoa tapi nasibnya jalan di tempat, bagaimana membobol benteng akal bawah sadar saat buang air di toilet, hingga rahasia zikir bahasa ibu yang menggetarkan langit."
    ],
    keyTakeaway: "Pikiran sadar hanya nahkoda kecil; samudra bawah sadar yang menentukan ke mana bahtera nasibmu berlayar."
  },
  17: {
    badge: "KEDAI KALIURANG",
    title: "Asbak Penuh dan Kawan yang Tersesat",
    subtitle: "Rajin seminar mahal dan tahajud ribuan kali, tapi nasib tetap jalan di tempat.",
    paragraphs: [
      "Pernah nggak kamu duduk di warung kopi sampai larut malam, asbak di depanmu sudah menggunung puntung rokok, lalu ada kawanmu curhat dengan mata merah kelelahan? 'Mas, aku ini kurang apa? Seminar motivasi jutaan sudah tak ikuti, buku sukses setumpuk sudah tak khatamkan, tahajud tiap malam, tapi kenapa utangku malah makin nambah?'",
      "Coba perhatikan kawanmu itu. Waktu dia berdoa meminta rezeki melimpah dengan bibir komat-kamit, getaran apa yang sebenarnya berdenyut di ulu hatinya? Keyakinan tenang atau justru kepanikan takut jatuh miskin?",
      "Semesta itu nggak mendengarkan hafalan kata yang meminjam bahasa surga di bibirmu. Semesta itu proyektor yang membaca detak ketakutan di dadamu! Kalau batinmu panik, kepanikan itulah yang diwujudkan jadi kenyataan."
    ],
    keyTakeaway: "Semesta tidak mendengarkan hafalan kata di bibirmu; semesta merespons getaran rasa yang hidup di dadamu."
  },
  18: {
    badge: "TITIK REMUK",
    title: "Pintu Kesadaran Dimulai Saat Semuanya Runtuh",
    subtitle: "Bukan dicekoki dalil, tapi benahi dulu raga dan sistem saraf yang sedang terbakar.",
    paragraphs: [
      "Banyak orang baru mulai melirik jalan spiritual waktu hidupnya sudah remuk redam: tabungan ludes, pasangan minggat, atau badan digerogoti serangan panik dan insomnia. Anehnya, dalam kondisi terpuruk begitu, orang-orang di sekitarnya malah sibuk mencela: 'Kamu kurang sabar, sih! Kamu banyak dosa!'",
      "Lho, orang yang sedang remuk itu bukan butuh ditakut-takuti neraka atau dicekoki dalil moral! Sistem saraf simpatisnya sedang terbakar, kelenjar adrenalnya kebanjiran racun hormon stres, otaknya korslet. Kalau wadah biologis raganya nggak dibenahi dulu, ceramah seindah apa pun cuma terdengar seperti dengungan lalat.",
      "Tenangkan dulu fisiknya. Duduk bersandar, tarik napas panjang, longgarkan bahu yang kaku, dan tidur dalam gelap. Titik kehancuran itu bukan akhir hidupmu; itu cara semesta meremukkan kesombongan egomu biar kesadaran sejati bisa lahir."
    ],
    keyTakeaway: "Benahi raga dan saraf yang tegang sebelum menata batin; kehancuran ego adalah ruang lahirnya kesadaran sejati."
  },
  19: {
    badge: "BENTENG PENJAGA",
    title: "Penjaga Pintu yang Keras Kepala",
    subtitle: "Pikiran sadarmu cuma lima persen; benteng penolakan menjaga samudra bawah sadar.",
    paragraphs: [
      "Pernah heran nggak, kenapa afirmasi positif di depan cermin sering kali mentah nggak ada gunanya? Kamu berdiri tegap membusungkan dada sambil berbisik: 'Aku kaya, aku makmur, aku bahagia!' Tapi detik itu juga, ada suara nyinyir dari dalam kepalamu nyeletuk: 'Halah, bohong! Dompetmu saja isinya cuma nota tagihan.'",
      "Suara sinis itu berasal dari penjaga gerbang akal sadar yang namanya critical faculty. Tugasnya menyaring segala informasi baru berdasarkan data lama. Kalau data lamamu mencatat kamu orang sial, kalimat sukses model apa pun bakal langsung ditendang keluar sebelum sempat menyentuh dasar batinmu.",
      "Pikiran sadarmu itu cuma nahkoda kecil lima persen. Sembilan puluh persen sisanya adalah samudra bawah sadar yang nggak pernah tidur. Kalau kamu mau meretas nasib, jangan mendobrak pintu depan dengan paksa. Kamu harus tahu kapan si penjaga pintu ini tertidur lelap!"
    ],
    keyTakeaway: "Critical faculty menolak kata-kata kosong; sentuh bawah sadarmu saat pintu benteng akal sedang terbuka."
  },
  20: {
    badge: "PANGGUNG WAYANG",
    title: "Kamu Wayang Sekaligus Dalangnya",
    subtitle: "Jangan berlindung di balik pasrah palsu saat hidupmu compang-camping.",
    paragraphs: [
      "Masyarakat kita ini sering berlindung di balik pepatah kuno yang disalahartikan. Banyak orang suka berdalih: 'Urip kuwi mung sadermo nglakoni, manusia itu cuma wayang yang tinggal pasrah digerakkan dalang.' Kalimat itu akhirnya cuma jadi tameng kemalasan buat membenarkan hidup yang compang-camping.",
      "Lho, kalau kamu cuma wayang kayu yang pasif tanpa daya, untuk apa Tuhan meniupkan akal budi dan kesadaran ke dalam dadamu? Para sesepuh sejati mengajarkan rahasia yang jauh lebih dalam: kamu itu wayang sekaligus dalangnya!",
      "Lakon hidup yang kamu jalani hari ini adalah naskah getaran batin yang kamu mainkan kemarin. Kalau kamu terus memainkan gamelan kecemasan, panggung takdirmu bakal mementaskan lakon tragedi. Jangan menyalahkan dalang langit atas penderitaanmu, kalau tanganmu sendiri yang terus memilih gunungan amarah di balik layar pertunjukan!"
    ],
    keyTakeaway: "Kamu adalah wayang sekaligus dalang; panggung realitas hari ini mementaskan getaran batin yang kamu mainkan kemarin."
  },
  21: {
    badge: "JENDELA THETA",
    title: "Lima Belas Menit Menjelang Lelap dan Bangun",
    subtitle: "Saat penjaga gerbang tertidur, apa pun bisikanmu akan langsung menembus nasib.",
    paragraphs: [
      "Kamu tahu nggak, ada dua jendela emas setiap hari di mana benteng akal sadarmu membuka pintunya lebar-lebar tanpa penjagaan: lima belas menit sebelum kamu lelap tertidur, dan lima belas menit pertama waktu kamu baru membuka mata di pagi hari.",
      "Pada fase peralihan ini, gelombang otakmu melambat masuk ke zona Theta, frekuensi yang sama dengan kondisi hipnosis mendalam. Penjaga gerbang akalmu sedang mengantuk berat dan kehilangan daya kritisnya. Apa pun impresi rasa yang masuk pada momen ini akan langsung dicap stempel kenyataan mutlak oleh bawah sadarmu.",
      "Tragedi manusia zaman sekarang adalah mengisi lima belas menit keramat ini dengan menggulir linimasa medsos, menonton video pertengkaran, atau mencemaskan utang esok hari! Akhirnya, kaset kepanikan itulah yang diputar ulang oleh otakmu sepanjang malam. Jagalah gerbang fajar dan malammu dengan keheningan rasa syukur."
    ],
    keyTakeaway: "Jendela Theta adalah gerbang bawah sadar; isi momen sebelum tidur dan bangun pagi dengan getaran damai dan syukur."
  },
  22: {
    badge: "SAKRALITAS TOILET",
    title: "Keheningan yang Hilang di Balik Pintu Kamar Mandi",
    subtitle: "Saraf panggul rileks, tapi otakmu dipaksa perang oleh layar ponsel yang menyala.",
    paragraphs: [
      "Coba jujur sama dirimu sendiri: kapan terakhir kali kamu masuk ke kamar mandi tanpa bawa ponsel di tangan? Kita ini aneh. Mau buang kotoran raga saja, kepala kita masih sempat-sempatnya kepo sama urusan orang di medsos!",
      "Padahal waktu kamu duduk buang air besar di toilet yang hening, otot sfingter panggulmu mengendur alami. Saraf parasimpatis mengambil alih kendali, dan gelombang otakmu merosot pelan ke zona Theta yang menenangkan. Makanya para seniman dan pemikir besar sering menemukan ide paling cemerlang justru saat duduk bersahaja di kamar mandi.",
      "Tapi sekarang? Saraf panggulmu mau rileks, otakmu malah kamu paksa tegang membaca keributan linimasa! Rusak sudah ruang hening yang paling murah di rumahmu. Kembalikan toiletmu sebagai bilik hening pelepasan kotoran fisik sekaligus racun pikiran."
    ],
    keyTakeaway: "Bilik toilet adalah ruang hening biologis; jangan rusak keterbukaan saraf parasimpatismu dengan radiasi ponsel."
  },
  23: {
    badge: "LEDOKAN EMOSI",
    title: "Kutukan Ibu yang Menembus Langit",
    subtitle: "Syekh Sudais kecil, segenggam pasir di panci gulai, dan amarah yang disulap doa.",
    paragraphs: [
      "Pernah nggak kamu perhatikan, kenapa usaha orang yang sedang merintis tiba-tiba bisa gulung tikar mendadak? Waktu omset naik syukurnya cuma hambar di bibir, tapi waktu omset turun sedikit paniknya meledak luar biasa! Semesta langsung mengeksekusi getaran kepanikan murni itu.",
      "Lonjakan emosi intens adalah gerbang bawah sadar kedua yang mampu menjebol benteng akal seketika. Ada cerita legendaris dari tanah suci. Seorang ibu sedang memasak gulai lezat buat menjamu tamu suaminya. Tiba-tiba anaknya yang masih kecil berlari masuk dan dengan polos menaburkan segenggam pasir kotor tepat ke panci gulai yang sedang mendidih!",
      "Dada sang ibu bergemuruh menahan amarah yang meledak. Tapi perempuan bijak ini sadar akan dahsyatnya kuasa emosi murni. Dalam puncak amarahnya, dia meneriakkan sumpah doa yang mengguncang langit: 'Pergi kamu! Semoga Allah jadikan kamu Imam Masjidil Haram!' Dan anak kecil itu kelak tumbuh menjadi Syekh Abdurrahman As-Sudais, sang imam besar dunia."
    ],
    keyTakeaway: "Emosi intens menjebol bawah sadar; kunci mulutmu saat marah, atau sulap amarah itu menjadi doa paling luhur."
  },
  24: {
    badge: "MEMORI AIR",
    title: "Tujuh Puluh Dua Persen Wadah Cairan",
    subtitle: "Setiap kata dan getaran batin merestrukturisasi kristal sel di dalam ragamu.",
    paragraphs: [
      "Coba ingat-ingat kembali pelajaran biologi dasar: lebih dari tujuh puluh persen tubuh fisikmu ini tersusun dari cairan! Darahmu, otakmu, bahkan tulangmu yang keras itu basah oleh air. Dan sains modern sudah membuktikan kalau molekul air itu sangat peka merekam getaran frekuensi di sekelilingnya.",
      "Waktu kamu setiap hari mengeluh, mengutuk nasib sialmu, atau memaki diri sendiri di depan cermin, cairan di seluruh sel tubuhmu sedang mendengar dan menyusun kristalnya mengikuti getaran racun itu. Ragamu berubah jadi bejana air yang keruh dan berkarat.",
      "Repetisi kata-kata yang kamu ulang saban hari akan membentuk jalur saraf baru lewat mekanisme neuroplastisitas. Kalau kamu ingin merombak nasib, mulailah membasahi bejana cairan tubuhmu dengan kata-kata mulia, doa yang teduh, dan rasa cukup yang berakar di rongga dada."
    ],
    keyTakeaway: "Tubuhmu adalah bejana air hidup; getaran kata dan batinmu saban hari menyusun kejernihan sel ragamu sendiri."
  },
  25: {
    badge: "TIUP DOMPET",
    title: "Ritual Bersahaja Penembus Keraguan",
    subtitle: "Bukan uangnya yang mistis, tapi kepasrahan mutlak anak kecil di depan ayahnya.",
    paragraphs: [
      "Mas Aldi pernah bercerita tentang masa kecilnya yang sangat membekas. Setiap kali dia dan bapaknya berpapasan dengan mobil pengantin yang berhias bunga di jalanan, bapaknya selalu menoleh sambil berkata: 'Le, buka dompetmu, lalu tiup: ffuuuh!'",
      "Aldi kecil menurut saja tanpa banyak tanya. Anehnya, selama dua puluh lima tahun kebiasaan bersahaja itu dia rawat, selalu saja ada rezeki tak terduga yang datang mengetuk pintu. Lho, apa dompetnya punya kesaktian mistis? Sama sekali bukan!",
      "Kuncinya terletak pada figur otoritas dan kepasrahan mutlak tanpa sebutir pun keraguan. Di mata anak kecil, ucapan bapak yang dihormati adalah kebenaran mutlak. Penjaga gerbang akal nggak mendebat, dan efek plasebo batin bekerja seratus persen! Saat kamu meyakini berkah semesta tanpa keraguan di dada, semesta tidak punya alasan buat menolaknya."
    ],
    keyTakeaway: "Kepasrahan murni meruntuhkan segala keraguan; keyakinan yang utuh tanpa debat membuka pintu rezeki semesta."
  },
  26: {
    badge: "BAHASA IBU",
    title: "Zikir yang Menggetarkan Ulu Hati",
    subtitle: "Bibir mengucap lafal asing dengan buru-buru, tapi batin merekam ketakutan miskin.",
    paragraphs: [
      "Banyak orang rajin wirid ribuan kali dengan tasbih berputar kencang di jemari. Bibirnya komat-kamit melafalkan Ya Lathiif, tapi karena buru-buru mengejar target hitungan, lafalnya berubah jadi gumaman tanpa nyawa: tip-tip-tip-tip.",
      "Akal bawah sadarmu nggak dibesarkan dengan bahasa asing. Di kepalamu, suara tip-tip itu malah beresonansi jadi rasa tertipu atau keliru. Hasilnya sungguh ironis: zikirnya banyak, tapi dalam bisnis dia sering tertipu rekan kerja dan terjerat utang! Karena rasamu adalah doamu yang sejati.",
      "Gunakanlah bahasa ibumu buat berbisik kepada Tuhan. Bahasa yang sejak bayi dinyanyikan ibumu waktu menimangmu, bahasa yang langsung terhubung ke rongga dada dan rasa harumu. Bisikkan dengan lirih: 'Gusti, kulo nyuwun tentrem... Tuhan, peluklah jiwaku yang lelah ini.' Satu helaan napas penuh rasa jauh lebih mengguncang langit daripada ribuan hafalan bibir yang hambar!"
    ],
    keyTakeaway: "Bahasa ibu menyentuh lubuk rasa terdalam; satu doa lirih penuh penghayatan melampaui ribuan hafalan bibir belaka."
  },
  27: {
    badge: "CERMIN WAYANG",
    title: "Perang Sengkuni Melawan Semar di Dadamu",
    subtitle: "Otak reptil yang cemas dan licik berhadapan dengan rasa sejati yang membumi.",
    paragraphs: [
      "Di panggung pewayangan, ada dua tokoh agung yang menggambarkan perang abadi di dalam kepalamu: Sengkuni dan Ki Lurah Semar.",
      "Sengkuni itu simbol sempurna dari amigdala dan otak reptil manusia: selalu curiga, licik, penuh perhitungan sempit, dan dicekam ketakutan akan hari esok. Dialah bisikan cemas yang selalu menyuruhmu menimbun harta dengan cara curang karena takut miskin. Kalau kamu terus menuruti Sengkuni, hidupmu bakal dipenuhi drama perselisihan yang melelahkan.",
      "Sebaliknya, Semar adalah simbol rasa sejati yang membumi: sosok bersahaja yang perutnya buncit menampung segala cobaan hidup, matanya menangis melihat derita sesama tapi bibirnya tetap tersenyum tulus. Semar nggak pernah panik karena dia tahu seluruh jagat ada dalam genggaman Sang Maha Kuasa. Rawatlah Semar di dadamu, dan biarkan Sengkuni kehilangan panggungnya!"
    ],
    keyTakeaway: "Pilihlah suara Semar yang ayem tentrem daripada kepanikan Sengkuni; ketenangan batin adalah benteng takdirmu."
  },
  28: {
    badge: "MENATA PAGI",
    title: "Menyambut Fajar Tanpa Racun Medsos",
    subtitle: "Lima belas menit pertama menentukan arah gelombang hidupmu sepanjang hari.",
    paragraphs: [
      "Waktu alarm berdering dan matamu mulai terbuka menyapa fajar, apa benda pertama yang kamu raih? Kalau jemarimu langsung menyambar ponsel pintar buat memeriksa pesan kerjaan, notifikasi grup, atau drama medsos, kamu baru saja meracuni harimu sendiri!",
      "Pada momen peralihan tidur ke bangun itu, bawah sadarmu masih telanjang bulat tanpa tameng. Informasi apa pun yang masuk bakal langsung jadi cetak biru emosimu sampai petang nanti. Melihat pertengkaran politik atau pamer harta orang lain di pagi buta bakal langsung memicu hormon stres membanjiri darahmu.",
      "Pakai lima belas menit pertamamu dalam keheningan yang kudus. Duduk santai di tepi ranjang, minum segelas air hangat perlahan, dan ucapkan terima kasih karena jantungmu masih berdetak hari ini. Biarkan fajar menyapamu dengan kedamaian sebelum kamu melangkah keluar rumah."
    ],
    keyTakeaway: "Jaga kesucian lima belas menit pertamamu di waktu fajar; sambut hari dengan hening dan syukur sebelum menyentuh dunia luar."
  },
  29: {
    badge: "JEDA TIGA DETIK",
    title: "Memutus Rantai Otomatis di Otak Depan",
    subtitle: "Beri ruang bagi kebijaksanaan sebelum amarah purba membakar segalanya.",
    paragraphs: [
      "Beda mendasar antara orang yang disetir nasib dan orang yang berkesadaran itu cuma ada pada satu hal sederhana: jeda!",
      "Manusia otomatis bekerja mirip saklar lampu: begitu ada orang menyakiti atau menghina, amigdalanya langsung meledakkan reaksi amarah tanpa jeda sedetik pun. Akibatnya, kamu sering melontarkan kata-kata kasar yang kamu sesali seumur hidup, atau mengambil keputusan gegabah yang merusak hubunganmu.",
      "Waktu kabar buruk atau pancingan emosi datang menerjangmu, pasang rem darurat batinmu: diamlah tiga detik penuh! Tiga detik keheningan ini memberi waktu bagi darah dan oksigen buat mengalir ke prefrontal cortex, markas kebijaksanaanmu. Dalam tiga detik itu, tanyakan ke hatimu: 'Apakah hal sepele ini pantas merampas ketenanganku?' Jeda singkat itulah kemerdekaan sejatimu."
    ],
    keyTakeaway: "Ambil jeda tiga detik sebelum membalas pemicu; ruang hening singkat itulah tempat lahirnya kemerdekaan jiwamu."
  },
  30: {
    badge: "LAYAR TAKDIR",
    title: "Memegang Sendiri Kendali Layar Batin",
    subtitle: "Dunia luar selalu tunduk pada getaran rasa yang kamu hidupi di dalam dada.",
    paragraphs: [
      "Sekarang kamu sudah paham bagaimana samudra bawah sadar bekerja merajut kenyataan hidupmu. Kamu bukan lagi korban yang tak berdaya dari nasib sial atau garis tangan yang buruk. Segala pola kegagalan menahun sesungguhnya cuma kaset rusak yang dibiarkan berputar di ruang bawah sadarmu.",
      "Kunci kendali itu sekarang ada di tanganmu sendiri. Manfaatkan jendela Theta di malam dan fajar hari, basahi ragamu dengan zikir bahasa ibu yang menyentuh ulu hati, rawat keheningan saat buang air di toilet, dan ambil jeda tiga detik waktu amarah memuncak.",
      "Waktu rasa di dadamu berubah jadi ayem, tentrem, dan penuh prasangka baik kepada semesta, layar takdir di luar bakal otomatis berganti adegan. Kamu nggak perlu capek mengejar nasib; getaran batinmu yang jernih yang bakal mengundang kebaikan hidup datang mendekat."
    ],
    keyTakeaway: "Kunci nasibmu ada di kedalaman rasa batin; jernihkan getaran di dalam, maka semesta akan menggelar kebaikan di luar."
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
console.log('✅ Bab 2 Patch refreshed with pure Cak Nun stage aroma!');
