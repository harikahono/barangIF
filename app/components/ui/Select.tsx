"use client";

// adapted from opensourceui.in dropdowns (MIT) — value-select, theme-aware.
// Portalled to document.body so overflow:hidden ancestors (Card / collapsible
// wrapper) can't clip the popover. Follows the WAI-ARIA Listbox pattern.
import {
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();

  const selectedIndex = Math.max(0, options.indexOf(value));
  const selected = value || "";

  const measure = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const panelH = Math.min(options.length * 36 + 16, 240);
    const flip = rect.bottom + panelH > window.innerHeight && rect.top > panelH;
    setCoords(
      flip
        ? { top: rect.top - panelH - 4, left: rect.left, width: rect.width }
        : { top: rect.bottom + 4, left: rect.left, width: rect.width },
    );
  };

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };
  const closeMenu = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  // position + initial focus on the active option (before paint, no flicker)
  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const raf = requestAnimationFrame(() => optionRefs.current[activeIndex]?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // outside click + scroll/resize dismiss
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || portalRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onScrollOrResize = () => setOpen(false);
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open]);

  const typeahead = useRef<{ char: string; timer: number }>({ char: "", timer: 0 });
  const onTypeahead = (key: string) => {
    if (!/^[a-z0-9]$/i.test(key)) return;
    const now = Date.now();
    typeahead.current.char =
      now - typeahead.current.timer < 500 ? typeahead.current.char + key : key;
    typeahead.current.timer = now;
    const q = typeahead.current.char.toLowerCase();
    const start = activeIndex + 1;
    const pool = [...options.slice(start), ...options.slice(0, start)];
    const idx = pool.findIndex((o) => o.toLowerCase().startsWith(q));
    if (idx >= 0) {
      const real = (start + idx) % options.length;
      setActiveIndex(real);
      optionRefs.current[real]?.focus();
    }
  };

  const onListKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const n = Math.min(options.length - 1, activeIndex + 1);
        setActiveIndex(n);
        optionRefs.current[n]?.focus();
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const n = Math.max(0, activeIndex - 1);
        setActiveIndex(n);
        optionRefs.current[n]?.focus();
        break;
      }
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        optionRefs.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        optionRefs.current[options.length - 1]?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        onTypeahead(e.key);
        break;
    }
  };

  const select = (index: number) => {
    const opt = options[index];
    if (opt == null) return;
    onValueChange?.(opt);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openMenu();
    } else if (e.key === "Escape") {
      closeMenu(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-required={required || undefined}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        onPointerDown={(e) => e.preventDefault()}
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

      {open && coords && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={portalRef}
              id={listId}
              role="listbox"
              aria-label={label || "Pilih opsi"}
              onKeyDown={onListKeyDown}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 1000,
              }}
              className="max-h-60 overflow-auto rounded-lg border border-neutral-200 bg-neutral-100 py-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)]"
            >
              {options.map((opt, i) => (
                <button
                  key={opt}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  tabIndex={i === activeIndex ? 0 : -1}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(i);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center border-l-2 px-3 py-2 text-left text-sm transition-colors",
                    opt === value
                      ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                      : "border-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                    i === activeIndex && opt !== value && "bg-neutral-50",
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}

      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
