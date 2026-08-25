"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const NAV = [
  { href: "/aturan", label: "Aturan" },
  { href: "/tentang", label: "Tentang" },
  { href: "/statistik", label: "Statistik" },
  { href: "/masukan", label: "Masukan" },
];

export default function CapsuleNavbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (menuOpen) return; // jangan sembunyikan pas menu kebuka
      const y = window.scrollY;
      if (y < 20) setHidden(false);
      else if (y > lastY.current) setHidden(true); // scroll ke bawah -> ilang
      else setHidden(false); // scroll ke atas -> muncul
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = (href: string) =>
    `block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
      pathname === href
        ? "bg-nav-active-bg text-nav-active-text"
        : "text-nav-fg hover:opacity-70"
    }`;

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-transform duration-500 ${
        hidden ? "-translate-y-[170%]" : "translate-y-0"
      }`}
    >
      <nav className="relative flex w-[650px] max-w-[92vw] items-center justify-between rounded-full border border-neutral-200 bg-neutral-100 px-5 py-4 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.12)] max-sm:px-4">
        {/* desktop: link kiri */}
        <ul className="hidden items-center gap-5 sm:flex">
          {NAV.slice(0, 2).map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* logo — tengah di desktop, kiri di mobile */}
        <Link
          href="/"
          aria-label="barangIF — kembali ke beranda"
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 max-sm:static max-sm:translate-x-0 max-sm:translate-y-0"
        >
          <img
            src="/barangiflogo.webp"
            alt="barangIF"
            className="h-12 w-auto drop-shadow-xl max-sm:h-8"
          />
        </Link>

        {/* desktop: link kanan */}
        <ul className="hidden items-center gap-5 sm:flex">
          {NAV.slice(2).map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* mobile: hamburger */}
        <button
          type="button"
          aria-label="Buka menu"
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuOpen((o) => !o);
            setHidden(false);
          }}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 hover:opacity-70 sm:hidden"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* mobile: panel menu */}
      {menuOpen ? (
        <div className="absolute left-1/2 top-full mt-2 w-[88vw] max-w-sm -translate-x-1/2 sm:hidden">
          <div className="rounded-2xl border border-neutral-200 bg-neutral-100 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={linkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
