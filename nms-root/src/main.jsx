import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { installStoragePolyfill } from "./storagePolyfill";
import MarketingStudio from "../components/MarketingStudio";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Attach Supabase-backed window.storage before MarketingStudio reads it
    installStoragePolyfill();
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#0F172A",
        color: "#94A3B8", fontFamily: "Inter, sans-serif", fontSize: 14, gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>◈</span> NMS — Caricamento…
      </div>
    );
  }

  return <MarketingStudio />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
