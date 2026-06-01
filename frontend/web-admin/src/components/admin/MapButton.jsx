const MapButton = ({ onClick, color = "#3b82f6", label = "Peta" }) => (
  <button
    type="button"
    onClick={onClick}
    title={`Lihat ${label} di Peta`}
    className="btn btn-sm"
    style={{
      borderRadius: 6,
      border: "none",
      background: color,
      color: "#fff",
      fontSize: 11,
      fontWeight: 600,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      whiteSpace: "nowrap",
    }}
  >
    <i className="fas fa-map-marker-alt"></i> Peta
  </button>
);

export default MapButton;
