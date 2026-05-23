import { useEffect, useState } from "react";

import NavbarUser from "../../components/user/NavbarUser";
import DisasterCard from "../../components/user/DisasterCard";
import AssignmentTable from "../../components/user/AssignmentTable";
import ProfileForm from "../../components/user/ProfileForm";

import {
  AUTH_URL,
  VOL_URL,
  DIS_URL,
  authHeaders,
} from "../../services/api";

function DashboardUser() {

  const [section, setSection] =
    useState("disasters");

  const [user] = useState(
    {
        name: "Relawan Demo",
    }
  );

  const [disasters, setDisasters] =
    useState([]);

  const [assignments, setAssignments] =
    useState([]);

  const [profile, setProfile] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [alert, setAlert] = useState({
    message: "",
    type: "success",
  });

  useEffect(() => {
    //checkAuth();
    loadDisasters();
  }, []);

  const checkAuth = () => {
    const token =
      localStorage.getItem("token");

    if (!token || !user) {
      window.location.href = "/";
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const changeSection = (name) => {
    setSection(name);

    if (name === "assignments") {
      loadAssignments();
    }

    if (name === "profile") {
      loadProfile();
    }
  };

  const loadDisasters = async () => {
    try {
      const res = await fetch(
        `${DIS_URL}/disasters`,
        {
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      setDisasters(data.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const loadAssignments = async () => {
    try {
      const res = await fetch(
        `${VOL_URL}/assignments`,
        {
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      setAssignments(data.data || []);

    } catch (error) {
      console.log(error);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await fetch(
        `${AUTH_URL}/profile`,
        {
          headers: authHeaders(),
        }
      );

      const data = await res.json();

      if (data.success) {
        setProfile({
          ...profile,
          name: data.data.name,
          email: data.data.email,
        });
      }

    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {

      const body = {
        name: profile.name,
      };

      if (profile.password) {
        body.password =
          profile.password;
      }

      const res = await fetch(
        `${AUTH_URL}/profile`,
        {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      setAlert({
        message: data.message,
        type: data.success
          ? "success"
          : "danger",
      });

    } catch (error) {
      console.log(error);
    }
  };

  const severityBadge = (severity) => {

    if (severity === "critical")
      return "danger";

    if (severity === "high")
      return "warning";

    if (severity === "medium")
      return "primary";

    return "success";
  };

  return (
    <div
      style={{
        background: "#0f1923",
        minHeight: "100vh",
        color: "#e0e0e0",
      }}
    >

      <NavbarUser
        section={section}
        changeSection={changeSection}
        user={user}
        logout={logout}
      />

      <div className="container-fluid px-4 py-4">

        {section === "disasters" && (
          <div>

            <h4 className="fw-bold mb-4">
              Informasi Bencana
            </h4>

            {disasters.map((d) => (
              <DisasterCard
                key={d.id}
                disaster={d}
                severityBadge={severityBadge}
              />
            ))}

          </div>
        )}

        {section === "assignments" && (
          <div>

            <h4 className="fw-bold mb-4">
              Penugasan Saya
            </h4>

            <AssignmentTable
              assignments={assignments}
            />

          </div>
        )}

        {section === "profile" && (
          <div>

            <h4 className="fw-bold mb-4">
              Profil Saya
            </h4>

            <ProfileForm
              profile={profile}
              setProfile={setProfile}
              updateProfile={updateProfile}
              alert={alert}
            />

          </div>
        )}

      </div>

    </div>
  );
}

export default DashboardUser;