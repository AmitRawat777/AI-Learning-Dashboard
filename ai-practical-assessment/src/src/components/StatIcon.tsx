import type { ReactElement } from "react";
import type { DashboardSummary } from "../types/task";

const STAT_META: Record<
  keyof DashboardSummary,
  { label: string; tooltip: string; paths: ReactElement }
> = {
  total: {
    label: "Total items",
    tooltip: "All tasks in your workspace",
    paths: (
      <>
        <rect x="3.5" y="4" width="13" height="12" rx="2.2" fill="url(#stat-total-fill)" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 8.2h6M7 10.8h4.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
        <circle cx="14.5" cy="6.8" r="1.2" fill="currentColor" opacity="0.85" />
      </>
    ),
  },
  completed: {
    label: "Completed",
    tooltip: "Tasks finished and marked done",
    paths: (
      <>
        <circle cx="10" cy="10" r="7.2" fill="url(#stat-done-fill)" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6.4 10.1 8.7 12.4 13.8 7.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
  },
  inProgress: {
    label: "In progress",
    tooltip: "Tasks actively being worked on",
    paths: (
      <>
        <path d="M10 3.8v2.2M10 14v2.2M3.8 10H1.6M18.4 10H16.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
        <circle cx="10" cy="10" r="5.8" fill="url(#stat-progress-fill)" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 6.8V10l2.6 1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </>
    ),
  },
  overdue: {
    label: "Overdue",
    tooltip: "Tasks past their due date",
    paths: (
      <>
        <circle cx="10" cy="10.5" r="6.8" fill="url(#stat-overdue-fill)" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 7.2v4l2.4 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M10 3.2V2M14.2 4.4l.8-.8M16.8 10.5h1.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      </>
    ),
  },
  highPriority: {
    label: "High priority",
    tooltip: "Urgent tasks that need attention",
    paths: (
      <path
        d="M10 3.2c.75 2.2 2 3.2 3.6 4-2 .55-3.25 1.65-3.6 4-.35-2.35-1.6-3.45-3.6-4 1.6-.8 2.85-1.8 3.6-4Z"
        fill="url(#stat-priority-fill)"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    ),
  },
};

/** Premium glass-style stat icon with Uiverse-inspired hover tooltip. */
export function StatIcon({ stat }: { stat: keyof DashboardSummary }) {
  const { label, tooltip, paths } = STAT_META[stat];

  return (
    <span className={`stat-icon-wrap stat-icon-wrap--${stat}`}>
      <span className={`stat-icon stat-icon--${stat}`} role="img" aria-label={label}>
        <svg viewBox="0 0 20 20" fill="none" className="stat-icon__svg" aria-hidden="true">
          <defs>
            <linearGradient id="stat-total-fill" x1="3" y1="4" x2="17" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(85,255,255,0.42)" />
              <stop offset="1" stopColor="rgba(85,255,255,0.08)" />
            </linearGradient>
            <linearGradient id="stat-done-fill" x1="3" y1="3" x2="17" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(61,255,168,0.4)" />
              <stop offset="1" stopColor="rgba(61,255,168,0.1)" />
            </linearGradient>
            <linearGradient id="stat-progress-fill" x1="4" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,216,102,0.45)" />
              <stop offset="1" stopColor="rgba(255,160,40,0.12)" />
            </linearGradient>
            <linearGradient id="stat-overdue-fill" x1="3" y1="3" x2="17" y2="17" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(255,110,110,0.4)" />
              <stop offset="1" stopColor="rgba(255,60,80,0.1)" />
            </linearGradient>
            <linearGradient id="stat-priority-fill" x1="6" y1="3" x2="14" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff9a6c" />
              <stop offset="1" stopColor="#ff4d6d" />
            </linearGradient>
          </defs>
          {paths}
        </svg>
        <span className="stat-icon__glow" aria-hidden="true" />
      </span>
      <span className="stat-icon-tooltip" role="tooltip">
        {tooltip}
      </span>
    </span>
  );
}
