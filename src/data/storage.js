// A tiny mock "backend" stored in localStorage.
// Replace these functions with real API calls (fetch/axios) when a backend exists.

const USERS_KEY = "foundit_users_v2";
const ITEMS_KEY = "foundit_items_v2";
const SESSION_KEY = "foundit_session_v2";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Usually happens when an uploaded image is too large for localStorage
    throw new Error("Storage is full. Try a smaller image.", { cause: e });
  }
};

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();

/* ---------- Seed demo data on first run ---------- */
function seed() {
  if (localStorage.getItem(USERS_KEY)) return;
  const users = [
    { id: "u1", name: "Nimal Perera", email: "nimal@demo.com", phone: "+94 71 234 5678", password: "demo123" },
    { id: "u2", name: "Ayesha Fernando", email: "ayesha@demo.com", phone: "+94 77 987 6543", password: "demo123" },
  ];
  const items = [
    { id: uid(), type: "lost", title: "Black leather wallet", category: "wallets", description: "Black leather wallet with NIC, two bank cards and a small family photo inside. Brand: Tommy Hilfiger.", location: "City Library, Colombo 07", date: daysAgo(2).slice(0, 10), image: "", status: "open", ownerId: "u1", createdAt: daysAgo(2) },
    { id: uid(), type: "found", title: "iPhone 13 with blue case", category: "electronics", description: "Found an iPhone 13 in a navy blue silicone case near the food court tables. Lock screen shows a beach photo.", location: "Majestic City food court", date: daysAgo(1).slice(0, 10), image: "", status: "open", ownerId: "u2", createdAt: daysAgo(1) },
    { id: uid(), type: "found", title: "Set of 3 keys on red keychain", category: "keys", description: "Three keys (one looks like a Honda bike key) on a red lanyard keychain.", location: "Liberty Plaza car park", date: daysAgo(4).slice(0, 10), image: "", status: "open", ownerId: "u1", createdAt: daysAgo(4) },
    { id: uid(), type: "lost", title: "Silver Casio watch", category: "jewelry", description: "Silver Casio analog watch with a metal strap. Sentimental value — reward offered.", location: "Fitness Hub changing room", date: daysAgo(6).slice(0, 10), image: "", status: "open", ownerId: "u2", createdAt: daysAgo(6) },
    { id: uid(), type: "lost", title: "Grey hoodie (size M)", category: "clothing", description: "Plain grey Nike hoodie, size M, left on a bench at the bus stop.", location: "Pettah bus stand", date: daysAgo(9).slice(0, 10), image: "", status: "resolved", ownerId: "u1", createdAt: daysAgo(9) },
    { id: uid(), type: "found", title: "National ID card – K. Silva", category: "documents", description: "National identity card found on a train seat. Name starts with K. Silva.", location: "Fort railway station", date: daysAgo(3).slice(0, 10), image: "", status: "open", ownerId: "u2", createdAt: daysAgo(3) },
    { id: uid(), type: "lost", title: "Data Structures textbook", category: "books", description: "\"Data Structures & Algorithms in Java\" with my notes and highlights inside. Name written on first page.", location: "Coffee shop, Galle Road", date: daysAgo(5).slice(0, 10), image: "", status: "open", ownerId: "u1", createdAt: daysAgo(5) },
    { id: uid(), type: "found", title: "Small brown puppy", category: "pets", description: "Friendly brown puppy with a white patch on the chest, no collar. Being looked after safely until the owner is found.", location: "Viharamahadevi Park", date: daysAgo(0).slice(0, 10), image: "", status: "open", ownerId: "u2", createdAt: daysAgo(0) },
  ];
  write(USERS_KEY, users);
  write(ITEMS_KEY, items);
}
seed();

/* ---------- Users / auth ---------- */
const publicUser = ({ password: _pw, ...u }) => u;

export function registerUser({ name, email, phone, password }) {
  const users = read(USERS_KEY, []);
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user = { id: uid(), name, email, phone, password };
  write(USERS_KEY, [...users, user]);
  return publicUser(user); // no auto-login: the user signs in after registering
}

export function loginUser(email, password) {
  const user = read(USERS_KEY, []).find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) throw new Error("Invalid email or password.");
  write(SESSION_KEY, user.id);
  return publicUser(user);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionUser() {
  const id = read(SESSION_KEY, null);
  const user = read(USERS_KEY, []).find((u) => u.id === id);
  return user ? publicUser(user) : null;
}

export function getUserById(id) {
  const user = read(USERS_KEY, []).find((u) => u.id === id);
  return user ? publicUser(user) : null;
}

/* ---------- Items ---------- */
export const getItems = () => read(ITEMS_KEY, []);

export function addItem(item) {
  const items = getItems();
  const newItem = { ...item, id: uid(), status: "open", createdAt: new Date().toISOString() };
  write(ITEMS_KEY, [newItem, ...items]);
  return newItem;
}

export function updateItem(id, changes) {
  const items = getItems().map((i) => (i.id === id ? { ...i, ...changes } : i));
  write(ITEMS_KEY, items);
  return items;
}

export function deleteItem(id) {
  const items = getItems().filter((i) => i.id !== id);
  write(ITEMS_KEY, items);
  return items;
}
