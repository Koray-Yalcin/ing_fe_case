import { Router } from "@vaadin/router";
import "./pages/employee-page.js";
import "./pages/employee-form.js";

const appRootId = "app-root";
let appRoot = document.getElementById(appRootId);
if (!appRoot) {
  appRoot = document.createElement("div");
  appRoot.id = appRootId;
  document.body.appendChild(appRoot);
}

window.addEventListener("DOMContentLoaded", () => {
  if (document.body) {
    document.body.style.margin = "0";
    document.body.style.background = "#f8fafc";
    document.body.style.fontFamily =
      "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";
  }

  const router = new Router(appRoot);
  router.setRoutes([
    { path: "/", component: "employee-page" },
    { path: "/new", component: "employee-form" },
    { path: "/edit/:id", component: "employee-form" },
  ]);
});
