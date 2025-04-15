import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClaimProvider } from "./context/ClaimContext";

createRoot(document.getElementById("root")!).render(
  <ClaimProvider>
    <App />
  </ClaimProvider>
);
