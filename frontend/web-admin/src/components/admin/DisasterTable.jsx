import MapButton from "./MapButton";

const DisasterTable = ({
  disasters,
  loading,
  error,
  onAdd,
  onMap,
  onEdit,
  onDelete,
}) => {
  const renderState = () => {
    if (loading) return <div className="p-4 text-center">Memuat data...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!disasters.length) return <div className="p-4 text-center">Tidak ada data</div>;
    return null;
  };

  const severityBadge = (s) => {
    const map = {
      critical: "danger",
      high: "warning",
      medium: "primary",
      low: "success",
    };

    return <span className={`badge bg-${map[s] || "secondary"}`}>{s || "-"}</span>;
  };

  const statusBadge = (s) => {
    const map = {
      active: "success",
      handled: "warning",
      closed: "secondary",
    };

    return <span className={`badge bg-${map[s] || "secondary"}`}>{s || "-"}</span>;
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body" style={{ padding: "24px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="card-title">Disaster Reports</div>
          <button className="btn btn-danger btn-sm" onClick={onAdd}>
            <i className="fas fa-plus"></i> Tambah Disaster
          </button>
        </div>

        {renderState() || (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Lokasi</th>
                  <th>Jenis</th>
                  <th>Severity</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {disasters.map((d, i) => (
                  <tr key={d.id || i}>
                    <td style={{ color: "#94a3b8", fontSize: 12 }}>{d.id}</td>
                    <td>{d.title}</td>
                    <td>{d.location}</td>
                    <td>{d.type}</td>
                    <td>{severityBadge(d.severity)}</td>
                    <td>
                      {d.disaster_date
                        ? new Date(d.disaster_date).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td>{statusBadge(d.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <MapButton
                          onClick={() => onMap(d)}
                          color="#ef4444"
                          label="Disaster"
                        />

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => onEdit(d)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(d.id)}
                        >
                          Hapus
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

export default DisasterTable;