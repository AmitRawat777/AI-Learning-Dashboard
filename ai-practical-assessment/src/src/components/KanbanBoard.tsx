import { useCallback, useRef, useState, type DragEvent as ReactDragEvent, type PointerEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { TiltCard } from "./TiltCard";
import { PriorityBadge } from "./PriorityBadge";
import type { ProjectTask, TaskStatus } from "../types/task";
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "../types/task";

const COLUMNS: { status: TaskStatus; label: string; color: string; icon: string }[] = [
  { status: "planned", label: "Planned", color: "kanban-col--planned", icon: "📋" },
  { status: "in_progress", label: "In Progress", color: "kanban-col--progress", icon: "🚀" },
  { status: "completed", label: "Completed", color: "kanban-col--done", icon: "✅" },
];

const DRAG_MIME = "application/x-learntrack-task-id";
const DRAG_CURSOR_TIP = "Drag to another column";

interface DragCursorTip {
  x: number;
  y: number;
}

interface Props {
  tasks: ProjectTask[];
  onSelect: (task: ProjectTask) => void;
  onEdit: (task: ProjectTask) => void;
  onQuickStatus?: (task: ProjectTask, status: TaskStatus) => void;
  movingTaskId?: number | null;
}

function nextAction(status: TaskStatus): { label: string; next: TaskStatus } | null {
  if (status === "planned") return { label: "Start →", next: "in_progress" };
  if (status === "in_progress") return { label: "Mark complete ✓", next: "completed" };
  return { label: "Reopen ↺", next: "in_progress" };
}

function isInteractiveDragTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest(".task-card__edit, .task-card__quick, .task-card__title"),
  );
}

function canShowDragHint(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !isInteractiveDragTarget(target);
}

