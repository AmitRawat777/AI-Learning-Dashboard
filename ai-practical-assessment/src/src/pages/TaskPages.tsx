import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTask, fetchTask, updateTask } from "../api/tasks";
import { fetchUsers } from "../api/users";
import { TaskForm } from "../components/TaskForm";
import { ErrorState, LoadingState } from "../components/StateMessages";
import type { ProjectTask, TaskInput, User } from "../types/task";

export function TaskCreatePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadUsers = () => {
    setLoadingUsers(true);
    setLoadError(null);
    fetchUsers()
      .then((data) => {
        if (data.length === 0) {
          setLoadError("No owners available. Seed users on the backend first.");
          return;
        }
        setUsers(data);
      })
      .catch(() => setLoadError("Failed to load owners. Check the API connection."))
      .finally(() => setLoadingUsers(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (data: TaskInput) => {
    await createTask(data);
    navigate("/dashboard", { state: { success: "Task created successfully." } });
  };

  if (loadingUsers) return <LoadingState title="Loading form..." />;
  if (loadError) {
    return (
      <ErrorState
        title="Could not open create form"
        message={loadError}
        onRetry={loadUsers}
      />
    );
  }

  return (
    <TaskForm
      users={users}
      submitLabel="Create Task"
      onSubmit={handleSubmit}
      onCancel={() => navigate("/dashboard")}
    />
  );
}

function stripTaskParam(path: string): string {
  const [pathname, query = ""] = path.split("?");
  const params = new URLSearchParams(query);
  params.delete("task");
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const [task, setTask] = useState<ProjectTask | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadTask = () => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    Promise.all([fetchTask(Number(id)), fetchUsers()])
      .then(([t, u]) => {
        setTask(t);
        setUsers(u);
      })
      .catch(() => setLoadError("Could not load this task. It may have been removed."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTask();
  }, [id]);

  if (loading) return <LoadingState title="Loading..." />;
  if (loadError || !task) {
    return (
      <ErrorState
        title="Could not load task"
        message={loadError ?? "Task not found."}
        onRetry={loadTask}
      />
    );
  }

  const handleSubmit = async (data: TaskInput) => {
    await updateTask(task.id, data);
    navigate(stripTaskParam(returnTo), {
      state: { success: "Task updated successfully." },
    });
  };

  return (
    <TaskForm
      users={users}
      submitLabel="Update Task"
      initial={{
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        status: task.status,
        ownerId: task.ownerId,
        dueDate: task.dueDate?.slice(0, 10) ?? "",
      }}
      onSubmit={handleSubmit}
      onCancel={() => navigate(stripTaskParam(returnTo))}
    />
  );
}
