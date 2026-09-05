import fs from 'fs';

const pages = JSON.parse(fs.readFileSync('./src/data/book-pages.json', 'utf8'));

function formatPageText(badge, title, subtitle, paragraphs, keyTakeaway) {
  let md = `> **${badge}**\n\n# ${title}\n\n*${subtitle}*\n\n`;
  md += paragraphs.join('\n\n');
  md += `\n\n> **Intisari Kesadaran:** ${keyTakeaway}`;
  return md;
}

function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Page 38 (Index 37)
const p38 = pages[37];
p38.badge = "2. Peta Endokrin";
p38.title = "7 Cakra & 7 Wilayah Endokrin: Jalur Bio-Elektrik Saraf (Bagian 1)";
p38.subtitle = "Peta Korespondensi Tiga Stasiun Biologis Bawah: Gonad, Pankreas, dan Adrenal";
p38.subchapter_name = "7 Cakra & 7 Wilayah Endokrin: Stasiun Bio-Elektrik Saraf (Bagian 1)";
p38.paragraphs = [
  "Tujuh cakra utama bukanlah sekadar dongeng energi abstrak. Tujuh cakra adalah tujuh simpul kelenjar endokrin nyata di dalam raga yang memproduksi hormon dan mengatur realitas biologis serta emosionalmu.",
  "Penyelarasan stasiun hormon ini membentang dari pangkal tulang ekor hingga puncak kepala:.",
  "1. Cakra Dasar (Muladhara) berpadu dengan Kelenjar Gonad (testis/ovarium): Mengatur hormon reproduksi, daya tahan fisik, serta naluri bertahan hidup dan kemandirian materi.",
  "2. Cakra Seks (Svadhisthana) berpadu dengan Kelenjar Pankreas: Mengatur insulin, metabolisme energi, stabilitas nafsu, serta daya kreasi dan daya pikat sosial.",
  "3. Cakra Solar Plexus (Manipura) berpadu dengan Kelenjar Adrenal: Memproduksi kortisol dan adrenalin sebagai stasiun keberanian, ambisi terarah, dan ketahanan menghadapi tekanan hidup.",
  "Ketika tiga cakra bawah ini selaras, manusia berpijak kokoh di atas bumi—tidak mudah goyah oleh kecemasan duniawi."
];
p38.keyTakeaway = "Tiga cakra bawah adalah stasiun kelenjar fisik penopang raga; selaraskan hormonmu untuk menancapkan pijakan hidup yang kokoh.";
p38.text = formatPageText(p38.badge, p38.title, p38.subtitle, p38.paragraphs, p38.keyTakeaway);
p38.word_count = countWords(p38.text);
p38.illustration_description = "Peta Bio-Elektrik Saraf: Tiga Cakra Bawah dan Kelenjar Gonad, Pankreas, serta Adrenal";
p38.imageCaption = "Peta Bio-Elektrik Saraf: Penyelarasan Stasiun Hormon Muladhara, Svadhisthana, dan Manipura";
p38.visual_continuity_context = {
  prev_visual: "Piring keramik pecah di lantai semen",
  current_subject: "7 Cakra & 7 Wilayah Endokrin (Bagian 1: Cakra 1-3)",
  environment: "Diagram anatomi kuno bercahaya di atas kanvas kertas kulit kayu Jawa",
  mood: "Bio-elektrik mistik, ilmiah sakral, kehangatan pigmen alami"
};
p38.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 2. Penyelarasan Tradisi Kuno & Peta 7 Cakra Endokrin",
  source_paragraph_start: 1,
  source_paragraph_end: 5
};

