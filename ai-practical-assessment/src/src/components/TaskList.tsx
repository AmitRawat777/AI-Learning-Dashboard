import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { PriorityBadge, OverdueBadge } from "./PriorityBadge";
import type { ProjectTask, TaskStatus } from "../types/task";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "../types/task";

interface Props {
  tasks: ProjectTask[];
  onSelect: (task: ProjectTask) => void;
  onEdit: (task: ProjectTask) => void;
  onQuickStatus?: (task: ProjectTask, status: TaskStatus) => void;
}

function nextAction(status: TaskStatus): { label: string; next: TaskStatus } | null {
  if (status === "planned") return { label: "Start", next: "in_progress" };
  if (status === "in_progress") return { label: "Complete", next: "completed" };
  return { label: "Reopen", next: "in_progress" };
}

/** Udemy-style course card grid for filtered list view. */
export function TaskCardGrid({ tasks, onSelect, onEdit, onQuickStatus }: Props) {
  return (
    <div className="card-grid">
      <AnimatePresence mode="sync">
        {tasks.map((task, i) => {
          const action = nextAction(task.status);
          const hasDescription = Boolean(task.description?.trim());

          return (
            <motion.div
              key={task.id}
              className="card-grid__item"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                delay: Math.min(i * 0.04, 0.24),
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <TiltCard
                className={`course-card course-card--interactive course-card--${task.category} course-card--status-${task.status}${task.isOverdue ? " course-card--overdue" : ""}`}
                intensity={4}
              >
                <header className={`course-card__banner course-card__banner--${task.status}`}>
                  <div className="course-card__badges">
                    <PriorityBadge priority={task.priority} />
                    {task.isOverdue && <OverdueBadge />}
                  </div>
                </header>

                <div className="course-card__body">
                  <span className="course-card__category">
                    {CATEGORY_LABELS[task.category]}
                  </span>
                  <button
                    type="button"
                    className="course-card__title"
                    onClick={() => onSelect(task)}
                  >
                    {task.title}
                  </button>
                  <p
                    className={`course-card__desc${hasDescription ? "" : " course-card__desc--empty"}`}
                  >
                    {hasDescription ? task.description : "No description"}
                  </p>
                  <div className="course-card__meta">
                    <span className={`status-dot status-dot--${task.status}`} />
                    <span>{STATUS_LABELS[task.status]}</span>
                    <span className="course-card__meta-sep" aria-hidden="true">·</span>
                    <span className="task-card__avatar" aria-hidden="true">
                      {task.ownerName?.charAt(0).toUpperCase() ?? "?"}
                    </span>
                    <span className="course-card__owner">{task.ownerName}</span>
                  </div>
                </div>

                <footer className="course-card__footer">
                  <div className="course-card__due">
                    {task.dueDate ? (
                      <time
                        dateTime={task.dueDate}
                        className={task.isOverdue ? "course-card__due--overdue" : undefined}
                      >
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </time>
                    ) : (
                      <span className="course-card__due--none">No due date</span>
                    )}
                  </div>
                  <div className="course-card__footer-actions">
                    {action && onQuickStatus && (
                      <button
                        type="button"
                        className="btn btn--small btn--primary course-card__action"
                        onClick={() => onQuickStatus(task, action.next)}
                      >
                        {action.label}
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn--ghost btn--small course-card__edit"
                      onClick={() => onEdit(task)}
                    >
                      Edit
                    </button>
                  </div>
                </footer>
              </TiltCard>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
