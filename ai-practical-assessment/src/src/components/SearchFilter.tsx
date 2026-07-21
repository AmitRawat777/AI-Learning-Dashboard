import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TaskStatus } from "../types/task";
import { STATUS_LABELS } from "../types/task";

interface Props {
  search: string;
  status: TaskStatus | "";
  viewMode: "board" | "grid";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskStatus | "") => void;
  onViewModeChange: (mode: "board" | "grid") => void;
}

const STATUS_OPTIONS: {
  value: TaskStatus | "";
  label: string;
  icon: string;
  accent: string;
}[] = [
  { value: "", label: "All", icon: "✦", accent: "status-pill--all" },
  { value: "planned", label: STATUS_LABELS.planned, icon: "📋", accent: "status-pill--planned" },
  { value: "in_progress", label: STATUS_LABELS.in_progress, icon: "🚀", accent: "status-pill--progress" },
  { value: "completed", label: STATUS_LABELS.completed, icon: "✅", accent: "status-pill--done" },
];

const VIEW_MODES = [
  { mode: "board" as const, label: "Board", icon: "▦" },
  { mode: "grid" as const, label: "Cards", icon: "▤" },
];

export function SearchFilter({
  search,
  status,
  viewMode,
  onSearchChange,
  onStatusChange,
  onViewModeChange,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeFilterCount = (search ? 1 : 0) + (status ? 1 : 0);
  const activeStatus = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const clearAll = () => {
    onSearchChange("");
    onStatusChange("");
  };

  return (
    <motion.div
      className={`filter-bar${focused ? " filter-bar--focused" : ""}${activeFilterCount > 0 ? " filter-bar--active" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="filter-bar__glow" aria-hidden="true" />

      <div className="filter-bar__row filter-bar__row--main">
        <div className={`filter-bar__search${focused ? " filter-bar__search--focused" : ""}`}>
          <motion.span
            className="filter-bar__search-icon"
            aria-hidden="true"
            animate={focused ? { scale: 1.1, rotate: -8 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </motion.span>
          <input
            type="search"
            className="filter-bar__input"
            placeholder="Search goals by keyword..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search tasks by keyword"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                type="button"
                className="filter-bar__clear"
                onClick={() => onSearchChange("")}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Clear search"
              >
                ✕
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="filter-bar__dropdown" ref={dropdownRef}>
          <motion.button
            type="button"
            className={`filter-bar__dropdown-trigger${dropdownOpen ? " filter-bar__dropdown-trigger--open" : ""}${status ? " filter-bar__dropdown-trigger--selected" : ""}`}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
            aria-label="Filter by status"
          >
            <span className={`filter-bar__dropdown-icon ${activeStatus.accent}`} aria-hidden="true">
              {activeStatus.icon}
            </span>
            <span className="filter-bar__dropdown-label">
              {status ? activeStatus.label : "All statuses"}
            </span>
            <motion.span
              className="filter-bar__dropdown-chevron"
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            >
              ▾
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                className="filter-bar__dropdown-menu"
                role="listbox"
                aria-label="Status options"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              >
                {STATUS_OPTIONS.map((opt, i) => (
                  <motion.li
                    key={opt.value || "all"}
                    role="option"
                    aria-selected={status === opt.value}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <button
                      type="button"
                      className={`filter-bar__dropdown-item${status === opt.value ? " filter-bar__dropdown-item--active" : ""}`}
                      onClick={() => {
                        onStatusChange(opt.value);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className={`filter-bar__dropdown-item-icon ${opt.accent}`}>{opt.icon}</span>
                      <span>{opt.label}</span>
                      {status === opt.value && (
                        <motion.span
                          className="filter-bar__dropdown-check"
                          layoutId="status-check"
                          aria-hidden="true"
                        >
                          ✓
                        </motion.span>
                      )}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="filter-bar__views" role="group" aria-label="View mode">
          {VIEW_MODES.map(({ mode, label, icon }) => (
            <motion.button
              key={mode}
              type="button"
              className={`filter-bar__view-btn${viewMode === mode ? " filter-bar__view-btn--active" : ""}`}
              onClick={() => onViewModeChange(mode)}
              aria-pressed={viewMode === mode}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {viewMode === mode && (
                <motion.span
                  className="filter-bar__view-pill"
                  layoutId="view-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="filter-bar__view-icon" aria-hidden="true">{icon}</span>
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="filter-bar__row filter-bar__row--pills">
        <span className="filter-bar__pills-label">Quick filter</span>
        <div className="filter-bar__pills" role="radiogroup" aria-label="Filter by status">
          {STATUS_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value || "all"}
              type="button"
              role="radio"
              aria-checked={status === opt.value}
              className={`status-pill ${opt.accent}${status === opt.value ? " status-pill--selected" : ""}`}
              onClick={() => onStatusChange(opt.value)}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="status-pill__icon" aria-hidden="true">{opt.icon}</span>
              <span className="status-pill__text">{opt.label}</span>
              {status === opt.value && (
                <motion.span
                  className="status-pill__ring"
                  layoutId="status-pill-ring"
                  transition={{ type: "spring", stiffness: 380, damping: 26 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeFilterCount > 0 && (
          <motion.div
            className="filter-bar__active"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
          >
            <span className="filter-bar__active-label">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </span>
            <div className="filter-bar__active-chips">
              {search && (
                <span className="filter-chip">
                  <span className="filter-chip__label">Search</span>
                  <span className="filter-chip__value">&ldquo;{search}&rdquo;</span>
                  <button
                    type="button"
                    className="filter-chip__remove"
                    onClick={() => onSearchChange("")}
                    aria-label="Remove search filter"
                  >
                    ✕
                  </button>
                </span>
              )}
              {status && (
                <span className="filter-chip">
                  <span className="filter-chip__label">Status</span>
                  <span className="filter-chip__value">{activeStatus.label}</span>
                  <button
                    type="button"
                    className="filter-chip__remove"
                    onClick={() => onStatusChange("")}
                    aria-label="Remove status filter"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
            <motion.button
              type="button"
              className="filter-bar__clear-all"
              onClick={clearAll}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Clear all
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
