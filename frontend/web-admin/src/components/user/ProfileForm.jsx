function ProfileForm({ profile, setProfile, updateProfile, alert }) {
  const getAlertIcon = (type) => {
    if (type === "success") return "fas fa-check-circle";
    return "fas fa-exclamation-circle";
  };

  return (
    <div style={{ padding: "24px 0" }}>
      <div style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Informasi Profil</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Perbarui data akun Anda di sini</div>
        </div>

        {alert.message && (
          <div className={`alert-box ${alert.type}`} style={{ marginBottom: 20 }}>
            <i className={getAlertIcon(alert.type)}></i>
            {alert.message}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Nama Lengkap</label>
          <input
            type="text"
            className="form-control"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={profile.email}
            readOnly
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Password Baru</label>
          <input
            type="password"
            className="form-control"
            placeholder="Kosongkan jika tidak diubah"
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
          />
        </div>

        <button className="btn btn-danger" onClick={updateProfile}>
          <i className="fas fa-save"></i>
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

export default ProfileForm;
