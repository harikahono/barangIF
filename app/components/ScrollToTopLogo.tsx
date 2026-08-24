"use client";

import { useEffect, useState } from "react";

export default function ScrollToTopLogo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Kembali ke atas"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur transition-opacity duration-300 hover:bg-white ${
        show ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <img src="/barangiflogo.webp" alt="" className="h-9 w-auto" />
    </button>
  );
}
