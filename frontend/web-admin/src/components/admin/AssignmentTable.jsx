import StateDisplay from "./StateDisplay";
import { statusBadge } from "./badges";

const AssignmentTable = ({ assignments, loading, error, onAdd, onViewReport }) => {
  const state = <StateDisplay loading={loading} error={error} data={assignments} />;

  return (
    <div className="card shadow-sm">
      <div className="card-body" style={{ padding: "24px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="card-title">Assignments</div>
          <button className="btn btn-warning btn-sm" onClick={onAdd}>
            <i className="fas fa-plus"></i> Tambah Assignment
          </button>
        </div>

        {state.props.loading || state.props.error || !assignments.length ? state : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>ID</th><th>Volunteer</th><th>Bencana</th><th>Lokasi</th><th>Shelter</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {assignments.map((a, i) => (
                  <tr key={a.id || i}>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{a.id}</td>
                    <td>{a.volunteer_name || a.volunteer_id}</td>
                    <td>{a.disaster_title || a.disaster_id}</td>
                    <td>{a.disaster_location || "-"}</td>
                    <td>{a.shelter_name || "-"}</td>
                    <td>{statusBadge(a.assignment_status || a.status)}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info" 
                        onClick={() => onViewReport(a)}
                        title="Lihat laporan volunteer"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <i className="fas fa-file-alt"></i> Laporan
                      </button>
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

export default AssignmentTable;