// Page 39 (Index 38)
const p39 = pages[38];
p39.badge = "2. Peta Endokrin";
p39.title = "7 Cakra & 7 Wilayah Endokrin: Puncak Mahkota (Bagian 2)";
p39.subtitle = "Penyelarasan Empat Stasiun Biologis Atas: Timus, Tiroid, Pineal, dan Pituitari";
p39.subchapter_name = "7 Cakra & 7 Wilayah Endokrin: Puncak Mahkota Kesadaran (Bagian 2)";
p39.paragraphs = [
  "Melanjutkan perjalanan dari rongga dada menuju puncak mahkota kesadaran tertinggi:.",
  "4. Cakra Jantung (Anahata) bertumpu pada Kelenjar Timus: Pusat pembentukan sel limfosit T sistem imun, memancarkan welas asih sejati dan keheningan batin (Mandolo Wening).",
  "5. Cakra Tenggorokan (Vishuddha) bertumpu pada Kelenjar Tiroid: Mengatur metabolisme laju energi raga dan bobot getaran integritas sabda ucapan.",
  "6. Cakra Ajna (Mata Ketiga) bertumpu pada Kelenjar Pineal: Memproduksi melatonin dan molekul transendental alami, membangkitkan ketajaman intuisi dan pandangan batin tembus pandang.",
  "7. Cakra Mahkota (Sahasrara) bertumpu pada Kelenjar Pituitari (Master Gland): Mengorkestrasi seluruh sistem hormon tubuh dan melarutkan sekat ilusi keterpisahan dengan Semesta.",
  "Keteraturan sistem endokrin adalah gerbang kesadaran sejati; saat biokimia raga selaras, batin menemukan hening alaminya."
];
p39.keyTakeaway = "Empat cakra atas menghubungkan biologi dengan kebijaksanaan Ilahi; ketenangan timus dan pineal adalah stasiun pencerahan raga.";
p39.text = formatPageText(p39.badge, p39.title, p39.subtitle, p39.paragraphs, p39.keyTakeaway);
p39.word_count = countWords(p39.text);
p39.illustration_description = "Peta Bio-Elektrik Saraf: Empat Cakra Atas dan Kelenjar Timus, Tiroid, Pineal, serta Pituitari";
p39.imageCaption = "Peta Bio-Elektrik Saraf: Puncak Mahkota Kesadaran Menembus Langit Batin";
p39.visual_continuity_context = {
  prev_visual: "Diagram cakra dasar hingga solar plexus",
  current_subject: "7 Cakra & 7 Wilayah Endokrin (Bagian 2: Cakra 4-7)",
  environment: "Pendar cahaya spektrum zamrud, nila, dan violet pada ruas tulang belakang",
  mood: "Transendensi batin, keheningan mahkota, pencerahan jiwa"
};
p39.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 2. Penyelarasan Tradisi Kuno & Peta 7 Cakra Endokrin",
  source_paragraph_start: 6,
  source_paragraph_end: 10
};

// Page 40 (Index 39)
const p40 = pages[39];
p40.badge = "3. Mitologi Saraf";
p40.title = "Dekonstruksi Epos Mahabharata dalam Anatomi Saraf";
p40.subtitle = "Perang Kurusetra di Tempurung Kepala: Sengkuni (Amigdala) vs Sri Kresna (Kelenjar Pineal)";
p40.subchapter_name = "Dekonstruksi Epos Mahabharata dalam Anatomi Saraf";
p40.paragraphs = [
  "Perang dahsyat Bharatayuddha di padang Kurusetra bukanlah sekadar legenda perebutan takhta kuno. Bharatayuddha adalah peta peperangan neurologis yang berkecamuk di dalam tempurung kepala setiap manusia setiap hari:.",
  "• Patih Sengkuni adalah personifikasi dari Amigdala: Pusat rasa waswas dan intrik di otak purba reptil yang memproduksi hormon stres kortisol, membisikkan panik dan kecemasan.",
  "• Sri Kresna adalah personifikasi dari Kelenjar Pineal: Penuntun batin yang hening, tanpa memegang senjata tajam namun mengatur strategi kesadaran tinggi untuk menundukkan keliaran nafsu.",
  "• Tiga Panglima Utama Kurawa (Karna, Drona, Bisma): Merupakan personifikasi tiga cakra bawah—kemelekatan materi, nafsu relasi, dan arogansi ego. Ketiganya hanya bisa ditundukkan ketika Kresna menghentikan waktu dalam keheningan cakra jantung (Mandolo Wening).",
  "Leluhur membungkus sains neurobiologi ke dalam sanepo pewayangan adiluhung agar manusia mengenali musuh dan penuntun sejatinya di dalam diri."
];
p40.keyTakeaway = "Bharatayuddha adalah peta perang saraf di dalam kepala; tundukkan kepanikan amigdala dengan bimbingan hening kelenjar pineal.";
p40.text = formatPageText(p40.badge, p40.title, p40.subtitle, p40.paragraphs, p40.keyTakeaway);
p40.word_count = countWords(p40.text);
p40.illustration_description = "Dekonstruksi Perang Kurusetra di Dalam Saraf Kepala: Sengkuni (Amigdala) vs Sri Kresna (Kelenjar Pineal)";
p40.imageCaption = "Perang Kurusetra Batin: Penundukan Amigdala oleh Keheningan Kelenjar Pineal";
p40.visual_continuity_context = {
  prev_visual: "Pendar spektrum cakra mahkota",
  current_subject: "Dekonstruksi Epos Mahabharata dalam Anatomi Saraf",
  environment: "Medan perang mitologis temaram di dalam siluet tempurung kepala manusia",
  mood: "Ketegangan epik kuno, neuro-mitologis mendalam, ketenangan Kresna"
};
p40.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 3.1 Dekonstruksi Sanepo Epos Mahabharata dalam Anatomi Saraf",
  source_paragraph_start: 1,
  source_paragraph_end: 6
};

