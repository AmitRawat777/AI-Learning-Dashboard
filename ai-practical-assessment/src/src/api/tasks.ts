import { apiGet, apiPatch, apiPost } from "./client";
import type { DashboardSummary, ProjectTask, TaskInput } from "../types/task";

interface ListResponse {
  data: ProjectTask[];
}

interface ItemResponse {
  data: ProjectTask;
  message?: string;
}

interface SummaryResponse {
  data: DashboardSummary;
}

export async function fetchTasks(params?: {
  status?: string;
  search?: string;
}): Promise<ProjectTask[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const qs = query.toString();
  const result = await apiGet<ListResponse>(`/api/tasks${qs ? `?${qs}` : ""}`);
  return result.data;
}

export async function fetchTask(id: number): Promise<ProjectTask> {
  const result = await apiGet<ItemResponse>(`/api/tasks/${id}`);
  return result.data;
}

export async function fetchSummary(): Promise<DashboardSummary> {
  const result = await apiGet<SummaryResponse>("/api/tasks/summary");
  return result.data;
}

export async function createTask(input: TaskInput): Promise<ProjectTask> {
  const result = await apiPost<ItemResponse>("/api/tasks", input);
  return result.data;
}

export async function updateTask(
  id: number,
  input: Partial<TaskInput>,
): Promise<ProjectTask> {
  const result = await apiPatch<ItemResponse>(`/api/tasks/${id}`, input);
  return result.data;
}
