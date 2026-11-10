import { useApp } from "../context/AppContext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div key={toast.id} className={`toast toast-${toast.kind}`} role="status">
      {toast.kind === "error" ? "⚠️" : "✅"} {toast.message}
    </div>
  );
}
