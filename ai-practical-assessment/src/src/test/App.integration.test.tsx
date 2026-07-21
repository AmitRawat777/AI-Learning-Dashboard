import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRoutes } from "../App";
import * as tasksApi from "../api/tasks";
import * as usersApi from "../api/users";
import type { ProjectTask, User } from "../types/task";
import { renderWithRouter } from "./renderWithRouter";

const mockUsers: User[] = [
  { id: 2, name: "Alex", email: "alex@example.com", role: "learner" },
  { id: 3, name: "Sam", email: "sam@example.com", role: "developer" },
];

const mockTasks: ProjectTask[] = [
  {
    id: 1,
    title: "Learn Drupal",
    description: "Study entities",
    category: "learning",
    priority: "high",
    status: "in_progress",
    ownerId: 2,
    ownerName: "Alex",
    dueDate: "2026-08-01T00:00:00Z",
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-10T00:00:00Z",
    isOverdue: false,
  },
];

const mockSummary = {
  total: 1,
  completed: 0,
  inProgress: 1,
  overdue: 0,
  highPriority: 1,
};

async function expectStatCount(key: string, value: number) {
  await waitFor(() => {
    expect(screen.getByTestId(`stat-${key}`)).toHaveTextContent(String(value));
  });
}

async function pickFormSelect(
  user: ReturnType<typeof userEvent.setup>,
  fieldLabel: RegExp,
  optionLabel: RegExp,
) {
  await user.click(screen.getByRole("button", { name: fieldLabel }));
  const option = await screen.findByRole("option", { name: optionLabel });
  const optionButton = option.querySelector("button");
  if (!optionButton) {
    throw new Error(`No button found inside option matching ${optionLabel}`);
  }
  await user.click(optionButton);
}

describe("App integration flow", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(usersApi, "fetchUsers").mockResolvedValue(mockUsers);
    vi.spyOn(tasksApi, "fetchTasks").mockResolvedValue(mockTasks);
    vi.spyOn(tasksApi, "fetchSummary").mockResolvedValue(mockSummary);
    vi.spyOn(tasksApi, "fetchTask").mockImplementation(async (id) => ({
      ...mockTasks[0],
      id,
    }));
  });

  it("loads dashboard summary and task list with correct counts", async () => {
    renderWithRouter(<AppRoutes />, { routerProps: { initialEntries: ["/dashboard"] } });

    await waitFor(() => {
      expect(screen.getByText("Learn Drupal")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Dashboard summary")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Learning Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Total Items")).toBeInTheDocument();

    await expectStatCount("total", 1);
    await expectStatCount("completed", 0);
    await expectStatCount("inProgress", 1);
    await expectStatCount("overdue", 0);
    await expectStatCount("highPriority", 1);
  });

  it("runs create → list → update flow and refreshes dashboard counts", async () => {
    const user = userEvent.setup();
    const created: ProjectTask = {
      ...mockTasks[0],
      id: 2,
      title: "New Task",
      status: "planned",
      priority: "medium",
      isOverdue: false,
    };
    const updated: ProjectTask = {
      ...created,
      title: "Updated Title",
      status: "completed",
    };
    const afterCreateSummary = {
      total: 2,
      completed: 0,
      inProgress: 1,
      overdue: 0,
      highPriority: 1,
    };
    const afterUpdateSummary = {
      total: 2,
      completed: 1,
      inProgress: 1,
      overdue: 0,
      highPriority: 1,
    };

    vi.spyOn(tasksApi, "createTask").mockResolvedValue(created);
    vi.spyOn(tasksApi, "updateTask").mockResolvedValue(updated);
    vi.spyOn(tasksApi, "fetchTasks")
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce([...mockTasks, created])
      .mockResolvedValueOnce([mockTasks[0], updated]);
    vi.spyOn(tasksApi, "fetchSummary")
      .mockResolvedValueOnce(mockSummary)
      .mockResolvedValueOnce(afterCreateSummary)
      .mockResolvedValueOnce(afterUpdateSummary);
    vi.spyOn(tasksApi, "fetchTask").mockResolvedValue(created);

    renderWithRouter(<AppRoutes />, { routerProps: { initialEntries: ["/dashboard"] } });
    await waitFor(() => screen.getByText("Learn Drupal"));
    await expectStatCount("total", 1);

    await user.click(screen.getByRole("button", { name: "+ New Task" }));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Create Task" })).toBeInTheDocument();
    });
    await user.type(screen.getByLabelText(/title/i), "New Task");
    await pickFormSelect(user, /owner/i, /alex/i);
    await user.click(screen.getByRole("button", { name: "Create Task" }));

    await waitFor(() => {
      expect(tasksApi.createTask).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByText("Task created successfully.")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
    await expectStatCount("total", 2);

    await user.click(screen.getByRole("button", { name: /Edit New Task/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Update Task" })).toBeInTheDocument();
    });
    const titleInput = screen.getByLabelText(/title/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");
    await pickFormSelect(user, /status/i, /completed/i);
    await user.click(screen.getByRole("button", { name: "Update Task" }));

    await waitFor(() => {
      expect(tasksApi.updateTask).toHaveBeenCalledWith(
        2,
        expect.objectContaining({ title: "Updated Title", status: "completed" }),
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Task updated successfully.")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Updated Title")).toBeInTheDocument();
    });
    await expectStatCount("total", 2);
    await expectStatCount("completed", 1);
  });

  it("filters tasks by status", async () => {
    const user = userEvent.setup();
    const filtered = mockTasks.filter((t) => t.status === "in_progress");

    vi.spyOn(tasksApi, "fetchTasks")
      .mockResolvedValueOnce(mockTasks)
      .mockResolvedValueOnce(filtered);

    renderWithRouter(<AppRoutes />, { routerProps: { initialEntries: ["/dashboard"] } });
    await waitFor(() => screen.getByText("Learn Drupal"));

    await user.click(screen.getByRole("radio", { name: /in progress/i }));

    await waitFor(() => {
      expect(tasksApi.fetchTasks).toHaveBeenLastCalledWith({
        status: "in_progress",
        search: undefined,
      });
    });
  });

  it("shows empty state when no tasks match filters", async () => {
    vi.spyOn(tasksApi, "fetchTasks").mockResolvedValue([]);

    renderWithRouter(<AppRoutes />, { routerProps: { initialEntries: ["/dashboard?status=completed"] } });

    await waitFor(() => {
      expect(screen.getByText("No tasks found")).toBeInTheDocument();
    });
  });

  it("shows error state when dashboard load fails", async () => {
    vi.spyOn(tasksApi, "fetchTasks").mockRejectedValue(new Error("Network error"));

    renderWithRouter(<AppRoutes />, { routerProps: { initialEntries: ["/dashboard"] } });

    await waitFor(() => {
      expect(screen.getByText("Could not load tasks")).toBeInTheDocument();
    });
  });
});
