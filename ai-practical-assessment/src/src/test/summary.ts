import type { DashboardSummary, ProjectTask } from "../types/task";

/**
 * Client-side summary calculation (mirrors backend logic for tests).
 */
export function computeSummary(tasks: ProjectTask[]): DashboardSummary {
  return {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    overdue: tasks.filter((t) => t.isOverdue).length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
  };
}
