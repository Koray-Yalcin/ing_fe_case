import { fixture, html } from "@open-wc/testing";
import "../../src/components/app-header.js";
import { expect } from "vitest";

describe("app-header", () => {
  it("renders and toggles language dropdown and dispatches lang-change", async () => {
    const el = await fixture(html`<app-header></app-header>`);
    const lf = el.shadowRoot.querySelector(".lang-flag");
    expect(lf).toBeTruthy();

    let changed = null;
    el.addEventListener("lang-change", (e) => (changed = e.detail.lang));

    const tr = el.shadowRoot.querySelectorAll(".lang-item")[1];
    tr.click();

    await new Promise((r) => setTimeout(r, 0));
    expect(changed).toBe("TR");
  });
});
