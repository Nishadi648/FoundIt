import { useState } from "react";
import { useApp } from "../context/AppContext";

const links = [
  { path: "browse", label: "Browse Items" },
  { path: "report", label: "Report Item" },
  { path: "my-reports", label: "My Reports" },
];

export default function Navbar() {
  const { user, logout, route, navigate } = useApp();
  const [open, setOpen] = useState(false);
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const go = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <button className="brand" onClick={() => go("browse")}>
          <span className="brand-logo">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg>
          </span>
          Found<span className="brand-accent">It</span>
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <button
              key={l.path}
              className={`nav-link ${route.page === l.path ? "active" : ""}`}
              onClick={() => go(l.path)}
            >
              {l.label}
            </button>
          ))}
          <div className="nav-user">
            <span className="avatar">{initials}</span>
            <span className="nav-username">{user.name.split(" ")[0]}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout}>Log out</button>
          </div>
        </nav>

        <button className="menu-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
