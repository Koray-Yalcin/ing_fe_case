import { fixture, html } from "@open-wc/testing";
import "../../src/components/employee-table.js";
import { expect } from "vitest";

describe("employee-table", () => {
  it("renders headers and rows and emits events", async () => {
    const rows = [
      {
        id: 1,
        firstName: "A",
        lastName: "B",
        employment_date: "01/01/2020",
        birth_date: "01/01/1990",
        phone: "05319824411",
        email: "a@b.com",
        department: "Tech",
        position: "Junior",
      },
    ];

    const el = await fixture(
      html`<employee-table .rows=${rows}></employee-table>`
    );

    const ths = el.shadowRoot.querySelectorAll("th");
    expect(ths.length).toBeGreaterThan(5);

    const editBtn = el.shadowRoot.querySelector(".feather-edit");
    const delBtn = el.shadowRoot.querySelector(".feather-trash-2");

    let edited = false,
      deleted = false;
    el.addEventListener("edit-row", () => (edited = true));
    el.addEventListener("delete-row", () => (deleted = true));

    // click action buttons
    el.shadowRoot.querySelectorAll(".action-btn")[0].click();
    el.shadowRoot.querySelectorAll(".action-btn")[1].click();

    await new Promise((r) => setTimeout(r, 0));

    expect(edited).toBe(true);
    expect(deleted).toBe(true);
  });
});
