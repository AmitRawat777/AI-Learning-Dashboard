import { motion, type Variants } from "framer-motion";
import { CountUp } from "./CountUp";
import { StatIcon } from "./StatIcon";
import { BannerLottieAccent } from "./animations/BannerLottieAccent";
import type { DashboardSummary } from "../types/task";

interface Props {
  summary: DashboardSummary | null;
  loading: boolean;
  activeStat?: string | null;
  onStatClick?: (key: keyof DashboardSummary) => void;
}

const STATS: {
  key: keyof DashboardSummary;
  label: string;
  gradient: string;
}[] = [
  { key: "total", label: "Total Items", gradient: "stat--violet" },
  { key: "completed", label: "Completed", gradient: "stat--green" },
  { key: "inProgress", label: "In Progress", gradient: "stat--amber" },
  { key: "overdue", label: "Overdue", gradient: "stat--red" },
  { key: "highPriority", label: "High Priority", gradient: "stat--pink" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
};

export function DashboardSummaryCards({ summary, loading, activeStat, onStatClick }: Props) {
  const completionRate =
    summary && summary.total > 0
      ? Math.round((summary.completed / summary.total) * 100)
      : 0;

  return (
    <section className="dashboard-hero" aria-label="Dashboard summary">
      <motion.div
        className="hero-banner hero-banner--interactive"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.005 }}
      >
        <div className="hero-banner__glow" aria-hidden="true" />
        <div className="hero-banner__text">
          <motion.span
            className="hero-banner__eyebrow"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Welcome back ✨
          </motion.span>
          <h2>Continue your learning journey</h2>
          <p>
            {loading
              ? "Loading your progress..."
              : `${summary?.inProgress ?? 0} tasks in progress · ${summary?.overdue ?? 0} need attention`}
          </p>
        </div>
        <div className="hero-banner__visual">
          <BannerLottieAccent />
          <motion.div
            className="hero-banner__ring hero-banner__ring--solo"
            aria-label={`${completionRate}% of tasks completed`}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
          <svg viewBox="0 0 100 100" className="progress-ring">
            <circle className="progress-ring__bg" cx="50" cy="50" r="42" />
            <motion.circle
              className="progress-ring__fill"
              cx="50"
              cy="50"
              r="42"
              strokeDasharray={`${completionRate * 2.64} 264`}
              initial={{ strokeDasharray: "0 264" }}
              animate={{ strokeDasharray: `${completionRate * 2.64} 264` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <span className="progress-ring__label">
            {loading ? "—" : `${completionRate}%`}
          </span>
          <span className="progress-ring__caption">Complete</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="stats-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {STATS.map((stat) => (
          <motion.article
            key={stat.key}
            className={`stat-card stat-card--clickable ${stat.gradient}${activeStat === stat.key ? " stat-card--active" : ""}`}
            variants={item}
            whileHover={{ y: -8, scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStatClick?.(stat.key)}
            role={onStatClick ? "button" : undefined}
            tabIndex={onStatClick ? 0 : undefined}
            onKeyDown={(e) => {
              if (onStatClick && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onStatClick(stat.key);
              }
            }}
          >
            <div className="stat-card__icon" aria-hidden="true">
              <StatIcon stat={stat.key} />
            </div>
            <div>
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value" aria-live="polite" data-testid={`stat-${stat.key}`}>
                {loading || !summary ? (
                  <span className="skeleton skeleton--num" />
                ) : (
                  <CountUp value={summary[stat.key]} />
                )}
              </span>
            </div>
            <span className="stat-card__hint" aria-hidden="true">Filter</span>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
