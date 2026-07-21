import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import learningAnimation from "../../assets/lottie/learning.json";
import { LottiePlayer } from "./LottiePlayer";
import { HeroSceneAnimation } from "./SvgAnimations";

const CODE_LINES = [
  { text: "function LearningCard({ task }) {", color: "kw" },
  { text: "  return (", color: "plain" },
  { text: '    <Card title={task.title}>', color: "plain" },
  { text: '      <Badge status={task.status} />', color: "fn" },
  { text: "      <Progress value={task.progress} />", color: "fn" },
  { text: "    </Card>", color: "plain" },
  { text: "  );", color: "plain" },
  { text: "}", color: "kw" },
];

export function HeroVisual() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-120, 120], [6, -6]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-120, 120], [-6, 6]), { stiffness: 120, damping: 20 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="hero__visual-stack"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      <div className="hero__lottie-wrap">
        <LottiePlayer
          animationData={learningAnimation}
          className="hero__lottie"
          ariaLabel="Animated learning illustration"
          fallback={<HeroSceneAnimation />}
        />
      </div>

      <div className="code-panel glass hero__code-panel">
        <div className="code-panel__bar">
          <span /><span /><span />
          <span className="code-panel__title">TaskCard.tsx</span>
        </div>
        <pre className="code-panel__body">
          {CODE_LINES.map((line, i) => (
            <motion.div
              key={line.text}
              className={`code-line code-line--${line.color}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.07 }}
            >
              {line.text}
            </motion.div>
          ))}
        </pre>
        <motion.div
          className="code-panel__bolt"
          animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          aria-hidden="true"
        >
          ⚡
        </motion.div>
        <motion.div
          className="code-panel__cursor code-panel__cursor--a"
          animate={{ x: [0, 6, 0], y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Alex
        </motion.div>
        <motion.div
          className="code-panel__cursor code-panel__cursor--b"
          animate={{ x: [0, -8, 0], y: [0, 5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          Sam
        </motion.div>
      </div>
    </motion.div>
  );
}
