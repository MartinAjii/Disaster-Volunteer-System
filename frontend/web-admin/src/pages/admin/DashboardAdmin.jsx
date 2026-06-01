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
import ReportModal from "../../components/admin/ReportModal";

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
    const storedUser = sessionStorage.getItem("user");

    try {
      if (storedUser && storedUser !== "undefined") {
        return JSON.parse(storedUser);
      }
    } catch {
      sessionStorage.removeItem("user");
    }

    return {};
  };

  const user = getUser();

  const menus = [
    {
      key: "dashboard",
      icon: "fas fa-chart-line",
      label: "Dashboard",
    },
    {
      key: "volunteers",
      icon: "fas fa-users",
      label: "Volunteers",
    },
    {
      key: "disasters",
      icon: "fas fa-fire",
      label: "Disasters",
    },
    {
      key: "shelters",
      icon: "fas fa-home",
      label: "Shelters",
    },
    {
      key: "assignments",
      icon: "fas fa-tasks",
      label: "Assignments",
    },
  ];

  const sectionTitles = {
    dashboard: {
      title: "Dashboard",
      sub: "Ringkasan data sistem",
    },
    volunteers: {
      title: "Volunteer Management",
      sub: "Kelola data relawan",
    },
    disasters: {
      title: "Disaster Reports",
      sub: "Data laporan bencana",
    },
    shelters: {
      title: "Shelter Management",
      sub: "Data shelter / posko",
    },
    assignments: {
      title: "Assignments",
      sub: "Penugasan relawan",
    },
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
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

        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }

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

  const deleteData = async (url) => {
    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json.message || "Gagal menghapus data");
    }

    return json;
  };

  // ─────────────────────────────
  // DELETE VOLUNTEER
  // ─────────────────────────────
  const handleDeleteVolunteer = async (volunteer) => {
    const volunteerId = volunteer?.id || volunteer;
    const confirmDelete = window.confirm("Yakin ingin menghapus volunteer ini?");

    if (!confirmDelete) return;

    try {
      await deleteData(`${VOLUNTEERS_URL}/${volunteerId}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // ─────────────────────────────
  // EDIT DISASTER
  // ─────────────────────────────
  const openEditDisaster = (disaster) => {
    setModal({
      type: "disasters",
      title: "Edit Disaster",
      initialData: disaster,
      fields: [
        {
          key: "title",
          label: "Judul Bencana",
        },
        {
          key: "location",
          label: "Lokasi",
        },
        {
          key: "latitude",
          label: "Latitude",
          type: "number",
          required: false,
        },
        {
          key: "longitude",
          label: "Longitude",
          type: "number",
          required: false,
        },
        {
          key: "type",
          label: "Jenis Bencana",
          type: "select",
          options: [
            "Banjir",
            "Gempa",
            "Longsor",
            "Kebakaran",
            "Tsunami",
            "Angin Puting Beliung",
            "Lainnya",
          ],
        },
        {
          key: "severity",
          label: "Tingkat Keparahan",
          type: "select",
          options: ["low", "medium", "high", "critical"],
        },
        {
          key: "disaster_date",
          label: "Tanggal Kejadian",
          type: "date",
        },
        {
          key: "description",
          label: "Deskripsi",
          type: "textarea",
          required: false,
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["active", "handled", "closed"],
        },
      ],
      onSubmit: async (form) => {
        const res = await fetch(`${DISASTERS_URL}/${disaster.id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(form),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Gagal update disaster");
        }

        setModal(null);
        fetchData();
      },
    });
  };

  // ─────────────────────────────
  // EDIT SHELTER
  // ─────────────────────────────
  const openEditShelter = (shelter) => {
    setModal({
      type: "shelters",
      title: "Edit Shelter / Posko",
      initialData: shelter,
      fields: [
        {
          key: "name",
          label: "Nama Shelter",
        },
        {
          key: "location",
          label: "Lokasi / Alamat",
        },
        {
          key: "latitude",
          label: "Latitude",
          type: "number",
          required: false,
        },
        {
          key: "longitude",
          label: "Longitude",
          type: "number",
          required: false,
        },
        {
          key: "capacity",
          label: "Kapasitas",
          type: "number",
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["tersedia", "penuh"],
        },
        {
          key: "coordinator",
          label: "Nama Koordinator",
          required: false,
        },
        {
          key: "contact",
          label: "Kontak",
          required: false,
        },
      ],
      onSubmit: async (form) => {
        const res = await fetch(`${SHELTERS_URL}/${shelter.id}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(form),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Gagal update shelter");
        }

        setModal(null);
        fetchData();
      },
    });
  };

  // ─────────────────────────────
  // DELETE SHELTER
  // ─────────────────────────────
  const handleDeleteShelter = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus shelter ini?");

    if (!confirmDelete) return;

    try {
      await deleteData(`${SHELTERS_URL}/${id}`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const emptyToNull = (value) => {
  if (value === "" || value === undefined || value === null) {
    return null;
  }

    return value;
  };

  const numberOrZero = (value) => {
    if (value === "" || value === undefined || value === null) {
      return 0;
    }

    return Number(value);
  };

  // ─────────────────────────────
  // OPEN MODAL (ADD)
  // ─────────────────────────────
  const openModal = (section) => {
    const configs = {
      volunteers: {
        title: "Tambah Volunteer",
        fields: [
          {
            key: "full_name",
            label: "Nama Lengkap",
          },
          {
            key: "email",
            label: "Email Login",
            type: "email",
            placeholder: "volunteer@email.com",
            helper: "Role akan otomatis menjadi volunteer. Password dibuat otomatis oleh sistem.",
          },
          {
            key: "phone",
            label: "Nomor Telepon",
            required: false,
            placeholder: "08xxxxxxxxxx",
          },
          {
            key: "address",
            label: "Alamat",
            type: "textarea",
            required: false,
          },
          {
            key: "skills",
            label: "Keahlian",
            required: false,
            placeholder: "cth: P3K, Evakuasi",
          },
          {
            key: "availability_status",
            label: "Status Ketersediaan",
            type: "select",
            default: "available",
            options: ["available", "assigned", "unavailable"],
          },
        ],
        onSubmit: async (form) => {
          const result = await postData(VOLUNTEERS_URL, form);
          const account = result.data?.user;
          const defaultPassword = result.data?.default_password;

          setModal(null);
          fetchData();

          if (account && defaultPassword) {
            window.alert(
              `Akun volunteer berhasil dibuat.\n\nEmail: ${account.email}\nPassword default: ${defaultPassword}\nRole: ${account.role}\n\nSimpan/catat password ini karena hanya ditampilkan sekali.`
            );
          }
        },
      },

      disasters: {
        type: "disasters",
        title: "Tambah Laporan Bencana",
        fields: [
          {
            key: "title",
            label: "Judul Bencana",
            placeholder: "cth: Banjir Bantul",
          },
          {
            key: "type",
            label: "Jenis Bencana",
            type: "select",
            default: "Banjir",
            options: [
              "Banjir",
              "Gempa",
              "Longsor",
              "Kebakaran",
              "Tsunami",
              "Angin Puting Beliung",
              "Lainnya",
            ],
          },
          {
            key: "location",
            label: "Lokasi",
            placeholder: "cth: Bantul, Yogyakarta",
          },
          {
            key: "latitude",
            label: "Latitude",
            type: "number",
            required: false,
          },
          {
            key: "longitude",
            label: "Longitude",
            type: "number",
            required: false,
          },
          {
            key: "severity",
            label: "Tingkat Keparahan",
            type: "select",
            default: "medium",
            options: ["low", "medium", "high", "critical"],
          },
          {
            key: "disaster_date",
            label: "Tanggal Kejadian",
            type: "date",
            default: new Date().toISOString().slice(0, 10),
          },
          {
            key: "description",
            label: "Deskripsi",
            type: "textarea",
            required: false,
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            default: "active",
            options: ["active", "handled", "closed"],
          },
        ],
        onSubmit: async (form) => {
          const payload = {
            ...form,
            latitude: emptyToNull(form.latitude),
            longitude: emptyToNull(form.longitude),
            description: emptyToNull(form.description),
            severity: form.severity || "medium",
            status: form.status || "active",
          };

          await postData(DISASTERS_URL, payload);
          setModal(null);
          fetchData();
        },
      },

      shelters: {
        type: "shelters",
        title: "Tambah Shelter / Posko",
        fields: [
          {
            key: "name",
            label: "Nama Shelter",
            placeholder: "cth: Posko Utama Bantul",
          },
          {
            key: "location",
            label: "Lokasi / Alamat",
            placeholder: "cth: Bantul, Yogyakarta",
          },
          {
            key: "latitude",
            label: "Latitude",
            type: "number",
            required: false,
          },
          {
            key: "longitude",
            label: "Longitude",
            type: "number",
            required: false,
          },
          {
            key: "capacity",
            label: "Kapasitas",
            type: "number",
            default: "0",
          },
          {
            key: "current_capacity",
            label: "Jumlah Terisi",
            type: "number",
            default: "0",
          },
          {
            key: "status",
            label: "Status",
            type: "select",
            default: "tersedia",
            options: ["tersedia", "penuh"],
          },
          {
            key: "coordinator",
            label: "Nama Koordinator",
            required: false,
          },
          {
            key: "contact",
            label: "Kontak",
            required: false,
          },
        ],
        onSubmit: async (form) => {
          const emptyToNull = (value) => {
            if (value === "" || value === undefined || value === null) {
              return null;
            }

            return value;
          };

          const numberOrZero = (value) => {
            if (value === "" || value === undefined || value === null) {
              return 0;
            }

            return Number(value);
          };

          const payload = {
            name: form.name,
            location: form.location,
            latitude: emptyToNull(form.latitude),
            longitude: emptyToNull(form.longitude),
            capacity: numberOrZero(form.capacity),
            current_capacity: numberOrZero(form.current_capacity),
            status: form.status || "tersedia",
            coordinator: emptyToNull(form.coordinator),
            contact: emptyToNull(form.contact),
          };

          await postData(SHELTERS_URL, payload);
          setModal(null);
          fetchData();
        },
      },

      assignments: {
        title: "Tambah Assignment",
        fields: [
          {
            key: "volunteer_id",
            label: "Volunteer",
            type: "select",
            options: volunteers
              .filter((v) => v.availability_status === "available")
              .map((v) => ({
                value: v.id,
                label: `${v.full_name}${v.skills ? ` — ${v.skills}` : ""}`,
              })),
          },
          {
            key: "disaster_id",
            label: "Bencana",
            type: "select",
            options: disasters
              .filter((d) => d.status === "active")
              .map((d) => ({
                value: d.id,
                label: `${d.title} (${d.location || d.type || "-"})`,
              })),
          },
          {
            key: "shelter_id",
            label: "Shelter",
            type: "select",
            required: false,
            options: shelters.map((s) => ({
              value: s.id,
              label: `${s.name} — ${s.location || "-"}`,
            })),
          },
        ],
        onSubmit: async (form) => {
          if (!form.shelter_id) {
            delete form.shelter_id;
          }

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
      {modal && modal.type !== "report" && (
        <FormModal
          title={modal.title}
          fields={modal.fields}
          type={modal.type}
          initialData={modal.initialData}
          onClose={() => setModal(null)}
          onSubmit={modal.onSubmit}
        />
      )}

      {modal && modal.type === "report" && (
        <ReportModal
          assignment={modal.assignment}
          onClose={() => setModal(null)}
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
            onMap={(v) =>
              setMapView({
                data: v,
                type: "volunteer",
              })
            }
            onDelete={handleDeleteVolunteer}
          />
        )}

        {activeSection === "disasters" && (
          <DisasterTable
            disasters={disasters}
            loading={loading}
            error={error}
            onAdd={() => openModal("disasters")}
            onMap={(d) =>
              setMapView({
                data: d,
                type: "disaster",
              })
            }
            onEdit={openEditDisaster}
            onDelete={async (id) => {
              const confirmDelete = window.confirm("Yakin ingin menghapus disaster ini?");

              if (!confirmDelete) return;

              try {
                await deleteData(`${DISASTERS_URL}/${id}`);
                fetchData();
              } catch (err) {
                alert(err.message);
              }
            }}
          />
        )}

        {activeSection === "shelters" && (
          <ShelterTable
            shelters={shelters}
            loading={loading}
            error={error}
            onAdd={() => openModal("shelters")}
            onMap={(s) =>
              setMapView({
                data: s,
                type: "shelter",
              })
            }
            onEdit={openEditShelter}
            onDelete={handleDeleteShelter}
          />
        )}

        {activeSection === "assignments" && (
          <AssignmentTable
            assignments={assignments}
            loading={loading}
            error={error}
            onAdd={() => openModal("assignments")}
            onViewReport={(assignment) => {
              setModal({
                type: "report",
                title: "Laporan Volunteer",
                assignment,
              });
            }}
          />
        )}
      </div>
    </>
  );
};

export default DashboardAdmin;