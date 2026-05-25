import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { redIcon, greenIcon, blueIcon } from "./mapIcons";

const FlyToCenter = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1 });
  }, [center, map]);

  return null;
};

const ResizeMap = () => {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);

  return null;
};

const MapViewModal = ({ data, type, onClose, realtimeLocations = [] }) => {
  const realtime = realtimeLocations?.find(
    (r) => String(r?.volunteer_id) === String(data?.id)
  );

  const lat = realtime?.latitude || data?.latitude;
  const lng = realtime?.longitude || data?.longitude;
  const hasCoords = !!(lat && lng);
  const center = hasCoords ? [parseFloat(lat), parseFloat(lng)] : [-7.7956, 110.3695];

  const icon = type === "disaster" ? redIcon : type === "shelter" ? greenIcon : blueIcon;

  const popupLabel = () => {
    if (type === "disaster") return data.title || "Lokasi Bencana";
    if (type === "shelter") return data.name || "Lokasi Shelter";
    return data.full_name || data.name || "Volunteer";
  };

  const typeLabel = {
    disaster: "Bencana",
    shelter: "Shelter",
    volunteer: "Volunteer",
  }[type];

  const typeColor = {
    disaster: "#ef4444",
    shelter: "#22c55e",
    volunteer: "#3b82f6",
  }[type];

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 14, width: 600, maxWidth: "95vw", maxHeight: "90vh", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: typeColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`fas ${type === "disaster" ? "fa-fire" : type === "shelter" ? "fa-home" : "fa-user"}`} style={{ color: "#fff", fontSize: 14 }}></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>Lokasi {typeLabel}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{popupLabel()}</div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#94a3b8", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: "10px 20px", background: "#f1f5f9", borderBottom: "1px solid #e2e8f0", fontSize: 13, color: "#475569" }}>
          <i className="fas fa-map-marker-alt" style={{ marginRight: 6, color: typeColor }}></i>
          {data.location || (hasCoords ? `${lat}, ${lng}` : "-")}
        </div>

        <div style={{ flex: 1, height: "450px", width: "100%", minHeight: "450px" }}>
          {!hasCoords ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10, color: "#94a3b8" }}>
              <i className="fas fa-map-marked-alt" style={{ fontSize: 40 }}></i>
              <div style={{ fontSize: 14 }}>Koordinat tidak tersedia</div>
            </div>
          ) : (
            <MapContainer
              key={`${type}-${data.id}`}
              center={center}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%", minHeight: "450px" }}
            >
              <ResizeMap />
              <FlyToCenter center={center} />
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={icon}>
                <Popup><strong>{popupLabel()}</strong></Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapViewModal;
