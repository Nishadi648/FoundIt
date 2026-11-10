import { useState } from "react";
import { useApp } from "../context/AppContext";
import { getCategory, timeAgo, CATEGORIES } from "../data/constants";
import ItemArt from "../components/ItemArt";

/* Item pictures placed around the centred card.
   pos = desktop position, m = optional mobile position (tiles without m are hidden on phones). */
const TILES = [
  { art: "wallet",     bg: "#ffedd5", rot: -10, pos: { top: "7%",  left: "6%" },  m: { top: "1.5%", left: "4%" } },
  { art: "phone",      bg: "#e0e7ff", rot: 8,   pos: { top: "14%", left: "22%" }, inner: true, size: "sm" },
  { art: "keys",       bg: "#fef9c3", rot: -6,  pos: { top: "52%", left: "21%" }, inner: true },
  { art: "backpack",   bg: "#ccfbf1", rot: 7,   pos: { top: "68%", left: "5%" } },
  { art: "glasses",    bg: "#e0f2fe", rot: -4,  pos: { top: "83%", left: "23%" }, inner: true, size: "sm" },
  { art: "watch",      bg: "#f1f5f9", rot: 9,   pos: { top: "6%",  right: "21%" }, inner: true, size: "sm", m: { top: "1.5%", right: "4%" } },
  { art: "headphones", bg: "#ffe4e6", rot: -8,  pos: { top: "13%", right: "5%" } },
  { art: "umbrella",   bg: "#ede9fe", rot: 6,   pos: { top: "56%", right: "21%" }, inner: true },
  { art: "pet",        bg: "#fef3c7", rot: -9,  pos: { top: "71%", right: "5%" } },
  { art: "idcard",     bg: "#dbeafe", rot: 5,   pos: { top: "85%", right: "24%" }, inner: true, size: "sm" },
];

const emptyForm = { name: "", email: "", phone: "", password: "", confirm: "" };

/* Small inline icons for the inputs */
const icons = {
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
};
const Icon = ({ name }) => (
  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {icons[name]}
  </svg>
);

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return [
    { label: "Too short", cls: "s0" },
    { label: "Weak", cls: "s1" },
    { label: "Fair", cls: "s2" },
    { label: "Good", cls: "s3" },
    { label: "Strong", cls: "s4" },
  ][pw ? Math.max(score, pw.length >= 6 ? 1 : 0) : 0];
}

export default function AuthPage() {
  const { login, register, notify, items } = useApp();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState("");

  const isRegister = mode === "register";
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // Live data for the floating cards on the illustration
  const latestFound = items.find((i) => i.type === "found" && i.status === "open");
  const latestResolved = items.find((i) => i.status === "resolved");
  const reunited = items.filter((i) => i.status === "resolved").length;
  const open = items.length - reunited;

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setSuccess("");
    setForm(emptyForm);
  };

  const validate = () => {
    const e = {};
    if (isRegister && form.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (isRegister && !/^[+\d][\d\s-]{8,}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (isRegister && form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      if (isRegister) {
        const email = form.email.trim();
        register({ name: form.name.trim(), email, phone: form.phone.trim(), password: form.password });
        // Go back to the login tab with the new email filled in
        setMode("login");
        setErrors({});
        setShowPw(false);
        setForm({ ...emptyForm, email });
        setSuccess("Account created successfully! Please log in with your new password.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => document.querySelector(".auth-form input[type=password]")?.focus(), 50);
      } else {
        login(form.email.trim(), form.password);
        notify("Welcome back!");
      }
    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  const useDemo = () => setForm({ ...emptyForm, email: "nimal@demo.com", password: "demo123" });

  // Called as a function (not <Field/>) so inputs keep focus while typing
  const field = ({ name, label, icon, type = "text", placeholder, autoComplete, toggle }) => (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className={`input-wrap ${errors[name] ? "has-error" : ""}`}>
        <Icon name={icon} />
        <input type={type} value={form[name]} onChange={set(name)} placeholder={placeholder} autoComplete={autoComplete} />
        {toggle && (
          <button type="button" className="input-btn" onClick={() => setShowPw((s) => !s)}>
            {showPw ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </label>
  );

  const strength = passwordStrength(form.password);

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Decorative item pictures */}
      <div className="tiles" aria-hidden="true">
        {TILES.map((t, i) => (
          <div
            key={t.art}
            className={`tile ${t.size === "sm" ? "tile-sm" : ""} ${t.m ? "tile-m" : ""} ${t.inner ? "tile-in" : ""}`}
            style={{
              "--top": t.pos.top, "--left": t.pos.left ?? "auto", "--right": t.pos.right ?? "auto",
              "--mtop": t.m?.top, "--mleft": t.m?.left ?? "auto", "--mright": t.m?.right ?? "auto",
              "--rot": `${t.rot}deg`, "--delay": `${(i % 5) * 0.7}s`, background: t.bg,
            }}
          >
            <div className="tile-inner"><ItemArt name={t.art} /></div>
          </div>
        ))}

        {latestFound && (
          <div className="float-card fc-1">
            <span className="fc-icon found">{getCategory(latestFound.category).icon}</span>
            <div>
              <small><b className="txt-found">Found</b> · {timeAgo(latestFound.createdAt)}</small>
              <strong>{latestFound.title}</strong>
            </div>
          </div>
        )}
        <div className="float-card fc-2">
          <span className="fc-icon ok">✓</span>
          <div>
            <small>Reunited with owner</small>
            <strong>{latestResolved ? latestResolved.title : "Item returned"}</strong>
          </div>
        </div>
      </div>

      <div className="auth-center">
        <div className="auth-intro">
          <div className="brand brand-light">
            <span className="brand-logo">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="6" /><path d="M15 15l5 5" /></svg>
            </span>
            FoundIt
          </div>
          <h1>Lost something? Let's <span className="highlight">find it</span> together.</h1>
        </div>

        <main className="auth-card">
          <div className="tabs">
            <span className={`tab-slider ${isRegister ? "right" : ""}`} />
            <button className={!isRegister ? "active" : ""} onClick={() => switchMode("login")}>Log in</button>
            <button className={isRegister ? "active" : ""} onClick={() => switchMode("register")}>Register</button>
          </div>

          <div className="auth-head" key={mode}>
            <h2>{isRegister ? "Create your account ✨" : "Welcome back 👋"}</h2>
            <p className="muted">
              {isRegister ? "Join to report and claim lost & found items." : "Log in to see the latest lost & found reports."}
            </p>
          </div>

          {success && !isRegister && <div className="alert alert-success auth-success">✅ {success}</div>}
          {errors.form && <div className="alert alert-error">{errors.form}</div>}

          <form onSubmit={submit} noValidate key={`f-${mode}`} className="auth-form">
            {isRegister && field({ name: "name", label: "Full name", icon: "user", placeholder: "e.g. Nimal Perera", autoComplete: "name" })}
            {field({ name: "email", label: "Email address", icon: "mail", type: "email", placeholder: "you@example.com", autoComplete: "email" })}
            {isRegister && field({ name: "phone", label: "Phone number", icon: "phone", type: "tel", placeholder: "+94 71 234 5678", autoComplete: "tel" })}
            {field({ name: "password", label: "Password", icon: "lock", type: showPw ? "text" : "password", placeholder: "At least 6 characters", autoComplete: isRegister ? "new-password" : "current-password", toggle: true })}

            {isRegister && form.password && (
              <div className={`strength ${strength.cls}`}>
                <div className="strength-bars"><i /><i /><i /><i /></div>
                <span>{strength.label}</span>
              </div>
            )}

            {isRegister && field({ name: "confirm", label: "Confirm password", icon: "lock", type: showPw ? "text" : "password", placeholder: "Re-enter password", autoComplete: "new-password" })}

            <button type="submit" className="btn btn-primary btn-block btn-lg">
              {isRegister ? "Create account" : "Log in"} <span aria-hidden>→</span>
            </button>
          </form>

          {!isRegister && (
            <>
              <div className="divider"><span>or</span></div>
              <button className="btn btn-ghost btn-block" onClick={useDemo}>
                🎓 Use demo account
              </button>
            </>
          )}

          <p className="auth-switch">
            {isRegister ? "Already have an account?" : "New to FoundIt?"}{" "}
            <button className="link" onClick={() => switchMode(isRegister ? "login" : "register")}>
              {isRegister ? "Log in" : "Create an account"}
            </button>
          </p>

          <p className="trust">🛡️ Your contact details are only shown to signed-in users.</p>
        </main>

        <div className="auth-stats">
          <span><b>{open}</b> open reports</span>
          <span><b>{reunited}</b> items reunited</span>
          <span><b>{CATEGORIES.length}</b> categories</span>
        </div>
      </div>
    </div>
  );
}
