import { useState } from "react";
import { useApp } from "../context/AppContext";
import { getCategory, formatDate } from "../data/constants";
import { TypeBadge, StatusBadge } from "../components/Badges";

export default function MyReportsPage() {
  const { items, user, setStatus, navigate, notify } = useApp();
  const [tab, setTab] = useState("open");

  const mine = items.filter((i) => i.ownerId === user.id);
  const shown = mine.filter((i) => tab === "all" || i.status === tab);
  const count = (s) => mine.filter((i) => i.status === s).length;

  const toggle = (item) => {
    const next = item.status === "open" ? "resolved" : "open";
    setStatus(item.id, next);
    notify(next === "resolved" ? "Marked as resolved 🎉" : "Report reopened.");
  };

  return (
    <div className="container page">
      <div className="page-head split">
        <div>
          <h1>My reports</h1>
          <p className="muted">Track the items you've reported and mark them resolved once they're returned.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("report")}>+ New report</button>
      </div>

      <div className="profile card">
        <span className="avatar lg">{user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
        <div>
          <strong>{user.name}</strong>
          <div className="muted small">{user.email} · {user.phone}</div>
        </div>
        <div className="profile-stats">
          <div><strong>{mine.length}</strong><span>Total</span></div>
          <div><strong>{count("open")}</strong><span>Open</span></div>
          <div><strong>{count("resolved")}</strong><span>Resolved</span></div>
        </div>
      </div>

      <div className="segmented tabs-inline">
        {[["open", "Open"], ["resolved", "Resolved"], ["all", "All"]].map(([k, l]) => (
          <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {shown.length ? (
        <div className="table-card card">
          <table className="report-table">
            <thead>
              <tr><th>Item</th><th>Type</th><th>Location</th><th>Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {shown.map((i) => {
                const cat = getCategory(i.category);
                return (
                  <tr key={i.id}>
                    <td data-label="Item">
                      <button className="row-title" onClick={() => navigate(`item/${i.id}`)}>
                        <span className={`mini-thumb thumb-${i.type}`}>
                          {i.image ? <img src={i.image} alt="" /> : cat.icon}
                        </span>
                        <span>
                          <strong>{i.title}</strong>
                          <small className="muted">{cat.label}</small>
                        </span>
                      </button>
                    </td>
                    <td data-label="Type"><TypeBadge type={i.type} /></td>
                    <td data-label="Location">{i.location}</td>
                    <td data-label="Date">{formatDate(i.date)}</td>
                    <td data-label="Status"><StatusBadge status={i.status} /></td>
                    <td className="actions">
                      <button className={`btn btn-sm ${i.status === "open" ? "btn-success" : "btn-outline"}`} onClick={() => toggle(i)}>
                        {i.status === "open" ? "✓ Resolve" : "↺ Reopen"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>{tab === "resolved" ? "No resolved reports yet" : "No reports here"}</h3>
          <p className="muted">Reports you create will appear here.</p>
          <button className="btn btn-primary" onClick={() => navigate("report")}>Report an item</button>
        </div>
      )}
    </div>
  );
}
