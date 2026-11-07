import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const esAdmin = window.location.pathname.endsWith("admin.html");
const root = createRoot(document.getElementById("root"));

if (esAdmin) {
  import("./components/Admin").then(({ default: Admin }) => {
    root.render(<React.StrictMode><Admin /></React.StrictMode>);
  });
} else {
  root.render(<React.StrictMode><App /></React.StrictMode>);
}