// Page 41 (Index 40)
const p41 = pages[40];
p41.badge = "3. Simbolisme Tubuh";
p41.title = "Bukti Simbolisme Mitologi Dunia: Ganesha, Anubis & Sun Go Kong";
p41.subtitle = "Kode Anatomi Purba: Cerebellum, Epiglotis Sakratul Maut, dan Monkey Mind";
p41.subchapter_name = "Bukti Simbolisme Mitologi Dunia: Ganesha, Anubis & Sun Go Kong";
p41.paragraphs = [
  "Jika kamu membedah buku ajar neuroanatomi dan membandingkannya dengan arca-arca sakral peradaban kuno, kamu akan menemukan diagram organ biologis yang dipahat secara artistik:.",
  "1. Dewa Ganesha (Berkepala Gajah): Belahan posterior Cerebellum (otak kecil) dengan batang vermis sentral membentuk siluet yang identik dengan kepala dan belalai gajah. Cerebellum adalah filter keseimbangan motorik dan gerak—itulah mengapa Ganesha dimuliakan sebagai penyeimbang langkah dan pembuka rintangan.",
  "2. Dewa Anubis (Mesir Kuno / Berkepala Serigala Hitam): Struktur anatomi Epiglotis dan Pangkal Lidah penjaga gerbang sakratul maut persis menyerupai kepala serigala runcing Anubis. Di titik itulah napas terakhir tertahan saat menimbang kesucian rasa manusia.",
  "3. Sun Go Kong (Kera Sakti): Penggambaran keliaran pikiran (Monkey Mind) yang melompat tanpa arah, yang baru bisa ditundukkan ketika dikunci lingkar emas kesadaran pada lobus frontal.",
  "Mitologi kuno bukanlah dongeng pengantar tidur, melainkan ensiklopedia anatomi tubuh manusia yang diwariskan para bijak bestari."
];
p41.keyTakeaway = "Simbol mitologi dunia adalah buku teks anatomi purba; kenali organ dan kesadaranmu lewat sandi para leluhur.";
p41.text = formatPageText(p41.badge, p41.title, p41.subtitle, p41.paragraphs, p41.keyTakeaway);
p41.word_count = countWords(p41.text);
p41.illustration_description = "Arkeologi Simbolik Mitologi: Ganesha sebagai Cerebellum dan Anubis sebagai Epiglotis Gerbang Kematian";
p41.imageCaption = "Arkeologi Simbolik Mitologi Dunia: Ganesha, Anubis, dan Kera Liar Sun Go Kong";
p41.visual_continuity_context = {
  prev_visual: "Siluet perang Mahabharata di otak",
  current_subject: "Bukti Simbolisme Mitologi Dunia: Ganesha, Anubis & Sun Go Kong",
  environment: "Relief batu candi kuno bersanding dengan potongan melintang otak dan saluran napas",
  mood: "Arkeologis purba, ketepatan anatomis, mistisisme peradaban"
};
p41.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 3.2 & 3.3 Simbolisme Anatomi Mitologi Dunia",
  source_paragraph_start: 1,
  source_paragraph_end: 6
};

