import { LitElement, html, css } from "lit";

export class PaginationControls extends LitElement {
  static properties = {
    rows: { type: Array },
    pageSize: { type: Number },
    page: { type: Number },
    totalPages: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
    }
    .pagination {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: center;
      padding: 1rem 0;
    }
    .page-btn {
      border: 1px solid transparent;
      padding: 0.2rem 0.2rem;
      cursor: pointer;
      min-width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #475569;
    }

    .page-btn.disabled {
      opacity: 0.45;
      cursor: default;
      pointer-events: none;
      transform: none;
      color: #94a3b8; /* grey when disabled */
    }

    .page-btn.current {
      background: #ff6a00;
      color: #fff;
      border-radius: 9999px;
      width: 36px;
      height: 36px;
      min-width: 36px;
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.03) inset;
      font-weight: 700;
    }

    .page-btn.arrow {
      border-radius: 6px;
      width: 36px;
      height: 36px;
      min-width: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      padding: 0;
      color: #ff6a00;
    }

    .ellipsis {
      padding: 0 6px;
      color: #94a3b8;
      user-select: none;
    }

    .nav-arrow {
      font-size: 18px;
      line-height: 1;
    }

    @media (max-width: 420px) {
      .page-btn {
        padding: 0.25rem 0.4rem;
        min-width: 28px;
        height: 28px;
      }
      .page-btn.current {
        width: 30px;
        height: 30px;
        min-width: 30px;
      }
      .pagination {
        gap: 0.25rem;
      }
    }
  `;

  constructor() {
    super();
    this.rows = [];
    this.pageSize = 10;
    this.page = 1;
    this.totalPages = 1;
  }

  firstUpdated() {
    this._recalculate();

    this._emitPageData();
  }

  updated(changed) {
    if (changed.has("rows") || changed.has("pageSize")) {
      this._recalculate();

      if (this.page > this.totalPages) this.page = this.totalPages;
      this._emitPageData();
    }
  }

  _recalculate() {
    const len = Array.isArray(this.rows) ? this.rows.length : 0;
    this.totalPages = Math.max(1, Math.ceil(len / this.pageSize));
  }

  _emitPageData() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const pageRows = Array.isArray(this.rows)
      ? this.rows.slice(start, end)
      : [];
    this.dispatchEvent(
      new CustomEvent("page-data", {
        detail: {
          page: this.page,
          totalPages: this.totalPages,
          rows: pageRows,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _changePage(p) {
    if (p < 1 || p > this.totalPages || p === this.page) return;
    this.page = p;
    this._emitPageData();
  }

  _onKeyDown(e, p) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._changePage(p);
    }
  }

  _renderPages() {
    const pages = [];
    const total = this.totalPages;
    const current = this.page;

    pages.push(1);

    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);

    if (start > 2) {
      pages.push("ellipsis");
    } else {
      for (let i = 2; i < start; i++) pages.push(i);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < total - 1) {
      pages.push("ellipsis");
    } else {
      for (let i = end + 1; i < total; i++) pages.push(i);
    }

    pages.push(total);
    return pages;
  }

  render() {
    const pages = this._renderPages();
    return html`
      <div class="pagination" role="navigation" aria-label="Pagination">
        <div
          role="button"
          tabindex="0"
          class="page-btn arrow prev ${this.page === 1 ? "disabled" : ""}"
          @click=${() => this._changePage(this.page - 1)}
          @keydown=${(e) => this._onKeyDown(e, this.page - 1)}
          aria-disabled=${this.page === 1}
          title="Previous"
        >

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        ${pages.map((p) =>
          p === "ellipsis"
            ? html`<span class="ellipsis">…</span>`
            : html`
                <div
                  role="button"
                  tabindex="0"
                  class="page-btn ${p === this.page ? "current" : ""}"
                  @click=${() => this._changePage(p)}
                  @keydown=${(e) => this._onKeyDown(e, p)}
                  aria-current=${p === this.page ? "page" : null}
                >
                  ${p}
                </div>
              `
        )}

        <div
          role="button"
          tabindex="0"
          class="page-btn arrow next ${this.page === this.totalPages
            ? "disabled"
            : ""}"
          @click=${() => this._changePage(this.page + 1)}
          @keydown=${(e) => this._onKeyDown(e, this.page + 1)}
          aria-disabled=${this.page === this.totalPages}
          title="Next"
        >

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    `;
  }
}

customElements.define("pagination-controls", PaginationControls);
