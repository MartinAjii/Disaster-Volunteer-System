const StateDisplay = ({ loading, error, data }) => {
  if (loading) {
    return (
      <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "#dc2626", background: "#fee2e2", borderRadius: 8, margin: 16 }}>
        <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>{error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#cbd5e1" }}>
        <i className="fas fa-inbox" style={{ fontSize: 32, display: "block", marginBottom: 10 }}></i>
        Tidak ada data
      </div>
    );
  }

  return null;
};

export default StateDisplay;