// Page 42 (Index 41)
const p42 = pages[41];
p42.badge = "3. Biohacking Leluhur";
p42.title = "Biohacking Kuno: Siklus 35 Hari Selapanan, Puasa Apit Weton & Pati Geni";
p42.subtitle = "Siklus Pematangan Protein Cairan Serebrospinal dan Reset Melatonin Alami";
p42.subchapter_name = "Biohacking Kuno: Siklus 35 Hari Selapanan, Puasa Apit Weton & Pati Geni";
p42.paragraphs = [
  "Sains modern membanggakan istilah autophagy dan intermittent fasting. Padahal, ribuan tahun lalu, leluhur Nusantara telah merumuskan protokol biohacking yang jauh lebih presisi: Siklus Selapanan 35 Hari.",
  "Perpaduan 5 hari pasaran Jawa dengan 7 hari Masehi menghasilkan putaran tepat 35 hari. Dalam kearifan leluhur, cairan serebrospinal (CSF) di tulang belakang memerlukan siklus pematangan protein sekitar 35 hari untuk mencapai konduktivitas bioelektrik tertinggi.",
  "Puasa Apit Weton (3 hari berturut-turut: H-1, Hari Weton, dan H+1) dijalankan guna mengosongkan pencernaan dari lonjakan racun glukosa dan lemak tepat saat CSF mencapai puncak kematangan, sekaligus menjaga gelombang otak tetap tenang di frekuensi alfa/teta.",
  "Adapun tirakat Pati Geni—berdiam di ruang gelap gulita tanpa cahaya buatan—adalah protokol kuno merestart reseptor kelenjar pineal. Kegelapan mutlak memicu sekresi melatonin murni dalam skala masif yang membasuh ventrikel otak, memicu peremajaan sel saraf (neuronal autophagy), dan menyalakan molekul transendental batin."
];
p42.keyTakeaway = "Siklus selapanan 35 hari dan pati geni adalah biohacking leluhur untuk memurnikan cairan serebrospinal dan merestart kelenjar pineal.";
p42.text = formatPageText(p42.badge, p42.title, p42.subtitle, p42.paragraphs, p42.keyTakeaway);
p42.word_count = countWords(p42.text);
p42.illustration_description = "Biohacking Kuno: Siklus 35 Hari Selapanan, Puasa Apit Weton, dan Laku Pati Geni";
p42.imageCaption = "Biohacking Kuno: Siklus 35 Hari Selapanan dan Tirakat Ruang Gelap Pati Geni";
p42.visual_continuity_context = {
  prev_visual: "Relief Ganesha dan Anubis",
  current_subject: "Biohacking Kuno: Puasa Apit Weton 35 Hari & Pati Geni",
  environment: "Kalender Jawa melingkar kuno dengan siluet pertapa di dalam ruangan temaram",
  mood: "Disiplin pertapaan, grounding leluhur, regenerasi hening"
};
p42.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 3.4 Biohacking Kuno: Puasa Apit Weton 35 Hari & Pati Geni",
  source_paragraph_start: 1,
  source_paragraph_end: 6
};

// Page 43 (Index 42)
const p43 = pages[42];
p43.badge = "3. Pembersih Energi";
p43.title = "Sains Grounding: Garam Krosok & Daun Kelor";
p43.subtitle = "Pembersih Medan Elektromagnetik: Luruhnya Muatan Listrik Statis dan Residu Frekuensi Rendah";
p43.subchapter_name = "Sains Grounding: Garam Krosok & Daun Kelor";
p43.paragraphs = [
  "Manusia adalah antena elektromagnetik terbuka. Segala muatan statis lingkungan dan residu emosional disonan dapat menempel pada medan torus raga, menimbulkan sensasi tengkuk kaku, pusing melayang, dan rasa lelah tanpa sebab.",
  "Sebelum residu energi liar tersebut merembes ke organ dalam, leluhur Nusantara memiliki cara pembersihan yang sangat saintifik dan membumi:.",
  "1. Garam Krosok (Garam Laut Kasar Non-Rafinasi): Mengandung ikatan kristal ionik natrium (Na+) dan klorida (Cl-) murni bersama puluhan mineral laut mikro. Mandi atau rendaman air garam krosok bertindak sebagai konduktor pembumian (grounding agent) yang seketika menarik muatan listrik statis berlebih dari permukaan kulit.",
  "2. Daun Kelor (Moringa Oleifera): Memiliki senyawa antioksidan flavonoid dan muatan bio-energi dengan polaritas netral absolut yang meluruhkan residu frekuensi liar pada medan elektromagnetik manusia.",
  "Bilas tubuh dengan air larutan garam krosok dan remasan daun kelor dari ubun-ubun hingga telapak kaki; beban berat di pundak akan seketika luruh ke bumi."
];
p43.keyTakeaway = "Garam krosok dan daun kelor adalah sarana grounding alami untuk meluruhkan muatan listrik statis dan membersihkan medan energi raga.";
p43.text = formatPageText(p43.badge, p43.title, p43.subtitle, p43.paragraphs, p43.keyTakeaway);
p43.word_count = countWords(p43.text);
p43.illustration_description = "Sains Grounding: Kristal Garam Krosok Kasar dan Kesegaran Rimbun Daun Kelor";
p43.imageCaption = "Sains Grounding: Pembersihan Muatan Statis Elektromagnetik Melalui Garam dan Kelor";
p43.visual_continuity_context = {
  prev_visual: "Kalender Jawa dan pertapaan",
  current_subject: "Sains Grounding: Garam Krosok & Daun Kelor",
  environment: "Mangkuk tembikar berisi garam laut kasar non-rafinasi dan daun kelor berembun pagi",
  mood: "Pembersihan alami, luruhnya beban statis, kesegaran tanah Merapi"
};
p43.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 3.5 Pembersih Medan Elektromagnetik: Garam Krosok & Daun Kelor",
  source_paragraph_start: 1,
  source_paragraph_end: 5
};

