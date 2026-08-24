"use client";

import Link from "next/link";
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

  const linkClass = (href: string) =>
    `px-4 py-2 rounded-full font-medium text-sm transition-colors max-sm:px-2.5 max-sm:text-xs ${
      pathname === href
        ? "bg-white text-neutral-900"
        : "text-neutral-100 hover:text-neutral-300"
    }`;

  return (
    <div className="relative flex w-full justify-center px-4 mt-8">
      <nav className="relative flex w-full max-w-3xl items-center justify-between rounded-full bg-neutral-900 px-5 py-3 shadow-lg max-sm:px-3">
        <ul className="flex items-center gap-1">
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
            className="h-11 w-auto drop-shadow-xl max-sm:h-9"
          />
        </Link>

        <ul className="flex items-center gap-1">
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
