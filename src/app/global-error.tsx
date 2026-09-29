"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isServerError = Boolean(error.digest);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#ffffff",
          color: "#111827",
        }}
      >
        <div
          style={{
            maxWidth: "28rem",
            margin: "4rem auto",
            padding: "0 1.5rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            This page couldn&apos;t load
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            {isServerError
              ? "A server error occurred. Reload to try again."
              : "Reload to try again, or go back."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "none",
              borderRadius: "0.5rem",
              backgroundColor: "#111827",
              color: "#ffffff",
              padding: "0.625rem 1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#9ca3af" }}>
              ERROR {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
