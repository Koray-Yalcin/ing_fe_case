import { LitElement, html, css } from "lit";
import { translate } from "lit-translate";

export class ConfirmModal extends LitElement {
  static properties = {
    open: { type: Boolean },
    title: { type: String },
    personName: { type: String },
    action: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(16, 32, 38, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1200;
    }
    .modal {
      position: relative;
      width: 520px;
      max-width: calc(100% - 40px);
      background: #fff;
      border-radius: 8px;
      padding: 1.5rem 1.5rem 2rem 1.5rem;
      box-shadow: 0 10px 30px rgba(2, 6, 23, 0.12);
    }
    .close-btn {
      position: absolute;
      top: 0px;
      right: 0px;
      width: 36px;
      height: 36px;
      background: transparent;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #ff6a00;
    }

    .title {
      font-size: 1.6rem;
      color: #ff6a00;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }
    .body {
      color: #475569;
      margin-bottom: 1.25rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .btn-proceed {
      flex: 0 0 auto;
      width: 100%;
      background: #ff6a00;
      color: white;
      padding: 0.9rem 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 700;
    }
    .btn-cancel {
      flex: 0 0 auto;
      width: 100%;
      background: transparent;
      color: #4b3f9b;
      padding: 0.9rem 1rem;
      border-radius: 8px;
      border: 2px solid rgba(75, 63, 155, 0.12);
      cursor: pointer;
      font-weight: 600;
    }
  `;

  constructor() {
    super();
    this.open = false;
    this.personName = "";
    this.action = "delete";
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div class="backdrop" @click=${this._onBackdropClick}>
        <div
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-label=${translate("areYouSure")}
          @click=${(e) => e.stopPropagation()}
        >
          <button
            class="close-btn"
            @click=${this._onCancel}
            aria-label="Close"
            title="Close"
            type="button"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div class="title">${translate("areYouSure")}</div>
          <div class="body">
            ${translate("selectedEmployeeRecordOf")} ${this.personName || ""}
            ${translate(
              this.action === "edit" ? "willBeEdited" : "willBeDeleted"
            )}
          </div>
          <div class="actions">
            <button class="btn-proceed" @click=${this._onConfirm}>
              ${translate("proceed")}
            </button>
            <button class="btn-cancel" @click=${this._onCancel}>
              ${translate("cancel")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  _onBackdropClick() {
    this.dispatchEvent(
      new CustomEvent("cancel", { bubbles: true, composed: true })
    );
  }

  _onConfirm() {
    this.dispatchEvent(
      new CustomEvent("confirm", { bubbles: true, composed: true })
    );
  }

  _onCancel() {
    this.dispatchEvent(
      new CustomEvent("cancel", { bubbles: true, composed: true })
    );
  }
}

customElements.define("confirm-modal", ConfirmModal);
