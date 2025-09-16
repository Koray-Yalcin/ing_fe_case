import { LitElement, html, css } from "lit";
import store from "../store/index.js";
import { setLang } from "../store/langSlice.js";
import { use, translate } from "lit-translate";
import "../i18n.js";

export class AppHeader extends LitElement {
  static properties = {
    lang: { type: String },
    currentPath: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      background: white;
      box-sizing: border-box;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .logo {
      width: 40px;
      height: 28px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .product {
      font-weight: 400;
      font-size: 14px;
      color: #000;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header-actions a {
      color: #ef5a23;
      text-decoration: none;
      font-weight: 300;
      font-size: 0.9rem;
    }

    .nav-employees {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      color: #ef5a23;
      text-decoration: none;
      font-weight: 300;
      font-size: 0.9rem;
    }
    .nav-employees svg {
      width: 20px;
      height: 20px;
      display: block;
      flex-shrink: 0;
    }
    .nav-employees span {
      line-height: 1;
    }

    .nav-employees.active,
    .btn-add.active {
      font-weight: 700;
    }

    .btn-add {
      color: #ef5a23;
      padding: 0.45rem 0.75rem;
    }
    .lang-flag {
      width: 36px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #ff6a00;
      font-size: 12px;
      font-weight: 700;
      position: relative;
      cursor: pointer;
      overflow: visible;
    }
    .lang-flag img {
      width: 20px;
      height: 14px;
      object-fit: cover;
      border-radius: 2px;
    }

    .lang-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border: 1px solid #eef2f6;
      box-shadow: 0 8px 20px rgba(16, 32, 38, 0.06);
      border-radius: 6px;
      min-width: 120px;
      padding: 0.5rem 0;
      display: none;
      z-index: 30;
    }
    .lang-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.75rem;
      cursor: pointer;
      font-weight: 600;
      color: #102026;
    }
    .lang-item:hover {
      background: #f8fafc;
    }

    .lang-flag.open .lang-dropdown {
      display: block;
    }

    @media (max-width: 640px) {
      .app-header {
        padding: 0.5rem;
      }
      .product {
        display: none;
      }
    }
  `;

  constructor() {
    super();
    this.lang = store.getState().lang.lang || "EN"; // default from redux
    this.currentPath = "/";
    this._translations = { EN: {}, TR: {} };
  }

  connectedCallback() {
    super.connectedCallback();

    const langCode =
      (store &&
        store.getState &&
        store.getState().lang &&
        store.getState().lang.lang) ||
      this.lang ||
      "EN";
    use(langCode.toLowerCase()).catch(() => {});
    this._onPopState = () => {
      this.currentPath = window.location.pathname || "/";
    };

    this.currentPath = window.location.pathname || "/";
    window.addEventListener("popstate", this._onPopState);

    this._unsubscribeLang = store.subscribe(() => {
      const s = store.getState();
      if (s && s.lang && s.lang.lang && s.lang.lang !== this.lang) {
        this.lang = s.lang.lang;
        this.requestUpdate();
      }
    });

    this._onDocClick = (ev) => {
      const lf = this.shadowRoot && this.shadowRoot.querySelector(".lang-flag");
      if (!lf) return;
      const path = ev.composedPath ? ev.composedPath() : [];
      if (!path.includes(lf)) {
        lf.classList.remove("open");
      }
    };
    document.addEventListener("click", this._onDocClick);
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this._onPopState);
    if (this._unsubscribeLang) this._unsubscribeLang();
    document.removeEventListener("click", this._onDocClick);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <header class="app-header" role="banner">
        <div class="brand">
          <div class="logo" aria-hidden="true">
            <img src="/public/ing_logo.png" alt="ING" />
          </div>
          <div>
            <div class="product">ING</div>
          </div>
        </div>

        <nav class="header-actions" aria-label="Main actions">
          <a
            href="/"
            class="nav-employees ${this.currentPath === "/" ||
            this.currentPath === "/employee"
              ? "active"
              : ""}"
            aria-label="Employees"
          >
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                fill="#ef5a23"
              />
              <path
                d="M4 20v-1c0-2.76 2.24-5 5-5h6c2.76 0 5 2.24 5 5v1H4z"
                fill="#ef5a23"
              />
            </svg>
            <span>${translate("employees")}</span>
          </a>
          <a
            href="/new"
            class="btn-add ${this.currentPath === "/new" ||
            this.currentPath === "/employee/new"
              ? "active"
              : ""}"
            role="button"
            >${translate("addNew")}</a
          >

          <div class="lang-flag" @click=${this._toggleLang} title="Language">
            <img src="/public/united-states.png" alt="EN" />

            <div class="lang-dropdown">
              <div class="lang-item" @click=${() => this._setLang("EN")}>
                <img src="/public/united-states.png" alt="EN" /> EN
              </div>
              <div class="lang-item" @click=${() => this._setLang("TR")}>
                <img src="/public/turkey.png" alt="TR" /> TR
              </div>
            </div>
          </div>
        </nav>
      </header>
    `;
  }

  _toggleLang(e) {

    e.stopPropagation();
    const lf = this.shadowRoot.querySelector(".lang-flag");
    if (!lf) return;
    lf.classList.toggle("open");
  }

  _setLang(code) {

    store.dispatch(setLang(code));

    const img = this.shadowRoot.querySelector(".lang-flag img");
    if (img)
      img.src =
        code === "TR" ? "/public/turkey.png" : "/public/united-states.png";

    const lf = this.shadowRoot.querySelector(".lang-flag");
    if (lf) lf.classList.remove("open");
    this.lang = code;

    use(code.toLowerCase()).catch(() => {});
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent("lang-change", {
        detail: { lang: code },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("app-header", AppHeader);