/** Kanban board with drag-and-drop status updates. */
export function KanbanBoard({
  tasks,
  onSelect,
  onEdit,
  onQuickStatus,
  movingTaskId = null,
}: Props) {
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [dragCursorTip, setDragCursorTip] = useState<DragCursorTip | null>(null);
  const draggingIdRef = useRef<number | null>(null);
  const dropHandledRef = useRef(false);
  const dragCounters = useRef<Record<TaskStatus, number>>({
    planned: 0,
    in_progress: 0,
    completed: 0,
  });

  const findTask = useCallback(
    (id: number) => tasks.find((t) => t.id === id),
    [tasks],
  );

  const beginDrag = (task: ProjectTask) => {
    dropHandledRef.current = false;
    draggingIdRef.current = task.id;
    setDraggingId(task.id);
    setDragCursorTip(null);
  };

  const endDrag = () => {
    draggingIdRef.current = null;
    setDraggingId(null);
    setDropTarget(null);
    dragCounters.current = { planned: 0, in_progress: 0, completed: 0 };
  };

  const handleDragStart = (e: ReactDragEvent<HTMLDivElement>, task: ProjectTask) => {
    if (!onQuickStatus) return;
    e.stopPropagation();
    e.dataTransfer.setData(DRAG_MIME, String(task.id));
    e.dataTransfer.setData("text/plain", String(task.id));
    e.dataTransfer.effectAllowed = "move";
    beginDrag(task);

    const card = (e.currentTarget as HTMLElement).closest(".kanban-card");
    if (card instanceof HTMLElement) {
      e.dataTransfer.setDragImage(card, card.clientWidth / 2, 28);
    }
  };

  const handleDragEnd = () => {
    endDrag();
  };

  const handleDragEnter = (status: TaskStatus) => {
    if (draggingIdRef.current === null) return;
    dragCounters.current[status] += 1;
    setDropTarget(status);
  };

  const handleDragLeave = (status: TaskStatus, e: ReactDragEvent<HTMLDivElement>) => {
    const related = e.relatedTarget;
    if (related instanceof Node && e.currentTarget.contains(related)) {
      return;
    }
    dragCounters.current[status] -= 1;
    if (dragCounters.current[status] <= 0) {
      dragCounters.current[status] = 0;
      setDropTarget((prev) => (prev === status ? null : prev));
    }
  };

  const handleDrop = (e: ReactDragEvent<HTMLDivElement>, targetStatus: TaskStatus) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onQuickStatus || dropHandledRef.current) return;

    const raw = e.dataTransfer.getData(DRAG_MIME) || e.dataTransfer.getData("text/plain");
    const taskId = Number(raw);
    if (Number.isNaN(taskId)) {
      endDrag();
      return;
    }

    const task = findTask(taskId);
    dropHandledRef.current = true;
    endDrag();

    if (task && task.status !== targetStatus) {
      onQuickStatus(task, targetStatus);
    }
  };

  const handleDragOver = (e: ReactDragEvent<HTMLDivElement>) => {
    if (draggingIdRef.current === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const showCardDragHint = (taskId: number, e: PointerEvent<HTMLElement>) => {
    if (!onQuickStatus || movingTaskId === taskId || draggingId !== null) return;
    if (!canShowDragHint(e.target)) return;
    setHoveredCardId(taskId);
    setDragCursorTip({ x: e.clientX, y: e.clientY });
  };

  const moveCardDragHint = (taskId: number, e: PointerEvent<HTMLElement>) => {
    if (hoveredCardId !== taskId || draggingId !== null) return;
    if (!canShowDragHint(e.target)) {
      setDragCursorTip(null);
      return;
    }
    setDragCursorTip({ x: e.clientX, y: e.clientY });
  };

  const hideCardDragHint = () => {
    setHoveredCardId(null);
    setDragCursorTip(null);
  };

  const isDragging = draggingIdRef.current !== null;

  return (
    <>
      <div className="kanban" role="region" aria-label="Task board">
        {COLUMNS.map((col, colIndex) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);
          const isDropTarget = dropTarget === col.status && isDragging;
          const draggingTask = draggingId ? findTask(draggingId) : null;
          const showDropHint =
            isDropTarget && draggingTask && draggingTask.status !== col.status;

          return (
            <motion.div
              key={col.status}
              className={`kanban-col ${col.color}${isDropTarget ? " kanban-col--drop-target" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: colIndex * 0.1, duration: 0.4 }}
              onDragEnter={() => handleDragEnter(col.status)}
              onDragLeave={(e) => handleDragLeave(col.status, e)}
              onDragOverCapture={handleDragOver}
              onDropCapture={(e) => handleDrop(e, col.status)}
            >
              <header className="kanban-col__header">
                <h3>
                  <span className="kanban-col__icon" aria-hidden="true">{col.icon}</span>
                  {col.label}
                </h3>
                <motion.span
                  className="kanban-col__count"
                  key={columnTasks.length}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {columnTasks.length}
                </motion.span>
              </header>

              <div
                className={`kanban-col__cards${showDropHint ? " kanban-col__cards--highlight" : ""}`}
                onDragOverCapture={handleDragOver}
                onDropCapture={(e) => handleDrop(e, col.status)}
              >
                <AnimatePresence mode="popLayout">
                  {columnTasks.map((task, i) => {
                    const action = nextAction(task.status);
                    const isDraggingCard = draggingId === task.id;
                    const isMoving = movingTaskId === task.id;
                    const isHovered = hoveredCardId === task.id && !isDraggingCard;

                    return (
                      <motion.div
                        key={task.id}
                        className={`kanban-card${isDraggingCard ? " kanban-card--dragging" : ""}${isMoving ? " kanban-card--moving" : ""}${isDropTarget && !isDraggingCard ? " kanban-card--pass-through" : ""}${isHovered ? " kanban-card--hint" : ""}`}
                        layout
                        layoutId={`kanban-task-${task.id}`}
                        draggable={Boolean(onQuickStatus && !isMoving)}
                        onDragStart={(e) => {
                          const dragEvent = e as unknown as ReactDragEvent<HTMLDivElement>;
                          if (isInteractiveDragTarget(dragEvent.target)) {
                            dragEvent.preventDefault();
                            return;
                          }
                          handleDragStart(dragEvent, task);
                        }}
                        onDragEnd={handleDragEnd}
                        onDragOverCapture={handleDragOver}
                        onDropCapture={(e) => handleDrop(e, col.status)}
                        onPointerEnter={(e) => showCardDragHint(task.id, e)}
                        onPointerMove={(e) => moveCardDragHint(task.id, e)}
                        onPointerLeave={hideCardDragHint}
                        initial={{ opacity: 0, scale: 0.9, y: 12 }}
                        animate={{
                          opacity: isDraggingCard ? 0.45 : 1,
                          scale: isDraggingCard ? 0.96 : 1,
                          y: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.85, y: -8 }}
                        transition={{ delay: i * 0.04, type: "spring", stiffness: 320, damping: 26 }}
                      >
                        {onQuickStatus && (
                          <span className="kanban-card__drag-label" aria-hidden="true">
                            ⠿ Drag to move
                          </span>
                        )}

                        <TiltCard
                          className={`task-card task-card--interactive task-card--draggable task-card--${task.priority}${task.isOverdue ? " task-card--overdue" : ""}`}
                          interactive={!isDraggingCard && !isMoving}
                        >
                          {onQuickStatus && (
                            <span
                              className="task-card__drag-handle"
                              aria-hidden="true"
                              title="Drag to move between columns"
                            >
                              ⠿
                            </span>
                          )}

                          <div className="task-card__top">
                            <span className={`task-card__category task-card__category--${task.category}`}>
                              {CATEGORY_LABELS[task.category]}
                            </span>
                            <span className={`task-card__status task-card__status--${task.status}`}>
                              {STATUS_LABELS[task.status]}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="task-card__title"
                            onClick={() => onSelect(task)}
                          >
                            {task.title}
                            <span className="task-card__arrow" aria-hidden="true">→</span>
                          </button>
                          <p className="task-card__desc">
                            {task.description?.slice(0, 80)}
                            {(task.description?.length ?? 0) > 80 ? "…" : ""}
                          </p>
                          <footer className="task-card__footer">
                            <PriorityBadge priority={task.priority} />
                            <span className="task-card__owner">
                              <span className="task-card__avatar" aria-hidden="true">
                                {task.ownerName?.charAt(0).toUpperCase() ?? "?"}
                              </span>
                              {task.ownerName}
                            </span>
                            {task.dueDate && (
                              <time dateTime={task.dueDate} className={task.isOverdue ? "task-card__due--overdue" : ""}>
                                {new Date(task.dueDate).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </time>
                            )}
                          </footer>
                          <div className="task-card__actions">
                            {action && onQuickStatus && (
                              <motion.button
                                type="button"
                                className="task-card__quick btn btn--small"
                                onClick={() => onQuickStatus(task, action.next)}
                                disabled={isMoving}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {isMoving ? "Saving…" : action.label}
                              </motion.button>
                            )}
                            <button
                              type="button"
                              className="task-card__edit"
                              onClick={() => onEdit(task)}
                              aria-label={`Edit ${task.title}`}
                            >
                              Edit
                            </button>
                          </div>
                        </TiltCard>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <motion.div
                    className={`kanban-col__empty${showDropHint ? " kanban-col__empty--active" : ""}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    layout
                    onDragOverCapture={handleDragOver}
                    onDropCapture={(e) => handleDrop(e, col.status)}
                  >
                    {showDropHint ? (
                      <>
                        <span className="kanban-col__drop-icon" aria-hidden="true">↓</span>
                        Release to move here
                      </>
                    ) : (
                      <>Drop tasks here · No {col.label.toLowerCase()} items</>
                    )}
                  </motion.div>
                )}

                {showDropHint && columnTasks.length > 0 && (
                  <motion.div
                    className="kanban-col__drop-zone"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onDragOverCapture={handleDragOver}
                    onDropCapture={(e) => handleDrop(e, col.status)}
                  >
                    Release to move here
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {dragCursorTip && typeof document !== "undefined"
        ? createPortal(
            <div
              className="kanban-drag-cursor-tip"
              style={{ left: dragCursorTip.x + 14, top: dragCursorTip.y + 14 }}
              aria-hidden="true"
            >
              {DRAG_CURSOR_TIP}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
