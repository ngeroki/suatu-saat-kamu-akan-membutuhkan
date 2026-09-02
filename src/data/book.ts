/**
 * SUATU SAAT v2 — Canonical Book Data Layer
 * Backed by 389 mathematically verified unabridged pages from R:\flip-book\naskah-buku
 */
import pagesData from "./book-pages.json";

export interface VisualContinuityContext {
  prev_visual: string;
  current_subject: string;
  environment: string;
  mood: string;
}

export interface Page {
  start_char: number;
  end_char: number;
  text: string;
  word_count: number;
  chapter_id: number;
  chapter_code: string;
  chapter_name: string;
  subchapter_name: string;
  page_in_chap: number;
  total_in_chap: number;
  page_number: number;
  previous_page: number | null;
  next_page: number | null;
  illustration_prompt: string;
  illustration_description: string;
  visual_continuity_context: VisualContinuityContext;
  image_path: string;
}

export interface ChapterMeta {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  tags: string[];
  image: string;
  pageStart: number;
  pageCount: number;
}

export const PAGES: Page[] = pagesData as Page[];

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 0,
    code: "PROLOG",
    title: "Prolog: Kata Pengantar",
    subtitle: "Obrolan di Pinggir Jalan, Bukan di Atas Panggung",
    tags: ["Obrolan Pinggir Jalan", "Rahwana Consciousness", "Kopi Tubruk"],
    image: "assets/hero_bg.jpg",
    pageStart: 1,
    pageCount: 18,
  },
  {
    id: 1,
    code: "BAB 01",
    title: "Anatomi Tubuh Energi\n& Memori Karma",
    subtitle: "Medan Torus, Black Box Tulang Ekor & Kosmologi Kesadaran",
    tags: ["Medan Torus", "Memori Karma", "Cairan CSF"],
    image: "assets/bab_01_torus.jpg",
    pageStart: 19,
    pageCount: 41,
  },
  {
    id: 2,
    code: "BAB 02",
    title: "Meretas Pikiran\nBawah Sadar\n& Reprogramming Nasib",
    subtitle: "Zona Theta, Critical Faculty & Jeda 3 Detik",
    tags: ["Zona Theta", "Critical Faculty", "Jeda 3 Detik"],
    image: "assets/bab_02_theta.jpg",
    pageStart: 60,
    pageCount: 76,
  },
  {
    id: 3,
    code: "BAB 03",
    title: "Sistem Hormon,\nBiohacking Leluhur",
    subtitle: "Dopamin, Ritme Sirkadian & Puasa Weton",
    tags: ["Dopamin", "Ritme Sirkadian", "Puasa Weton"],
    image: "assets/bab_03_biohack.jpg",
    pageStart: 136,
    pageCount: 94,
  },
  {
    id: 4,
    code: "BAB 04",
    title: "Fisika Kuantum,\nRelativitas &\nKeterhubungan",
    subtitle: "Quantum Entanglement & Titik Nol (Suwung)",
    tags: ["Keterhubungan", "Relativitas", "Titik Nol"],
    image: "assets/bab_04_kuantum.jpg",
    pageStart: 230,
    pageCount: 76,
  },
  {
    id: 5,
    code: "BAB 05",
    title: "Menjadi Manusia\nNormal & Seni\nBerserah",
    subtitle: "Anti Spiritual Bypass & Ketenangan Batin",
    tags: ["Anti Spiritual Bypass", "Dunia Fisik", "Titik Nol"],
    image: "assets/bab_05_berserah.jpg",
    pageStart: 306,
    pageCount: 64,
  },
  {
    id: 6,
    code: "EPILOG",
    title: "Epilog: Catatan Penutup",
    subtitle: "Menjadi Manusia yang Utuh — Aldi",
    tags: ["Catatan Penutup", "Pulang ke Diri", "Hening"],
    image: "assets/closing_landscape.jpg",
    pageStart: 370,
    pageCount: 20,
  }
];

export function getChapter(id: number): ChapterMeta {
  return CHAPTERS.find(c => c.id === id) || CHAPTERS[0];
}

export function getPageByGlobal(globalPage: number): Page {
  const found = PAGES.find(p => p.page_number === globalPage);
  return found || PAGES[0];
}

export function getPage(chapId: number, pageInChap: number): Page {
  const found = PAGES.find(p => p.chapter_id === chapId && p.page_in_chap === pageInChap);
  if (found) return found;
  const closest = PAGES.find(p => p.chapter_id === chapId);
  return closest || PAGES[0];
}
