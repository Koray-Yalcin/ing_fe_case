import { registerTranslateConfig } from "lit-translate";

registerTranslateConfig({
  loader: (lang) => {
    const code = String(lang || "en").toLowerCase();
    return fetch(`/src/locales/${code}.json`).then((r) => {
      if (!r.ok) throw new Error("Could not load locale " + code);
      return r.json();
    });
  },
});
