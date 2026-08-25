"use client";

// adapted from opensourceui.in dropdowns (MIT) — value-select, theme-aware.
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { ChevronDown } from "lucide-react";

export type SelectProps = Readonly<{
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value: string;
  options: readonly string[];
  onValueChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}>;

export function Select({
  id,
  name,
  label,
  placeholder = "Pilih…",
  value,
  options,
  onValueChange,
  className,
  required,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = value || "";

  useEffect(() => {
    const closeOnOutside = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-required={required || undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border bg-neutral-100 px-3.5 font-sans text-sm transition-[border-color] duration-200",
          open ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-900",
          selected ? "text-neutral-900" : "text-neutral-400",
        )}
      >
        <span className="truncate">
          {label ? <span className="mr-1 text-neutral-400">{label}:</span> : null}
          {selected ? selected : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={cn("shrink-0 text-neutral-400 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 z-50 max-h-60 w-full overflow-auto rounded-lg border border-neutral-200 bg-neutral-100 py-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)]"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={opt === value}
              onClick={() => {
                setOpen(false);
                onValueChange?.(opt);
              }}
              className={cn(
                "flex w-full cursor-pointer items-center border-l-2 px-3 py-2 text-left text-sm transition-colors",
                opt === value
                  ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                  : "border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : null}

      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
