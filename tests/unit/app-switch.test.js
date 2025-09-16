import { fixture, html } from "@open-wc/testing";
import "../../src/components/app-switch.js";
import { expect } from "vitest";

describe("app-switch", () => {
  it("toggles view and emits view-change", async () => {
    const el = await fixture(html`<app-switch></app-switch>`);
    let changed = null;
    el.addEventListener("view-change", (e) => (changed = e.detail.view));

    el._changeView("card");
    await new Promise((r) => setTimeout(r, 0));

    expect(changed).toBe("card");
    expect(el.view).toBe("card");
  });
});
