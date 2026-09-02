declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, options: any);
    loadFromHtml(items: NodeListOf<Element> | HTMLElement[]): void;
    loadFromImages(images: string[]): void;
    flip(pageIndex: number, corner?: string): void;
    flipNext(corner?: string): void;
    flipPrev(corner?: string): void;
    destroy(): void;
    on(event: string, callback: (e: any) => void): void;
    off(event: string, callback: (e: any) => void): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    turnToPage(pageIndex: number): void;
  }
}
