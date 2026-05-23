import { useEffect, useState } from "react";
import { AUTH_URL } from "../services/api";

function LandingPage() {
  const [activeTab, setActiveTab] = useState("login");

  const [alert, setAlert] = useState({
    message: "",
    type: "danger",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const showAlert = (message, type = "danger") => {
    setAlert({
      message,
      type,
    });
  };

  const handleLogin = async () => {
    const { email, password } = loginData;

    if (!email || !password) {
      return showAlert("Email dan password wajib diisi.");
    }

    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        const role = data.data.user.role;

        window.location.href =
          role === "admin"
            ? "/admin/dashboard"
            : "/user/dashboard";
      } else {
        showAlert(data.message);
      }
    } catch (error) {
      showAlert("Gagal terhubung ke server.");
    }
  };

  const handleRegister = async () => {
    const { name, email, password } = registerData;

    if (!name || !email || !password) {
      return showAlert("Semua field wajib diisi.");
    }

    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "volunteer",
        }),
      });

      const data = await res.json();

      if (data.success) {
        showAlert("Registrasi berhasil! Silakan login.", "success");
        setActiveTab("login");
      } else {
        showAlert(data.message);
      }
    } catch (error) {
      showAlert("Gagal terhubung ke server.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      window.location.href =
        user.role === "admin"
          ? "/admin/dashboard"
          : "/user/dashboard";
    }
  }, []);

  return (
    <div
      className="container-fluid d-flex align-items-center"
      style={{
        minHeight: "100vh",
        background: "#1d3557",
        color: "#f1faee",
      }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-md-5">
          <div className="text-center mb-4">
            <i
              className="fas fa-hands-helping"
              style={{
                fontSize: "3rem",
                color: "#e63946",
              }}
            ></i>

            <h2 className="mt-2 fw-bold">
              Disaster Volunteer Network
            </h2>

            <p className="text-muted">
              Sistem Informasi Relawan Bencana
            </p>
          </div>

          <div
            className="card p-4 rounded-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* TAB */}
            <ul className="nav nav-pills nav-fill mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "login" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </button>
              </li>

              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "register" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("register")}
                >
                  Register
                </button>
              </li>
            </ul>

            {/* ALERT */}
            {alert.message && (
              <div
                className={`alert alert-${alert.type} py-2`}
              >
                {alert.message}
              </div>
            )}

            {/* LOGIN */}
            {activeTab === "login" && (
              <div>
                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({
                        ...loginData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={handleLogin}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Masuk
                </button>
              </div>
            )}

            {/* REGISTER */}
            {activeTab === "register" && (
              <div>
                <div className="mb-3">
                  <label className="form-label">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nama Anda"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min. 6 karakter"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={handleRegister}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;