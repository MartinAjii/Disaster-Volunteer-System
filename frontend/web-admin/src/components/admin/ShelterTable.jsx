import StateDisplay from "./StateDisplay";
import MapButton from "./MapButton";

const statusBadge = (status) => {
  const map = {
    tersedia: { bg: "#dcfce7", color: "#16a34a", label: "Tersedia" },
    penuh:    { bg: "#fee2e2", color: "#dc2626", label: "Penuh" },
  };
  const s = map[status] || { bg: "#f1f5f9", color: "#64748b", label: status || "-" };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "2px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 600
    }}>
      {s.label}
    </span>
  );
};

const ShelterTable = ({ shelters, loading, error, onAdd, onMap, onEdit, onDelete }) => {
  const state = <StateDisplay loading={loading} error={error} data={shelters} />;

  return (
    <div className="card shadow-sm">
      <div className="card-body" style={{ padding: "24px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="card-title">Shelter / Posko</div>
          <button className="btn btn-success btn-sm" onClick={onAdd}>
            <i className="fas fa-plus"></i> Tambah Shelter
          </button>
        </div>

        {state.props.loading || state.props.error || !shelters.length ? state : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Lokasi</th>
                  <th>Kapasitas</th>
                  <th>Status</th>
                  <th>Koordinator</th>
                  <th>Kontak</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {shelters.map((s, i) => (
                  <tr key={s.id || i}>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.location}</td>
                    <td>{s.capacity}</td>
                    <td>{statusBadge(s.status)}</td>
                    <td>{s.coordinator || "-"}</td>
                    <td>{s.contact || "-"}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <MapButton onClick={() => onMap(s)} color="#22c55e" label="Shelter" />
                        <button
                          className="btn btn-sm"
                          style={{ background: "#3b82f6", color: "#fff", fontSize: 12 }}
                          onClick={() => onEdit(s)}
                          title="Edit"
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ background: "#ef4444", color: "#fff", fontSize: 12 }}
                          onClick={() => onDelete(s.id)}
                          title="Hapus"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterTable;