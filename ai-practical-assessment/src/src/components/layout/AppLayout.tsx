import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FloatingOrbs } from "../animations/FloatingOrbs";

interface MarketingLayoutProps {
  children: ReactNode;
}

/** Locofy-style top navigation for the landing page. */
export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="marketing">
      <div className="marketing__bg" aria-hidden="true" />
      <div className="marketing__grid" aria-hidden="true" />

      <header className="topnav topnav--glass">
        <Link to="/" className="topnav__brand">
          <span className="topnav__logo" aria-hidden="true">⚡</span>
          <span>LearnTrack</span>
        </Link>
        <nav className="topnav__links" aria-label="Marketing">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div className="topnav__actions">
          <a
            href="https://ai-practical-assessment.ddev.site/admin"
            className="topnav__login"
            target="_blank"
            rel="noreferrer"
          >
            Admin
          </a>
          <Link to="/dashboard" className="btn btn--cta">
            Get Started <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="marketing-footer">
        <p>AI Learning Dashboard · Drupal 11 + React · Built for practical assessment</p>
      </footer>
    </div>
  );
}

interface AppLayoutProps {
  children?: ReactNode;
}

/** App shell with routing outlet for dashboard pages. */
export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <div className="app-layout__bg" aria-hidden="true" />
      <div className="app-layout__grid" aria-hidden="true" />
      <FloatingOrbs />

      <header className="topnav topnav--glass">
        <Link to="/" className="topnav__brand">
          <span className="topnav__logo" aria-hidden="true">⚡</span>
          <span>LearnTrack</span>
        </Link>
        <nav className="topnav__links" aria-label="Main">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "topnav__link topnav__link--active" : "topnav__link"
            }
            end
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? "topnav__link topnav__link--active" : "topnav__link"
            }
          >
            All Tasks
          </NavLink>
        </nav>
        <div className="topnav__actions">
          <motion.button
            type="button"
            className="btn btn--cta"
            onClick={() => navigate("/tasks/new")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            + New Task
          </motion.button>
        </div>
      </header>

      <motion.main
        className="app-layout__content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children ?? <Outlet />}
      </motion.main>
    </div>
  );
}
