"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // Avoid SSR/client mismatch by waiting for mount before reading localStorage
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light") setDark(false);
      else if (saved === "dark") setDark(true);
      else {
        // Respect user preference if available
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDark(prefersDark ?? true);
      }
    } catch {
      setDark(true);
    }
  }, []);

  // Apply theme when we have a concrete value
  useEffect(() => {
    if (dark === null) return;
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, [dark]);

  // Do not render interactive UI until mounted to prevent hydration flash
  if (dark === null) return null;

  return (
    <button
      onClick={() => setDark(!dark)}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "1px solid #1f3b63",
        background: dark ? "#07142a" : "#ffffff",
        color: dark ? "#ffd54a" : "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        zIndex: 9999,
        transition: "all 0.2s ease",
      }}
      title="Toggle theme"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}