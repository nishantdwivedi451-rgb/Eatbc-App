import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

/* Top-level safety net: one render throw should never leave the user
   staring at a white screen. Shows a friendly recovery card instead. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Surface to console; a real error tracker (Sentry) can hook in here.
    console.error("EatBC crashed:", error, info);
    const w = window as unknown as { Sentry?: { captureException: (e: unknown) => void } };
    w.Sentry?.captureException?.(error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "linear-gradient(160deg,#064E30,#1DAA61)",
          fontFamily: "'Space Grotesk','Inter',sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 360,
            textAlign: "center",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 28,
            padding: 32,
            color: "#fff",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍵</div>
          <h1 style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
            Something slipped
          </h1>
          <p style={{ opacity: 0.75, fontSize: 14, lineHeight: 1.6, marginBottom: 22 }}>
            We hit an unexpected hiccup. Your data is safe — a quick refresh
            usually sorts it out.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#fff",
              color: "#1DAA61",
              fontWeight: 800,
              border: "none",
              borderRadius: 16,
              padding: "12px 28px",
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Reload EatBC
          </button>
        </div>
      </div>
    );
  }
}
