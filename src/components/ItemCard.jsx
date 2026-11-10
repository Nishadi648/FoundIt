import { getCategory, formatDate, timeAgo } from "../data/constants";
import { useApp } from "../context/AppContext";
import { TypeBadge, StatusBadge } from "./Badges";

export default function ItemCard({ item }) {
  const { navigate } = useApp();
  const cat = getCategory(item.category);

  return (
    <article
      className={`item-card ${item.status === "resolved" ? "is-resolved" : ""}`}
      onClick={() => navigate(`item/${item.id}`)}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`item/${item.id}`)}
    >
      <div className={`item-thumb thumb-${item.type}`}>
        {item.image ? <img src={item.image} alt={item.title} /> : <span className="thumb-icon">{cat.icon}</span>}
        <div className="thumb-badges">
          <TypeBadge type={item.type} />
          {item.status === "resolved" && <StatusBadge status="resolved" />}
        </div>
      </div>
      <div className="item-body">
        <span className="item-cat">{cat.icon} {cat.label}</span>
        <h3 className="item-title">{item.title}</h3>
        <p className="item-desc">{item.description}</p>
        <div className="item-meta">
          <span>📍 {item.location}</span>
          <span>📅 {formatDate(item.date)}</span>
        </div>
      </div>
      <div className="item-foot">
        <span className="muted">Posted {timeAgo(item.createdAt)}</span>
        <span className="link-arrow">View details →</span>
      </div>
    </article>
  );
}
