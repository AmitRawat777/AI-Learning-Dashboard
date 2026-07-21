import Lottie from "lottie-react";
import type { CSSProperties, ReactNode } from "react";

interface LottiePlayerProps {
  animationData: object;
  className?: string;
  loop?: boolean;
  ariaLabel?: string;
  fallback?: ReactNode;
  style?: CSSProperties;
}

/** Plays a bundled Lottie JSON animation with an optional SVG fallback. */
export function LottiePlayer({
  animationData,
  className,
  loop = true,
  ariaLabel,
  fallback = null,
  style,
}: LottiePlayerProps) {
  if (!animationData) return <>{fallback}</>;

  return (
    <div className={className} style={style} role="img" aria-label={ariaLabel}>
      <Lottie animationData={animationData} loop={loop} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
