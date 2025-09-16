import { fixture, html } from "@open-wc/testing";
import "../../src/components/pagination-controls.js";
import { expect } from "vitest";

describe("pagination-controls", () => {
  it("calculates pages and emits page-data", async () => {
    const rows = Array.from({ length: 45 }, (_, i) => ({ id: i + 1 }));
    const el = await fixture(
      html`<pagination-controls
        .rows=${rows}
        .pageSize=${10}
      ></pagination-controls>`
    );

    await new Promise((r) => setTimeout(r, 0));

    let pageData = null;
    el.addEventListener("page-data", (e) => (pageData = e.detail));

    el._changePage(3);
    await new Promise((r) => setTimeout(r, 0));

    expect(pageData).toBeTruthy();
    expect(pageData.page).toBe(3);
    expect(pageData.rows.length).toBe(10);
  });
});
