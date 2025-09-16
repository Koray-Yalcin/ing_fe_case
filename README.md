# ING Frontend Case — Documentation

A small LitElement-based frontend used for an employee list / CRUD case. This repository uses Vite for development and build, Lit for UI components, Vaadin Router for routing, Redux Toolkit for minimal state, and lit-translate for localization.

## Quick start

From the project root:

```bash
npm install
npm run dev        # start dev server (Vite)
npm run build      # build for production
npm run preview    # preview production build locally
npm run test       # run unit tests (Vitest)
```

Default dev server: http://localhost:5173 (Vite default — check terminal output).

## Project structure (important files)

```
/
├── public/                    # static assets (icons, flags, images)
├── src/
│   ├── components/            # Lit components (header, table, card, modal, pagination, etc.)
│   ├── pages/                 # Routed pages (employee list, add/edit form)
│   ├── assets/
│   │   └── data/
│   │       └── users.json     # canonical dataset used by the app
│   ├── locales/               # translation JSON files (en.json, tr.json)
│   ├── store/                 # Redux store + slices
│   ├── i18n.js                # lit-translate loader wiring
│   └── main.js                # app bootstrap + router
├── tests/                     # unit/e2e tests (Vitest + open-wc helpers)
├── package.json
└── README.md
```

Note: component names are available under `src/components/` (for example `employee-table`, `employee-card`, `confirm-modal`, `pagination-controls`, `app-header`, `app-switch`).

## Data & persistence

- The canonical dataset is `src/assets/data/users.json` included in the repository for demo purposes.
- The app attempts to persist changes by issuing a `PUT` to `/src/assets/data/users.json` when saving; this will fail on static hosts. In that case the app falls back to offering a download of the updated `users.json` so you can replace the file manually.
- For reliable server-side persistence you will need to provide a backend endpoint that accepts writes (not included in this repo).

## Localization

- Localization is implemented with `lit-translate`.
- Locale files live in `src/locales/en.json` and `src/locales/tr.json` and are loaded by `src/i18n.js`.
- Language selection is exposed in the header; changing language will update components using the `translate` helper or directive.

## Routing

- Vaadin Router is used (`src/main.js`) to register routes for list and add/edit operations:
  - `/` or `/employee` — list view
  - `/new` or `/employee/new` — add employee
  - `/edit/:id` or `/employee/edit/:id` — edit employee

When navigating to an edit route the selected user is passed via `history.state.selectedUser` where available to prefill the form.

## Tests

- Unit tests are implemented with Vitest and `@open-wc/testing` helpers.
- Run tests with `npm run test`.
- Test files are placed under `tests/unit/`.
