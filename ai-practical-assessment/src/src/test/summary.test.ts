import { describe, expect, it } from "vitest";
import type { ProjectTask } from "../types/task";
import { computeSummary } from "./summary";

const baseTask = (overrides: Partial<ProjectTask>): ProjectTask => ({
  id: 1,
  title: "Test",
  description: "",
  category: "learning",
  priority: "medium",
  status: "planned",
  ownerId: 1,
  ownerName: "Admin",
  dueDate: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  isOverdue: false,
  ...overrides,
});

describe("computeSummary", () => {
  it("counts totals correctly from task list", () => {
    const tasks = [
      baseTask({ id: 1, status: "completed", priority: "high" }),
      baseTask({ id: 2, status: "in_progress", priority: "high" }),
      baseTask({ id: 3, status: "planned", priority: "low", isOverdue: true }),
      baseTask({ id: 4, status: "planned", priority: "medium" }),
    ];

    expect(computeSummary(tasks)).toEqual({
      total: 4,
      completed: 1,
      inProgress: 1,
      overdue: 1,
      highPriority: 2,
    });
  });

  it("returns zeros for empty list", () => {
    expect(computeSummary([])).toEqual({
      total: 0,
      completed: 0,
      inProgress: 0,
      overdue: 0,
      highPriority: 0,
    });
  });
});
