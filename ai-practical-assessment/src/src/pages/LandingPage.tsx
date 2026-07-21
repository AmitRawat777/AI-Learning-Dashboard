import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeroVisual } from "../components/animations/HeroVisual";
import { KanbanDragDemo } from "../components/animations/KanbanDragDemo";
import { FeatureIconAnimation } from "../components/animations/SvgAnimations";

const TECH = ["Drupal 11", "React", "JSON:API", "Vite", "TypeScript", "MariaDB"];

const FEATURES = [
  { kind: "dashboard" as const, title: "Live dashboard", desc: "Summary cards powered by real API data." },
  { kind: "kanban" as const, title: "Kanban board", desc: "Drag cards between columns to update status." },
  { kind: "search" as const, title: "Search & filter", desc: "Find tasks instantly by keyword or status." },
  { kind: "crud" as const, title: "Full CRUD", desc: "Create, view, update, and complete tasks." },
];

export function LandingPage() {
  return (
    <>
      <section className="hero">
        <motion.div
          className="hero__copy"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="hero__badge">AI-Powered Learning Tracker</span>
          <h1>
            Learning goals at{" "}
            <span className="hero__highlight">lightning speed</span>
          </h1>
          <p className="hero__sub">
            From <span className="hero__design-box">planning</span> to{" "}
            <span className="hero__code">{"{ progress }"}</span> in a flash.
            Track tasks, owners, due dates, and completion — all in one beautiful dashboard.
          </p>
          <div className="hero__ctas">
            <Link to="/dashboard" className="btn btn--cta btn--lg">
              Get Started <span aria-hidden="true">→</span>
            </Link>
            <a href="#features" className="btn btn--ghost-light btn--lg">
              Explore features <span aria-hidden="true">⌄</span>
            </a>
          </div>
          <div className="hero__tech" aria-label="Tech stack">
            {TECH.map((name, i) => (
              <motion.span
                key={name}
                className="hero__tech-pill"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileHover={{ y: -2, scale: 1.05 }}
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <HeroVisual />
      </section>

      <section id="features" className="features">
        <h2>
          The missing layer between{" "}
          <span className="text-cyan">learning goals</span> and{" "}
          <span className="text-cyan">project delivery</span>
        </h2>
        <p className="features__lead">
          LearnTrack connects your Drupal backend to a React dashboard — giving teams
          real-time visibility into what is planned, in progress, completed, and overdue.
        </p>
        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              className="feature-card glass"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="feature-card__anim">
                <FeatureIconAnimation kind={f.kind} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="kanban-guide" className="guide-section glass">
        <div className="guide-section__copy">
          <span className="guide-section__eyebrow">Quick start guide</span>
          <h2>Move tasks with drag &amp; drop</h2>
          <p className="guide-section__lead">
            On the Kanban board, grab any card and drop it into another column to update
            its status instantly — no edit form required.
          </p>
          <ol className="guide-section__steps">
            <li>Open the dashboard and switch to <strong>Board</strong> view.</li>
            <li>Hover a card — your cursor shows <strong>Drag to another column</strong>.</li>
            <li>Click and hold the card body, then drop it on Planned, In Progress, or Completed.</li>
          </ol>
          <Link to="/dashboard?view=board" className="btn btn--cta">
            Try it on the board <span aria-hidden="true">→</span>
          </Link>
        </div>
        <KanbanDragDemo />
      </section>

      <section id="how-it-works" className="cta-section glass">
        <h2>Ready to track your learning journey?</h2>
        <p>Open the dashboard and start managing tasks in seconds.</p>
        <Link to="/dashboard" className="btn btn--cta btn--lg">
          Open Dashboard <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
