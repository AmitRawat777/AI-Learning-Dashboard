import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export interface FormSelectOption<T extends string | number> {
  value: T;
  label: string;
  icon?: string;
  hint?: string;
  accent?: string;
}

interface FormSelectProps<T extends string | number> {
  label: string;
  value: T;
  options: FormSelectOption<T>[];
  onChange: (value: T) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

/** Premium glass dropdown for modal forms — menu portals above all form layers. */
export function FormSelect<T extends string | number>({
  label,
  value,
  options,
  onChange,
  required = false,
  placeholder = "Select…",
  disabled = false,
}: FormSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, left: 0, width: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const labelId = useId();

  const active = options.find((opt) => opt.value === value);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleReposition = () => updateMenuPosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const menu = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="form-select__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.ul
            ref={menuRef}
            id={listId}
            className="form-select__menu form-select__menu--portal"
            role="listbox"
            aria-labelledby={labelId}
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 460, damping: 30 }}
          >
            {options.map((opt, i) => {
              const selected = opt.value === value;
              return (
                <motion.li
                  key={String(opt.value)}
                  role="option"
                  aria-selected={selected}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button
                    type="button"
                    className={`form-select__option${selected ? " form-select__option--active" : ""}`}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <span className={`form-select__option-icon ${opt.accent ?? "form-select__icon--default"}`}>
                      {opt.icon ?? "•"}
                    </span>
                    <span className="form-select__option-text">
                      <span className="form-select__option-label">{opt.label}</span>
                      {opt.hint && <span className="form-select__option-hint">{opt.hint}</span>}
                    </span>
                    {selected && (
                      <span className="form-select__check" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div
      className={`form-field form-field--select${open ? " form-field--select--open" : ""}`}
      ref={rootRef}
    >
      <span className="form-field__label" id={labelId}>
        {label}
        {required && <span className="required" aria-hidden="true"> *</span>}
      </span>

      <motion.button
        ref={triggerRef}
        type="button"
        className={`form-select__trigger${open ? " form-select__trigger--open" : ""}${active ? " form-select__trigger--filled" : ""}`}
        onClick={() => {
          if (disabled) return;
          if (!open) updateMenuPosition();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        aria-controls={listId}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.985 }}
      >
        <span className={`form-select__icon ${active?.accent ?? "form-select__icon--default"}`} aria-hidden="true">
          {active?.icon ?? "◇"}
        </span>
        <span className="form-select__value">
          <span className="form-select__value-label">{active?.label ?? placeholder}</span>
          {active?.hint && <span className="form-select__value-hint">{active.hint}</span>}
        </span>
        <motion.span
          className="form-select__chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          aria-hidden="true"
        >
          ▾
        </motion.span>
      </motion.button>

      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
}
