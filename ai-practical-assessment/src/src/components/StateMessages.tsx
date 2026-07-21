import { motion, AnimatePresence } from "framer-motion";
import {
  EmptyInboxAnimation,
  ErrorPulseAnimation,
  LoadingOrbitAnimation,
} from "./animations/SvgAnimations";

interface StateMessageProps {
  title: string;
  message?: string;
}

export function LoadingState({ title, message }: StateMessageProps) {
  return (
    <motion.div
      className="state state-loading"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <LoadingOrbitAnimation />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </motion.div>
  );
}

export function EmptyState({ title, message }: StateMessageProps) {
  return (
    <motion.div
      className="state state-empty"
      role="status"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <EmptyInboxAnimation />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </motion.div>
  );
}

export function ErrorState({
  title,
  message,
  onRetry,
}: StateMessageProps & { onRetry?: () => void }) {
  return (
    <motion.div
      className="state state-error"
      role="alert"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <ErrorPulseAnimation />
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </motion.div>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <AnimatePresence>
      <motion.div
        className="toast toast--success"
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: -20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: -12, x: "-50%" }}
      >
        <span aria-hidden="true">✓</span> {message}
      </motion.div>
    </AnimatePresence>
  );
}
