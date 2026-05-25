import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  API_URL,
  authHeaders,
  VOLUNTEERS_URL,
  DISASTERS_URL,
  SHELTERS_URL,
  ASSIGNMENTS_URL,
} from "../../services/api";
import "../../index.css";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  collection,
  onSnapshot
} from "firebase/firestore";

import { db }
from "../../config/firebase";

// Fix default marker icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom icon merah untuk disaster
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

// Custom icon hijau untuk shelter
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

// Custom icon biru untuk volunteer
const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

/* ── Helper: fly to center when position changes ── */
const FlyToCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1 });
  }, [center, map]);
  return null;
};

/* ── ResizeMap helper ── */
const ResizeMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [map]);
  return null;
};

/* ── Location Picker (untuk form tambah) ── */
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
      <MapContainer center={[-7.7956, 110.3695]} zoom={11}
        style={{ height: "260px", width: "100%", borderRadius: "10px", overflow: "hidden" }}>
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler />
        {form.latitude && form.longitude && (
          <Marker position={[form.latitude, form.longitude]} />
        )}
      </MapContainer>
      <small style={{ color: "#64748b" }}>Klik titik lokasi bencana pada peta.</small>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAP VIEW MODAL — lihat lokasi di peta
══════════════════════════════════════════ */
const MapViewModal = ({
  data,
  type,
  onClose,
  realtimeLocations = []
}) => {
  
  const realtime =
  realtimeLocations?.find(
    (r) =>
      String(
        r?.volunteer_id
      ) ===
      String(data?.id)
  );

  const getCenter = () => {

    const lat =
      realtime?.latitude ||
      data?.latitude;

    const lng =
      realtime?.longitude ||
      data?.longitude;

    if (lat && lng) {

      return [
        parseFloat(lat),
        parseFloat(lng)
      ];
    }

    return [-7.7956, 110.3695];
  };

  const hasCoords = () => {

    const lat =
      realtime?.latitude ||
      data?.latitude;

    const lng =
      realtime?.longitude ||
      data?.longitude;

    return !!(lat && lng);
  };

  const icon =
    type === "disaster"
      ? redIcon
      : type === "shelter"
      ? greenIcon
      : blueIcon;

  const popupLabel = () => {

    if (type === "disaster")
      return (
        data.title ||
        "Lokasi Bencana"
      );

    if (type === "shelter")
      return (
        data.name ||
        "Lokasi Shelter"
      );

    return (
      data.full_name ||
      data.name ||
      "Volunteer"
    );
  };

  const typeLabel = {

    disaster: "Bencana",

    shelter: "Shelter",

    volunteer: "Volunteer"

  }[type];

  const typeColor = {

    disaster: "#ef4444",

    shelter: "#22c55e",

    volunteer: "#3b82f6"

  }[type];

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
      onClick={onClose}
    >

      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: 600,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div
          style={{
            padding: "16px 20px",
            borderBottom:
              "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            background: "#f8fafc"
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >

            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: typeColor,
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center"
              }}
            >

              <i
                className={`fas ${
                  type === "disaster"
                    ? "fa-fire"
                    : type === "shelter"
                    ? "fa-home"
                    : "fa-user"
                }`}
                style={{
                  color: "#fff",
                  fontSize: 14
                }}
              ></i>

            </div>

            <div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "#1e293b"
                }}
              >

                Lokasi {typeLabel}

              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#64748b"
                }}
              >

                {popupLabel()}

              </div>

            </div>

          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#94a3b8",
              lineHeight: 1
            }}
          >

            ×

          </button>

        </div>

        <div
          style={{
            padding: "10px 20px",
            background: "#f1f5f9",
            borderBottom:
              "1px solid #e2e8f0",
            fontSize: 13,
            color: "#475569"
          }}
        >

          <i
            className="fas fa-map-marker-alt"
            style={{
              marginRight: 6,
              color: typeColor
            }}
          ></i>

          {data.location ||
            `${realtime?.latitude || data?.latitude},
             ${realtime?.longitude || data?.longitude}` ||
            "-"}

        </div>

        <div
          style={{
            flex: 1,
            height: "450px",
            width: "100%",
            minHeight: "450px"
          }}
        >

          {!hasCoords() ? (

            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "center",
                flexDirection: "column",
                gap: 10,
                color: "#94a3b8"
              }}
            >

              <i
                className="fas fa-map-marked-alt"
                style={{
                  fontSize: 40
                }}
              ></i>

              <div
                style={{
                  fontSize: 14
                }}
              >

                Koordinat tidak tersedia

              </div>

            </div>

          ) : (

            <MapContainer

              key={`${type}-${data.id}`}

              center={getCenter()}

              zoom={14}

              scrollWheelZoom={true}

              style={{
                height: "100%",
                width: "100%",
                minHeight: "450px"
              }}
            >

              <ResizeMap />

              <FlyToCenter
                center={getCenter()}
              />

              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker

                position={[
                parseFloat(
                  realtime?.latitude ||
                  data?.latitude
                ),

                parseFloat(
                  realtime?.longitude ||
                  data?.longitude
                )
              ]}

                icon={icon}
              >

                <Popup>

                  <strong>
                    {popupLabel()}
                  </strong>

                </Popup>

              </Marker>

            </MapContainer>
          )}

        </div>

      </div>

    </div>
  );
};

