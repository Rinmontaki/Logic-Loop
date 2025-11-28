import React from "react";
import "./CodeEditor.css";

export default function CodeEditor({ value, onChange }) {
  return (
    <textarea
      className="code-editor-dracula"
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={8}
      style={{ color: "#f8f8f2" }}
    />
  );
}
