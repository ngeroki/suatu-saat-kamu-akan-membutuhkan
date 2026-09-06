import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Audit Dictionary from self-reflection-audit-final.md
AUDIT_REPLACEMENTS = {
    # BAB 01
    1: "Pernahkah kamu berada di tempat yang sama sekali baru, lalu tubuhmu lebih dulu merasa akrab sebelum kepalamu menemukan alasannya? Ingat kembali satu kejadian seperti itu dan rasakan apa yang muncul di dadamu.",
    2: "Ingat satu tempat yang belum pernah kamu datangi tetapi terasa anehnya akrab. Saat itu, apa yang lebih dulu bereaksi: pikiranmu, atau tubuhmu?",
    3: "Ketuk meja di dekatmu sekali. Rasakan kerasnya permukaan itu, lalu tanyakan pada dirimu sendiri: apa sebenarnya yang sedang bersentuhan ketika tanganmu bertemu benda yang terasa begitu padat?",
    4: "Pernahkah kamu masuk ke sebuah rumah, kamar, atau tempat lama lalu langsung merasa berat atau justru tenteram sebelum tahu ceritanya? Apa yang pertama kali kamu rasakan di tubuhmu saat itu?",
    5: "Sekarang coba perhatikan bagian paling bawah tulang belakangmu. Seberapa sering kamu benar-benar menyadari bagian tubuh yang setiap hari menopangmu tetapi hampir tak pernah kamu perhatikan?",
    6: "Pernahkah kamu menutupi rasa bersalah, takut, atau gelisah dengan senyum seolah semuanya baik-baik saja? Kalau kamu berdiri di depan cermin dan berhenti berpura-pura selama beberapa detik, apa yang sebenarnya terlihat di wajahmu?",
    7: "Saat air mengalir melewati tengkuk dan punggungmu, pernahkah kamu benar-benar memperhatikan sensasi yang muncul di sepanjang tulang belakang? Apa yang berubah ketika perhatianmu tidak lagi sibuk di kepala?",
    8: "Coba ingat lima belas menit terakhir sebelum tidurmu semalam. Apa yang benar-benar kamu berikan kepada tubuhmu: kegelapan dan keheningan, atau layar dan rangsangan baru?",
    9: "Perhatikan napasmu sekarang. Apakah ia pendek dan terburu-buru, atau cukup dalam untuk membuat tubuhmu terasa aman? Apa yang terjadi ketika kamu sengaja memperpanjang hembusannya?",
    10: "Saat menatap langit atau sesuatu yang jauh, pernahkah kamu berhenti dan mengalihkan perhatian kembali ke tubuhmu sendiri? Apa yang kamu rasakan ketika pencarian ke luar itu sebentar berhenti?",
    11: "Pernahkah kamu melakukan sesuatu yang baik lalu diam-diam berharap ada yang melihat? Kalau tidak seorang pun tahu bahwa kamu melakukannya, apakah kamu masih akan melakukannya dengan cara yang sama?",
    12: "Lihat posisi tubuhmu sekarang. Apakah punggungmu tegak atau sedang tenggelam ke depan? Coba luruskan perlahan, lalu perhatikan apakah napas dan suasana batinmu ikut berubah.",
    13: "Lampu sudah mati, tetapi apakah ponselmu masih menyala tadi malam? Ingat momen ketika tanganmu tahu harus meletakkan layar, tetapi tetap mencarinya sekali lagi.",
    14: "Ingat pertengkaran atau pesan yang pernah membuat rahangmu mengeras. Kalau kamu diberi tiga detik sebelum menjawab, apa yang mungkin berbeda dari balasanmu?",
    15: "Letakkan telapak tangan di dada sebentar. Sebelum membaca buku ini, berapa sering kamu benar-benar memperhatikan jantung yang terus bekerja tanpa pernah kamu minta?",

    # BAB 02
    16: "Saat meminta rezeki atau ketenangan, pernahkah kamu memperhatikan apakah di balik doa itu ada rasa percaya atau justru ketakutan yang terus bergetar? Mana yang lebih dominan di tubuhmu saat itu?",
    17: "Pernahkah kamu mengumpulkan buku, seminar, atau nasihat tentang perubahan tetapi tetap membawa rasa tidak aman yang sama ke tempat tidur? Apa yang sebenarnya belum berubah di dalam dirimu?",
    18: "Ketika hidupmu sedang remuk, apa yang paling kamu butuhkan saat itu: nasihat, atau tubuh yang diberi kesempatan untuk berhenti terbakar sebentar?",
    19: "Pernahkah kamu mengucapkan afirmasi yang terdengar bagus tetapi ada bagian dalam dirimu yang langsung menolak dan menertawakannya? Kalimat apa yang sebenarnya lebih jujur tentang keadaanmu saat itu?",
    20: "Ada satu bagian hidup yang selama ini kamu sebut 'takdir' padahal mungkin masih berada dalam wilayah pilihanmu. Apa yang sebenarnya masih bisa kamu kerjakan, tetapi terus kamu serahkan kepada nasib?",
    21: "Ingat lima belas menit sebelum tidurmu tadi malam. Apa yang menjadi suara terakhir yang masuk ke kepalamu sebelum kamu terlelap?",
    22: "Saat terakhir kali berada sendirian di kamar mandi, apakah kamu sanggup beberapa menit tanpa menyentuh ponsel? Kalau sunyi itu terasa tidak nyaman, apa yang sebenarnya sedang kamu hindari?",
    23: "Ingat satu kali ketika amarah membuatmu mengucapkan sesuatu yang kemudian kamu sesali. Kalau kalimat itu tidak pernah keluar dari mulutmu, apa yang mungkin berbeda setelahnya?",
    24: "Kalau setiap pagi kamu mendengar dirimu sendiri berkata, 'gue capek', 'gue sial', atau 'gue selalu gagal', bagaimana rasanya membawa kalimat itu sepanjang hari? Apa yang berubah ketika kamu memilih kata yang lebih jujur sekaligus lebih baik kepada dirimu?",
    25: "Waktu kecil, seberapa mudah kamu percaya pada sesuatu sebelum kepala dipenuhi pertanyaan dan keraguan? Apa yang berubah dalam dirimu ketika berharap sekarang?",
    26: "Pernahkah mulutmu sibuk mengulang doa sementara perhatianmu sibuk menghitung kapan selesai? Apa yang terjadi kalau satu kali saja kamu berhenti mengejar jumlah dan benar-benar hadir pada maknanya?",
    27: "Saat kesempatan atau rezeki datang, apakah pikiran pertamamu rasa syukur atau kecurigaan bahwa seseorang akan mengambilnya darimu? Perhatikan suara mana yang lebih cepat muncul.",
    28: "Begitu bangun tidur, apa yang pertama kali dicari tanganmu? Coba ingat bagaimana perasaanmu beberapa menit setelah melihat layar itu.",
    29: "Ingat satu kejadian ketika kamu hampir langsung membalas karena marah. Apa yang terjadi di tubuhmu dalam tiga detik sebelum tanganmu bergerak?",
    30: "Ketika sesuatu di luar dirimu berantakan, seberapa cepat kamu menyalahkan keadaan? Sebelum menyentuh 'layar' di luar itu, apa yang sedang terjadi di dalam dadamu sendiri?",

    # BAB 03
    31: "Saat kamu merasa mudah marah, cemas, atau gelisah, coba lihat tubuhmu sebelum langsung menyalahkan mentalmu. Bagaimana tidurmu, apa yang masuk ke tubuhmu, dan kapan terakhir kali kamu benar-benar istirahat?",
    32: "Bayangkan piring pecah di depanmu setelah hari yang melelahkan. Apakah benda yang jatuh itu benar-benar sebesar reaksi yang mungkin keluar darimu, atau tubuhmu memang sudah terlalu penuh sebelum kejadian itu?",
    33: "Pernahkah kamu tidak melakukan apa-apa seharian tetapi tetap merasa seperti habis berlari jauh? Apa yang sedang menguras tenagamu di dalam kepala pada hari itu?",
    34: "Perhatikan satu notifikasi atau urusan kecil yang biasanya langsung membuat bahu dan rahangmu menegang. Kapan terakhir kali tubuhmu merasa tidak sedang dikejar apa pun?",
    35: "Ketika badan terasa berat dan pikiran berkabut, apa yang sudah lama kamu tahan tanpa pernah benar-benar kamu lepaskan? Coba perhatikan hubungan antara beban yang kamu bawa dan cara tubuhmu terasa hari ini.",
    36: "Ingat dua jam terakhir yang habis untuk scrolling. Setelah semuanya selesai, apakah kamu merasa lebih penuh atau justru lebih kosong? Bandingkan dengan satu pekerjaan sederhana yang kamu kerjakan sampai tuntas.",
    37: "Apa kenyamanan yang paling sulit kamu tinggalkan? Ketika sedikit kesulitan datang, apakah kamu langsung goyah karena selama ini tubuhmu terlalu jarang dilatih untuk menanggung rasa tidak nyaman?",
    38: "Dari uang, rasa aman, makanan, atau hasrat, mana yang paling mudah menguasai pikiranmu ketika terganggu? Apa yang terjadi pada caramu berpikir ketika kebutuhan itu terasa terancam?",
    39: "Saat berbicara dengan orang yang dekat denganmu, kapan terakhir kali kamu benar-benar berkata jujur tanpa takut kehilangan penerimaan? Apa yang terasa berbeda di dada dan lehermu setelahnya?",
    40: "Pernahkah rasa curiga, iri, atau panik muncul begitu cepat sampai kamu mengira itulah suara nuranimu? Coba beri jarak sebentar dan lihat apakah suara itu memang mewakili dirimu sepenuhnya.",
    41: "Perhatikan pikiranmu selama beberapa menit. Berapa kali ia melompat dari satu hal ke hal lain tanpa kamu suruh? Kalau pikiran itu adalah tokoh yang sedang berlari di panggung, siapa yang sedang menyaksikannya?",
    42: "Kapan terakhir kali kamu memberi tubuhmu waktu tanpa layar, makanan berlebihan, dan kebisingan? Apa yang pertama kali muncul ketika rangsangan itu berhenti?",
    43: "Setelah seharian bekerja dan bertemu banyak orang, pernahkah tubuhmu terasa seperti masih membawa seluruh hari itu? Apa yang biasanya kamu lakukan untuk benar-benar merasa sudah selesai dan pulang?",
    44: "Saat panik datang, perhatikan dulu napasmu sebelum mencoba meyakinkan pikiranmu. Seberapa pendek ia sekarang, dan apa yang berubah ketika hembusanmu dibuat perlahan dan panjang?",
    45: "Kalau tubuhmu benar-benar adalah rumah tempat batinmu tinggal, bagian mana dari rumah itu yang paling sering kamu abaikan? Apa satu kebiasaan kecil yang bisa kamu rawat mulai hari ini?",

    # BAB 04
    46: "Pernahkah kamu duduk sendirian di tengah ramai orang dan tetap merasa terpisah? Coba rasakan napasmu saat itu dan ingat bahwa tubuhmu tetap berbagi udara yang sama dengan dunia di sekitarmu.",
    47: "Pernahkah seseorang yang sudah lama tidak kamu pikirkan tiba-tiba muncul di layar atau muncul dalam ingatanmu? Apa yang kamu rasakan sebelum buru-buru menyebutnya kebetulan?",
    48: "Pernahkah kamu merasa sesuatu sedang terjadi pada orang yang kamu cintai meski kamu jauh darinya? Ingat satu pengalaman nyata yang pernah membuatmu mempertanyakan batas antara jarak dan kedekatan.",
    49: "Pegang sedikit tanah, batu, atau benda alami di dekatmu. Pernahkah kamu benar-benar memikirkan bahwa bahan yang menyusun tubuhmu berasal dari sejarah alam yang jauh lebih tua daripada dirimu?",
    50: "Berapa banyak waktumu hari ini habis untuk hidup di kemarin atau besok? Coba berhenti sebentar dan rasakan kursi, lantai, napas, atau suara yang benar-benar ada di detik ini.",
    51: "Apa satu hal yang terus kamu tunda untuk dinikmati sampai kondisi ideal datang? Kalau rasa cukup tidak perlu menunggu keadaan sempurna, seperti apa rasanya menjalani hari ini tanpa menagih kebahagiaan dari masa depan?",
    52: "Perhatikan satu masalah yang sama. Ketika kamu melihatnya dalam keadaan curiga, bagaimana wajah dunia di sekitarmu berubah? Lalu lihat kembali saat dadamu lebih lapang.",
    53: "Pernahkah kamu duduk atau sujud sampai untuk beberapa saat nama, jabatan, dan cerita tentang dirimu terasa tidak penting? Apa yang tersisa ketika label-label itu tidak sedang kamu pegang?",
    54: "Setelah semua pencarian batin yang kamu baca di buku ini, bagaimana kamu memperlakukan orang yang kamu temui setiap hari? Apa yang berubah ketika spiritualitas dibawa pulang ke pasar, jalan, dan rumah?",
    55: "Kalau hidupmu memang seperti sebelas tembang perjalanan, di bagian mana kamu merasa sedang berada sekarang? Apa yang sedang kamu pelajari dari fase itu yang tidak bisa kamu lompat?",
    56: "Pegang cangkir atau minuman yang sedang kamu nikmati. Saat tubuhmu benar-benar berada di sana, apa aroma, suhu, dan rasa yang biasanya terlewat karena pikiranmu sudah pergi ke besok?",
    57: "Ingat satu kali kamu menolong seseorang. Kalau tidak ada yang tahu, tidak ada pujian, dan tidak ada ucapan terima kasih, apakah kamu tetap ingin melakukannya?",
    58: "Ketika keadaan membuatmu marah, apakah kamu lebih sibuk merusak 'layar' di luar atau memeriksa apa yang sedang terjadi di dalam dirimu? Coba bedakan keduanya pada satu masalah yang sedang kamu hadapi.",
    59: "Setelah semua teori dan cerita yang baru kamu lewati, bisakah kamu menatap sesuatu yang sederhana selama beberapa saat tanpa buru-buru memberi nama atau mencari makna? Apa yang muncul ketika pikiran tidak dipaksa bekerja?",
    60: "Setelah semua pencarian spiritual itu, ketika kamu melepas alas kaki dan masuk ke rumah, apakah kamu masih membawa kebutuhan untuk terlihat istimewa? Atau kamu bisa kembali menjadi manusia biasa di depan keluargamu?",

    # BAB 05
    61: "Pernahkah setelah membaca satu buku spiritual atau mengikuti retret kamu mulai merasa lebih tahu daripada orang di warung sebelah? Apa yang terjadi ketika kesadaranmu justru membuatmu makin sulit menikmati kehidupan biasa?",
    62: "Coba perhatikan caramu berbicara dengan orang yang menjual sayur, memperbaiki motor, atau bekerja untukmu. Apakah kamu bisa hadir tanpa merasa lebih tinggi karena apa yang kamu ketahui tentang spiritualitas?",
    63: "Ketika bersama pasangan, apakah tubuhmu benar-benar hadir atau pikiranmu masih sibuk di tempat lain? Apa arti keintiman bagimu ketika tidak lagi diperlakukan sekadar sebagai pelepasan sesaat?",
    64: "Pernahkah sebuah hubungan dari masa lalu masih terasa memengaruhi cara kamu mempercayai atau mencintai pasangan hari ini? Apa yang sebenarnya masih kamu bawa dari hubungan itu ketika kamu masuk ke rumah?",
    65: "Kalau kamu pernah berada di titik ketika pegangan hidupmu runtuh, apa yang paling terasa hilang saat itu? Dan ketika semuanya tidak lagi bisa kamu andalkan, apa yang ternyata masih tersisa di dalam dirimu?",
    66: "Ingat satu hal yang pernah kamu perjuangkan sampai batas kemampuanmu. Setelah semua ikhtiar benar-benar selesai, apakah kamu masih memaksa hasilnya, atau pernah merasakan saat ketika tanganmu akhirnya bisa terbuka?",
    67: "Ketika seseorang yang kamu sayangi terus mengulang masalah yang sama, apakah kamu membantu sesuai kemampuannya atau diam-diam ingin menjadi orang yang menyelesaikan semuanya? Apa yang sebenarnya kamu rasakan ketika dirimu tidak lagi dibutuhkan sebagai penyelamat?",
    68: "Saat menolong seseorang, perhatikan apa yang terjadi di dadamu. Apakah terasa ringan dan selesai setelah bantuan diberikan, atau muncul keinginan agar jasamu diingat dan dibalas?",
    69: "Ada sesuatu yang sangat kamu inginkan tetapi terus kamu tunda karena harga yang harus dibayar terasa mahal. Pengorbanan apa yang sebenarnya selama ini kamu tawar?",
    70: "Ingat satu hari ketika kamu pulang kerja membawa kemacetan, tekanan, atau konflik langsung masuk ke rumah. Apa yang berubah pada keluargamu ketika kamu tidak sempat meninggalkan semua itu di depan pintu?",
    71: "Pernahkah kamu sampai pada titik ketika semua strategi terasa buntu dan kamu hanya bisa bersujud? Apa yang terjadi di dalam dirimu ketika untuk beberapa saat kamu berhenti memaksa jawaban datang?",
    72: "Ingat seseorang yang pernah datang kepadamu dalam keadaan remuk. Apakah waktu itu kamu benar-benar mendengarkan, atau terlalu cepat ingin memberinya jawaban yang menurutmu paling benar?",
    73: "Kalau semua pengetahuan spiritualmu tidak terlihat oleh siapa pun, apa yang tersisa yang bisa dilihat dari cara kamu bekerja, berbicara, mencintai, dan bertanggung jawab?",
    74: "Sekarang lihat kembali kehidupan yang paling biasa di sekitarmu: rumah, pasangan, anak, secangkir kopi, pekerjaan, dan meja makan. Setelah perjalanan panjang ini, apa yang sekarang terasa berbeda ketika kamu menyentuh semua yang dulu kamu anggap biasa?"
}

PRESERVED_PAGES = {2, 3, 10, 14, 17}

# 2. Verify book-pages.json and portrait assets
book_pages = json.load(open(BASE_DIR / 'src' / 'data' / 'book-pages.json', encoding='utf-8'))
bp_map = {p['page_number']: p for p in book_pages}

print("=== RE-READING ASSETS & BOOK-PAGES ===")
for p_num in range(1, 75):
    bp = bp_map[p_num]
    slide_file = BASE_DIR / "public" / bp["image_path"].lstrip("/")
    if not slide_file.exists():
        raise FileNotFoundError(f"Missing slide asset: {slide_file}")
print("All 74 portrait slide assets exist and verified.")

# 3. Patch docs/visual-narratives/bab-0*.json
changed_pages = []
preserved_pages_reported = []

for chap_num in range(1, 6):
    json_path = BASE_DIR / 'docs' / 'visual-narratives' / f'bab-0{chap_num}.json'
    items = json.load(open(json_path, encoding='utf-8'))
    
    for item in items:
        p_num = item['page_number']
        if p_num in PRESERVED_PAGES:
            preserved_pages_reported.append(p_num)
            continue
            
        old_val = item.get('self_reflection_check')
        new_val = AUDIT_REPLACEMENTS.get(p_num)
        
        if new_val and new_val != old_val:
            item['self_reflection_check'] = new_val
            changed_pages.append(p_num)
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2, ensure_ascii=False)
    print(f"Patched {json_path.name}")

print("\n=== PATCH SUMMARY ===")
print(f"Total pages changed ({len(changed_pages)}): {changed_pages}")
print(f"Preserved pages ({len(preserved_pages_reported)}): {sorted(preserved_pages_reported)}")
