import { motion } from "framer-motion";

const ORBS = [
  { size: 280, x: "8%", y: "12%", color: "rgba(85, 255, 255, 0.18)", duration: 14 },
  { size: 200, x: "78%", y: "8%", color: "rgba(61, 255, 168, 0.14)", duration: 18 },
  { size: 320, x: "65%", y: "55%", color: "rgba(85, 255, 255, 0.12)", duration: 22 },
  { size: 160, x: "15%", y: "70%", color: "rgba(255, 255, 255, 0.08)", duration: 16 },
];

/** Ambient floating orbs for depth on dashboard pages. */
export function FloatingOrbs() {
  return (
    <div className="floating-orbs" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <motion.span
          key={i}
          className="floating-orbs__orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 24, -16, 0],
            y: [0, -20, 12, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
