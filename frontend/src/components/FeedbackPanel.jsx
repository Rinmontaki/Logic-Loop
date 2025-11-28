import React from "react";

export default function FeedbackPanel({ feedback, errors }) {
  const isSuccess =
    typeof feedback === "string" &&
    feedback.trim() === "Código correcto. ¡Bien hecho!";
  return (
    <div style={{ marginTop: 24 }}>
      <h3>Retroalimentación</h3>
      <pre
        style={{
          background: "#f4f4f4",
          padding: 12,
          borderRadius: 6,
          color: isSuccess ? "#228B22" : "#111", // verde si es éxito, negro si no
          fontWeight: isSuccess ? "bold" : undefined,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowX: "auto",
          maxWidth: "100%"
        }}
      >
        {feedback}
      </pre>
      {errors && errors.length > 0 && (
        <div style={{ color: "#c00" }}>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
