/**
 * <palette-generator> — generate a tints+shades colour palette from a base colour.
 * Click a swatch to copy its hex. Zero dependencies.
 * Built & maintained by SGBP — Singapore Build Partners (https://sgbp.tech). MIT.
 */
class PaletteGenerator extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this.base = "#EB0028"; }
  connectedCallback() { this.render(); }
  _toHsl(hex) {
    let h = hex.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    let r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let hh = 0, s = 0, l = (max + min) / 2;
    if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      hh = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4; hh /= 6; }
    return [hh * 360, s * 100, l * 100];
  }
  _toHex(h, s, l) {
    s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const c = (n) => Math.round(255 * f(n)).toString(16).padStart(2, "0");
    return "#" + c(0) + c(8) + c(4);
  }
  _palette() {
    const [h, s, l] = this._toHsl(this.base);
    return [Math.min(92, l + 32), Math.min(80, l + 16), l, Math.max(20, l - 16), Math.max(8, l - 32)]
      .map((L) => this._toHex(h, s, L));
  }
  render() {
    const swatches = this._palette();
    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:border-box}
        :host{display:block;width:100%;max-width:520px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        .card{border:1px solid #e2e2e2;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px}
        .row{display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap}
        label{font-size:12px;font-weight:600;color:#555}
        input[type=color]{width:42px;height:34px;border:1px solid #ccc;border-radius:6px;padding:0;cursor:pointer;flex:0 0 auto}
        input[type=color]::-webkit-color-swatch-wrapper{padding:0}input[type=color]::-webkit-color-swatch{border:none;border-radius:5px}
        input[type=text]{flex:1 1 auto;min-width:0;width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;font:inherit;font-size:16px;text-transform:lowercase}
        button.rnd{font:inherit;font-size:13px;font-weight:600;border:1px solid #ccc;background:#fff;border-radius:8px;padding:8px 14px;cursor:pointer}
        .pal{display:flex;border-radius:10px;overflow:hidden;border:1px solid #eee}
        .sw{flex:1;height:96px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;cursor:pointer;font-size:11px;font-weight:700;font-family:ui-monospace,monospace}
        .hint{font-size:11px;color:#888;margin-top:8px;text-align:center}
      </style>
      <div class="card">
        <div class="row">
          <label>Base</label>
          <input type="color" id="c" value="${this.base}">
          <input type="text" id="t" value="${this.base}" maxlength="7">
          <button class="rnd" id="rnd">Random</button>
          <button class="rnd" id="reset">Reset</button>
        </div>
        <div class="pal">${swatches.map((c) => {
          const dark = parseInt(c.slice(1), 16) < 0x888888;
          return `<div class="sw" data-c="${c}" style="background:${c};color:${dark ? "#fff" : "#111"}">${c}</div>`;
        }).join("")}</div>
        <p class="hint">Click any swatch to copy its hex.</p>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    const set = (v) => { if (/^#?[0-9a-fA-F]{3,6}$/.test(v)) { this.base = v.startsWith("#") ? v : "#" + v; this.render(); } };
    $("#c").addEventListener("input", (e) => set(e.target.value));
    $("#t").addEventListener("change", (e) => set(e.target.value));
    $("#rnd").addEventListener("click", () => { this.base = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"); this.render(); });
    $("#reset").addEventListener("click", () => { this.base = "#EB0028"; this.render(); });
    this.shadowRoot.querySelectorAll(".sw").forEach((s) => s.addEventListener("click", () => {
      navigator.clipboard && navigator.clipboard.writeText(s.dataset.c);
      const o = s.textContent; s.textContent = "Copied"; setTimeout(() => { s.textContent = o; }, 900);
    }));
  }
}
if (!customElements.get("palette-generator")) customElements.define("palette-generator", PaletteGenerator);
