import { motion } from "framer-motion";
import type { ReactElement } from "react";
import type { TaskPriority } from "../types/task";
import { PRIORITY_LABELS } from "../types/task";

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "sm" | "md";
  className?: string;
}

function HighIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="priority-badge__svg">
      <path
        d="M10 2.5c.8 2.4 2.2 3.6 4 4.5-2.2.6-3.6 1.8-4 4.5-.4-2.7-1.8-3.9-4-4.5 1.8-.9 3.2-2.1 4-4.5Z"
        fill="url(#priority-high-fill)"
      />
      <path
        d="M10 9.5c.5 1.4 1.3 2.1 2.4 2.6-1.3.4-2.1 1.1-2.4 2.4-.3-1.3-1.1-2-2.4-2.4 1.1-.5 1.9-1.2 2.4-2.6Z"
        fill="url(#priority-high-fill)"
        opacity="0.85"
      />
      <defs>
        <linearGradient id="priority-high-fill" x1="6" y1="2" x2="14" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9a6c" />
          <stop offset="1" stopColor="#ff4d6d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="priority-badge__svg">
      <rect x="3" y="11" width="3.5" height="6" rx="1" fill="currentColor" opacity="0.55" />
      <rect x="8.25" y="7" width="3.5" height="10" rx="1" fill="currentColor" opacity="0.8" />
      <rect x="13.5" y="3" width="3.5" height="14" rx="1" fill="currentColor" />
    </svg>
  );
}

function LowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="priority-badge__svg">
      <path
        d="M10 4.5 6.2 10h2.4l-.6 5.5L13.8 10h-2.4l.6-5.5H10Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}

const ICONS: Record<TaskPriority, () => ReactElement> = {
  high: HighIcon,
  medium: MediumIcon,
  low: LowIcon,
};

export function PriorityBadge({ priority, size = "sm", className = "" }: PriorityBadgeProps) {
  const Icon = ICONS[priority];
  const label = PRIORITY_LABELS[priority];

  return (
    <motion.span
      className={`priority-badge priority-badge--${priority} priority-badge--${size}${className ? ` ${className}` : ""}`}
      title={`${label} priority`}
      aria-label={`${label} priority`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
    >
      {priority === "high" && (
        <motion.span
          className="priority-badge__glow"
          aria-hidden="true"
          animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <span className="priority-badge__icon-wrap">
        <Icon />
      </span>
      <span className="priority-badge__label">{label}</span>
    </motion.span>
  );
}

export function OverdueBadge() {
  return (
    <motion.span
      className="priority-badge priority-badge--overdue priority-badge--sm"
      aria-label="Overdue"
      animate={{ opacity: [1, 0.75, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="priority-badge__icon-wrap">
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="priority-badge__svg">
          <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 5.5v5l3 1.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="priority-badge__label">Overdue</span>
    </motion.span>
  );
}
