import React from "react";
import { logger } from "@/lib/logger";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 className="text-2xl mb-2">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-4">
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-md border border-border bg-background cursor-pointer hover:bg-muted"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
