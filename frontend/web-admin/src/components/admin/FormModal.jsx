import { useState } from "react";
import LocationPicker from "./LocationPicker";

const FormModal = ({ title, fields, onClose, onSubmit, type, initialData = {} }) => {
  const [form, setForm] = useState(
    fields.reduce(
      (acc, f) => ({
        ...acc,
        [f.key]: initialData[f.key] ?? f.default ?? "",
      }),
      {}
    )
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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 28,
          width: 460,
          maxWidth: "92vw",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h5>{title}</h5>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={handleSubmit}>
          {(type === "disasters" || type === "shelters") && (
            <LocationPicker form={form} setForm={setForm} />
          )}

         {fields.map((f) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
                <label
                htmlFor={f.key}
                style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 5,
                    color: "#475569",
                }}
                >
                {f.label}
                {f.required !== false && <span style={{ color: "red" }}> *</span>}
                </label>

                {f.type === "select" ? (
                <select
                    id={f.key}
                    name={f.key}
                    required={f.required !== false}
                    value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    background: "#fff",
                    color: "#1e293b",
                    boxSizing: "border-box",
                    }}
                >
                    <option value="">Pilih {f.label}</option>
                    {f.options.map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>
                        {o.label ?? o}
                    </option>
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
                    style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    background: "#fff",
                    color: "#1e293b",
                    resize: "vertical",
                    boxSizing: "border-box",
                    }}
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
                    style={{
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    background: "#fff",
                    color: "#1e293b",
                    boxSizing: "border-box",
                    }}
                />
                )}
            </div>
            ))}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;