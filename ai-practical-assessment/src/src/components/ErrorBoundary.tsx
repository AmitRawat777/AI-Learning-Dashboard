import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Catches render errors so the app shows a message instead of a blank screen. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("LearnTrack render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="boot-error">
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
          <p>
            Open the app at{" "}
            <a href="https://ai-practical-assessment.ddev.site:5173/dashboard">
              https://ai-practical-assessment.ddev.site:5173/dashboard
            </a>{" "}
            (HTTPS, port <strong>5173</strong>).
          </p>
          <button type="button" className="btn btn--cta" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
