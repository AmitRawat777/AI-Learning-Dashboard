export type TaskStatus = "planned" | "in_progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "learning" | "project" | "research" | "other";

export interface ProjectTask {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  ownerId: number;
  ownerName: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export interface DashboardSummary {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  highPriority: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface TaskInput {
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  ownerId: number;
  dueDate: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  planned: "Planned",
  in_progress: "In Progress",
  completed: "Completed",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  learning: "Learning",
  project: "Project",
  research: "Research",
  other: "Other",
};
