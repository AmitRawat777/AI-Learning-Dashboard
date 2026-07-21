import { Navigate, useParams } from "react-router-dom";

/** Legacy URL — open task drawer on the dashboard instead of a blank page. */
export function TaskDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <Navigate to="/dashboard" replace />;
  return <Navigate to={`/dashboard?task=${id}`} replace />;
}
