// Original, colourful vector pictures of everyday lost items (viewBox 0 0 64 64).
const art = {
  wallet: (
    <>
      <rect x="12" y="14" width="34" height="14" rx="3" fill="#38bdf8" />
      <rect x="6" y="20" width="52" height="32" rx="7" fill="#f97316" />
      <rect x="36" y="29" width="24" height="14" rx="5" fill="#c2410c" />
      <circle cx="53" cy="36" r="3" fill="#fff7ed" />
      <rect x="10" y="24" width="44" height="24" rx="5" fill="none" stroke="#fed7aa" strokeWidth="1.5" strokeDasharray="3 3" />
    </>
  ),
  phone: (
    <>
      <rect x="18" y="5" width="28" height="54" rx="7" fill="#1e293b" />
      <rect x="21" y="11" width="22" height="42" rx="4" fill="#818cf8" />
      <rect x="27" y="7.5" width="10" height="2" rx="1" fill="#475569" />
      <rect x="24" y="15" width="6" height="6" rx="2" fill="#fde047" />
      <rect x="34" y="15" width="6" height="6" rx="2" fill="#f472b6" />
      <rect x="24" y="25" width="6" height="6" rx="2" fill="#34d399" />
      <rect x="34" y="25" width="6" height="6" rx="2" fill="#fff" />
      <rect x="24" y="44" width="16" height="4" rx="2" fill="#e0e7ff" />
    </>
  ),
  keys: (
    <>
      <circle cx="20" cy="22" r="11" fill="none" stroke="#a855f7" strokeWidth="4" />
      <circle cx="22" cy="31" r="9" fill="#facc15" />
      <circle cx="22" cy="31" r="3.5" fill="#fff" />
      <rect x="28" y="28" width="28" height="6" rx="2" fill="#facc15" />
      <rect x="46" y="33" width="4" height="7" rx="1" fill="#facc15" />
      <rect x="52" y="33" width="4" height="5" rx="1" fill="#facc15" />
      <rect x="10" y="40" width="10" height="16" rx="3" fill="#ef4444" transform="rotate(-15 15 48)" />
    </>
  ),
  backpack: (
    <>
      <path d="M24 12a8 8 0 0 1 16 0" fill="none" stroke="#0f766e" strokeWidth="4" />
      <rect x="12" y="14" width="40" height="44" rx="12" fill="#14b8a6" />
      <rect x="18" y="34" width="28" height="18" rx="5" fill="#0d9488" />
      <rect x="29" y="38" width="6" height="3" rx="1.5" fill="#ccfbf1" />
      <rect x="20" y="20" width="24" height="5" rx="2.5" fill="#5eead4" />
    </>
  ),
  glasses: (
    <>
      <circle cx="19" cy="34" r="12" fill="#bae6fd" stroke="#0f172a" strokeWidth="4" />
      <circle cx="45" cy="34" r="12" fill="#bae6fd" stroke="#0f172a" strokeWidth="4" />
      <path d="M31 33q1-3 2 0" stroke="#0f172a" strokeWidth="4" fill="none" />
      <path d="M7 32 3 24M57 32l4-8" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M13 29l6-4M39 29l6-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  watch: (
    <>
      <rect x="23" y="4" width="18" height="56" rx="6" fill="#64748b" />
      <circle cx="32" cy="32" r="17" fill="#e2e8f0" stroke="#334155" strokeWidth="3.5" />
      <circle cx="32" cy="32" r="12" fill="#fff" />
      <path d="M32 24v8l6 4" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" fill="none" />
    </>
  ),
  headphones: (
    <>
      <path d="M12 38v-6a20 20 0 0 1 40 0v6" fill="none" stroke="#4f46e5" strokeWidth="5" />
      <rect x="7" y="34" width="13" height="20" rx="6" fill="#f43f5e" />
      <rect x="44" y="34" width="13" height="20" rx="6" fill="#f43f5e" />
    </>
  ),
  umbrella: (
    <>
      <path d="M6 32a26 26 0 0 1 52 0z" fill="#8b5cf6" />
      <path d="M6 32a8.7 8 0 0 1 17.3 0a8.7 8 0 0 1 17.4 0a8.7 8 0 0 1 17.3 0" fill="#a78bfa" />
      <path d="M32 32v18a5 5 0 0 1-10 0" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 6v4" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  pet: (
    <>
      <ellipse cx="32" cy="42" rx="13" ry="11" fill="#b45309" />
      <ellipse cx="16" cy="27" rx="6" ry="7.5" fill="#d97706" />
      <ellipse cx="48" cy="27" rx="6" ry="7.5" fill="#d97706" />
      <ellipse cx="25" cy="15" rx="5.5" ry="7" fill="#d97706" />
      <ellipse cx="39" cy="15" rx="5.5" ry="7" fill="#d97706" />
    </>
  ),
  idcard: (
    <>
      <rect x="5" y="14" width="54" height="36" rx="6" fill="#3b82f6" />
      <rect x="5" y="14" width="54" height="9" rx="4" fill="#1d4ed8" />
      <circle cx="20" cy="35" r="6" fill="#fde68a" />
      <path d="M11 47a9 7 0 0 1 18 0" fill="#fde68a" />
      <rect x="33" y="30" width="20" height="3.5" rx="1.75" fill="#dbeafe" />
      <rect x="33" y="37" width="14" height="3.5" rx="1.75" fill="#93c5fd" />
    </>
  ),
};

export default function ItemArt({ name }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      {art[name]}
    </svg>
  );
}
