# FoundIt – Lost & Found Web Application

React frontend for **FoundIt**, a Business Analysis problem-solving project (2026).
It helps people report lost or found items, browse and filter them, contact the reporter, and close a report once the item is returned.

## Features

- **Login / Register** – the app is only available after signing in (form validation, show/hide password)
- **Report an item** – choose *Lost* or *Found*, then add the title, category, description, location, date, an optional photo, and contact details
- **Browse & filter** – keyword search, category chips with counts, Lost/Found toggle, status filter (open/resolved), and sorting
- **Categories** – Electronics, Wallets & Bags, Keys, ID & Cards, Clothing, Jewelry & Watches, Books & Stationery, Pets, Other
- **Item details** – full information, a **Show contact details** button (email/phone with copy, mailto and tel links), and suggested *possible matches*
- **Item lifecycle** – the person who reported an item can **mark it resolved**, reopen it, or delete it (with a confirmation dialog)
- **My Reports** – profile summary and a table of your reports with quick Resolve/Reopen buttons
- Responsive layout for desktop and mobile, plus toast notifications

## Tech stack

- React 19 + Vite
- Plain CSS (no UI library)
- No other dependencies: routing uses a small hash router in `AppContext.jsx`

## Getting started

```bash
npm install
npm run dev      # open http://localhost:5173
npm run build    # production build in /dist
```

**Demo login:** `nimal@demo.com` / `demo123` (or register a new account)

## Project structure

```
src/
├── main.jsx               # entry point
├── App.jsx                # auth gate + page routing
├── styles.css             # design system & all styles
├── context/AppContext.jsx # global state: user, items, router, toasts
├── data/
│   ├── storage.js         # mock backend (localStorage) + seed data
│   └── constants.js       # categories, date helpers
├── components/            # Navbar, ItemCard, Badges, Toast
└── pages/                 # AuthPage, BrowsePage, ReportPage, ItemDetailPage, MyReportsPage
```

## Note on the backend

All data is stored in the browser's `localStorage` through `src/data/storage.js`. This is for demo purposes only, and passwords are **not** secured.
To connect a real backend (Node/Express, Spring Boot, Firebase, etc.), replace the functions in `storage.js` with API calls. The rest of the app does not need to change.

## Item lifecycle

`Open` → (owner marks resolved) → `Resolved` → (owner can reopen) → `Open`
