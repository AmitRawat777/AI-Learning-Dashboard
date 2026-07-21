import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { fetchSummary, fetchTask, fetchTasks, updateTask } from "../api/tasks";
import { fetchUsers } from "../api/users";
import { DashboardSummaryCards } from "../components/DashboardSummary";
import { KanbanBoard } from "../components/KanbanBoard";
import { KanbanOnboardingHint } from "../components/KanbanOnboardingHint";
import { SearchFilter } from "../components/SearchFilter";
import { TaskDetail } from "../components/TaskDetail";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SuccessBanner,
} from "../components/StateMessages";
import { TaskCardGrid } from "../components/TaskList";
import type { DashboardSummary, ProjectTask, TaskStatus } from "../types/task";
import { STATUS_LABELS } from "../types/task";
import { ApiError } from "../api/client";

interface DashboardPageProps {
  mode?: "dashboard" | "tasks";
}

export function DashboardPage({ mode = "dashboard" }: DashboardPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const basePath = mode === "tasks" ? "/tasks" : "/dashboard";
  const search = searchParams.get("search") ?? "";
  const statusFilter = (searchParams.get("status") ?? "") as TaskStatus | "";
  const viewMode = (searchParams.get("view") ?? "board") as "board" | "grid";
  const highlight = searchParams.get("highlight") ?? "";
  const taskIdParam = searchParams.get("task");

  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerUpdating, setDrawerUpdating] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(() => setUsersLoaded(true))
      .catch(() => setError("Failed to load users."))
      .finally(() => setUsersLoaded(true));
  }, []);

  const updateParams = (updates: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    setSearchParams(next, { replace: true });
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskData, summaryData] = await Promise.all([
        fetchTasks({
          status: statusFilter || undefined,
          search: search || undefined,
        }),
        fetchSummary(),
      ]);
      setTasks(taskData);
      setSummary(summaryData);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    if (!usersLoaded) return;
    const timer = setTimeout(loadData, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadData, search, usersLoaded]);

  useEffect(() => {
    const state = location.state as { success?: string } | null;
    if (state?.success) {
      setSuccess(state.success);
      navigate(location.pathname + location.search, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => setSuccess(null), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!taskIdParam) {
      setSelectedTask(null);
      return;
    }

    const id = Number(taskIdParam);
    if (Number.isNaN(id)) {
      updateParams({ task: "" });
      return;
    }

    setDrawerLoading(true);
    fetchTask(id)
      .then(setSelectedTask)
      .catch(() => {
        setError("Could not load task details.");
        updateParams({ task: "" });
      })
      .finally(() => setDrawerLoading(false));
  }, [taskIdParam]);

  const openTask = (task: ProjectTask) => {
    updateParams({ task: String(task.id) });
  };

  const closeTaskDrawer = () => {
    updateParams({ task: "" });
    setSelectedTask(null);
  };

  const handleQuickStatus = async (task: ProjectTask, status: TaskStatus) => {
    if (task.status === status) return;
    setMovingTaskId(task.id);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status } : t)),
    );
    try {
      const updated = await updateTask(task.id, { status });
      setSuccess(`Moved to ${STATUS_LABELS[status]}`);
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      );
      const summaryData = await fetchSummary();
      setSummary(summaryData);
    } catch {
      setError("Could not update task status.");
      await loadData();
    } finally {
      setMovingTaskId(null);
    }
  };

  const handleDrawerStatus = async (status: TaskStatus) => {
    if (!selectedTask) return;
    setDrawerUpdating(true);
    try {
      await updateTask(selectedTask.id, { status });
      closeTaskDrawer();
      setSuccess(`Task marked as ${STATUS_LABELS[status]}`);
      await loadData();
    } catch {
      setError("Could not update task status.");
    } finally {
      setDrawerUpdating(false);
    }
  };

  const handleStatClick = (key: keyof DashboardSummary) => {
    if (key === "total") {
      updateParams({ status: "", search: "", highlight: "", view: "board", task: "" });
      return;
    }
    if (key === "completed") {
      updateParams({ status: "completed", view: "grid", highlight: key, task: "" });
      return;
    }
    if (key === "inProgress") {
      updateParams({ status: "in_progress", view: "grid", highlight: key, task: "" });
      return;
    }
    if (key === "overdue" || key === "highPriority") {
      updateParams({ status: "", view: "grid", highlight: key, task: "" });
    }
  };

  const displayTasks =
    highlight === "overdue"
      ? tasks.filter((t) => t.isOverdue)
      : highlight === "highPriority"
        ? tasks.filter((t) => t.priority === "high")
        : tasks;

  const showBoard =
    mode === "dashboard" && viewMode === "board" && !statusFilter && !search && !highlight;

  return (
    <>
      <AnimatePresence mode="wait">
        {success ? <SuccessBanner key="success-toast" message={success} /> : null}
      </AnimatePresence>

      <motion.header
        className="page-header glass page-header--animated"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1>
            {mode === "tasks" ? "All Tasks" : "Learning Dashboard"}
            <span className="page-header__pulse" aria-hidden="true" />
          </h1>
          <p>
            {mode === "tasks"
              ? "Browse and filter every project task."
              : "Track progress, priorities, and overdue items."}
          </p>
        </div>
        {!loading && summary && (
          <motion.div
            className="page-header__badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            {summary.total} active goals
          </motion.div>
        )}
      </motion.header>

      {mode === "dashboard" && (
        <DashboardSummaryCards
          summary={summary}
          loading={loading && !summary}
          activeStat={highlight || null}
          onStatClick={handleStatClick}
        />
      )}

      <SearchFilter
        search={search}
        status={statusFilter}
        viewMode={viewMode}
        onSearchChange={(v) => updateParams({ search: v })}
        onStatusChange={(v) => updateParams({ status: v, highlight: "" })}
        onViewModeChange={(v) => updateParams({ view: v })}
      />

      {loading && (
        <LoadingState title="Loading tasks..." message="Fetching from Drupal backend." />
      )}
      {!loading && error && (
        <ErrorState
          title="Could not load tasks"
          message={error}
          onRetry={() => loadData()}
        />
      )}
      {!loading && !error && displayTasks.length === 0 && (
        <EmptyState
          title="No tasks found"
          message="Create a new task or adjust your filters."
        />
      )}
      {!loading && !error && displayTasks.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={showBoard ? "board" : "grid"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {showBoard ? (
              <>
                <KanbanOnboardingHint />
                <KanbanBoard
                tasks={displayTasks}
                onSelect={openTask}
                movingTaskId={movingTaskId}
                onEdit={(task) =>
                  navigate(`/tasks/${task.id}/edit`, {
                    state: { from: `${basePath}${location.search}` },
                  })
                }
                onQuickStatus={handleQuickStatus}
              />
              </>
            ) : (
              <TaskCardGrid
                tasks={displayTasks}
                onSelect={openTask}
                onEdit={(task) =>
                  navigate(`/tasks/${task.id}/edit`, {
                    state: { from: `${basePath}${location.search}` },
                  })
                }
                onQuickStatus={handleQuickStatus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {drawerLoading && taskIdParam && (
        <LoadingState title="Loading task..." />
      )}

      {selectedTask && !drawerLoading && (
        <TaskDetail
          task={selectedTask}
          onClose={closeTaskDrawer}
          onEdit={() => {
            const returnTo = `${basePath}${location.search}`;
            closeTaskDrawer();
            navigate(`/tasks/${selectedTask.id}/edit`, { state: { from: returnTo } });
          }}
          onMarkInProgress={() => handleDrawerStatus("in_progress")}
          onMarkCompleted={() => handleDrawerStatus("completed")}
          updating={drawerUpdating}
        />
      )}
    </>
  );
}
