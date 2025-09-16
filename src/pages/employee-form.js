import { LitElement, html, css } from "lit";
import "../components/app-header.js";
import { translate } from "lit-translate";
import "../components/confirm-modal.js";

export class EmployeeForm extends LitElement {
  static properties = {
    id: { type: String },
    mode: { type: String },
    model: { type: Object },
    _errors: { type: Object },
    _confirmOpen: { type: Boolean },
    _pendingToStore: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
    }
    .container {
      margin: 1.5rem auto;
      padding: 1rem 1.5rem 3rem 1.5rem;
    }
    .card {
      background: white;
      padding: 2.25rem 2.5rem;
      border-radius: 8px;
      box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
    }
    h2 {
      color: #ff6a00;
      font-weight: 400;
      margin: 0 0 1.25rem 0;
      font-size: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem 3rem;
      align-items: start;
    }

    @media (max-width: 1100px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 700px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    .field {
      display: flex;
      flex-direction: column;
    }

    label {
      display: block;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      color: #102026;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="date"] {
      width: 100%;
      padding: 0.75rem 0.9rem;
      border-radius: 8px;
      border: 1px solid #e6eef5;
      font-size: 0.95rem;
      box-sizing: border-box;
    }

    select {
      width: 100%;
      padding: 0.75rem 0.9rem;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-size: 0.95rem;
      box-sizing: border-box;
      appearance: none;
    }

    .help {
      margin-top: 0.45rem;
      color: #ef4444;
      font-size: 0.82rem;
      min-height: 18px;
    }

    .actions {
      margin-top: 2.25rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }

    .btn {
      padding: 0.9rem 2.5rem;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      font-size: 1.05rem;
    }

    .btn-primary {
      background: #ff6a00;
      color: white;
      border: none;
      min-width: 320px;
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid rgba(75, 63, 155, 0.12);
      color: #4b3f9b;
      min-width: 240px;
    }

    .row-spacer {
      height: 1rem;
    }
  `;

  constructor() {
    super();
    this.id = null;
    this.mode = "add";
    this.model = {
      firstName: "",
      lastName: "",
      employment_date: "",
      birth_date: "",
      phone: "",
      email: "",
      department: "",
      position: "",
    };
    this._errors = {};
    this._confirmOpen = false;
    this._pendingToStore = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const path = window.location.pathname || "";
    const parts = path.split("/").filter(Boolean); // removes empty segments
    let id = null;
    if (parts.length >= 2 && parts[0] === "employee" && parts[1] === "edit") {
      id = parts[2];
    } else if (parts.length >= 2 && parts[0] === "edit") {
      id = parts[1];
    }

    if (id) {
      this.mode = "edit";
      this.id = id;

      const state = window.history.state || {};
      if (state && state.selectedUser) {
        const u = state.selectedUser;
        this.model = {
          ...u,
          employment_date: this._toIso(u.employment_date),
          birth_date: this._toIso(u.birth_date),
          department: u.department || "",
          position: u.position || "",
        };

        this.requestUpdate();
      } else {
        this._loadModel();
      }
    } else if (
      parts.length >= 2 &&
      parts[0] === "employee" &&
      parts[1] === "new"
    ) {
      this.mode = "add";
    } else if (path === "/new") {
      this.mode = "add";
    }
  }

  render() {
    return html`
      <div>
        <app-header></app-header>
        <div class="container">
          <h2>
            ${this.mode === "add"
              ? translate("addEmployee")
              : translate("editEmployee")}
          </h2>
          <div class="card">
            <div class="form-grid">
              <div class="field">
                <label>${translate("firstName")}</label>
                <input
                  type="text"
                  .value=${this.model.firstName}
                  @input=${(e) =>
                    this._updateField("firstName", e.target.value)}
                  required
                />
                <div class="help">${this._errors.firstName || ""}</div>
              </div>

              <div class="field">
                <label>${translate("lastName")}</label>
                <input
                  type="text"
                  .value=${this.model.lastName}
                  @input=${(e) => this._updateField("lastName", e.target.value)}
                  required
                />
                <div class="help">${this._errors.lastName || ""}</div>
              </div>

              <div class="field">
                <label>${translate("dateOfEmployment")}</label>
                <input
                  type="date"
                  .value=${this.model.employment_date}
                  @input=${(e) =>
                    this._updateField("employment_date", e.target.value)}
                />
                <div class="help">${this._errors.employment_date || ""}</div>
              </div>

              <div class="field">
                <label>${translate("dateOfBirth")}</label>
                <input
                  type="date"
                  .value=${this.model.birth_date}
                  @input=${(e) =>
                    this._updateField("birth_date", e.target.value)}
                />
                <div class="help">${this._errors.birth_date || ""}</div>
              </div>

              <div class="field">
                <label>${translate("phone")}</label>
                <input
                  type="tel"
                  .value=${this.model.phone}
                  @input=${this._onPhoneInput}
                  placeholder="+(90) 5xx xxx xx xx"
                />
                <div class="help">${this._errors.phone || ""}</div>
              </div>

              <div class="field">
                <label>${translate("email")}</label>
                <input
                  type="email"
                  .value=${this.model.email}
                  @input=${(e) => this._updateField("email", e.target.value)}
                />
                <div class="help">${this._errors.email || ""}</div>
              </div>

              <div class="field">
                <label>${translate("department")}</label>
                <select
                  name="department"
                  .value=${this.model.department}
                  @change=${(e) =>
                    this._updateField("department", e.target.value)}
                >
                  <option value="" disabled ?selected=${!this.model.department}>
                    Please Select
                  </option>
                  <option value="Tech">Tech</option>
                  <option value="Analytics">Analytics</option>
                </select>
                <div class="help">${this._errors.department || ""}</div>
              </div>

              <div class="field">
                <label>${translate("position")}</label>
                <select
                  name="position"
                  .value=${this.model.position}
                  @change=${(e) =>
                    this._updateField("position", e.target.value)}
                >
                  <option value="" disabled ?selected=${!this.model.position}>
                    Please Select
                  </option>
                  <option value="Junior">Junior</option>
                  <option value="Medior">Medior</option>
                  <option value="Senior">Senior</option>
                </select>
                <div class="help">${this._errors.position || ""}</div>
              </div>
            </div>

            <div class="actions">
              <button class="btn btn-primary" @click=${this._onSave}>
                ${translate("save")}
              </button>
              <button class="btn btn-secondary" @click=${this._onCancel}>
                ${translate("cancel")}
              </button>
            </div>
          </div>
        </div>

        <confirm-modal
          .open=${this._confirmOpen}
          .personName=${this.model &&
          (this.model.firstName || this.model.lastName)
            ? `${this.model.firstName || ""} ${
                this.model.lastName || ""
              }`.trim()
            : ""}
          .action=${this.mode === "edit" ? "edit" : "delete"}
          @confirm=${this._onConfirmModal}
          @cancel=${this._onCancelModal}
        ></confirm-modal>
      </div>
    `;
  }

  _updateField(key, value) {
    this.model = { ...this.model, [key]: value };

    const errors = { ...this._errors };
    if (errors[key]) {
      delete errors[key];
      this._errors = errors;
    }
  }

  _onPhoneInput(e) {
    const el = e.target;
    const formatted = this._formatPhone(el.value);

    el.value = formatted;
    this._updateField("phone", formatted);
  }

  _formatPhone(input) {
    if (!input) return "";

    const digits = String(input).replace(/\D+/g, "");
    let d = digits;

    if (d.startsWith("90")) d = d.slice(2);
    if (d.startsWith("0")) d = d.slice(1);

    d = d.slice(0, 10);

    const parts = [];
    if (d.length > 0) parts.push(d.slice(0, Math.min(3, d.length)));
    if (d.length > 3) parts.push(d.slice(3, Math.min(6, d.length)));
    if (d.length > 6) parts.push(d.slice(6, Math.min(8, d.length)));
    if (d.length > 8) parts.push(d.slice(8, Math.min(10, d.length)));

    let display = "+(90)";
    if (parts.length > 0) display += " " + parts[0];
    if (parts.length > 1) display += " " + parts[1];
    if (parts.length > 2) display += " " + parts[2];
    if (parts.length > 3) display += " " + parts[3];

    return display;
  }

  _loadModel() {
    fetch("/src/assets/data/users.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load users.json: ${r.status}`);
        return r.json();
      })
      .then((users) => {
        const u = users.find((x) => String(x.id) === String(this.id));
        if (u) {
          this.model = {
            ...u,
            employment_date: this._toIso(u.employment_date),
            birth_date: this._toIso(u.birth_date),

            department: u.department || "",
            position: u.position || "",
          };

          this.requestUpdate();
        }
      })
      .catch((err) => console.warn("Could not load users.json for edit", err));
  }

  _toIso(val) {
    if (!val) return "";
    if (typeof val !== "string") return "";
    if (val.includes("-")) return val; // already ISO
    const parts = val.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(
        2,
        "0"
      )}`;
    }
    return "";
  }

  _fromIso(val) {
    if (!val) return "";
    if (typeof val !== "string") return "";
    if (val.includes("/")) return val; // already dd/mm/yyyy
    const parts = val.split("-");
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y.padStart(
        4,
        "0"
      )}`;
    }
    return "";
  }

  _validate() {
    const errs = {};
    const m = this.model || {};

    if (!m.firstName || String(m.firstName).trim().length < 1)
      errs.firstName = "First name is required.";
    if (!m.lastName || String(m.lastName).trim().length < 1)
      errs.lastName = "Last name is required.";

    if (!m.employment_date)
      errs.employment_date = "Employment date is required.";
    if (!m.birth_date) errs.birth_date = "Birth date is required.";

    if (!m.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(m.email)))
      errs.email = "Please enter a valid email address.";

    if (
      !m.phone ||
      !/^\+\(90\)\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(String(m.phone))
    )
      errs.phone =
        "Phone is required and must be in format +(90) 531 982 44 11.";

    if (!["Tech", "Analytics"].includes(m.department))
      errs.department = "Department must be Tech or Analytics.";

    if (!["Junior", "Medior", "Senior"].includes(m.position))
      errs.position = "Position must be Junior, Medior or Senior.";

    if (m.employment_date && isNaN(Date.parse(m.employment_date)))
      errs.employment_date = "Invalid employment date.";
    if (m.birth_date && isNaN(Date.parse(m.birth_date)))
      errs.birth_date = "Invalid birth date.";

    this._errors = errs;
    return Object.keys(errs).length === 0;
  }

  _onCancel() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  _onSave() {
    if (!this._validate()) {
      const firstKey = Object.keys(this._errors)[0];
      const el = this.renderRoot.querySelector(`[name="${firstKey}"]`);
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    const toStore = {
      ...this.model,
      employment_date: this._fromIso(this.model.employment_date),
      birth_date: this._fromIso(this.model.birth_date),
    };

    if (this.mode === "edit") {
      // open confirmation modal before proceeding with update
      this._pendingToStore = toStore;
      this._confirmOpen = true;
      this.requestUpdate();
      return;
    }

    // for add mode proceed immediately
    fetch("/src/assets/data/users.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load users.json: ${r.status}`);
        return r.json();
      })
      .then((users) => {
        let list = Array.isArray(users) ? users : [];
        if (this.mode === "edit" && this.id) {
          const idx = list.findIndex((x) => String(x.id) === String(this.id));
          if (idx !== -1) list[idx] = { ...toStore, id: list[idx].id };
        } else {
          const maxId = list.reduce((m, x) => (x.id > m ? x.id : m), 0);
          const newId = maxId + 1;
          list.push({ ...toStore, id: newId });
        }

        return fetch("/src/assets/data/users.json", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(list, null, 2),
        })
          .then((res) => {
            if (!res.ok) throw new Error("PUT failed");

            const existingId =
              this.mode === "edit" && this.id
                ? list.find((x) => String(x.id) === String(this.id)).id
                : null;
            const savedUser =
              this.mode === "edit" && existingId
                ? { ...toStore, id: existingId }
                : list[list.length - 1];

            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent("popstate"));

            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("user-saved", { detail: savedUser })
              );
            }, 60);
          })
          .catch((err) => {
            console.warn("PUT failed, offering download", err);
            const blob = new Blob([JSON.stringify(list, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "users.json";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            window.history.pushState({}, "", "/");
            window.dispatchEvent(new PopStateEvent("popstate"));

            const existingIdFallback =
              this.mode === "edit" && this.id
                ? list.find((x) => String(x.id) === String(this.id)).id
                : null;
            const savedUserFallback =
              this.mode === "edit" && existingIdFallback
                ? { ...toStore, id: existingIdFallback }
                : list[list.length - 1];
            setTimeout(() => {
              window.dispatchEvent(
                new CustomEvent("user-saved", { detail: savedUserFallback })
              );
            }, 60);
          });
      })
      .catch((err) => console.error("Error saving users.json", err));
  }

  _onConfirmModal() {
    // user confirmed save in edit mode
    this._confirmOpen = false;
    const toStore = this._pendingToStore;
    this._pendingToStore = null;
    if (toStore) {
      // reuse existing save flow but force mode to edit path
      // perform same PUT/update logic as in _onSave
      fetch("/src/assets/data/users.json")
        .then((r) => {
          if (!r.ok) throw new Error(`Could not load users.json: ${r.status}`);
          return r.json();
        })
        .then((users) => {
          let list = Array.isArray(users) ? users : [];
          if (this.mode === "edit" && this.id) {
            const idx = list.findIndex((x) => String(x.id) === String(this.id));
            if (idx !== -1) list[idx] = { ...toStore, id: list[idx].id };
          }

          return fetch("/src/assets/data/users.json", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(list, null, 2),
          })
            .then((res) => {
              if (!res.ok) throw new Error("PUT failed");

              const existingId =
                this.mode === "edit" && this.id
                  ? list.find((x) => String(x.id) === String(this.id)).id
                  : null;
              const savedUser =
                this.mode === "edit" && existingId
                  ? { ...toStore, id: existingId }
                  : list[list.length - 1];

              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));

              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("user-saved", { detail: savedUser })
                );
              }, 60);
            })
            .catch((err) => {
              console.warn("PUT failed, offering download", err);
              const blob = new Blob([JSON.stringify(list, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "users.json";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);

              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));

              const existingIdFallback =
                this.mode === "edit" && this.id
                  ? list.find((x) => String(x.id) === String(this.id)).id
                  : null;
              const savedUserFallback =
                this.mode === "edit" && existingIdFallback
                  ? { ...toStore, id: existingIdFallback }
                  : list[list.length - 1];
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("user-saved", { detail: savedUserFallback })
                );
              }, 60);
            });
        })
        .catch((err) => console.error("Error saving users.json", err));
    }
  }

  _onCancelModal() {
    this._confirmOpen = false;
    this._pendingToStore = null;
    this.requestUpdate();
  }
}

customElements.define("employee-form", EmployeeForm);
