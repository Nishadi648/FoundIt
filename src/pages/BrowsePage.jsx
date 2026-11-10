import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, getCategory } from "../data/constants";
import ItemCard from "../components/ItemCard";

const initialFilters = { q: "", type: "all", category: "all", status: "open", sort: "newest" };

export default function BrowsePage() {
  const { items, navigate } = useApp();
  const [f, setF] = useState(initialFilters);
  const set = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

  const stats = useMemo(() => ({
    lost: items.filter((i) => i.type === "lost" && i.status === "open").length,
    found: items.filter((i) => i.type === "found" && i.status === "open").length,
    resolved: items.filter((i) => i.status === "resolved").length,
  }), [items]);

  const countByCat = useMemo(() => {
    const m = {};
    items.forEach((i) => { m[i.category] = (m[i.category] || 0) + 1; });
    return m;
  }, [items]);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    return items
      .filter((i) => f.type === "all" || i.type === f.type)
      .filter((i) => f.category === "all" || i.category === f.category)
      .filter((i) => f.status === "all" || i.status === f.status)
      .filter((i) => !q || [i.title, i.description, i.location, getCategory(i.category).label]
        .join(" ").toLowerCase().includes(q))
      .sort((a, b) => {
        if (f.sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
        if (f.sort === "date") return (b.date || "").localeCompare(a.date || "");
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [items, f]);

  const isFiltered = JSON.stringify(f) !== JSON.stringify(initialFilters);

  return (
    <div className="container page">
      <section className="hero-banner">
        <div>
          <h1>Browse lost & found items</h1>
          <p>Search reports from your community. Recognise something? Open it to get the reporter's contact details.</p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-lost" onClick={() => navigate("report?type=lost")}>I lost something</button>
          <button className="btn btn-found" onClick={() => navigate("report?type=found")}>I found something</button>
        </div>
      </section>

      <section className="stats">
        <div className="stat stat-lost"><strong>{stats.lost}</strong><span>Open lost reports</span></div>
        <div className="stat stat-found"><strong>{stats.found}</strong><span>Open found reports</span></div>
        <div className="stat stat-resolved"><strong>{stats.resolved}</strong><span>Items reunited</span></div>
      </section>

      <section className="category-strip" aria-label="Categories">
        <button className={`cat-chip ${f.category === "all" ? "active" : ""}`} onClick={() => set("category", "all")}>
          🗂️ All <span className="chip-count">{items.length}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`cat-chip ${f.category === c.id ? "active" : ""}`}
            onClick={() => set("category", c.id)}
          >
            {c.icon} {c.label} <span className="chip-count">{countByCat[c.id] || 0}</span>
          </button>
        ))}
      </section>

      <section className="filter-bar">
        <div className="search">
          <span className="search-icon">🔍</span>
          <input
            value={f.q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search by name, description or location…"
          />
          {f.q && <button className="search-clear" onClick={() => set("q", "")}>✕</button>}
        </div>

        <div className="segmented">
          {["all", "lost", "found"].map((t) => (
            <button key={t} className={f.type === t ? "active" : ""} onClick={() => set("type", t)}>
              {t === "all" ? "All" : t === "lost" ? "Lost" : "Found"}
            </button>
          ))}
        </div>

        <select value={f.status} onChange={(e) => set("status", e.target.value)}>
          <option value="open">Open only</option>
          <option value="resolved">Resolved only</option>
          <option value="all">Any status</option>
        </select>

        <select value={f.sort} onChange={(e) => set("sort", e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="date">By lost/found date</option>
        </select>
      </section>

      <div className="results-head">
        <span><strong>{results.length}</strong> item{results.length !== 1 && "s"} found</span>
        {isFiltered && <button className="link" onClick={() => setF(initialFilters)}>Clear filters</button>}
      </div>

      {results.length ? (
        <div className="grid">
          {results.map((i) => <ItemCard key={i.id} item={i} />)}
        </div>
      ) : (
        <div className="empty">
          <div className="empty-icon">🔎</div>
          <h3>No items match your filters</h3>
          <p className="muted">Try a different keyword or category — or report the item yourself.</p>
          <button className="btn btn-primary" onClick={() => navigate("report")}>Report an item</button>
        </div>
      )}
    </div>
  );
}
