import { LitElement, html, css } from "lit";
import { translate } from "lit-translate";

export class AppSwitch extends LitElement {
  static properties = {
    title: { type: String },
    view: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 0 1.25rem 0;
      background: #f8fafc;
      border-bottom: 1px solid #f1f5f9;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 400;
      color: #ff6a00;
    }
    .title-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .icon-btn {
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.12s ease, box-shadow 0.12s ease;
    }

    .icon-btn.active svg rect {
      stroke-width: 1.6;
      stroke: #ff6a00;
      fill: #ff6a00;
    }
  `;

  constructor() {
    super();
    this.view = "list";

    this._externalDispatch = window.__APP_STORE_DISPATCH || null;
  }

  render() {
    return html`
      <section class="page-header">
        <div class="page-title">${translate("employeeList")}</div>
        <div class="title-controls">
          <div
            role="button"
            tabindex="0"
            class="icon-btn ${this.view === "list" ? "active" : ""}"
            @click=${() => this._changeView("list")}
            @keydown=${(e) => this._onKeyDown(e, "list")}
            title="List view"
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                class="line"
                x="3"
                y="5"
                width="18"
                height="2"
                rx="1"
                fill="#ff6a00"
              />
              <rect
                class="line"
                x="3"
                y="11"
                width="18"
                height="2"
                rx="1"
                fill="#ff6a00"
              />
              <rect
                class="line"
                x="3"
                y="17"
                width="18"
                height="2"
                rx="1"
                fill="#ff6a00"
              />
            </svg>
          </div>

          <div
            role="button"
            tabindex="0"
            class="icon-btn ${this.view === "card" ? "active" : ""}"
            @click=${() => this._changeView("card")}
            @keydown=${(e) => this._onKeyDown(e, "card")}
            title="Card view"
          >

            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
              <rect
                x="10"
                y="3"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
              <rect
                x="17"
                y="3"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />

              <rect
                x="3"
                y="10"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
              <rect
                x="10"
                y="10"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
              <rect
                x="17"
                y="10"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />

              <rect
                x="3"
                y="17"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
              <rect
                x="10"
                y="17"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
              <rect
                x="17"
                y="17"
                width="4"
                height="4"
                rx="0.8"
                stroke="#ff6a00"
                stroke-width="1.2"
              />
            </svg>
          </div>
        </div>
      </section>
    `;
  }

  _changeView(view) {
    this.view = view;

    if (this._externalDispatch) {

      this._externalDispatch({ type: "ui/setView", payload: view });
    }

    this.dispatchEvent(
      new CustomEvent("view-change", {
        detail: { view },
        bubbles: true,
        composed: true,
      })
    );
  }

  _onKeyDown(e, view) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._changeView(view);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener("ui-view", (e) => {
      if (e && e.detail && e.detail.view) {
        this.view = e.detail.view;
      }
    });
  }
}

customElements.define("app-switch", AppSwitch);
