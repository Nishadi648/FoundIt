import { useState } from "react";
import { useApp } from "../context/AppContext";
import { getCategory, formatDate, timeAgo } from "../data/constants";
import { TypeBadge, StatusBadge } from "../components/Badges";
import ItemCard from "../components/ItemCard";

export default function ItemDetailPage({ id }) {
  const { items, user, getUserById, setStatus, removeItem, navigate, notify } = useApp();
  const [showContact, setShowContact] = useState(false);
  const [confirm, setConfirm] = useState(null); // "resolve" | "delete" | null

  const item = items.find((i) => i.id === id);
  if (!item) {
    return (
      <div className="container page">
        <div className="empty">
          <div className="empty-icon">🤷</div>
          <h3>Item not found</h3>
          <p className="muted">This report may have been removed.</p>
          <button className="btn btn-primary" onClick={() => navigate("browse")}>Back to items</button>
        </div>
      </div>
    );
  }

  const cat = getCategory(item.category);
  const owner = getUserById(item.ownerId);
  const isOwner = item.ownerId === user.id;
  const resolved = item.status === "resolved";
  const contact = {
    name: owner?.name || "Unknown user",
    email: item.contactEmail || owner?.email,
    phone: item.showPhone === false ? null : item.contactPhone || owner?.phone,
  };

  const related = items
    .filter((i) => i.id !== item.id && i.category === item.category && i.type !== item.type && i.status === "open")
    .slice(0, 3);

  const doConfirm = () => {
    if (confirm === "resolve") {
      setStatus(item.id, "resolved");
      notify("Marked as resolved. Glad it worked out! 🎉");
    } else if (confirm === "delete") {
      removeItem(item.id);
      notify("Report deleted.");
      navigate("my-reports");
    }
    setConfirm(null);
  };

  const copy = (text) => {
    navigator.clipboard?.writeText(text);
    notify("Copied to clipboard");
  };

  return (
    <div className="container page">
      <button className="back" onClick={() => history.length > 1 ? history.back() : navigate("browse")}>← Back</button>

      {resolved && (
        <div className="alert alert-success">
          ✓ This item has been marked as <strong>resolved</strong> — it's back with its owner.
        </div>
      )}

      <div className="detail">
        <div className={`detail-media thumb-${item.type}`}>
          {item.image ? <img src={item.image} alt={item.title} /> : <span className="thumb-icon big">{cat.icon}</span>}
        </div>

        <div className="detail-info card">
          <div className="badge-row">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
            <span className="badge badge-cat">{cat.icon} {cat.label}</span>
          </div>
          <h1>{item.title}</h1>
          <p className="detail-desc">{item.description}</p>

          <dl className="facts">
            <div><dt>📍 Location {item.type}</dt><dd>{item.location}</dd></div>
            <div><dt>📅 Date {item.type}</dt><dd>{formatDate(item.date)}</dd></div>
            <div><dt>👤 Reported by</dt><dd>{isOwner ? "You" : contact.name}</dd></div>
            <div><dt>🕒 Posted</dt><dd>{timeAgo(item.createdAt)}</dd></div>
          </dl>

          {isOwner ? (
            <div className="owner-box">
              <h3>Manage your report</h3>
              <p className="muted small">
                {resolved ? "Reopen the report if the item still needs to be found." : "Got the item back or returned it to its owner? Mark it resolved."}
              </p>
              <div className="btn-row">
                {resolved ? (
                  <button className="btn btn-outline" onClick={() => { setStatus(item.id, "open"); notify("Report reopened."); }}>
                    ↺ Reopen report
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={() => setConfirm("resolve")}>✓ Mark as resolved</button>
                )}
                <button className="btn btn-danger-ghost" onClick={() => setConfirm("delete")}>Delete</button>
              </div>
            </div>
          ) : (
            <div className="contact-box">
              <h3>{item.type === "lost" ? "Found this item?" : "Is this yours?"}</h3>
              <p className="muted small">
                {item.type === "lost"
                  ? "Contact the owner and arrange a safe hand-over."
                  : "Contact the finder. Be ready to describe a detail only the owner would know."}
              </p>
              {resolved ? (
                <p className="muted small">This report is closed, so contact details are hidden.</p>
              ) : showContact ? (
                <div className="contact-list">
                  <div className="contact-row"><span className="avatar">{contact.name[0]}</span><strong>{contact.name}</strong></div>
                  <div className="contact-row">
                    <span>✉️</span>
                    <a href={`mailto:${contact.email}?subject=${encodeURIComponent("FoundIt: " + item.title)}`}>{contact.email}</a>
                    <button className="link small" onClick={() => copy(contact.email)}>Copy</button>
                  </div>
                  {contact.phone ? (
                    <div className="contact-row">
                      <span>📞</span>
                      <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                      <button className="link small" onClick={() => copy(contact.phone)}>Copy</button>
                    </div>
                  ) : (
                    <div className="contact-row muted small">Phone number not shared</div>
                  )}
                  <p className="safety">🛡️ Meet in a public place (e.g. a police station or busy café) when exchanging items.</p>
                </div>
              ) : (
                <button className="btn btn-primary btn-block" onClick={() => setShowContact(true)}>
                  Show contact details
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>Possible matches</h2>
          <p className="muted">Open {item.type === "lost" ? "found" : "lost"} reports in {cat.label}</p>
          <div className="grid">{related.map((i) => <ItemCard key={i.id} item={i} />)}</div>
        </section>
      )}

      {confirm && (
        <div className="modal-backdrop" onClick={() => setConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3>{confirm === "resolve" ? "Mark as resolved?" : "Delete this report?"}</h3>
            <p className="muted">
              {confirm === "resolve"
                ? "The item will be shown as reunited and contact details will be hidden. You can reopen it later."
                : "This permanently removes the report. This can't be undone."}
            </p>
            <div className="btn-row end">
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className={`btn ${confirm === "resolve" ? "btn-success" : "btn-danger"}`} onClick={doConfirm}>
                {confirm === "resolve" ? "Yes, resolved" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
