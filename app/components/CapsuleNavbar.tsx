"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LEFT = [
  { href: "/aturan", label: "Aturan" },
  { href: "/tentang", label: "Tentang" },
];
const NAV_RIGHT = [
  { href: "/statistik", label: "Statistik" },
  { href: "/masukan", label: "Masukan" },
];

export default function CapsuleNavbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 20) setHidden(false);
      else if (y > lastY.current) setHidden(true); // scroll ke bawah -> ilang
      else setHidden(false); // scroll ke atas -> muncul
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) =>
    `px-6 py-2.5 rounded-full font-medium text-sm transition-colors max-sm:px-3 max-sm:text-xs ${
      pathname === href
        ? "bg-white text-brand"
        : "text-white hover:text-white/70"
    }`;

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-transform duration-500 ${
        hidden ? "-translate-y-[170%]" : "translate-y-0"
      }`}
    >
      <nav className="relative flex w-[650px] max-w-[92vw] items-center justify-between rounded-full bg-brand px-5 py-4 shadow-lg max-sm:px-4">
        <ul className="flex items-center gap-5 max-sm:gap-2">
          {NAV_LEFT.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          aria-label="barangIF — kembali ke beranda"
          className="pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <img
            src="/barangiflogo.webp"
            alt="barangIF"
            className="h-12 w-auto drop-shadow-xl max-sm:h-9"
          />
        </Link>

        <ul className="flex items-center gap-5 max-sm:gap-2">
          {NAV_RIGHT.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
