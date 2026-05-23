function ProfileForm({
  profile,
  setProfile,
  updateProfile,
  alert,
}) {
  return (
    <div className="row">

      <div className="col-md-6">

        <div className="card bg-dark border-secondary p-4">

          {alert.message && (
            <div
              className={`alert alert-${alert.type}`}
            >
              {alert.message}
            </div>
          )}

          <div className="mb-3">

            <label className="form-label">
              Nama
            </label>

            <input
              type="text"
              className="form-control bg-secondary text-white border-0"
              value={profile.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  name: e.target.value,
                })
              }
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control bg-secondary text-white border-0"
              value={profile.email}
              readOnly
            />

          </div>

          <div className="mb-3">

            <label className="form-label">
              Password Baru
            </label>

            <input
              type="password"
              className="form-control bg-secondary text-white border-0"
              placeholder="Kosongkan jika tidak diubah"
              onChange={(e) =>
                setProfile({
                  ...profile,
                  password: e.target.value,
                })
              }
            />

          </div>

          <button
            className="btn btn-danger"
            onClick={updateProfile}
          >
            Simpan Perubahan
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProfileForm;