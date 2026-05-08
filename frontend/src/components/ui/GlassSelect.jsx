import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function GlassSelect({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
  className,
  buttonClassName,
  menuClassName
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const normalizedOptions = useMemo(
    () => options.map((option) => (typeof option === "string" ? { value: option, label: option } : option)),
    [options]
  );
  const selected = normalizedOptions.find((option) => String(option.value) === String(value));

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const choose = (option) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div className={clsx("relative", className)} ref={rootRef}>
      <button
        type="button"
        className={clsx(
          "field-glass flex items-center justify-between gap-3 text-left font-semibold",
          !selected && "text-slate-400",
          disabled && "cursor-not-allowed",
          buttonClassName
        )}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown className={clsx("shrink-0 text-slate-400 transition", open && "rotate-180 text-harbor")} size={18} />
      </button>

      {open && (
        <div
          className={clsx(
            "absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/70 bg-white/90 p-1.5 shadow-glass backdrop-blur-xl scrollbar-thin",
            menuClassName
          )}
          role="listbox"
        >
          {normalizedOptions.map((option) => {
            const active = String(option.value) === String(value);

            return (
              <button
                type="button"
                className={clsx(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition",
                  active ? "bg-ink text-white shadow-lg shadow-slate-900/15" : "text-slate-600 hover:bg-harbor/10 hover:text-ink",
                  option.disabled && "cursor-not-allowed opacity-45"
                )}
                disabled={option.disabled}
                key={String(option.value)}
                onClick={() => choose(option)}
                role="option"
                aria-selected={active}
              >
                <span className="truncate">{option.label}</span>
                {active && <Check className="shrink-0" size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
