import { motion } from "framer-motion";

/** Animated Kanban drag-and-drop demo for the landing page guide. */
export function KanbanDragDemo() {
  return (
    <div className="kanban-demo" aria-hidden="true">
      <svg viewBox="0 0 420 200" className="kanban-demo__svg">
        {[0, 1, 2].map((col) => (
          <g key={col}>
            <rect
              x={16 + col * 136}
              y="24"
              width="112"
              height="160"
              rx="10"
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            />
            <text
              x={72 + col * 136}
              y="44"
              textAnchor="middle"
              fill="rgba(255,255,255,0.65)"
              fontSize="10"
              fontWeight="700"
            >
              {col === 0 ? "Planned" : col === 1 ? "In Progress" : "Completed"}
            </text>
          </g>
        ))}

        <motion.rect
          x="28"
          y="58"
          width="88"
          height="36"
          rx="8"
          fill="rgba(85,255,255,0.28)"
          stroke="#55ffff"
          strokeWidth="1.5"
          animate={{ x: [28, 28, 164, 164], y: [58, 58, 72, 72] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.55, 1],
            repeatDelay: 0.8,
          }}
        />
        <motion.text
          x="72"
          y="80"
          textAnchor="middle"
          fill="#fff"
          fontSize="9"
          fontWeight="700"
          animate={{ x: [72, 72, 208, 208], y: [80, 80, 94, 94] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.55, 1],
            repeatDelay: 0.8,
          }}
        >
          Drag me
        </motion.text>

        <motion.path
          d="M 72 100 Q 120 88 164 92"
          fill="none"
          stroke="rgba(61,255,168,0.8)"
          strokeWidth="2"
          strokeDasharray="4 4"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" }}
        />

        <motion.g
          animate={{ x: [0, 0, 8, 0], y: [0, 0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="360" cy="168" r="14" fill="rgba(61,255,168,0.25)" stroke="#3dffa8" strokeWidth="1.5" />
          <path
            d="M354 168 L358 172 L366 162"
            fill="none"
            stroke="#3dffa8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>

      <div className="kanban-demo__cursor">
        <motion.span
          className="kanban-demo__cursor-icon"
          animate={{ x: [40, 40, 176, 176], y: [70, 70, 84, 84] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.55, 1],
            repeatDelay: 0.8,
          }}
        >
          🖱️
        </motion.span>
        <motion.span
          className="kanban-demo__cursor-label"
          animate={{ x: [52, 52, 188, 188], y: [58, 58, 72, 72], opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.15, 0.55, 1],
            repeatDelay: 0.8,
          }}
        >
          Drag to move
        </motion.span>
      </div>
    </div>
  );
}
