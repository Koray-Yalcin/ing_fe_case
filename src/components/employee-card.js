import { LitElement, html, css } from "lit";
import { translate } from "lit-translate";

export class EmployeeCard extends LitElement {
  static properties = {
    row: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
    }
    .card {
      background: white;

      padding: 1rem; /* reduced padding */
      box-shadow: 0 6px 18px rgba(16, 32, 38, 0.06); /* stronger shadow */
      border: 1px solid #eef2f6;
      box-sizing: border-box;
      transition: transform 150ms ease, box-shadow 150ms ease;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.2rem 1.2rem; /* increased vertical gap */
      align-items: start;
    }
    .label {
      font-size: 0.78rem; /* a bit smaller */
      color: #9aa6b2;
      margin-bottom: 0.4rem; /* increased spacing under label */
    }
    .value {
      font-size: 1rem; /* slightly smaller */
      color: #102026;
      font-weight: 600;
    }
    .row-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.6rem; /* more space between buttons */
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.9rem;
    }
    .btn-edit {
      background: #4b3f9b; /* purple */
      color: white;
    }
    .btn-delete {
      background: #ff6a00; /* orange */
      color: white;
    }
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  constructor() {
    super();
    this.row = null;
  }

  render() {
    if (!this.row) {
      return html`<div class="card">No data</div>`;
    }

    return html`
      <div class="card">
        <div class="grid">
          <div>
            <div class="label">${translate("firstName")}</div>
            <div class="value">${this.row.firstName}</div>
          </div>

          <div>
            <div class="label">${translate("lastName")}</div>
            <div class="value">${this.row.lastName}</div>
          </div>

          <div>
            <div class="label">${translate("dateOfEmployment")}</div>
            <div class="value">${this.row.employment_date}</div>
          </div>

          <div>
            <div class="label">${translate("dateOfBirth")}</div>
            <div class="value">${this.row.birth_date}</div>
          </div>

          <div>
            <div class="label">${translate("phone")}</div>
            <div class="value">${this._formatPhone(this.row.phone)}</div>
          </div>

          <div>
            <div class="label">${translate("email")}</div>
            <div class="value">${this.row.email}</div>
          </div>

          <div>
            <div class="label">${translate("department")}</div>
            <div class="value">${this.row.department}</div>
          </div>

          <div>
            <div class="label">${translate("position")}</div>
            <div class="value">${this.row.position}</div>
          </div>
        </div>

        <div class="row-actions">
          <button class="btn btn-edit" @click=${this._onEdit}>

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21h3.75L18.81 8.94a1.5 1.5 0 000-2.12L17.18 5.2a1.5 1.5 0 00-2.12 0L4.5 15.76V19.5A1.5 1.5 0 006 21H3z"
                fill="white"
                opacity="0.12"
              />
              <path
                d="M3 21h3.75L18.81 8.94a1.5 1.5 0 000-2.12L17.18 5.2a1.5 1.5 0 00-2.12 0L4.5 15.76V19.5A1.5 1.5 0 006 21H3z"
                stroke="white"
                stroke-width="1.1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            ${translate("edit")}
          </button>

          <button class="btn btn-delete" @click=${this._onDelete}>

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h18"
                stroke="white"
                stroke-width="1.1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6"
                stroke="white"
                stroke-width="1.1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 11v6M14 11v6"
                stroke="white"
                stroke-width="1.1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            ${translate("delete")}
          </button>
        </div>
      </div>
    `;
  }

  _formatPhone(phone) {
    if (!phone) return "";

    if (phone.includes("(")) return phone;

    const digits = phone.replace(/\D/g, "");

    let p = digits;
    if (p.length === 11 && p.startsWith("90")) {
      p = p.slice(2);
    } else if (p.length === 12 && p.startsWith("90")) {
      p = p.slice(2);
    }

    if (p.length >= 10) {
      const g1 = p.slice(0, 3);
      const g2 = p.slice(3, 6);
      const g3 = p.slice(6, 8);
      const g4 = p.slice(8, 10);
      return `+(90) ${g1} ${g2} ${g3} ${g4}`;
    }
    return phone;
  }

  _onEdit() {
    this.dispatchEvent(
      new CustomEvent("edit-row", {
        detail: { row: this.row },
        bubbles: true,
        composed: true,
      })
    );
  }

  _onDelete() {
    this.dispatchEvent(
      new CustomEvent("delete-row", {
        detail: { row: this.row },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("employee-card", EmployeeCard);
