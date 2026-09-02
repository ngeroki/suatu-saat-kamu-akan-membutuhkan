/**
 * SUATU SAAT v2 — Tab Bar Component
 * 3 items at bottom: ☰ Daftar Isi | Aa Teks | ✦ Layer Penuh
 */

export class TabBar {
  private container: HTMLElement;
  private onTabCb?: (name: "toc" | "teks" | "layar") => void;

  constructor(parent: HTMLElement) {
    this.container = document.createElement("div");
    this.container.className = "tab-bar";
    this.container.innerHTML = `
      <div class="tab-item" data-action="toc">
        <span class="tab-icon">☰</span>
        <span>Daftar Isi</span>
      </div>
      <div class="tab-item" data-action="teks">
        <span class="tab-icon">Aa</span>
        <span>Teks</span>
      </div>
      <div class="tab-item" data-action="layar">
        <span class="tab-icon">✦</span>
        <span>Layer Penuh</span>
      </div>
    `;

    parent.appendChild(this.container);

    this.container.querySelectorAll(".tab-item").forEach(item => {
      item.addEventListener("click", () => {
        const action = item.getAttribute("data-action") as "toc" | "teks" | "layar";
        if (action) this.onTabCb?.(action);
      });
    });
  }

  public onTab(cb: (name: "toc" | "teks" | "layar") => void): void {
    this.onTabCb = cb;
  }
}
