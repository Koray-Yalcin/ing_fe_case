import { fixture, html } from "@open-wc/testing";
import "../../src/components/employee-card.js";
import { expect } from "vitest";

describe("employee-card", () => {
  it("renders fields and emits edit/delete", async () => {
    const row = {
      id: 1,
      firstName: "Foo",
      lastName: "Bar",
      employment_date: "01/01/2020",
      birth_date: "01/01/1990",
      phone: "05319824411",
      email: "f@b.com",
      department: "Tech",
      position: "Senior",
    };
    const el = await fixture(html`<employee-card .row=${row}></employee-card>`);

    const editBtn = el.shadowRoot.querySelector(".btn-edit");
    const delBtn = el.shadowRoot.querySelector(".btn-delete");

    let edited = false,
      deleted = false;
    el.addEventListener("edit-row", () => (edited = true));
    el.addEventListener("delete-row", () => (deleted = true));

    editBtn.click();
    delBtn.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(edited).toBe(true);
    expect(deleted).toBe(true);
  });
});
