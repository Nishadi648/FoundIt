import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/constants";

const today = () => new Date().toISOString().slice(0, 10);

// Shrink uploaded photos so they fit in localStorage
function resizeImage(file, max = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ReportPage() {
  const { user, reportItem, navigate, notify, route } = useApp();
  const [form, setForm] = useState({
    type: route.query?.type === "found" ? "found" : "lost",
    title: "",
    category: "",
    description: "",
    location: "",
    date: today(),
    image: "",
    contactEmail: user.email,
    contactPhone: user.phone,
    showPhone: true,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const isLost = form.type === "lost";

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setErrors({ ...errors, image: "Please choose an image file." });
    try {
      setForm({ ...form, image: await resizeImage(file) });
      setErrors({ ...errors, image: undefined });
    } catch {
      setErrors({ ...errors, image: "Could not read this image." });
    }
  };

  const validate = () => {
    const e = {};
    if (form.title.trim().length < 3) e.title = "Give the item a short title (min. 3 characters).";
    if (!form.category) e.category = "Select a category.";
    if (form.description.trim().length < 10) e.description = "Describe the item (min. 10 characters) — colour, brand, marks.";
    if (!form.location.trim()) e.location = `Where was it ${isLost ? "lost" : "found"}?`;
    if (!form.date) e.date = "Select a date.";
    else if (form.date > today()) e.date = "Date cannot be in the future.";
    if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) e.contactEmail = "Enter a valid email.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      notify("Please fix the highlighted fields.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const item = reportItem({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
      });
      notify(`Your ${form.type} item report was published.`);
      navigate(`item/${item.id}`);
    } catch (err) {
      notify(err.message, "error");
      setSubmitting(false);
    }
  };

  const err = (k) => errors[k] && <span className="field-error">{errors[k]}</span>;

  return (
    <div className="container page narrow">
      <button className="back" onClick={() => navigate("browse")}>← Back to items</button>
      <div className="page-head">
        <h1>Report an item</h1>
        <p className="muted">The more detail you give, the easier it is to reunite the item with its owner.</p>
      </div>

      <form className="card form-card" onSubmit={submit} noValidate>
        <fieldset>
          <legend>1. What happened?</legend>
          <div className="type-toggle">
            <label className={`type-option lost ${isLost ? "selected" : ""}`}>
              <input type="radio" name="type" value="lost" checked={isLost} onChange={set("type")} />
              <span className="type-emoji">😟</span>
              <strong>I lost an item</strong>
              <small>Let finders know what you're looking for</small>
            </label>
            <label className={`type-option found ${!isLost ? "selected" : ""}`}>
              <input type="radio" name="type" value="found" checked={!isLost} onChange={set("type")} />
              <span className="type-emoji">🙌</span>
              <strong>I found an item</strong>
              <small>Help the owner get it back</small>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>2. Item details</legend>
          <label className="field">
            <span className="field-label">Item name / title *</span>
            <input value={form.title} onChange={set("title")} placeholder="e.g. Black leather wallet" maxLength={80} className={errors.title ? "has-error" : ""} />
            {err("title")}
          </label>

          <div className="field">
            <span className="field-label">Category *</span>
            <div className="cat-picker">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={`cat-pick ${form.category === c.id ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, category: c.id })}
                >
                  <span>{c.icon}</span>{c.label}
                </button>
              ))}
            </div>
            {err("category")}
          </div>

          <label className="field">
            <span className="field-label">Description *</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={set("description")}
              placeholder="Colour, brand, size, distinguishing marks, contents…"
              maxLength={600}
              className={errors.description ? "has-error" : ""}
            />
            <span className="char-count">{form.description.length}/600</span>
            {err("description")}
          </label>

          <div className="row">
            <label className="field">
              <span className="field-label">Location {isLost ? "lost" : "found"} *</span>
              <input value={form.location} onChange={set("location")} placeholder="e.g. Main Library, 2nd floor" className={errors.location ? "has-error" : ""} />
              {err("location")}
            </label>
            <label className="field">
              <span className="field-label">Date {isLost ? "lost" : "found"} *</span>
              <input type="date" value={form.date} max={today()} onChange={set("date")} className={errors.date ? "has-error" : ""} />
              {err("date")}
            </label>
          </div>

          <div className="field">
            <span className="field-label">Photo (optional)</span>
            {form.image ? (
              <div className="image-preview">
                <img src={form.image} alt="Preview" />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm({ ...form, image: "" })}>Remove photo</button>
              </div>
            ) : (
              <label className="dropzone">
                <input type="file" accept="image/*" onChange={onImage} />
                <span className="dz-icon">📷</span>
                <span><strong>Click to upload</strong> a photo of the item</span>
                <small className="muted">JPG or PNG — it will be resized automatically</small>
              </label>
            )}
            {err("image")}
            {!isLost && form.image === "" && (
              <small className="hint">Tip: for found items, consider hiding unique details so the real owner can verify them.</small>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>3. Contact details</legend>
          <p className="muted small">These are shown to logged-in users who open your report.</p>
          <div className="row">
            <label className="field">
              <span className="field-label">Contact email *</span>
              <input type="email" value={form.contactEmail} onChange={set("contactEmail")} className={errors.contactEmail ? "has-error" : ""} />
              {err("contactEmail")}
            </label>
            <label className="field">
              <span className="field-label">Contact phone</span>
              <input type="tel" value={form.contactPhone} onChange={set("contactPhone")} disabled={!form.showPhone} />
            </label>
          </div>
          <label className="checkbox">
            <input type="checkbox" checked={form.showPhone} onChange={set("showPhone")} />
            Show my phone number on this report
          </label>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate("browse")}>Cancel</button>
          <button type="submit" className={`btn ${isLost ? "btn-lost" : "btn-found"}`} disabled={submitting}>
            Publish {isLost ? "lost" : "found"} report
          </button>
        </div>
      </form>
    </div>
  );
}
