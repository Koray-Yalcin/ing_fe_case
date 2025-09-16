import { LitElement, html, css } from "lit";
import { translate } from "lit-translate";

export class EmployeeTable extends LitElement {
  static properties = {
    rows: { type: Array },
  };

  static styles = css`
    :host {
      display: block;
    }
    .table-wrap {
      overflow-x: auto;
    }
    table {
      width: 100%;
      background: white;
      border-collapse: collapse;
      font-size: 0.95rem;
    }
    thead {
      background: #fff;
    }
    th,
    td {

      text-align: center;
      vertical-align: middle;
      padding: 0.9rem 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      white-space: nowrap;
    }
    th {
      font-weight: 700;
      color: #ff6a00; /* header text orange */
      font-size: 0.8rem;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: center; /* center action buttons */
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: white;
      border: 1px solid #fff;
      cursor: pointer;
      padding: 0;
    }

    .action-icon {
      width: 16px;
      height: 16px;
      display: block;
    }

    .checkbox {
      width: 18px;
      height: 18px;
      display: inline-block;
    }
  `;

  constructor() {
    super();
    this.rows = [];
    this._unsubscribe = null;
  }

  connectedCallback() {
    super.connectedCallback();

  }

  disconnectedCallback() {
    if (this._unsubscribe) this._unsubscribe();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="table-wrap">
        <table role="table" aria-label="Employee list">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  class="checkbox"
                  aria-label="Select all"
                />
              </th>
              <th>${translate("firstName")}</th>
              <th>${translate("lastName")}</th>
              <th>${translate("dateOfEmployment")}</th>
              <th>${translate("dateOfBirth")}</th>
              <th>${translate("phone")}</th>
              <th>${translate("email")}</th>
              <th>${translate("department")}</th>
              <th>${translate("position")}</th>
              <th>${translate("actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.length === 0
              ? html`<tr>
                  <td
                    colspan="10"
                    style="padding:2rem;text-align:center;color:#94a3b8"
                  >
                    ${translate("noData")}
                  </td>
                </tr>`
              : this.rows.map(
                  (r) => html`<tr>
                    <td><input type="checkbox" class="checkbox" /></td>
                    <td>${r.firstName}</td>
                    <td>${r.lastName}</td>
                    <td>${r.employment_date}</td>
                    <td>${r.birth_date}</td>
                    <td>${r.phone}</td>
                    <td>${r.email}</td>
                    <td>${r.department}</td>
                    <td>${r.position}</td>
                    <td class="actions">
                      <button
                        class="action-btn"
                        title="Edit"
                        @click=${() => this._onEdit(r)}
                        aria-label="Edit"
                      >
                        <?xml version="1.0"?>
                        <svg
                          class="feather feather-edit"
                          fill="none"
                          height="20"
                          stroke="#ff6a00"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.4"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          />
                          <path
                            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            fill="#ff6a00"
                          />
                        </svg>
                      </button>

                      <button
                        class="action-btn"
                        title="Delete"
                        @click=${() => this._onDelete(r)}
                        aria-label="Delete"
                      >
                        <?xml version="1.0"?>
                        <svg
                          class="feather feather-trash-2"
                          fill="none"
                          height="20"
                          stroke="#ff6a00"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.4"
                          viewBox="0 0 24 24"
                          width="24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                          />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    </td>
                  </tr>`
                )}
          </tbody>
        </table>
      </div>
    `;
  }

  _onEdit(row) {
    this.dispatchEvent(
      new CustomEvent("edit-row", {
        detail: { row },
        bubbles: true,
        composed: true,
      })
    );
  }

  _onDelete(row) {
    this.dispatchEvent(
      new CustomEvent("delete-row", {
        detail: { row },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("employee-table", EmployeeTable);
