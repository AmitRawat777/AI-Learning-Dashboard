import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "learntrack_kanban_tip_dismissed";

/** Dismissible tip shown above the Kanban board for first-time users. */
export function KanbanOnboardingHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore storage errors */
    }
  };

  if (!visible) return null;

  return (
    <div className="kanban-tip glass" role="note" aria-label="Kanban drag and drop tip">
      <div className="kanban-tip__content">
        <span className="kanban-tip__icon" aria-hidden="true">⠿</span>
        <div>
          <strong>Drag cards between columns</strong>
          <p>
            Hover a card to see the drag hint, then click and hold anywhere on the card
            (except the title and buttons) to move it to Planned, In Progress, or Completed.
          </p>
        </div>
      </div>
      <div className="kanban-tip__actions">
        <Link to="/#kanban-guide" className="btn btn--ghost btn--small">
          Watch demo
        </Link>
        <button type="button" className="btn btn--primary btn--small" onClick={dismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
