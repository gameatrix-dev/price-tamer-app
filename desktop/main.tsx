import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import SkupApp from "@/components/SkupApp";
import "../src/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SkupApp />
  </StrictMode>,
);
