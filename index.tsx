import React, {StrictMode} from "react";
import { createRoot } from "react-dom/client";
import "./index.css";  // make sure the file name is correct
import App from "./App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Root element not found! Make sure <div id='root'></div> exists.");
  throw new Error("Root element missing");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
