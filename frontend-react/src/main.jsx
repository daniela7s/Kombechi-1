import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Agrego como componente
import Admin from "./components/Admin";

const esAdmin = window.location.pathname.endsWith("admin.html");
createRoot(document.getElementById("root")).render(
  <React.StrictMode>{esAdmin ? <Admin /> : <App />}</React.StrictMode>
);
