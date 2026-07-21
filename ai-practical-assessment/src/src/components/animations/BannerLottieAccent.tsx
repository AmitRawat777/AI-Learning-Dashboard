import { motion } from "framer-motion";
import learningAnimation from "../../assets/lottie/learning.json";
import { LottiePlayer } from "./LottiePlayer";

/** Subtle Lottie accent for dashboard welcome banner. */
export function BannerLottieAccent() {
  return (
    <motion.div
      className="hero-banner__lottie"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 0.45, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <LottiePlayer animationData={learningAnimation} loop className="hero-banner__lottie-inner" />
    </motion.div>
  );
}
