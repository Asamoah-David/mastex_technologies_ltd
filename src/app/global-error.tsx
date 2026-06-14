"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: "system-ui, sans-serif",
          background: "#070b16",
          color: "white",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ color: "#aebfe0", maxWidth: 420 }}>
          A critical error occurred. Please reload the page.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
