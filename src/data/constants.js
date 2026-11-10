export const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "📱" },
  { id: "wallets", label: "Wallets & Bags", icon: "👜" },
  { id: "keys", label: "Keys", icon: "🔑" },
  { id: "documents", label: "ID & Cards", icon: "🪪" },
  { id: "clothing", label: "Clothing", icon: "🧥" },
  { id: "jewelry", label: "Jewelry & Watches", icon: "💍" },
  { id: "books", label: "Books & Stationery", icon: "📚" },
  { id: "pets", label: "Pets", icon: "🐾" },
  { id: "other", label: "Other", icon: "📦" },
];

export const getCategory = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

export const timeAgo = (iso) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  return formatDate(iso);
};
