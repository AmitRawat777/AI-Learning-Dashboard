import { motion } from "framer-motion";
import type { ReactNode } from "react";

const float = (delay = 0) => ({
  animate: { y: [0, -8, 0] },
  transition: { duration: 3 + delay * 0.4, repeat: Infinity, ease: "easeInOut" as const, delay },
});

/** Original copyright-free loading orbit animation. */
export function LoadingOrbitAnimation() {
  return (
    <svg viewBox="0 0 120 120" className="svg-anim svg-anim--loading" aria-hidden="true">
      <motion.circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="rgba(85,255,255,0.2)"
        strokeWidth="4"
      />
      <motion.circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="#55ffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="80 200"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }}
      />
      <motion.circle
        cx="60"
        cy="16"
        r="6"
        fill="#3dffa8"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "60px 60px" }}
      />
    </svg>
  );
}

/** Original copyright-free empty inbox illustration. */
export function EmptyInboxAnimation() {
  return (
    <svg viewBox="0 0 200 160" className="svg-anim svg-anim--empty" aria-hidden="true">
      <motion.rect
        x="40"
        y="50"
        width="120"
        height="80"
        rx="12"
        fill="rgba(255,255,255,0.12)"
        stroke="rgba(85,255,255,0.5)"
        strokeWidth="2"
        {...float(0)}
      />
      <motion.path
        d="M40 62 L100 95 L160 62"
        fill="none"
        stroke="rgba(85,255,255,0.6)"
        strokeWidth="2"
        {...float(0.2)}
      />
      <motion.circle
        cx="100"
        cy="40"
        r="18"
        fill="rgba(61,255,168,0.25)"
        stroke="#3dffa8"
        strokeWidth="2"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.text
        x="100"
        y="46"
        textAnchor="middle"
        fill="#fff"
        fontSize="18"
        fontWeight="700"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ?
      </motion.text>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={70 + i * 30}
          cy="130"
          r="4"
          fill="#55ffff"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </svg>
  );
}

/** Original copyright-free error pulse illustration. */
export function ErrorPulseAnimation() {
  return (
    <svg viewBox="0 0 120 120" className="svg-anim svg-anim--error" aria-hidden="true">
      <motion.circle
        cx="60"
        cy="60"
        r="40"
        fill="rgba(255,120,120,0.15)"
        stroke="#ff8a8a"
        strokeWidth="2"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.path
        d="M60 35 L60 68 M60 78 L60 82"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
    </svg>
  );
}

type FeatureKind = "dashboard" | "kanban" | "search" | "crud";

const FEATURE_PATHS: Record<FeatureKind, ReactNode> = {
  dashboard: (
    <>
      <motion.rect x="20" y="30" width="60" height="40" rx="6" fill="rgba(85,255,255,0.2)" stroke="#55ffff" strokeWidth="2" {...float(0)} />
      <motion.rect x="90" y="20" width="50" height="25" rx="4" fill="rgba(61,255,168,0.2)" stroke="#3dffa8" strokeWidth="2" {...float(0.3)} />
      <motion.rect x="90" y="55" width="50" height="50" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" {...float(0.5)} />
      <motion.polyline points="25,60 40,48 55,55 70,38" fill="none" stroke="#3dffa8" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
    </>
  ),
  kanban: (
    <>
      {[0, 1, 2].map((col) => (
        <motion.g key={col} {...float(col * 0.15)}>
          <rect x={18 + col * 38} y="22" width="30" height="76" rx="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <rect x={22 + col * 38} y={30 + col * 8} width="22" height="14" rx="3" fill={col === 0 ? "rgba(85,255,255,0.35)" : col === 1 ? "rgba(255,216,102,0.35)" : "rgba(61,255,168,0.35)"} />
          <rect x={22 + col * 38} y={50 + col * 4} width="22" height="14" rx="3" fill="rgba(255,255,255,0.12)" />
        </motion.g>
      ))}
    </>
  ),
  search: (
    <>
      <motion.circle cx="55" cy="55" r="28" fill="none" stroke="#55ffff" strokeWidth="3" {...float(0)} />
      <motion.line x1="76" y1="76" x2="95" y2="95" stroke="#3dffa8" strokeWidth="4" strokeLinecap="round" {...float(0.2)} />
      <motion.circle cx="55" cy="55" r="8" fill="#3dffa8" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
    </>
  ),
  crud: (
    <>
      <motion.rect x="30" y="25" width="60" height="70" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" strokeWidth="2" {...float(0)} />
      <motion.path d="M45 45 H75 M45 58 H68 M45 71 H60" stroke="#55ffff" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} />
      <motion.circle cx="85" cy="85" r="16" fill="#3dffa8" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.path d="M78 85 L83 90 L93 78" fill="none" stroke="#053a6e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function FeatureIconAnimation({ kind }: { kind: FeatureKind }) {
  return (
    <svg viewBox="0 0 120 120" className="svg-anim svg-anim--feature" aria-hidden="true">
      {FEATURE_PATHS[kind]}
    </svg>
  );
}

/** Interactive hero scene — original SVG dashboard mock with parallax cards. */
export function HeroSceneAnimation() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <motion.div className="hero-scene__card hero-scene__card--back" {...float(0.4)} />
      <motion.div className="hero-scene__card hero-scene__card--mid" {...float(0.2)} />
      <motion.div className="hero-scene__card hero-scene__card--front" {...float(0)}>
        <span className="hero-scene__bar" />
        <span className="hero-scene__bar hero-scene__bar--short" />
        <span className="hero-scene__bar hero-scene__bar--accent" />
      </motion.div>
      <motion.div
        className="hero-scene__orb"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}
