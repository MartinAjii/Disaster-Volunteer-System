import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./mapIcons";

const LocationPicker = ({ form, setForm }) => {
  const ClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        let locationName = `${lat}, ${lng}`;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          if (data?.display_name) locationName = data.display_name;
        } catch (err) {
          console.error("Gagal mengambil nama lokasi:", err);
        }

        setForm({ ...form, latitude: lat, longitude: lng, location: locationName });
      },
    });

    return null;
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5, color: "#475569" }}>
        Pilih Lokasi di Peta
      </label>

      <MapContainer
        center={[-7.7956, 110.3695]}
        zoom={11}
        style={{ height: "260px", width: "100%", borderRadius: "10px", overflow: "hidden" }}
      >
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler />
        {form.latitude && form.longitude && <Marker position={[form.latitude, form.longitude]} />}
      </MapContainer>

      <small style={{ color: "#64748b" }}>Klik titik lokasi pada peta.</small>
    </div>
  );
};

export default LocationPicker;
