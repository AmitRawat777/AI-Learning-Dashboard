import { motion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  /** Max tilt degrees on pointer move (default 10). */
  intensity?: number;
}

/** 3D tilt on pointer move for interactive cards. */
export function TiltCard({
  children,
  className = "",
  onClick,
  interactive = true,
  intensity = 10,
}: TiltCardProps) {
  const rotateX = useSpring(0, { stiffness: 300, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 24 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-py * intensity);
    rotateY.set(px * intensity);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={`tilt-card ${className}`.trim()}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      style={{
        rotateX: interactive ? rotateX : 0,
        rotateY: interactive ? rotateY : 0,
        transformPerspective: 800,
      }}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      <span className="tilt-card__shine" aria-hidden="true" />
      {children}
    </motion.div>
  );
}
