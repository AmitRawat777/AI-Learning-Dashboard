import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout, MarketingLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TaskDetailRedirect } from "./pages/TaskDetailRedirect";
import { TaskCreatePage, TaskEditPage } from "./pages/TaskPages";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MarketingLayout>
            <LandingPage />
          </MarketingLayout>
        }
      />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage mode="dashboard" />} />
        <Route path="/tasks" element={<DashboardPage mode="tasks" />} />
        <Route path="/tasks/new" element={<TaskCreatePage />} />
        <Route path="/tasks/:id" element={<TaskDetailRedirect />} />
        <Route path="/tasks/:id/edit" element={<TaskEditPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
