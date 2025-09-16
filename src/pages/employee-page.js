import { LitElement, html, css } from "lit";
import "../components/app-header.js";
import "../components/app-switch.js";
import "../components/employee-table.js";
import "../components/pagination-controls.js";
import "../components/employee-card.js";
import "../components/confirm-modal.js";
import store from "../store/index.js";
import { setView } from "../store/uiSlice.js";

export class EmployeePage extends LitElement {
  static properties = {
    page: { type: Number },
    totalPages: { type: Number },
    rows: { type: Array },
    rowsAll: { type: Array },
    view: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto,
        "Helvetica Neue", Arial;
      color: #102026;
    }
    .page-wrap {
      background: #f8fafc;
      min-height: 100vh;
    }
    main {
      margin: 0 30px 0 30px;
      border-radius: 8px;
      overflow: hidden;
      box-sizing: border-box;
    }
    .content {
      padding: 0; /* components handle their own spacing */
    }
    .placeholder {
      padding: 2rem;
      color: #64748b;
    }

    .card-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 600px));
      justify-content: center;
      gap: 4rem;
      padding: 1rem 1.25rem;
    }

    @media (max-width: 800px) {
      .card-list {
        grid-template-columns: 1fr;
      }
      main {
        margin: 0 12px;
      }
    }
  `;

  constructor() {
    super();
    this.page = 1;
    this.pageSize = 10; // rows per page
    this.totalPages = 1;
    this.rowsAll = [];
    this.rows = [];
    this.view = store.getState().ui.view || "list";

    this._confirmOpen = false;
    this._toDeleteRow = null;

    window.__APP_STORE_DISPATCH = store.dispatch;

    this._onUserSavedWindow = this._onUserSaved.bind(this);

    this._unsubscribe = store.subscribe(() => {
      const s = store.getState();
      if (s && s.ui && s.ui.view !== this.view) {
        this.view = s.ui.view;

        window.dispatchEvent(
          new CustomEvent("ui-view", { detail: { view: this.view } })
        );
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribe) this._unsubscribe();

    if (window.__APP_STORE_DISPATCH) delete window.__APP_STORE_DISPATCH;

    window.removeEventListener("user-saved", this._onUserSavedWindow);
  }

  firstUpdated() {

    fetch("src/assets/data/users.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users.json");
        return res.json();
      })
      .then((data) => {
        this.rowsAll = Array.isArray(data) ? data : [];

      })
      .catch((err) => {
        console.error(err);
        this.rowsAll = [];
        this.rows = [];
      });

    this.addEventListener("delete-row", (e) => this._onDeleteRequested(e));

    this.addEventListener("edit-row", (e) => this._onEditRequested(e));

    this.addEventListener("confirm", () => this._confirmDelete());
    this.addEventListener("cancel", () => this._cancelDelete());

    this.addEventListener("user-saved", (e) => this._onUserSaved(e));

    window.addEventListener("user-saved", this._onUserSavedWindow);
  }

  _onUserSaved(e) {
    const u = e && e.detail ? e.detail : null;
    if (!u) return;
    const key = this._getRowKey(u);
    const exists = this.rowsAll.some((r) => this._getRowKey(r) === key);
    if (exists) {
      this.rowsAll = this.rowsAll.map((r) =>
        this._getRowKey(r) === key ? { ...r, ...u } : r
      );
    } else {
      this.rowsAll = [...this.rowsAll, u];
    }

    this.requestUpdate();
  }

  render() {
    return html`
      <div class="page-wrap">
        <app-header @add-new="${this._onAdd}"></app-header>

        <main>
          <div class="content">
            <app-switch @view-change="${this._onViewChange}"></app-switch>

            ${this.view === "list"
              ? html`

                  <employee-table .rows=${this.rows}></employee-table>
                `
              : html`

                  <div class="card-list">
                    ${this.rows.map(
                      (r) => html`<employee-card .row=${r}></employee-card>`
                    )}
                  </div>
                `}

            <pagination-controls
              .rows=${this.rowsAll}
              .pageSize=${this.pageSize}
              @page-data=${this._onPageData}
            ></pagination-controls>
          </div>
        </main>

        <confirm-modal
          .open=${this._confirmOpen}
          .personName=${this._toDeleteRow
            ? `${this._toDeleteRow.firstName} ${this._toDeleteRow.lastName}`
            : ""}
        ></confirm-modal>
      </div>
    `;
  }

  _onAdd() {
    console.log("Add new clicked");
  }

  _onViewChange(e) {
    console.log("view changed", e.detail.view);
  }

  _onPageData(e) {

    this.page = e.detail.page;
    this.totalPages = e.detail.totalPages;
    this.rows = e.detail.rows;
  }

  _onDeleteRequested(e) {

    e.stopPropagation();
    if (e && e.detail && e.detail.row) {
      this._toDeleteRow = e.detail.row;
      this._confirmOpen = true;
      this.requestUpdate();
    }
  }

  _onEditRequested(e) {
    if (!e || !e.detail || !e.detail.row) return;
    const row = e.detail.row;
    const id = row.id || row.email || `${row.firstName}_${row.lastName}`;

    window.history.pushState({ selectedUser: row }, "", `/edit/${id}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  _getRowKey(row) {
    return (
      row.id ?? row.email ?? `${row.firstName || ""}_${row.lastName || ""}`
    );
  }
  _confirmDelete() {
    if (this._toDeleteRow) {
      const keyToDelete = this._getRowKey(this._toDeleteRow);

      this.rowsAll = this.rowsAll.filter(
        (r) => this._getRowKey(r) !== keyToDelete
      );

    }
    this._confirmOpen = false;
    this._toDeleteRow = null;
    this.requestUpdate();
  }

  _cancelDelete() {
    this._confirmOpen = false;
    this._toDeleteRow = null;
    this.requestUpdate();
  }

  _showList() {

    store.dispatch(setView("list"));
  }

  _showCards() {
    store.dispatch(setView("card"));
  }
}

customElements.define("employee-page", EmployeePage);
