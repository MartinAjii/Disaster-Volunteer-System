import StateDisplay from "./StateDisplay";
import MapButton from "./MapButton";

const ShelterTable = ({ shelters, loading, error, onAdd, onMap }) => {
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
                <tr><th>ID</th><th>Nama</th><th>Lokasi</th><th>Kapasitas</th><th>Pengungsi</th><th>Koordinator</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {shelters.map((s, i) => (
                  <tr key={s.id || i}>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.location}</td>
                    <td>{s.capacity}</td>
                    <td>{s.current_capacity ?? "-"}</td>
                    <td>{s.coordinator || "-"}</td>
                    <td>
                      <MapButton onClick={() => onMap(s)} color="#22c55e" label="Shelter" />
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
