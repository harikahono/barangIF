"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

// ponytail: no-dep theme toggle. Mobile (<640px) follows OS; desktop keeps manual choice.
export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle tema siang/malam"
      className="fixed top-4 right-4 z-[60] hidden rounded-full border border-neutral-200 bg-neutral-100 p-2 text-neutral-700 shadow-sm transition-colors hover:bg-neutral-200 sm:inline-flex"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