// Page 44 (Index 43)
const p44 = pages[43];
p44.badge = "4. Protokol Eksekusi";
p44.title = "Protokol Eksekusi: Panduan Napas Parasimpatis 4-4-8 & Master Matrix";
p44.subtitle = "Aktivasi Saraf Vagus Seketika, Detoks Kortisol, dan Penyelarasan Raga Menjelang Tidur";
p44.subchapter_name = "Protokol Eksekusi: Panduan Napas Parasimpatis 4-4-8 & Master Matrix";
p44.paragraphs = [
  "Olah napas adalah satu-satunya saklar sadar yang dimiliki manusia untuk mengintervensi sistem saraf otonom. Ketika overthinking membakar energi dan kortisol membanjiri darah, eksekusi protokol napas parasimpatis 4-4-8 malam ini:.",
  "1. Duduk tegak dengan tulang belakang lurus, lemaskan bahu dan rahang.",
  "2. Tarik Napas (4 Detik) perlahan melalui hidung, biarkan rongga perut mengembang alami.",
  "3. Tahan Napas (4 Detik) di dasar panggul (mulabandha), memberi waktu cairan serebrospinal tertekan naik.",
  "4. Hembuskan Napas (8 Detik) sangat halus dan panjang melalui mulut atau hidung.",
  "Kunci Ilmiah: Hembusan napas berdurasi dua kali lipat lebih panjang dari tarikan napas mengaktivasi Nervus Vagus secara instan, memperlambat denyut jantung, seketika menghentikan produksi hormon kortisol, dan menurunkan gelombang otak ke alfa/teta.",
  "Praktikkan 10 siklus sebelum tidur; tubuh biologismu akan bertransisi dari mode siaga perang menjadi sanctuary pemulihan seluler yang hening."
];
p44.keyTakeaway = "Napas parasimpatis 4-4-8 adalah saklar instan aktivasi nervus vagus; matikan badai kortisol dan pulihkan raga dalam keheningan malam.";
p44.text = formatPageText(p44.badge, p44.title, p44.subtitle, p44.paragraphs, p44.keyTakeaway);
p44.word_count = countWords(p44.text);
p44.illustration_description = "Protokol Eksekusi: Diagram Alir Napas Parasimpatis 4-4-8 dan Aktivasi Saraf Vagus";
p44.imageCaption = "Protokol Napas 4-4-8: Saklar Parasimpatis Penuntas Kortisol dan Penyelaras Raga";
p44.visual_continuity_context = {
  prev_visual: "Mangkuk garam krosok dan daun kelor",
  current_subject: "Protokol Eksekusi: Napas Parasimpatis 4-4-8 & Master Matrix",
  environment: "Kamar hening temaram, siluet meditasi dengan diagram aliran napas berirama 4-4-8",
  mood: "Relaksasi mendalam, aktivasi saraf vagus, keheningan absolut"
};
p44.provenance = {
  source_chapter: 3,
  source_section: "Bab 3 > 4.2 Protokol Detoks Kortisol & Napas Parasimpatis",
  source_paragraph_start: 1,
  source_paragraph_end: 6
};

fs.writeFileSync('./src/data/book-pages.json', JSON.stringify(pages, null, 2), 'utf8');
console.log('✅ Phase 1 Bab 3 (Pages 38-44) successfully updated in book-pages.json!');
