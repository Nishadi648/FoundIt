export const TypeBadge = ({ type }) => (
  <span className={`badge badge-${type}`}>{type === "lost" ? "Lost" : "Found"}</span>
);

export const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>{status === "resolved" ? "✓ Resolved" : "● Open"}</span>
);
