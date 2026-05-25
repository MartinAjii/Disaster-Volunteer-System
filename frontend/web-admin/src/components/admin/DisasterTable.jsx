import StateDisplay from "./StateDisplay";
import MapButton from "./MapButton";
import { severityBadge, statusBadge } from "./badges";

const DisasterTable = ({ disasters, loading, error, onAdd, onMap }) => {
  const state = <StateDisplay loading={loading} error={error} data={disasters} />;

  return (
    <div className="card shadow-sm">
      <div className="card-body" style={{ padding: "24px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="card-title">Disaster Reports</div>
          <button className="btn btn-danger btn-sm" onClick={onAdd}>
            <i className="fas fa-plus"></i> Tambah Disaster
          </button>
        </div>

        {state.props.loading || state.props.error || !disasters.length ? state : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Judul</th><th>Lokasi</th><th>Jenis</th><th>Severity</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {disasters.map((d, i) => (
                  <tr key={d.id || i}>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{d.id}</td>
                    <td>{d.title}</td>
                    <td>{d.location}</td>
                    <td>{d.type}</td>
                    <td>{severityBadge(d.severity)}</td>
                    <td>{d.disaster_date ? new Date(d.disaster_date).toLocaleDateString("id-ID") : "-"}</td>
                    <td>{statusBadge(d.status)}</td>
                    <td>
                      <MapButton onClick={() => onMap(d)} color="#ef4444" label="Disaster" />
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

export default DisasterTable;
