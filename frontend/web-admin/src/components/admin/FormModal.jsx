import { useState } from "react";
import LocationPicker from "./LocationPicker";

const FormModal = ({ title, fields, onClose, onSubmit, type }) => {
  const [form, setForm] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.default ?? "" }), {})
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      await onSubmit(form);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 12, padding: 28, width: 460, maxWidth: "92vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#1e293b" }}>{title}</div>

        {err && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {(type === "disasters" || type === "shelters") && <LocationPicker form={form} setForm={setForm} />}

          {fields.map((f) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label htmlFor={f.key} style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5, color: "#475569" }}>
                {f.label}{f.required !== false && <span style={{ color: "red" }}> *</span>}
              </label>

              {f.type === "select" ? (
                <select
                  id={f.key}
                  name={f.key}
                  required={f.required !== false}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff", boxSizing: "border-box" }}
                >
                  <option value="">Pilih {f.label}</option>
                  {f.options.map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  id={f.key}
                  name={f.key}
                  required={f.required !== false}
                  placeholder={f.placeholder || f.label}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, resize: "vertical", boxSizing: "border-box" }}
                />
              ) : (
                <input
                  id={f.key}
                  name={f.key}
                  type={f.type || "text"}
                  required={f.required !== false}
                  placeholder={f.placeholder || f.label}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
            <button type="button" onClick={onClose} disabled={saving} style={{ padding: "9px 22px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f1f5f9", cursor: "pointer", fontSize: 14 }}>
              Batal
            </button>
            <button type="submit" disabled={saving} style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: saving ? "#93c5fd" : "#3b82f6", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
