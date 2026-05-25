import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";

import {
  API_URL,
  authHeaders,
  VOLUNTEERS_URL,
  DISASTERS_URL,
  SHELTERS_URL,
  ASSIGNMENTS_URL,
} from "../../services/api";

import { db } from "../../config/firebase";

import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import DashboardSection from "../../components/admin/DashboardSection";
import VolunteerTable from "../../components/admin/VolunteerTable";
import DisasterTable from "../../components/admin/DisasterTable";
import ShelterTable from "../../components/admin/ShelterTable";
import AssignmentTable from "../../components/admin/AssignmentTable";
import FormModal from "../../components/admin/FormModal";
import MapViewModal from "../../components/admin/MapViewModal";

import "../../index.css";

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
  const [mapView, setMapView] = useState(null);

  const getUser = () => {
    const storedUser = localStorage.getItem("user");

    try {
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem("user");
    }

    return {};
  };

  const user = getUser();

  const menus = [
    { key: "dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    { key: "volunteers", icon: "fas fa-users", label: "Volunteers" },
    { key: "disasters", icon: "fas fa-fire", label: "Disasters" },
    { key: "shelters", icon: "fas fa-home", label: "Shelters" },
    { key: "assignments", icon: "fas fa-tasks", label: "Assignments" },
  ];

  const sectionTitles = {
    dashboard: { title: "Dashboard", sub: "Ringkasan data sistem" },
    volunteers: { title: "Volunteer Management", sub: "Kelola data relawan" },
    disasters: { title: "Disaster Reports", sub: "Data laporan bencana" },
    shelters: { title: "Shelter Management", sub: "Data shelter / posko" },
    assignments: { title: "Assignments", sub: "Penugasan relawan" },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = authHeaders();
      const [vRes, dRes, sRes, aRes] = await Promise.all([
        fetch(`${API_URL}/volunteers`, { headers }),
        fetch(`${API_URL}/disasters`, { headers }),
        fetch(`${API_URL}/shelters`, { headers }),
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "realtime_locations"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRealtimeLocations(data);
      },
      (error) => {
        console.error("Firebase realtime error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const postData = async (url, body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || "Gagal menyimpan data");
    }

    return json;
  };

  const openModal = (section) => {
    const configs = {
      volunteers: {
        title: "Tambah Volunteer",
        fields: [
          { key: "full_name", label: "Nama Lengkap" },
          { key: "phone", label: "Nomor Telepon", required: false, placeholder: "08xxxxxxxxxx" },
          { key: "address", label: "Alamat", type: "textarea", required: false },
          { key: "skills", label: "Keahlian", required: false, placeholder: "cth: P3K, Evakuasi" },
          {
            key: "availability_status",
            label: "Status Ketersediaan",
            type: "select",
            default: "available",
            options: ["available", "assigned", "unavailable"],
          },
        ],
        onSubmit: async (form) => {
          await postData(VOLUNTEERS_URL, form);
          setModal(null);
          fetchData();
        },
      },

      disasters: {
        type: "disasters",
        title: "Tambah Laporan Bencana",
        fields: [
          { key: "title", label: "Judul Bencana", placeholder: "cth: Banjir Bandang Desa X" },
          { key: "location", label: "Lokasi" },
          { key: "latitude", label: "Latitude", type: "number", required: false },
          { key: "longitude", label: "Longitude", type: "number", required: false },
          {
            key: "type",
            label: "Jenis Bencana",
            type: "select",
            options: ["Banjir", "Gempa", "Longsor", "Kebakaran", "Tsunami", "Angin Puting Beliung", "Lainnya"],
          },
          {
            key: "severity",
            label: "Tingkat Keparahan",
            type: "select",
            default: "medium",
            options: ["low", "medium", "high", "critical"],
          },
          { key: "disaster_date", label: "Tanggal Kejadian", type: "date" },
          { key: "description", label: "Deskripsi", type: "textarea", required: false },
          {
            key: "status",
            label: "Status",
            type: "select",
            default: "active",
            options: ["active", "handled", "closed"],
          },
        ],
        onSubmit: async (form) => {
          await postData(DISASTERS_URL, form);
          setModal(null);
          fetchData();
        },
      },

      shelters: {
        type: "shelters",
        title: "Tambah Shelter / Posko",
        fields: [
          { key: "name", label: "Nama Shelter" },
          { key: "location", label: "Lokasi / Alamat" },
          { key: "latitude", label: "Latitude", type: "number", required: false },
          { key: "longitude", label: "Longitude", type: "number", required: false },
          { key: "capacity", label: "Kapasitas (orang)", type: "number", default: "0" },
          { key: "current_capacity", label: "Pengungsi Saat Ini", type: "number", default: "0", required: false },
          { key: "coordinator", label: "Nama Koordinator", required: false },
          { key: "contact", label: "Kontak Koordinator", required: false, placeholder: "08xxxxxxxxxx" },
        ],
        onSubmit: async (form) => {
          await postData(SHELTERS_URL, form);
          setModal(null);
          fetchData();
        },
      },

      assignments: {
        title: "Tambah Assignment",
        fields: [
          { key: "volunteer_id", label: "ID Volunteer", type: "number", placeholder: "Lihat tab Volunteers untuk ID" },
          { key: "disaster_id", label: "ID Disaster", type: "number", placeholder: "Lihat tab Disasters untuk ID" },
          { key: "shelter_id", label: "ID Shelter (opsional)", type: "number", required: false },
          {
            key: "assignment_status",
            label: "Status",
            type: "select",
            default: "assigned",
            options: ["assigned", "on_the_way", "on_site", "completed", "cancelled"],
          },
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

  return (
    <>
      {modal && (
        <FormModal
          title={modal.title}
          fields={modal.fields}
          type={modal.type}
          onClose={() => setModal(null)}
          onSubmit={modal.onSubmit}
        />
      )}

      {mapView && (
        <MapViewModal
          data={mapView.data}
          type={mapView.type}
          onClose={() => setMapView(null)}
          realtimeLocations={realtimeLocations}
        />
      )}

      <Sidebar
        menus={menus}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        handleLogout={handleLogout}
      />

      <div className="main-content">
        <Topbar
          title={sectionTitles[activeSection]?.title}
          sub={sectionTitles[activeSection]?.sub}
          user={user}
        />

        {activeSection === "dashboard" && (
          <DashboardSection
            loading={loading}
            volunteers={volunteers}
            disasters={disasters}
            shelters={shelters}
            assignments={assignments}
          />
        )}

        {activeSection === "volunteers" && (
          <VolunteerTable
            volunteers={volunteers}
            loading={loading}
            error={error}
            onAdd={() => openModal("volunteers")}
            onMap={(v) => setMapView({ data: v, type: "volunteer" })}
          />
        )}

        {activeSection === "disasters" && (
          <DisasterTable
            disasters={disasters}
            loading={loading}
            error={error}
            onAdd={() => openModal("disasters")}
            onMap={(d) => setMapView({ data: d, type: "disaster" })}
          />
        )}

        {activeSection === "shelters" && (
          <ShelterTable
            shelters={shelters}
            loading={loading}
            error={error}
            onAdd={() => openModal("shelters")}
            onMap={(s) => setMapView({ data: s, type: "shelter" })}
          />
        )}

        {activeSection === "assignments" && (
          <AssignmentTable
            assignments={assignments}
            loading={loading}
            error={error}
            onAdd={() => openModal("assignments")}
          />
        )}
      </div>
    </>
  );
};

export default DashboardAdmin;
