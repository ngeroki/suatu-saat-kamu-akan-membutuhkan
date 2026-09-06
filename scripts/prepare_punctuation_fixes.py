import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
bp = json.load(open(BASE_DIR / 'src' / 'data' / 'book-pages.json', encoding='utf-8'))

# Exact paragraph replacements
# Format: (page_number, old_sub, new_sub)

REPLACEMENTS = [
    # === 1. SIDE A REFLECTIONS ===
    # Handled separately on side_a_text

    # === 2. SEMICOLONS IN PARAGRAPHS ===
    ("Semesta tidak membencimu; getaran batinmu sendiri yang mengundangnya datang!",
     "Semesta tidak membencimu. Getaran batinmu sendiri yang mengundangnya datang!"),

    ("Sama sekali bukan; itu sains biologis yang luar biasa cerdas!",
     "Sama sekali bukan. Itu sains biologis yang luar biasa cerdas!"),

    ("Titik kehancuran itu bukan akhir hidupmu; itu cara semesta meremukkan kesombongan egomu biar kesadaran sejati bisa lahir.",
     "Titik kehancuran itu bukan akhir hidupmu. Itu cara semesta meremukkan kesombongan egomu biar kesadaran sejati bisa lahir."),

    ("Kamu nggak perlu capek mengejar nasib; getaran batinmu yang jernih yang bakal mengundang kebaikan hidup datang mendekat.",
     "Kamu nggak perlu capek mengejar nasib. Justru getaran batinmu yang jernih yang bakal mengundang kebaikan hidup datang mendekat."),

    ("Ini bukan soal yang satu lebih beradab atau lebih suci; ini soal cairan kimia apa yang sedang membanjiri sel-sel darah mereka saat musibah itu datang!",
     "Ini bukan soal yang satu lebih beradab atau lebih suci. Ini soal cairan kimia apa yang sedang membanjiri sel-sel darah mereka saat musibah itu datang!"),

    ("Tubuhmu itu nggak sedang rusak secara acak; dia lagi teriak minta tolong biar kamu berhenti mencemaskan hidup!",
     "Tubuhmu itu nggak sedang rusak secara acak. Dia lagi teriak minta tolong biar kamu berhenti mencemaskan hidup!"),

    ("Orang dulu nggak pakai jimat; mereka memanfaatkan fisika mineral bumi buat membasuh kotoran raga.",
     "Orang dulu nggak pakai jimat. Mereka memanfaatkan fisika mineral bumi buat membasuh kotoran raga."),

    ("jangan mencoba menenangkan pikiran dengan pikiran; itu seperti menyiram bensin ke kobaran api!",
     "jangan mencoba menenangkan pikiran dengan pikiran. Itu seperti menyiram bensin ke kobaran api!"),

    ("Tubuhmu tidak cuma hidup menumpang di semesta; seluruh semesta raya ini sedang hidup dan bernapas di dalam dirimu!",
     "Tubuhmu tidak cuma hidup menumpang di semesta. Seluruh semesta raya ini sedang hidup dan bernapas di dalam dirimu!"),

    ("Hidup ini tembang yang berganti bait; jangan salah menyanyikannya!",
     "Hidup ini tembang yang berganti bait—jangan salah menyanyikannya!"),

    ("Dunia luar hanyalah layar bioskop pantulan; proyektornya adalah getaran rasa dan rekaman bawah sadarmu sendiri!",
     "Dunia luar hanyalah layar bioskop pantulan. Proyektornya adalah getaran rasa dan rekaman bawah sadarmu sendiri!"),

    ("Tuhan nggak butuh kamu jadi malaikat palsu yang aneh di bumi; Tuhan ingin kamu jadi manusia sejati yang menginjak tanah!",
     "Tuhan nggak butuh kamu jadi malaikat palsu yang aneh di bumi. Tuhan ingin kamu jadi manusia sejati yang menginjak tanah!"),

    ("Bersabarlah melewati pekatnya malam; fajar kebangkitan batinmu sedang bersiap menyingsing!",
     "Bersabarlah melewati pekatnya malam. Fajar kebangkitan batinmu sedang bersiap menyingsing!"),

    ("Orang yang sedang remuk hatinya tidak butuh kuliah tentang medan torus atau gelombang kuantum; mereka cuma butuh telinga yang tulus mendengarkan dan tatapan mata yang hangat tanpa penghakiman.",
     "Orang yang sedang remuk hatinya tidak butuh kuliah tentang medan torus atau gelombang kuantum. Mereka cuma butuh telinga yang tulus mendengarkan dan tatapan mata yang hangat tanpa penghakiman."),

    # Semicolons in page.text (e.g. Page 2)
    ("Tubuh biologismu jauh lebih cerdas daripada pikiranmu; tulang ekormu menyimpan rekaman perjalanan",
     "Tubuh biologismu jauh lebih cerdas daripada pikiranmu. Tulang ekormu menyimpan rekaman perjalanan"),

    # === 3. OVERUSED COLONS IN PARAGRAPHS ===
    # Page 2
    ("Kebiasaan kita hari ini memang begitu: apa pun yang sedikit dalam, buru-buru disederhanakan jadi kabel konslet.",
     "Kebiasaan kita hari ini memang begitu—apa pun yang sedikit dalam, buru-buru disederhanakan jadi kabel konslet."),
    ("Kebiasaan kita hari ini memang begitu: apa pun pengalaman batin yang sedikit mendalam, buru-buru disederhanakan",
     "Kebiasaan kita hari ini memang begitu—apa pun pengalaman batin yang sedikit mendalam, buru-buru disederhanakan"),

    # Page 3
    ("melingkupi ragamu: medan torus.",
     "melingkupi ragamu, yaitu medan torus."),

    # Page 4
    ("terjadilah resonansi: dua gelombang saling mengunci.",
     "terjadilah resonansi—dua gelombang saling mengunci."),
    ("titik penyimpanan data paling purba di tubuhmu: tulang ekor!",
     "titik penyimpanan data paling purba di tubuhmu, yaitu tulang ekor!"),

    # Page 6
    ("Karma itu hukum fisika batin yang sangat presisi: aksi dan reaksi.",
     "Karma itu hukum fisika batin yang sangat presisi—ada aksi, ada reaksi."),

    # Page 7
    ("Tapi coba periksa susunan kimianya: penuh protein khusus",
     "Tapi coba periksa susunan kimianya, penuh protein khusus"),
    ("tujuh stasiun kelenjar utama di tubuhmu: dari dasar panggul sampai ubun-ubun.",
     "tujuh stasiun kelenjar utama di tubuhmu, dari dasar panggul sampai ubun-ubun."),

    # Page 8
    ("pabrik pembuat hormon melatonin: bukan sekadar obat tidur, tapi master pembersih",
     "pabrik pembuat hormon melatonin—bukan sekadar obat tidur, tapi master pembersih"),
    ("Tapi pabrik ini punya aturan keras: ia cuma mau membanjiri",
     "Tapi pabrik ini punya aturan keras. Ia cuma mau membanjiri"),

    # Page 9
    ("Coba perhatikan caramu bernapas sekarang: terburu-buru dan cuma berhenti di dada bagian atas, kan?",
     "Coba perhatikan caramu bernapas sekarang. Terburu-buru dan cuma berhenti di dada bagian atas, kan?"),
    ("Tapi coba ubah caranya: tarik napas panjang lewat hidung,",
     "Tapi coba ubah caranya. Tarik napas panjang lewat hidung,"),
    ("Inilah Isro' Mikrokosmos: sekat ruang dan waktu luluh seketika,",
     "Inilah Isro' Mikrokosmos—sekat ruang dan waktu luluh seketika,"),

    # Page 10
    ("mendongak ke langit luar: memotret bintang di galaksi seberang",
     "mendongak ke langit luar, memotret bintang di galaksi seberang"),

    # Page 13
    ("pasang disiplin bersahaja: matikan layar gawai minimal satu jam sebelum berbaring.",
     "pasang disiplin bersahaja. Matikan layar gawai minimal satu jam sebelum berbaring."),

    # Page 14
    ("tarik rem darurat batinmu: diamlah tiga detik penuh!",
     "tarik rem darurat batinmu—diamlah tiga detik penuh!"),

    # Page 18
    ("waktu hidupnya sudah remuk redam: tabungan ludes,",
     "waktu hidupnya sudah remuk redam—tabungan ludes,"),

    # Page 20
    ("mengajarkan rahasia yang jauh lebih dalam: kamu itu wayang sekaligus dalangnya!",
     "mengajarkan rahasia yang jauh lebih dalam bahwa kamu itu wayang sekaligus dalangnya!"),

    # Page 21
    ("membuka pintunya lebar-lebar tanpa penjagaan: lima belas menit sebelum",
     "membuka pintunya lebar-lebar tanpa penjagaan—lima belas menit sebelum"),

    # Page 22
    ("Coba jujur sama dirimu sendiri: kapan terakhir kali",
     "Coba jujur sama dirimu sendiri, kapan terakhir kali"),

    # Page 24
    ("Coba ingat-ingat kembali pelajaran biologi dasar: lebih dari tujuh puluh persen",
     "Coba ingat-ingat kembali pelajaran biologi dasar. Lebih dari tujuh puluh persen"),

    # Page 25
    ("buka dompetmu, lalu tiup: ffuuuh!'",
     "buka dompetmu, lalu tiup, ffuuuh!'"),

    # Page 26
    ("gumaman tanpa nyawa: tip-tip-tip-tip.",
     "gumaman tanpa nyawa, tip-tip-tip-tip."),
    ("Hasilnya sungguh ironis: zikirnya banyak, tapi dalam bisnis",
     "Hasilnya sungguh ironis. Zikirnya banyak, tapi dalam bisnis"),

    # Page 27
    ("di dalam kepalamu: Sengkuni dan Ki Lurah Semar.",
     "di dalam kepalamu, yaitu Sengkuni dan Ki Lurah Semar."),
    ("amigdala dan otak reptil manusia: selalu curiga, licik,",
     "amigdala dan otak reptil manusia—selalu curiga, licik,"),
    ("simbol rasa sejati yang membumi: sosok bersahaja yang perutnya",
     "simbol rasa sejati yang membumi—sosok bersahaja yang perutnya"),

    # Page 29
    ("cuma ada pada satu hal sederhana: jeda!",
     "cuma ada pada satu hal sederhana, yaitu jeda!"),
    ("mirip saklar lampu: begitu ada orang menyakiti atau menghina,",
     "mirip saklar lampu. Begitu ada orang menyakiti atau menghina,"),
    ("pasang rem darurat batinmu: diamlah tiga detik penuh!",
     "pasang rem darurat batinmu—diamlah tiga detik penuh!"),

    # Page 32
    ("pecah berkeping-keping: prang!",
     "pecah berkeping-keping—prang!"),
    ("Lho, peristiwanya sama persis: piring pecah.",
     "Lho, peristiwanya sama persis, piring pecah."),

    # Page 33
    ("manusia modern berakar di sana: pikiran melayang menyesali masa lalu",
     "manusia modern berakar di sana—pikiran melayang menyesali masa lalu"),

    # Page 34
    ("antara dua kubu hormon: pasukan darurat bertahan hidup",
     "antara dua kubu hormon, pasukan darurat bertahan hidup"),

    # Page 35
    ("proses ini dinamai Sindrom Sirus: oksidasi seluler menahun",
     "proses ini dinamai Sindrom Sirus, yaitu oksidasi seluler menahun"),

    # Page 36
    ("mengajarkan laku tirakat: berpuasa, berkeringat kerja keras,",
     "mengajarkan laku tirakat—berpuasa, berkeringat kerja keras,"),

    # Page 38
    ("bertengger kelenjar adrenal: komandan keberanian dan penentu reaksi bertarung.",
     "bertengger kelenjar adrenal, komandan keberanian dan penentu reaksi bertarung."),

    # Page 39
    ("cara pandangmu berubah total: kamu memandang sesama",
     "cara pandangmu berubah total. Kamu memandang sesama"),

    # Page 40
    ("gambaran amigdala otakmu: selalu curiga, meniupkan rasa cemas,",
     "gambaran amigdala otakmu—selalu curiga, meniupkan rasa cemas,"),
    ("tiga benteng cakra bawah yang harus dilumpuhkan: Karna lambang",
     "tiga benteng cakra bawah yang harus dilumpuhkan—Karna lambang"),

    # Page 41
    ("menimbang jantung di gerbang maut: simbol katup napas",
     "menimbang jantung di gerbang maut, simbol katup napas"),

    # Page 44
    ("Kendalikan pintu masuk fisikmu: napas.",
     "Kendalikan pintu masuk fisikmu, yaitu napas."),
    ("Lalu kunci rahasianya: hembuskan napasmu lewat celah bibir",
     "Lalu inilah kunci rahasianya. Hembuskan napasmu lewat celah bibir"),

    # Page 45
    ("batu karang di tengah samudra: tidak silau oleh sanjungan semu,",
     "batu karang di tengah samudra—tidak silau oleh sanjungan semu,"),

    # Page 47
    ("Pernah nggak kamu mengalami hal yang ganjil: tiba-tiba kepalamu teringat",
     "Pernah nggak kamu mengalami hal yang ganjil? Tiba-tiba kepalamu teringat"),

    # Page 48
    ("Logikanya cuma satu: karena di dimensi yang lebih dalam,",
     "Logikanya cuma satu, karena di dimensi yang lebih dalam,"),

    # Page 50
    ("Yang nyata-nyata ada cuma detik ini: titik saiki!",
     "Yang nyata-nyata ada cuma detik ini—titik saiki!"),
    ("perhatiannya terbelah: separuh terjebak menyesali masa lalu,",
     "perhatiannya terbelah—separuh terjebak menyesali masa lalu,"),

    # Page 51
    ("hukum sebab-akibat yang kaku: kamu harus punya harta melimpah",
     "hukum sebab-akibat yang kaku. Kamu harus punya harta melimpah"),
    ("diputar balik seratus delapan puluh derajat: akibat mendahului sebab!",
     "diputar balik seratus delapan puluh derajat—akibat mendahului sebab!"),

    # Page 52
    ("jutaan gelombang kemungkinan: kemungkinan sial,",
     "jutaan gelombang kemungkinan—kemungkinan sial,"),

    # Page 53
    ("ke dalam samudra luas: embun itu tidak musnah,",
     "ke dalam samudra luas. Embun itu tidak musnah,"),

    # Page 54
    ("Dan perhatikan rahasia puncaknya: beliau tidak berhenti menetap",
     "Dan perhatikan rahasia puncaknya. Beliau tidak berhenti menetap"),
    ("kitab suci ditutup dengan surat An-Nas: kembali membumi",
     "kitab suci ditutup dengan surat An-Nas, kembali membumi"),

    # Page 56
    ("Itulah potret manusia modern: raganya duduk di warkop,",
     "Itulah potret manusia modern—raganya duduk di warkop,"),

    # Page 57
    ("ego pahlawan yang gila pengakuan: ingin dianggap berjasa,",
     "ego pahlawan yang gila pengakuan—ingin dianggap berjasa,"),

    # Page 59
    ("Di sanalah rumah sejatimu bersemayam: damai, abadi,",
     "Di sanalah rumah sejatimu bersemayam—damai, abadi,"),

    # Page 60
    ("kembali menjadi manusia normal: bekerja jujur, menyayangi keluarga,",
     "kembali menjadi manusia normal—bekerja jujur, menyayangi keluarga,"),

    # Page 65
    ("seluruh pegangan hidupmu runtuh seketika: bisnis bangkrut, pasangan pergi",
     "seluruh pegangan hidupmu runtuh seketika—bisnis bangkrut, pasangan pergi"),

    # Page 66
    ("merasa dizalimi nasib: tangannya terangkat lunglai",
     "merasa dizalimi nasib. Tangannya terangkat lunglai"),

    # Page 67
    ("Banyak orang mengidap sindrom juru selamat: begitu melihat teman",
     "Banyak orang mengidap sindrom juru selamat. Begitu melihat teman"),

    # Page 68
    ("Kebaikan sejati bersinar seperti matahari: menyinari bumi tanpa",
     "Kebaikan sejati bersinar seperti matahari—menyinari bumi tanpa"),

    # Page 69
    ("banyak orang terjangkit mentalitas murahan: ingin kaya tanpa",
     "banyak orang terjangkit mentalitas murahan—ingin kaya tanpa"),
    ("bersiaplah membayar harganya: bayar dengan disiplin diri,",
     "bersiaplah membayar harganya. Bayar dengan disiplin diri,")
]

print(f"Total defined replacements: {len(REPLACEMENTS)}")
found_count = 0
not_found = []
for old_sub, new_sub in REPLACEMENTS:
    matched = False
    for p in bp:
        for para in p.get('paragraphs', []):
            if old_sub in para:
                matched = True
                break
        if not matched and old_sub in p.get('text', ''):
            matched = True
        if matched:
            break
    if matched:
        found_count += 1
    else:
        not_found.append(old_sub)

print(f"Matched replacements: {found_count}/{len(REPLACEMENTS)}")
if not_found:
    print(f"Not found: {not_found}")