/* ── Form Modal ── */
const Modal = ({ title, fields, onClose, onSubmit, type }) => {
  const [form, setForm] = useState(
    fields.reduce((acc, f) => ({ ...acc, [f.key]: f.default ?? "" }), {})
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      await onSubmit(form);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 12, padding: 28, width: 460, maxWidth: "92vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#1e293b" }}>{title}</div>

        {err && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {type === "disasters" && <LocationPicker form={form} setForm={setForm} />}
          {fields.map((f) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 5, color: "#475569" }}>
                {f.label}{f.required !== false && <span style={{ color: "red" }}> *</span>}
              </label>
              {f.type === "select" ? (
                <select required={f.required !== false} value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, background: "#fff", boxSizing: "border-box" }}>
                  <option value="">Pilih {f.label}</option>
                  {f.options.map((o) => (
                    <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea required={f.required !== false} placeholder={f.placeholder || f.label}
                  value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
              ) : (
                <input type={f.type || "text"} required={f.required !== false}
                  placeholder={f.placeholder || f.label} value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }} />
              )}
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
            <button type="button" onClick={onClose} disabled={saving}
              style={{ padding: "9px 22px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f1f5f9", cursor: "pointer", fontSize: 14 }}>
              Batal
            </button>
            <button type="submit" disabled={saving}
              style={{ padding: "9px 22px", borderRadius: 8, border: "none", background: saving ? "#93c5fd" : "#3b82f6", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   Main Dashboard
══════════════════════════════════════════ */
const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [volunteers, setVolunteers] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [realtimeLocations, setRealtimeLocations] = useState([]);
  const [modal, setModal] = useState(null);

  // State untuk MapViewModal
  const [mapView, setMapView] = useState(null); // { data, type }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  /* ── Fetch data pada component mount ── */
  useEffect(() => {
    fetchData();
  }, []);

  /* ── Subscribe realtime locations ── */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "realtime_locations"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("Realtime Firebase:", data);
        setRealtimeLocations(data);
      }
    );
    return () => unsubscribe();
  }, []);

  const menus = [
    { key: "dashboard",   icon: "fas fa-chart-line", label: "Dashboard" },
    { key: "volunteers",  icon: "fas fa-users",       label: "Volunteers" },
    { key: "disasters",   icon: "fas fa-fire",        label: "Disasters" },
    { key: "shelters",    icon: "fas fa-home",        label: "Shelters" },
    { key: "assignments", icon: "fas fa-tasks",       label: "Assignments" },
  ];

  const sectionTitles = {
    dashboard:   { title: "Dashboard",            sub: "Ringkasan data sistem" },
    volunteers:  { title: "Volunteer Management", sub: "Kelola data relawan" },
    disasters:   { title: "Disaster Reports",     sub: "Data laporan bencana" },
    shelters:    { title: "Shelter Management",   sub: "Data shelter / posko" },
    assignments: { title: "Assignments",          sub: "Penugasan relawan" },
  };

  /* ── Fetch ── */
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const headers = authHeaders();
      const [vRes, dRes, sRes, aRes] = await Promise.all([
        fetch(`${API_URL}/volunteers`,  { headers }),
        fetch(`${API_URL}/disasters`,   { headers }),
        fetch(`${API_URL}/shelters`,    { headers }),
        fetch(`${API_URL}/assignments`, { headers }),
      ]);
      const parse = async (res) => {
        const json = await res.json();
        if (Array.isArray(json)) return json;
        if (json.data && Array.isArray(json.data)) return json.data;
        return [];
      };
      setVolunteers(await parse(vRes));
      setDisasters(await parse(dRes));
      setShelters(await parse(sRes));
      setAssignments(await parse(aRes));
    } catch (err) {
      setError(err.message || "Gagal mengambil data dari server");
    } finally {
      setLoading(false);
    }
  };

  /* ── POST ── */
  const postData = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Gagal menyimpan data");
    return json;
  };

  /* ── Modal configs ── */
  const openModal = (section) => {
    const configs = {
      volunteers: {
        title: "Tambah Volunteer",
        fields: [
          { key: "full_name", label: "Nama Lengkap" },
          { key: "phone",     label: "Nomor Telepon", required: false, placeholder: "08xxxxxxxxxx" },
          { key: "address",   label: "Alamat", type: "textarea", required: false },
          { key: "skills",    label: "Keahlian", required: false, placeholder: "cth: P3K, Evakuasi" },
          { key: "availability_status", label: "Status Ketersediaan", type: "select", default: "available",
            options: ["available", "assigned", "unavailable"] },
        ],
        onSubmit: async (form) => { await postData(VOLUNTEERS_URL, form); setModal(null); fetchData(); },
      },
      disasters: {
        type: "disasters",
        title: "Tambah Laporan Bencana",
        fields: [
          { key: "title",    label: "Judul Bencana", placeholder: "cth: Banjir Bandang Desa X" },
          { key: "location", label: "Lokasi" },
            { key: "latitude", label: "Latitude", type: "number", required: false },
          { key: "longitude", label: "Longitude", type: "number", required: false },
          { key: "type",     label: "Jenis Bencana", type: "select",
            options: ["Banjir", "Gempa", "Longsor", "Kebakaran", "Tsunami", "Angin Puting Beliung", "Lainnya"] },
          { key: "severity", label: "Tingkat Keparahan", type: "select", default: "medium",
            options: ["low", "medium", "high", "critical"] },
          { key: "disaster_date", label: "Tanggal Kejadian", type: "date" },
          { key: "description", label: "Deskripsi", type: "textarea", required: false },
          { key: "status", label: "Status", type: "select", default: "active",
            options: ["active", "handled", "closed"] },
        ],
        onSubmit: async (form) => { await postData(DISASTERS_URL, form); setModal(null); fetchData(); },
      },
      shelters: {
        title: "Tambah Shelter / Posko",
        fields: [
          { key: "name",             label: "Nama Shelter" },
          { key: "location",         label: "Lokasi / Alamat" },
          { key: "latitude",         label: "Latitude", type: "number", required: false },
          { key: "longitude",        label: "Longitude", type: "number", required: false },
          { key: "capacity",         label: "Kapasitas (orang)", type: "number", default: "0" },
          { key: "current_capacity", label: "Pengungsi Saat Ini", type: "number", default: "0", required: false },
          { key: "coordinator",      label: "Nama Koordinator", required: false },
          { key: "contact",          label: "Kontak Koordinator", required: false, placeholder: "08xxxxxxxxxx" },
        ],
        onSubmit: async (form) => { await postData(SHELTERS_URL, form); setModal(null); fetchData(); },
      },
      assignments: {
        title: "Tambah Assignment",
        fields: [
          { key: "volunteer_id", label: "ID Volunteer", type: "number", placeholder: "Lihat tab Volunteers untuk ID" },
          { key: "disaster_id",  label: "ID Disaster",  type: "number", placeholder: "Lihat tab Disasters untuk ID" },
          { key: "shelter_id",   label: "ID Shelter (opsional)", type: "number", required: false },
          { key: "assignment_status", label: "Status", type: "select", default: "assigned",
            options: ["assigned", "on_the_way", "on_site", "completed", "cancelled"] },
          { key: "notes", label: "Catatan", type: "textarea", required: false },
        ],
        onSubmit: async (form) => {
          if (!form.shelter_id) delete form.shelter_id;
          await postData(ASSIGNMENTS_URL, form);
          setModal(null);
          fetchData();
        },
      },
    };
    setModal(configs[section]);
  };

  /* ── State display ── */
  const renderState = (data) => {
    if (loading) return (
      <div style={{ padding: 32, textAlign: "center", color: "#94a3b8" }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Memuat data...
      </div>
    );
    if (error) return (
      <div style={{ padding: 20, color: "#dc2626", background: "#fee2e2", borderRadius: 8, margin: 16 }}>
        <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>{error}
      </div>
    );
    if (!data.length) return (
      <div style={{ padding: 40, textAlign: "center", color: "#cbd5e1" }}>
        <i className="fas fa-inbox" style={{ fontSize: 32, display: "block", marginBottom: 10 }}></i>
        Tidak ada data
      </div>
    );
    return null;
  };

  const severityBadge = (s) => {
    const map = { critical: "danger", high: "warning", medium: "primary", low: "success" };
    return <span className={`badge bg-${map[s] || "secondary"}`}>{s || "-"}</span>;
  };
  const statusBadge = (s) => {
    const map = { active: "success", available: "success", completed: "primary", assigned: "info", pending: "warning", cancelled: "danger", unavailable: "secondary", on_the_way: "warning", on_site: "primary", handled: "warning", closed: "secondary" };
    return <span className={`badge bg-${map[s] || "secondary"}`}>{s || "-"}</span>;
  };

  /* ── Tombol Lihat Peta ── */
  const MapBtn = ({ onClick, color = "#3b82f6", label = "Peta" }) => (
    <button
      onClick={onClick}
      title={`Lihat ${label} di Peta`}
      style={{
        padding: "4px 10px", borderRadius: 6, border: "none",
        background: color, color: "#fff", fontSize: 11, fontWeight: 600,
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
        whiteSpace: "nowrap",
      }}
    >
      <i className="fas fa-map-marker-alt"></i> Peta
    </button>
  );

  return (
    <>
      {/* Form Modal */}
      {modal && (
        <Modal
          title={modal.title}
          fields={modal.fields}
          type={modal.type}
          onClose={() => setModal(null)}
          onSubmit={modal.onSubmit}
        />
      )}

      {/* Map View Modal */}
      {mapView && (
        <MapViewModal
          data={mapView.data}
          type={mapView.type}
          onClose={() => setMapView(null)}
          realtimeLocations={realtimeLocations}
        />
      )}

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><i className="fas fa-hands-helping"></i></div>
          <div>
            <div className="sidebar-logo-text">DVN Admin</div>
            <div className="sidebar-logo-sub">Disaster Volunteer Network</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu Utama</div>
          {menus.map((m) => (
            <button key={m.key}
              className={`nav-link ${activeSection === m.key ? "active" : ""}`}
              onClick={() => setActiveSection(m.key)}>
              <i className={m.icon}></i>{m.label}
            </button>
          ))}
          <div className="sidebar-divider" />
          <button className="nav-link logout-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>Logout
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">{sectionTitles[activeSection]?.title}</div>
            <div className="topbar-sub">{sectionTitles[activeSection]?.sub}</div>
          </div>
          <div className="topbar-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => alert("Belum ada notifikasi baru")}>
              <i className="fas fa-bell"></i>Notifikasi
            </button>
            <div className="navbar-user-chip">
              <div className="navbar-avatar"><i className="fas fa-user-shield"></i></div>
              {user?.name || "Admin"}
            </div>
          </div>
        </div>

        {/* DASHBOARD */}
        {activeSection === "dashboard" && (
          <div className="row g-4">
            {[
              { label: "Volunteers",  count: volunteers.length,  color: "red",    icon: "fa-users" },
              { label: "Disasters",   count: disasters.length,   color: "blue",   icon: "fa-fire" },
              { label: "Shelters",    count: shelters.length,    color: "green",  icon: "fa-home" },
              { label: "Assignments", count: assignments.length, color: "orange", icon: "fa-tasks" },
            ].map((s) => (
              <div key={s.label} className="col-md-3">
                <div className={`stat-card ${s.color}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="stat-card-label">{s.label}</div>
                      <div className="stat-number">{loading ? "..." : s.count}</div>
                    </div>
                    <div className={`stat-card-icon ${s.color}`}>
                      <i className={`fas ${s.icon}`}></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VOLUNTEERS */}
        {activeSection === "volunteers" && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: "24px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="card-title">Volunteer Management</div>
                <button className="btn btn-primary btn-sm" onClick={() => openModal("volunteers")}>
                  <i className="fas fa-user-plus"></i> Tambah Volunteer
                </button>
              </div>
              {renderState(volunteers) || (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Nama</th><th>Telepon</th><th>Keahlian</th><th>Status</th><th>Aksi</th>
                      </tr>
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
                            {/* Volunteer: tombol lacak lokasi realtime */}
                            <MapBtn
                              onClick={() => setMapView({ data: v, type: "volunteer" })}
                              color="#3b82f6"
                              label="Volunteer"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DISASTERS */}
        {activeSection === "disasters" && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: "24px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="card-title">Disaster Reports</div>
                <button className="btn btn-danger btn-sm" onClick={() => openModal("disasters")}>
                  <i className="fas fa-plus"></i> Tambah Disaster
                </button>
              </div>
              {renderState(disasters) || (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Judul</th><th>Lokasi</th><th>Jenis</th><th>Severity</th><th>Tanggal</th><th>Status</th><th>Aksi</th>
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
                          <td>{d.disaster_date ? new Date(d.disaster_date).toLocaleDateString("id-ID") : "-"}</td>
                          <td>{statusBadge(d.status)}</td>
                          <td>
                            <MapBtn
                              onClick={() => setMapView({ data: d, type: "disaster" })}
                              color="#ef4444"
                              label="Disaster"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SHELTERS */}
        {activeSection === "shelters" && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: "24px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="card-title">Shelter / Posko</div>
                <button className="btn btn-success btn-sm" onClick={() => openModal("shelters")}>
                  <i className="fas fa-plus"></i> Tambah Shelter
                </button>
              </div>
              {renderState(shelters) || (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Nama</th><th>Lokasi</th><th>Kapasitas</th><th>Pengungsi</th><th>Koordinator</th><th>Aksi</th>
                      </tr>
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
                            <MapBtn
                              onClick={() => setMapView({ data: s, type: "shelter" })}
                              color="#22c55e"
                              label="Shelter"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ASSIGNMENTS */}
        {activeSection === "assignments" && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: "24px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="card-title">Assignments</div>
                <button className="btn btn-warning btn-sm" onClick={() => openModal("assignments")}>
                  <i className="fas fa-plus"></i> Tambah Assignment
                </button>
              </div>
              {renderState(assignments) || (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Volunteer</th><th>Bencana</th><th>Lokasi</th><th>Shelter</th><th>Status</th>
                      </tr>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardAdmin;