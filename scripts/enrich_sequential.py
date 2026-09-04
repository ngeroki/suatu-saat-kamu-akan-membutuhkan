# -*- coding: utf-8 -*-
"""
scripts/enrich_sequential.py
Canonical Sequential Enrichment Engine for SUATU SAAT Flipbook.
Authored by Antigravity [AG] Lead Architect.
"""

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

PAGES_FILE = r"src/data/book-pages.json"

MICRO_ARCS = {
    1: {
        (1, 4): {
            "role": "setup", "trans": "continues",
            "prev_visual": "Kabut fajar lereng Merapi Yogyakarta",
            "env": "Warkop underbridge Yogya malam hari, lampu temaram, aroma kopi tubruk",
            "mood": "Introspektif, hening mistis, percakapan malam"
        },
        (5, 9): {
            "role": "development", "trans": "deepens",
            "prev_visual": "Cangkir keramik kopi tubruk mengepul",
            "env": "Ruang minimalis gelap dengan aksen medan energi keemasan",
            "mood": "Reverent, sacred anatomy, ilmiah dan meditatif"
        },
        (10, 15): {
            "role": "synthesis", "trans": "resolves",
            "prev_visual": "Lengkungan medan torus keemasan",
            "env": "Sudut hening pelataran rumah Jawa di waktu fajar",
            "mood": "Damai, meditatif fajar, kepulangan raga"
        }
    },
    2: {
        (1, 5): {
            "role": "setup", "trans": "continues",
            "prev_visual": "Embun pagi pelataran Jawa",
            "env": "Bento Kopi Kaliurang saat senja, rintik hujan di kaca",
            "mood": "Hangat, reflektif, intim percakapan sahabat"
        },
        (6, 10): {
            "role": "insight", "trans": "deepens",
            "prev_visual": "Meja kayu Bento Kopi dengan cangkir kopi",
            "env": "Kedalaman air jernih dengan pendaran cahaya hipnagogik biru kehijauan",
            "mood": "Keheningan gelombang theta, tenang, ambang batas sadar"
        },
        (11, 15): {
            "role": "practice", "trans": "resolves",
            "prev_visual": "Permukaan air tenang beriak halus",
            "env": "Ruang kamar hening temaram, napas berirama sadar",
            "mood": "Fokus batin, afirmatif rasa, terbebas dari jeratan masa lalu"
        }
    },
    3: {
        (1, 5): {
            "role": "setup", "trans": "continues",
            "prev_visual": "Ruang hening kamar temaram",
            "env": "Kolong jembatan layang Yogya saat senja, aspal basah",
            "mood": "Raw industrial, tajam, refleksi tubuh nyata"
        },
        (6, 10): {
            "role": "insight", "trans": "deepens",
            "prev_visual": "Piring keramik pecah di lantai semen",
            "env": "Kebun herbal lereng gunung, flora tropis berembun fajar",
            "mood": "Vitalitas organik, dekonstruksi biologis, harmoni alam"
        },
        (11, 15): {
            "role": "practice", "trans": "resolves",
            "prev_visual": "Daun kelor segar bertabur embun",
            "env": "Tanah vulkanik Merapi yang subur, hamparan bebatuan alami",
            "mood": "Grounding kuat, pulihnya daya hidup raga, keheningan purba"
        }
    },
    4: {
        (1, 5): {
            "role": "setup", "trans": "continues",
            "prev_visual": "Bebatuan vulkanik Merapi berselimut kabut",
            "env": "Kedai kopi remang berdinding bata di bawah hamparan bintang malam",
            "mood": "Kosmik, misterius, hening perenungan semesta"
        },
        (6, 10): {
            "role": "insight", "trans": "deepens",
            "prev_visual": "Pendaran bintang menembus atap kedai kopi",
            "env": "Ruang hampa kosmik indigo pekat bertabur jalinan benang cahaya kuantum",
            "mood": "Keterhubungan agung, kesatuan wujud, melampaui ruang waktu"
        },
        (11, 14): {
            "role": "synthesis", "trans": "resolves",
            "prev_visual": "Spiral partikel kuantum yang bersinar",
            "env": "Cakrawala fajar keemasan yang menyatu dengan keheningan batin",
            "mood": "Suwung, manunggal ing rasa, ketenangan absolut"
        }
    },
    5: {
        (1, 5): {
            "role": "setup", "trans": "continues",
            "prev_visual": "Cakrawala fajar keemasan",
            "env": "Ruang keluarga bersahaja, meja makan kayu jati tua, secangkir teh melati hangat",
            "mood": "Membumi, hangat, normal, anti-spiritual bypass"
        },
        (6, 10): {
            "role": "insight", "trans": "deepens",
            "prev_visual": "Meja makan kayu dengan cangkir teh melati",
            "env": "Sudut beranda rumah saat senja keemasan berangin sepoi",
            "mood": "Welas asih, memeluk ketidaksempurnaan, penerimaan utuh"
        },
        (11, 15): {
            "role": "synthesis", "trans": "resolves",
            "prev_visual": "Siluet pepohonan senja di beranda",
            "env": "Ruang hening di dalam dada, titik nol kepulangan batin",
            "mood": "Berserah total, kepulangan sejati, damai tanpa syarat"
        }
    }
}

ADDITIONS = {
    1: "Buku ini membedah bagaimana raga biologis manusia sejatinya adalah generator frekuensi elektromagnetik. Di balik getaran deja vu yang kerap disederhanakan sebagai korsleting saraf, tersimpan jejak memori karma, sirkulasi cairan serebrospinal, dan kearifan olah napas leluhur Nusantara. Melalui pemahaman anatomi energi ini, kita diajak menyelami kembali rahasia agung yang selama ini tersimpan rapat di dalam keheningan tubuh sendiri.",
    3: "Atom dan molekul tubuh kita bergetar dalam tarian energi yang terus bertukar informasi dengan ruang di sekitarnya tanpa henti.",
    4: "Ketika getaran tempat itu berselaras dengan memori energik di dalam ragamu, batinmu mendadak tersentak mengenali suasana yang sebenarnya baru pertama kali kau lihat. Ruang fisik bukanlah benda mati yang bisu; ia adalah rekaman hidup yang senantiasa beresonansi dengan siapa pun yang memasukinya.",
    5: "Sebagai penyimpan memori epigenetik sistem saraf purba, tulang ekor merekam seluruh residu rasa bersalah dan trauma yang belum tuntas diuraikan oleh kesadaran. Menjaga kemurnian energi di area tulang ekor adalah fondasi utama bagi kesehatan fisik, kestabilan emosi, dan kejernihan batin manusia.",
    6: "Satu-satunya jalan memutus siklus ini adalah keberanian menatap luka batin tanpa penghakiman, sehingga frekuensi disonansi di dalam raga perlahan kembali selaras. Ketika rasa bersalah itu kau lepaskan dengan ikhlas, beban gravitasi karma di tulang ekor runtuh, membuka jalan bagi mengalirnya energi kehidupan baru.",
    7: "Cairan bening ini mengalir di sepanjang rongga tulang belakang menuju ventrikel otak, menghantarkan daya bioelektrik yang mengaktifkan persepsi spiritual tertinggi manusia. Kekuatan bioelektrik cairan ini bertindak layaknya kabel serat optik biologis yang menghubungkan getaran bumi dengan pancaran kesadaran semesta.",
    8: "Dalam hening dan kegelapan tanpa interupsi cahaya buatan, kelenjar pineal terstimulasi memproduksi melatonin murni yang meregenerasi kualitas cairan serebrospinal secara menyeluruh. Teknologi batin Pati Geni leluhur kita sejatinya adalah laku ilmiah untuk mengistirahatkan saraf optik demi memicu regenerasi seluler tingkat tinggi.",
    9: "Ketika cairan konduktif ini menyentuh mahkota kepala, tabir pemisah antara mikrokosmos raga dan makrokosmos semesta runtuh dalam keheningan yang tak terlukiskan kata. Pancaran frekuensi DMT alami ini menyapu bersih residu trauma di sistem saraf dan menyingkapkan kesadaran murni bahwa raga ini senantiasa dibimbing oleh keheningan Sang Pencipta.",
    10: "Semesta raya (Jagat Gedhe) dan alam raga manusia (Jagat Alit) bernapas dalam ritme yang sama. Mengenal kedalaman diri sendiri adalah pintu gerbang memahami seluruh hukum kosmik.",
    11: "Tiga sanepo agung ini bukan sekadar dongeng mistis, melainkan sandi sains biologis para leluhur untuk menjaga kemurnian energi hidup di tengah hiruk-pikuk dunia materi. Memahami sanepo Jawa menuntut ketajaman rasa, bukan sekadar hafalan akal, agar makna hakiki di balik lambang-lambang leluhur dapat hidup di dalam jiwa.",
    12: "Tegakkan tulang punggung, rilekskan otot bahu, dan biarkan oksigen mengalir lembut menenangkan sistem saraf simpatis yang seharian terbebani ketegangan. Lakukan pernapasan teratur ini setiap kali pikiranmu mulai terasa bising, hingga ketenangan batin yang sejati kembali menetap di dasar dadamu.",
    13: "Tutup gawai minimal satu jam sebelum beristirahat. Biarkan mata dan otakmu kembali menyatu dengan kegelapan alami malam demi memulihkan vitalitas seluler raga. Tidur dalam kegelapan pekat adalah hak biologis tubuhmu untuk menyembuhkan luka-luka mikroskopis sel yang timbul akibat paparan radiasi dan stres harian.",
    14: "Saat emosi amarah atau luka lama terpicu, ambil jeda beberapa tarikan napas sadar. Jangan bereaksi otomatis; putuskan rantai karma dengan kesadaran yang hadir penuh. Di antara stimulus dan respon selalu terbentang ruang kebebasanmu untuk memilih: terus terjebak dalam pusaran dendam atau melangkah bebas dalam kedamaian.",
    15: "Pencarian sejati tidak pernah menuntutmu berlari ke ujung dunia. Seluruh rahasia kesadaran dan kedamaian yang kau cari telah berdenyut tenang di dalam detak jantungmu sendiri. Heningkan ragamu, rasakan denyut napasmu, dan sadarilah bahwa engkau tidak pernah terpisah dari keagungan semesta yang memeliharamu setiap detik.",
    16: "Pikiran bawah sadar mengendalikan lebih dari sembilan puluh persen keputusan, reaksi emosional, dan takdir harian kita. Memprogram ulang nasib menuntut keberanian membongkar luka lama di ruang terdalam batin. Di bab kedua ini, kita akan membongkar mekanisme pikiran bawah sadar dan mempelajari teknik nyata meretas nasib lewat gelombang otak dan keheningan rasa.",
    27: "Doa yang paling cepat diijabah semesta bukanlah kata-kata di bibir, melainkan frekuensi getaran rasa yang berdenyut tulus di dasar dadamu.",
    30: "Nasib bukanlah vonis mati yang kaku; ia adalah pantulan frekuensi batin yang selalu bisa kau ubah kapan pun kau memilih untuk hening dan sadar.",
    31: "Tubuh fisik manusia adalah laboratorium biohacking paling canggih yang pernah diciptakan alam semesta. Sistem endokrin dan hormon kita merupakan jembatan langsung antara realitas material dan dimensi kesadaran spiritual. Memahami biokimiawi raga adalah kunci membebaskan diri dari kecemasan kronis, memulihkan kebugaran seluler, dan meniti jalan hidup yang lebih ringan serta berenergi.",
    32: "Reaksi spontan tubuh saat menghadapi tekanan fisik sesungguhnya mencerminkan seberapa jauh sistem saraf kita terkuras oleh kecemasan bawah sadar.",
    33: "Setiap notifikasi gawai dan distraksi digital tanpa sadar memicu lonjakan kortisol mikro yang menguras baterai vitalitas raga secara perlahan.",
    34: "Ketika tubuh terus-menerus dipaksa berada dalam mode bertahan hidup, kemampuan regenerasi sel dan penyembuhan alami akan terhenti total.",
    35: "Radikal bebas dan kelelahan mental yang menumpuk bertahun-tahun meracuni mitokondria, mempercepat penuaan dini dan meredupkan pancaran energi hidup. Pemulihan seluler dimulai dari keberanian mengurangi beban kerja organ pencernaan dan memberikan waktu istirahat yang cukup bagi tubuh untuk merestorasi dirinya.",
    37: "Leluhur kita memahami bahwa kenikmatan sejati lahir dari kemampuan menahan diri dan menunda kesenangan sesaat demi tercapainya kejernihan batin.",
    38: "Tujuh cakra kuno sesungguhnya adalah manifestasi energi dari tujuh kelenjar endokrin nyata yang mengatur keseimbangan kimiawi seluruh tubuh manusia.",
    39: "Kisah pewayangan kuno bukan sekadar legenda moral, melainkan peta anatomi persilangan saraf dan pertarungan kimiawi di dalam kepala kita sendiri.",
    40: "Mitos dan arketipe kuno adalah cermin psikologis dan biologis yang dirancang leluhur untuk membantu manusia memetakan perjalanan evolusi kesadarannya sendiri.",
    41: "Laku prihatin yang dijalani dengan kesadaran penuh akan membersihkan racun biologis sekaligus memperkuat daya tahan mental dalam menghadapi dinamika zaman.",
    42: "Garam laut alami dan daun kelor memiliki kandungan mineral bioelektrik tinggi yang membantu membuang muatan elektromagnetik statis berlebih dari tubuh.",
    43: "Jadikan protokol raga ini sebagai rutinitas harian yang membumi, bukan beban kewajiban yang kaku, agar tubuhmu selalu berada dalam frekuensi pemulihan prima.",
    46: "Fisika kuantum dan spiritualitas Nusantara bertemu pada satu muara: tiada sesuatu pun di jagat raya ini yang benar-benar terpisah. Kita semua terhubung dalam jaring-jaring kesadaran tunggal yang maha luas. Melalui pemahaman fisika kuantum dan keterhubungan semesta ini, kita belajar melepaskan ilusi keterpisahan dan kembali pulang ke pelukan keheningan sejati.",
    47: "Rasa kesepian yang kerap melanda manusia modern sesungguhnya hanyalah sinyal kerinduan jiwa untuk kembali menyadari kesatuannya dengan alam semesta.",
    48: "Dua partikel yang pernah bersatu akan terus saling memengaruhi seketika melintasi ruang dan waktu, persis seperti ikatan batin manusia yang melampaui jarak fisik.",
    49: "Besi di dalam darahmu dan kalsium di tulangmu berasal dari ledakan bintang purba miliaran tahun silam; kau adalah semesta yang sedang mengamati dirinya sendiri.",
    50: "Masa lalu hanyalah rekaman ingatan di otak dan masa depan hanyalah proyeksi harapan; satu-satunya kenyataan yang benar-benar ada adalah detik ini.",
    51: "Ketika getaran rasa syukurmu memancar mendahului kenyataan fisik, semesta merespons dengan meruntuhkan gelombang kemungkinan menjadi materi nyata di depan matamu. Kausalitas di alam kuantum tidak berjalan linear dari masa lalu ke masa depan, melainkan ditentukan oleh kualitas kehadiran batinmu saat ini.",
    52: "Ke mana pun perhatian dan emosimu terfokus secara konsisten, ke sanalah partikel realitas hidupmu akan memadat dan membentuk takdirmu.",
    53: "Menyadari kesatuan wujud menuntut keruntuhan tirai keakuan ego yang sempit, hingga yang tersisa hanyalah kepasrahan mutlak pada Sang Sumber Segala Wujud. Dalam ketunggalan wujud, tiada lagi jurang pemisah antara yang mengamati dan yang diamati; segala puji dan kemuliaan hanya milik Dia Sang Maha Tunggal.",
    55: "Setiap tembang macapat adalah tangga nada evolusi kesadaran manusia, menuntun jiwa bertualang dari alam kandungan raga kembali menuju titik Suwung. Setiap bait kidung pewayangan mengajarkan keberserahan jiwa meniti perjalanan hidup, hingga tiba saatnya manusia merestorasi hakikat dirinya menjadi manusia sejati.",
    56: "Berhenti menggenggam obsesi hasil secara berlebihan. Jalani peranmu sebaik mungkin di saat ini, dan biarkan kecerdasan semesta mengurus bagian yang tak terlihat. Ketenangan batin yang hakiki tidak bergantung pada situasi eksternal di sekelilingmu, melainkan pada ketetapan hatimu untuk tetap bersandar pada Sang Sumber Kehidupan.",
    57: "Kerentek batin yang tulus tanpa pamrih adalah kompas navigasi paling akurat yang dianugerahkan semesta untuk memandu setiap langkah hidupmu.",
    58: "Dunia di sekelilingmu adalah cermin sempurna bagi kondisi frekuensi batinmu. Bila kau menata keheningan di dalam, bayangan di luar akan berubah dengan sendirinya tanpa perlu kau paksa. Jangan habiskan energimu mencoba mengubah pantulan cermin; bersihkan debu di dalam hatimu, maka dunia luar akan memancarkan kedamaian yang sama.",
    59: "Di titik Suwung, semua pertanyaan lenyap dan semua kecemasan larut. Kau menyadari bahwa dirimu bukanlah entitas yang terasing, melainkan bagian tak terpisahkan dari napas semesta.",
    60: "Spiritualitas sejati bukanlah pelarian menuju kesucian semu atau jubah kemuliaan yang memisahkan diri dari sesama. Puncak tertinggi pencarian jiwa adalah kembali menjadi manusia normal yang hadir seutuhnya bagi kehidupan. Bab penutup ini mengajak kita mengikis ilusi ego spiritual dan merayakan keindahan hidup biasa dengan penuh rasa syukur, welas asih, dan penerimaan total.",
    61: "Kecentilan spiritual sering kali hanyalah topeng halus dari ego yang haus pengakuan, menyembunyikan ketidakmampuan memeluk luka batin dan realitas duniawi apa adanya. Kematangan jiwa yang sejati tercermin dari kerendahan hati untuk mendengarkan, melayani, dan hadir bagi sesama tanpa merasa diri lebih suci atau lebih tinggi.",
    62: "Makan saat lapar, tidur saat lelah, dan mencintai sesama tanpa syarat adalah praktik spiritual paling sakral yang membumikan pencerahan ke dalam tindakan nyata. Kembali menjadi manusia normal adalah pencapaian tertinggi, di mana kesadaran spiritual melebur alami ke dalam setiap tarikan napas dan langkah kaki sehari-hari.",
    63: "Energi seksual adalah daya cipta paling murni yang mengalir dalam tubuh manusia; menghormatinya dengan kesadaran penuh akan mentransmutasikan nafsu menjadi vitalitas spiritual. Penyatuan dua raga dalam cinta kasih tulus adalah gerbang pembuka energi sakral yang memurnikan jiwa dan memperdalam keintiman spiritual antarsesama.",
    64: "Hubungan intim tanpa kesadaran meninggalkan residu energi emosional di bawah sadar yang dapat mengaburkan kejernihan batin dan memperpanjang rantai ikatan karma. Penyucian energi seksual diawali dengan keberanian melepaskan kemelekatan pada nafsu sesaat dan mengembalikan seksualitas sebagai sarana ibadah kehidupan yang mulia.",
    65: "Malam gelap jiwa bukanlah kutukan, melainkan proses peleburan ego yang menghancurkan ilusi kendali diri agar cahaya hakiki kesadaran dapat merekah fajar baru. Ketika seluruh pegangan duniwamu runtuh, jangan berputus asa; di sanalah titik balik di mana rahmat dan pertolongan ilahi mulai bekerja secara nyata.",
    66: "Menyerah adalah keputusasaan ego yang kalah, sedangkan berserah adalah kesadaran agung bahwa ada tangan tak terlihat yang menopang seluruh semesta melampaui kalkulasi akalmu. Berserah total bukanlah tanda kelemahan, melainkan keberanian tertinggi manusia untuk melepaskan kendali ego dan mempercayakan hidupnya pada rancangan semesta.",
    67: "Kebutuhan kompulsif untuk menyelamatkan semua orang kerap berakar dari ketakutan menghadapi kekosongan diri sendiri. Cukup selamatkan dirimu terlebih dahulu melalui keheningan batin yang stabil. Tanggung jawab pertamamu adalah menjaga kedamaian di dalam dirimu sendiri; dari cawan batin yang melimpah ruah itulah welas asih sejati dapat mengalir ke sesama.",
    68: "Dengarkan getaran halus kerentek hatimu sebelum mengambil keputusan besar. Naluri murni batin selalu berbisik lebih dulu sebelum pikiran rasional mulai sibuk berhitung untung-rugi. Latihlah keheningan batin setiap pagi agar getaran halus kerentek hatimu tidak tertutup oleh riuhnya opini dan ekspektasi orang-orang di sekitarmu.",
    69: "Tidak ada transformasi batin yang cuma-cuma; setiap lonjakan kesadaran menuntut pengorbanan ego, kenyamanan semu, dan keteguhan menjalani laku prihatin hidup. Menghargai proses dan bersedia menanggung pengorbanan adalah tanda kedewasaan spiritual yang membedakan pencari kebenaran sejati dari penikmat ilusi instan.",
    70: "Bersihkan medan energimu setiap hari sebagaimana kau membersihkan raga fisikmu dari debu jalanan, agar cermin kesadaranmu selalu bening memantulkan kebenaran. Jadikan pembersihan energi harian ini sebagai laku alami yang menyegarkan jiwa, menjaga kepekaan batin, dan membentengi dirimu dari getaran negatif lingkungan.",
    72: "Welas asih sejati tidak melemahkan dirimu; ia adalah ketegasan batin yang memeluk sesama dengan empati mendalam tanpa membiarkan energimu tersedot oleh drama lingkungan. Welas asih yang bijak menuntut kebijaksanaan untuk membedakan kapan harus merangkul dengan kelembutan dan kapan harus menetapkan batas yang tegas demi kebaikan bersama.",
    73: "Seluruh risalah obrolan ini bermuara pada satu pemahaman sederhana: hidup tidak dirancang untuk dipahami dengan kecemasan, melainkan untuk dirayakan dengan keheningan rasa yang hadir. Pegang teguh intisari kesadaran ini di setiap hembusan napasmu, dan jadilah saksi yang tenang di tengah panggung drama dunia yang terus berputar.",
    74: "Kini perjalanan pencarian telah usai di tempat kau bermula. Pulanglah ke dalam dadamu, heningkan pikiranmu, dan rasakan kehadiran-Nya yang tak pernah meninggalkanmu sedetik pun. Di titik nol keheningan ini, engkau telah tiba di rumah sejati. Damai, hening, dan paripurna dalam rengkuhan kasih-Nya yang abadi selamanya."
}

def get_micro_arc(cid, pin):
    arcs = MICRO_ARCS.get(cid, {})
    for (start_p, end_p), data in arcs.items():
        if start_p <= pin <= end_p:
            return data
    return {"role": "insight", "trans": "continues", "prev_visual": "", "env": "Nusantara editorial", "mood": "Hening"}

def enrich_all_pages(dry_run=True):
    with open(PAGES_FILE, 'r', encoding='utf-8') as f:
        pages = json.load(f)
        
    enriched_pages = []
    
    for p in pages:
        num = p['page_number']
        cid = p['chapter_id']
        pin = p['page_in_chap']
        
        # Clone full existing dict to preserve 100% schema!
        new_p = dict(p)
        
        # Micro-arc continuity
        arc = get_micro_arc(cid, pin)
        new_p['narrative_role'] = arc['role']
        new_p['transition'] = arc['trans']
        
        # Visual continuity context update
        ctx = new_p.get('visual_continuity_context', {})
        if not isinstance(ctx, dict):
            ctx = {}
        ctx['prev_visual'] = arc['prev_visual']
        ctx['environment'] = arc['env']
        ctx['mood'] = arc['mood']
        if not ctx.get('current_subject'):
            ctx['current_subject'] = p.get('title', '')
        new_p['visual_continuity_context'] = ctx
        
        # Provenance audit trail
        new_p['provenance'] = {
            "source_chapter": cid,
            "source_section": f"Bab {cid} > {p.get('title', '')}",
            "source_paragraph_start": 1,
            "source_paragraph_end": len(p.get('paragraphs', [])) + (1 if num in ADDITIONS else 0)
        }
        
        # Specific Trims for P17 and P44 (>160w)
        if num == 17:
            paras = list(p['paragraphs'])
            paras[-1] = "Ketika terjadi pertarungan antara pikiran sadar dan rekaman emosional bawah sadar, bawah sadar selalu keluar sebagai pemenang mutlak."
            new_p['paragraphs'] = paras
        elif num == 44:
            new_p['paragraphs'] = [
                "Semua pengetahuan leluhur Nusantara dan sains kedokteran modern bertemu di satu titik temu yang sama: tubuh manusia adalah miniatur alam semesta yang maha sempurna.",
                "Tujuh cakra utama berpadu selaras dengan tujuh kelenjar endokrin raga. Cakra Dasar hingga Solar Plexus bertumpu pada kelenjar Gonad, Pankreas, dan Adrenal yang bertugas mengelola materi, gairah relasi, serta insting pertahanan hidup di alam material.",
                "Cakra Jantung dipandu kelenjar Timus sebagai jembatan welas asih, Cakra Tenggorokan pada Tiroid pengatur resonansi bobot sabda, serta cakra Ajna dan Mahkota pada Pineal dan Pituitari sebagai pembuka intuisi transendental dan kebijaksanaan sejati.",
                "Ketika manusia mampu menyelaraskan ketujuh kelenjar biologis ini melalui olah napas dan keheningan batin, spiritualitas bukan lagi angan-angan mistis yang mengawang-awang, melainkan pengalaman biologis yang nyata dan membumi."
            ]
        elif num in ADDITIONS:
            paras = list(p['paragraphs'])
            paras.append(ADDITIONS[num])
            new_p['paragraphs'] = paras
        else:
            new_p['paragraphs'] = list(p['paragraphs'])
            
        # Ensure sentence integrity: all paragraphs must end in valid punctuation
        valid_paras = []
        for para in new_p['paragraphs']:
            para_clean = para.strip()
            if para_clean and para_clean[-1] not in '.!?\"\'”':
                para_clean += '.'
            valid_paras.append(para_clean)
        new_p['paragraphs'] = valid_paras
        
        # Recompute word count and markdown text
        wc = sum(len(para.split()) for para in valid_paras)
        new_p['word_count'] = wc
        
        # Update text field
        badge = new_p.get('badge', '')
        title = new_p.get('title', '')
        subtitle = new_p.get('subtitle', '')
        takeaway = new_p.get('keyTakeaway', '')
        
        text_blocks = []
        if badge: text_blocks.append(f"> **{badge}**")
        if title: text_blocks.append(f"# {title}")
        if subtitle: text_blocks.append(f"*{subtitle}*")
        for para in valid_paras:
            text_blocks.append(para)
        if takeaway:
            text_blocks.append(f"> **Intisari Kesadaran:** {takeaway}")
        new_p['text'] = "\n\n".join(text_blocks)
        
        enriched_pages.append(new_p)
        
    # Analysis & Verification
    wcs = [p['word_count'] for p in enriched_pages]
    avg_wc = sum(wcs) / len(wcs)
    min_wc = min(wcs)
    max_wc = max(wcs)
    in_target = sum(1 for w in wcs if 120 <= w <= 150)
    natural_endings = sum(1 for w in wcs if 95 <= w < 120)
    over_160 = sum(1 for w in wcs if w > 160)
    
    print("==================================================")
    print("ENRICHMENT SEQUENTIAL ANALYSIS & QUALITY REPORT")
    print("==================================================")
    print(f"Total Pages: {len(enriched_pages)} (Expected: 74)")
    print(f"Word Count Range: {min_wc} .. {max_wc} words")
    print(f"Average Word Count: {avg_wc:.1f} words/page (Total: {sum(wcs):,} words)")
    print(f"Pages in Target Window [120-150]: {in_target} / 74 ({in_target/74*100:.1f}%)")
    print(f"Pages in Natural Ending [95-119]: {natural_endings} / 74")
    print(f"Hard Warnings (>160 words): {over_160}")
    
    # Assertions
    assert len(enriched_pages) == 74, f"Mismatch page count: {len(enriched_pages)}"
    assert over_160 == 0, f"Pages over 160 detected: {over_160}"
    assert min_wc >= 115, f"Page below 115 words: {min_wc}"
    assert max_wc <= 155, f"Page above 155 words: {max_wc}"
    
    for p in enriched_pages:
        assert p.get('chapter_id') in [1, 2, 3, 4, 5], f"Missing chapter_id on page {p['page_number']}"
        assert p.get('page_in_chap') >= 1, f"Missing page_in_chap on page {p['page_number']}"
        assert 'previous_page' in p, f"Missing previous_page on page {p['page_number']}"
        assert 'next_page' in p, f"Missing next_page on page {p['page_number']}"
        assert 'provenance' in p, f"Missing provenance on page {p['page_number']}"
        assert 'narrative_role' in p, f"Missing narrative_role on page {p['page_number']}"
        assert 'transition' in p, f"Missing transition on page {p['page_number']}"
        for para in p['paragraphs']:
            assert para[-1] in '.!?\"\'”', f"Broken sentence ending on page {p['page_number']}: {para}"
            assert '```' not in para, f"Code block leak on page {p['page_number']}"
            assert not any(c in para for c in ['┌', '│', '─', '└']), f"ASCII leak on page {p['page_number']}"

    print("ALL 74 PAGES VERIFIED: ZERO BROKEN SENTENCES, ZERO MISSING KEYS, 100% CLEAN!")
    
    if not dry_run:
        with open(PAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(enriched_pages, f, ensure_ascii=False, indent=2)
        print(f"SUCCESS: Enriched canonical dataset written to {PAGES_FILE}!")
    else:
        print("DRY RUN: Validation passed! Run with --write to commit to disk.")

if __name__ == "__main__":
    dry = "--write" not in sys.argv
    enrich_all_pages(dry_run=dry)
