import fs from 'fs';

const patchFile = './scripts/patches/bab-1.json';
const pages = JSON.parse(fs.readFileSync(patchFile, 'utf8'));

const updates = {
  4: {
    badge: "MEDAN TORUS",
    title: "Dua Gelombang yang Saling Menemukan",
    subtitle: "Dinding tua dan tanah basah menyimpan cerita, lalu tubuhmu membacanya seketika.",
    paragraphs: [
      "Pernah nggak kamu bertanya-tanya, kenapa waktu kamu melangkah masuk ke rumah tua peninggalan kolonial atau warkop berdinding kayu di sudut kota, bulu kudukmu mendadak meremang? Kamu belum tahu sejarah tempat itu, tapi dadamu sudah berdesir duluan.",
      "Tanah basah yang kamu pijak, tiang kayu, sampai bebatuan kali di lereng gunung itu menyimpan rekaman getaran. Ada impresi rasa dari orang-orang yang pernah tertawa, menangis, dan memendam rindu di tempat itu selama puluhan tahun. Nah, saat kamu masuk ke sana, medan donat energi di dadamu beririsan dengan frekuensi ruang itu.",
      "Kalau frekuensinya klop, terjadilah resonansi: dua gelombang saling mengunci. Benturan getaran inilah yang menekan titik penyimpanan data paling purba di tubuhmu: tulang ekor! Begitu titik itu tersengat, berkas memori lama melonjak ke kepala. Makanya kamu merasa akrab, padahal matamu baru pertama kali melihatnya."
    ],
    keyTakeaway: "Resonansi ruang adalah bahasa getaran tanpa kata; tubuhmu menyapa dunia jauh melampaui batas kulit luar."
  },
  5: {
    badge: "KOTAK HITAM SULBI",
    title: "Tulang Kecil Penjaga Rekaman Abadi",
    subtitle: "Dari garis mula di rahim ibu hingga debu terakhir di liang lahat.",
    paragraphs: [
      "Coba raba ujung paling bawah dari tulang punggungmu. Ada benjolan tulang kecil yang tersembunyi di balik panggul, namanya coccyx atau tulang sulbi. Bentuknya sepele banget, tapi kalau kamu tanya ke dokter embriologi yang meneliti janin manusia, mereka bakal tercengang.",
      "Tanda kehidupan biologis pertama yang muncul di rahim ibumu itu bukan kepala atau tangan, melainkan garis mula bernama primitive streak yang berakar persis di area tulang ekor ini! Dan kalau ada orang meninggal lalu jasadnya dibakar di perapian kremasi ribuan derajat, seluruh daging dan tulang lebur jadi abu, kecuali tulang kecil ini.",
      "Lho, kenapa bisa sekuat itu? Karena tulang sulbi ini kotak hitam pesawat terbangmu! Di situlah rekaman luka batin leluhur, memori seluler, dan seluruh benih perjalanan karmamu dikunci rapat. Di ceruk inilah cairan hidup bersemayam, menunggu dibangunkan menjadi kesadaran murni."
    ],
    keyTakeaway: "Tulang sulbi adalah kotak hitam ragamu; di sanalah tersimpan cetak biru perjalanan hidup yang membentuk nasibmu."
  },
  6: {
    badge: "CERMIN AKSI-REAKSI",
    title: "Karma Bukan Hakim di Atas Awan",
    subtitle: "Semesta tidak pernah menghukummu; ia cuma memantulkan getaran yang kamu siarkan.",
    paragraphs: [
      "Kita ini sering keliru membayangkan karma. Di kepala banyak orang, karma itu digambarkan seperti kakek galak bertongkat yang duduk di atas awan, sibuk mencatat dosa lalu melempar petir hukuman. Pikiran kerdil seperti itu cuma mereduksi keagungan Tuhan jadi drama kemarahan manusia.",
      "Karma itu hukum fisika batin yang sangat presisi: aksi dan reaksi. Waktu kamu berbuat curang, menyakiti orang lain, atau mengkhianati nuranimu sendiri, sistem sarafmu tegang dan hormon stres membakar sel tubuhmu. Rasa bersalah yang kamu tutupi dengan senyum palsu itu mengkristal menjadi getaran frekuensi rendah di tulang ekor.",
      "Nah, dari titik inilah lingkaran nasibmu berputar. Tubuhmu terus menyiarkan frekuensi rendah itu ke semesta. Lalu semesta memantulkan kembali kawan bisnis penipu, pasangan manipulatif, atau situasi sial yang setara gelombangnya. Semesta tidak membencimu; getaran batinmu sendiri yang mengundangnya datang!"
    ],
    keyTakeaway: "Karma adalah cermin pantulan getaran batinmu; semesta tidak menghukum, ia hanya mengembalikan apa yang kamu siarkan."
  },
  7: {
    badge: "KABEL CAHAYA",
    title: "Serat Optik di Punggung Manusia",
    subtitle: "Cairan bening pembawa arus bioelektrik dari dasar panggul menuju puncak kepala.",
    paragraphs: [
      "Kamu tahu nggak, di dalam tulang belakangmu ada kabel serat optik alami yang dialiri cairan bening bercahaya? Namanya cairan serebrospinal. Kalau di buku kedokteran umum, cairan ini sering cuma dianggap bantalan air biasa biar otakmu nggak kejedot batok kepala.",
      "Tapi coba periksa susunan kimianya: penuh protein khusus dan ion elektrolit natrium, kalium, serta klorida yang menghantarkan arus listrik berkecepatan dahsyat! Cairan ini bekerja persis seperti serat optik biologis bertegangan tinggi.",
      "Arus bioelektrik ini mengalir melintasi tujuh stasiun kelenjar utama di tubuhmu: dari dasar panggul sampai ubun-ubun. Orang tua zaman dulu menandai pembaruan cairan hayat ini setiap tiga puluh lima hari dalam siklus selapanan kalender weton. Tepat pada momentum itulah kualitas cairan sarafmu mencapai puncak kematangan untuk menyegarkan seluruh jaringan raga."
    ],
    keyTakeaway: "Tulang belakangmu adalah jalan tol cahaya; cairan serebrospinal mengalirkan daya kesadaran melintasi stasiun kehidupan."
  },
  8: {
    badge: "MALAM PATI GENI",
    title: "Rahim Gelap Pembersih Racun Saraf",
    subtitle: "Kelenjar pineal hanya memproduksi obat terbaik saat matamu terbebas dari cahaya.",
    paragraphs: [
      "Coba perhatikan, kenapa orang zaman dulu kalau tirakat senang sekali masuk ke kamar gelap gulita tanpa lampu, yang dinamai Pati Geni? Apa cuma mistis cari wangsit? Sama sekali bukan; itu sains biologis yang luar biasa cerdas!",
      "Di tengah batok kepalamu ada kelenjar kecil seukuran butir beras bernama pineal. Dialah pabrik pembuat hormon melatonin: bukan sekadar obat tidur, tapi master pembersih paling tangguh yang bertugas mencuci karat dan racun saraf di otakmu. Tapi pabrik ini punya aturan keras: ia cuma mau membanjiri tubuh dengan melatonin kalau matamu berada dalam kegelapan mutlak tanpa setitik pun cahaya.",
      "Waktu leluhur mengunci diri dalam ruang gelap sambil puasa apit weton tiga hari, pencernaan berhenti bekerja keras dan mata beristirahat total. Seluruh energi tubuh dialihkan untuk menyuling cairan otak dan membasuh memori seluler yang rusak. Kegelapan itu rahim pemulihanmu."
    ],
    keyTakeaway: "Kegelapan total adalah rahim pemulihan alami; di sana kelenjar pineal mencuci racun saraf dan membarui raga."
  },
  9: {
    badge: "PINTU ISRO'",
    title: "Ketika Langit Runtuh ke Dalam Diri",
    subtitle: "Olah napas mendalam meremas kristal kalsit dan membuka gerbang kesadaran sejati.",
    paragraphs: [
      "Coba perhatikan caramu bernapas sekarang: terburu-buru dan cuma berhenti di dada bagian atas, kan? Pola napas panik seperti ini membuat cairan sarafmu mengendap pasif di dasar panggul. Energimu terkunci cuma buat urusan bertahan hidup, kecemasan materi, dan nafsu syahwat.",
      "Tapi coba ubah caranya: tarik napas panjang lewat hidung, tahan dalam hening, lalu kunci otot dasar panggulmu ke dalam. Tulang ekormu terungkit lembut, memicu tekanan pompa hidrolik yang mendesak cairan saraf melesat naik menembus tulang belakang menuju kepala!",
      "Hantaman cairan bertegangan tinggi ini menekan kristal kalsit di kelenjar pineal, memicu letupan listrik piezoelektrik yang melepas molekul DMT alami tubuhmu. Inilah Isro' Mikrokosmos: sekat ruang dan waktu luluh seketika, dan kamu menyaksikan dengan mata batin bahwa raga kecilmu ini menyatu utuh dengan keagungan semesta raya."
    ],
    keyTakeaway: "Isro' mikrokosmos adalah teknologi biologis raga; saat napas dihimpun ke kepala, sekat keterpisahan lebur seketika."
  },
  10: {
    badge: "RUMAH SEMESTA",
    title: "Jagat Raya di Balik Kedipan Mata",
    subtitle: "Tak perlu memburu rahasia langit ke bintang jauh; cukup melangkah ke dalam diri.",
    paragraphs: [
      "Manusia ini memang lucu. Mau mencari rahasia Tuhan dan keluasan alam semesta saja repot-repot mendongak ke langit luar: memotret bintang di galaksi seberang atau berkhayal naik pesawat antariksa ke surga. Orang tua zaman dulu cuma tersenyum melihat tingkah yang melelahkan itu.",
      "Mereka berbisik santai: Jagat Gedhe kuwi padha karo Jagat Alit. Seluruh keluasan kosmos raya ini sudah dicetak lengkap di dalam dirimu sendiri! Perjalanan spiritual sejati bukan terbang melayang di awan, melainkan pengembaraan meniti tujuh stasiun kesadaran di sepanjang tulang punggungmu sendiri.",
      "Perjalanan itu bermula dari gerbang dasar di panggul, mendaki ke keheningan dada, sampai mekar mewangi di ubun-ubun kepala. Waktu kamu berani menyelami setiap jengkal di dalam tubuhmu, seluruh rahasia langit tersingkap tanpa kamu perlu beranjak sejengkal pun dari tempat dudukmu."
    ],
    keyTakeaway: "Kosmos raya bercermin di dalam dirimu; kenali mikrokosmos raga, maka seluruh rahasia makrokosmos akan terbuka."
  },
  11: {
    badge: "TIGA TEKA-TEKI",
    title: "Tiga Sanepô Rahasia Leluhur",
    subtitle: "Mencari inti kangkung, sarang angin, dan bekas jejak burung bangau yang terbang.",
    paragraphs: [
      "Orang tua kita zaman dulu kalau mewariskan ilmu tingkat tinggi nggak pernah bikin seminar berbayar atau modul tebal. Mereka cuma melempar tiga teka-teki yang bikin kepala terbentur dan batin terdiam.",
      "Pertama, Nggoleki Galehing Kangkung: suruh mencari inti batang kangkung yang jelas-jelas bolong melompong! Maksudnya apa? Temukan keheningan suwung di balik ramainya pikiranmu. Kedua, Nggoleki Susuhing Angin: mencari sarang angin. Angin itu nggak kasatmata, tapi sarangnya nyata pada helaan napasmu di rongga dada.",
      "Ketiga, Nggoleki Tapaking Kuntul Nglayang: mencari bekas jejak kaki burung bangau yang sedang terbang di langit. Langit mana yang bisa mencatat bekas kaki burung? Artinya, berbuat baiklah sampai jejak keangkuhan egomu hilang tanpa sisa! Tiga sanepô ini menuntunmu pulang ke dada."
    ],
    keyTakeaway: "Tiga sanepô menuntun batin pulang: suwung dari keakuan, bernapas hening di dada, dan ikhlas tanpa jejak pamrih."
  },
  12: {
    badge: "NAPAS JANGKAR",
    title: "Menegakkan Tiang Rumah Batin",
    subtitle: "Duduk tegak, tarik napas empat detik, tahan tujuh, lalu hembuskan perlahan delapan detik.",
    paragraphs: [
      "Jangan pernah sepelekan caramu duduk dan bernapas hari ini. Tubuh yang bungkuk seharian menatap layar gawai membuat ruas tulang belakangmu terjepit dan jalur cairan saraf tersumbat. Punggung yang bengkok mencerminkan batin yang sedang kelelahan menanggung beban.",
      "Sekarang coba duduk bersila dengan punggung tegak bersahaja, lemaskan bahumu, dan tarik sedikit dagumu ke dalam. Tarik napas perlahan lewat hidung selama empat hitungan, rasakan perutmu mengembang lembut. Tahan napasmu selama tujuh hitungan dalam keheningan total, biarkan oksigen meresap ke dasar sel.",
      "Lalu hembuskan perlahan lewat celah bibir selama delapan hitungan sampai rongga perutmu kempis tuntas. Saat hembusan panjang ini mengalir, saraf parasimpatis langsung mengambil alih kendali, memadamkan alarm panik di kepalamu seketika. Raga yang tenang melahirkan pikiran yang jernih."
    ],
    keyTakeaway: "Tegakkan punggung dan hembuskan napas panjang; raga yang tenang adalah fondasi bagi batin yang jernih."
  },
  13: {
    badge: "DETOKS CAHAYA",
    title: "Memadamkan Api Palsu di Matamu",
    subtitle: "Satu jam sebelum tidur, biarkan matamu mencicipi kelembutan malam.",
    paragraphs: [
      "Coba perhatikan kebiasaan kita menjelang tidur. Lampu kamar sudah dimatikan, tapi tanganmu masih menggenggam ponsel pintar berjarak sejengkal dari hidung. Layar biru menyala tajam, membombardir matamu dengan sinyal palsu: 'Hei otak, ini masih siang benderang, jangan tidur!'",
      "Kelenjar pineal langsung menghentikan semburan melatonin seketika. Akibatnya tidurmu gelisah, mimpi buruk berkejaran, dan bangun pagi kepalamu berat seperti dihantam batu. Tubuhmu tidak sempat mencuci racun sarafnya sendiri.",
      "Mulai malam ini, pasang disiplin bersahaja: matikan layar gawai minimal satu jam sebelum berbaring. Biarkan matamu beristirahat dalam temaram malam yang teduh. Berikan kesempatan bagi kelenjar pinealmu untuk menyapu bersih sampah metabolisme dan meremajakan sel-selmu dalam pelukan gelap."
    ],
    keyTakeaway: "Jauhkan layar gawai menjelang tidur; beri ruang bagi kegelapan malam untuk merawat dan membasuh otakmu."
  },
  14: {
    badge: "PUTUS RANTAI",
    title: "Mengubah Jawaban di Saat Pemicu Datang",
    subtitle: "Ketika kata-kata pedas atau ujian lama melintas, diamlah tiga detik sebelum bereaksi.",
    paragraphs: [
      "Setiap kali kamu dipancing amarah oleh omongan pedas pasangan, tingkah menyebalkan kawan, atau kabar buruk di ponsel, perhatikan apa yang langsung meledak di tubuhmu. Jantungmu berdegup kencang, dada menyempit, rahang mengeras. Itu memori lama di tulang ekor yang sedang tersengat!",
      "Kebanyakan orang langsung membalas dengan bentakan yang sama, dan lingkaran nasib buruk pun berulang lagi. Mulai detik ini, tarik rem darurat batinmu: diamlah tiga detik penuh! Jangan langsung menjawab, jangan mengetik balasan dengan jemari yang gemetar emosi.",
      "Tarik napas dalam ke ulu hati. Sadari bahwa ini ujian lama yang sedang menguji kedewasaanmu, lalu pilih untuk tetap tenang. Dengan memutus reaksi otomatis raga, kamu baru saja meruntuhkan rantai nasib lama yang selama ini membelenggumu."
    ],
    keyTakeaway: "Beri jeda tiga detik saat amarah memuncak; memutus reaksi otomatis adalah jalan sejati memutus lingkaran nasib."
  },
  15: {
    badge: "PULANG KE DADA",
    title: "Tak Ada yang Perlu Dicari ke Luar",
    subtitle: "Seluruh peta perjalanan dan kunci keselamatan sudah tertanam di dalam tubuhmu.",
    paragraphs: [
      "Kita sudah berjalan jauh menelusuri rahasia tulang ekor, serat optik cairan saraf, rahim gelap pati geni, hingga teka-teki leluhur. Sekarang duduklah sejenak, letakkan telapak tangan kananmu tepat di tengah dada, dan rasakan denyut jantungmu yang setia berdetak.",
      "Kamu tidak perlu mengembara ke ujung dunia mencari tempat keramat atau membayar seminar mahal demi menemukan ketenangan sejati. Kuil suci itu adalah tubuhmu sendiri! Seluruh perangkat penyembuhan luka batin dan pintu menuju Sang Maha Menjaga sudah dipasang sempurna di dalam ragamu sejak hembusan napas pertamamu.",
      "Rawatlah rumah ini dengan keheningan, muliakan denyutnya, dan jalani hari-harimu dengan kesadaran utuh. Sebab pada akhirnya, seluruh pencarian panjang di dunia ini hanyalah perjalanan pulang ke dalam dirimu sendiri."
    ],
    keyTakeaway: "Berhentilah mencari ke luar; kuil kesadaran ada di dalam dadamu, menanti kamu pulang untuk menyadarinya."
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
console.log('✅ Bab 1 Patch refreshed with pure Cak Nun stage aroma!');
