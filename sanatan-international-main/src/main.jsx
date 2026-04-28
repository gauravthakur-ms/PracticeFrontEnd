import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          duration: 3000,
          style: { background: "#f97316", color: "#fff" },
        },
        error: { duration: 4000 },
      }}
    />
  </BrowserRouter>,
);
