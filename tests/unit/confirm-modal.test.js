import { fixture, html } from "@open-wc/testing";
import "../../src/components/confirm-modal.js";
import { expect } from "vitest";

describe("confirm-modal", () => {
  it("renders when open and emits confirm/cancel", async () => {
    const el = await fixture(
      html`<confirm-modal
        .open=${true}
        .personName=${"John Doe"}
      ></confirm-modal>`
    );

    const proceedBtn = el.shadowRoot.querySelector(".btn-proceed");
    const cancelBtn = el.shadowRoot.querySelector(".btn-cancel");

    let confirmed = false;
    let canceled = false;

    el.addEventListener("confirm", () => (confirmed = true));
    el.addEventListener("cancel", () => (canceled = true));

    proceedBtn.click();
    cancelBtn.click();

    await new Promise((r) => setTimeout(r, 0));

    expect(confirmed).toBe(true);
    expect(canceled).toBe(true);
  });
});
