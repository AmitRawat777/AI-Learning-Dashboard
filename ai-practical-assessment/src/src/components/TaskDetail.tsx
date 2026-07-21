import { motion, AnimatePresence } from "framer-motion";
import type { ProjectTask } from "../types/task";
import { PriorityBadge, OverdueBadge } from "./PriorityBadge";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "../types/task";

interface Props {
  task: ProjectTask;
  onClose: () => void;
  onEdit: () => void;
  onMarkInProgress: () => void;
  onMarkCompleted: () => void;
  updating: boolean;
}

export function TaskDetail({
  task,
  onClose,
  onEdit,
  onMarkInProgress,
  onMarkCompleted,
  updating,
}: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        <header className="drawer__header">
          <button type="button" className="drawer__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
          <span className={`drawer__status drawer__status--${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </header>

        <div className="drawer__body">
          <span className={`drawer__category drawer__category--${task.category}`}>
            {CATEGORY_LABELS[task.category]}
          </span>
          <h2 id="task-detail-title">{task.title}</h2>

          <div className="drawer__pills">
            <PriorityBadge priority={task.priority} size="md" />
            {task.isOverdue && <OverdueBadge />}
          </div>

          <section className="drawer__section">
            <h3>Description</h3>
            <p>{task.description || "No description provided."}</p>
          </section>

          <dl className="drawer__meta">
            <div>
              <dt>Owner</dt>
              <dd>{task.ownerName}</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not set"}
              </dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{new Date(task.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{new Date(task.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <footer className="drawer__footer">
          <motion.button
            type="button"
            className="btn btn--primary"
            onClick={onEdit}
            disabled={updating}
            whileTap={{ scale: 0.97 }}
          >
            Edit task
          </motion.button>
          {task.status !== "in_progress" && (
            <motion.button
              type="button"
              className="btn btn--secondary"
              onClick={onMarkInProgress}
              disabled={updating}
              whileTap={{ scale: 0.97 }}
            >
              {updating
                ? "Updating…"
                : task.status === "completed"
                  ? "Reopen task"
                  : "Mark in progress"}
            </motion.button>
          )}
          {task.status !== "completed" && (
            <motion.button
              type="button"
              className="btn btn--success"
              onClick={onMarkCompleted}
              disabled={updating}
              whileTap={{ scale: 0.97 }}
            >
              {updating ? "Updating…" : "Mark completed"}
            </motion.button>
          )}
        </footer>
      </motion.aside>
    </AnimatePresence>
  );
}
