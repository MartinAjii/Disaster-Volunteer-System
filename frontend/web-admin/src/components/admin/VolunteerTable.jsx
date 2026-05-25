import StateDisplay from "./StateDisplay";
import MapButton from "./MapButton";
import { statusBadge } from "./badges";

const VolunteerTable = ({ volunteers, loading, error, onAdd, onMap }) => {
  const state = <StateDisplay loading={loading} error={error} data={volunteers} />;

  return (
    <div className="card shadow-sm">
      <div className="card-body" style={{ padding: "24px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="card-title">Volunteer Management</div>
          <button className="btn btn-primary btn-sm" onClick={onAdd}>
            <i className="fas fa-user-plus"></i> Tambah Volunteer
          </button>
        </div>

        {state.props.loading || state.props.error || !volunteers.length ? state : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Nama</th><th>Telepon</th><th>Keahlian</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {volunteers.map((v, i) => (
                  <tr key={v.id || i}>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{v.id}</td>
                    <td>{v.full_name || v.name}</td>
                    <td>{v.phone || "-"}</td>
                    <td>{v.skills || "-"}</td>
                    <td>{statusBadge(v.availability_status || v.status)}</td>
                    <td>
                      <MapButton onClick={() => onMap(v)} color="#3b82f6" label="Volunteer" />
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

export default VolunteerTable;
