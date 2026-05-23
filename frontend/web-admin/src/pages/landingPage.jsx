import { useEffect, useState } from "react";

function LandingPage() {
  const AUTH_URL = "http://localhost:3001";

  const [activeTab, setActiveTab] = useState("login");
  const [alert, setAlert] = useState({ message: "", type: "danger" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });

  const showAlert = (message, type = "danger") => setAlert({ message, type });

  const getAlertIcon = (type) => {
    if (type === "success") return "fas fa-check-circle";
    if (type === "info") return "fas fa-info-circle";
    return "fas fa-exclamation-circle";
  };

  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) return showAlert("Email dan password wajib diisi.");
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        window.location.href = data.data.user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
      } else {
        showAlert(data.message);
      }
    } catch {
      showAlert("Gagal terhubung ke server.");
    }
  };

  const handleRegister = async () => {
    const { name, email, password } = registerData;
    if (!name || !email || !password) return showAlert("Semua field wajib diisi.");
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "volunteer" }),
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Registrasi berhasil! Silakan login.", "success");
        setActiveTab("login");
      } else {
        showAlert(data.message);
      }
    } catch {
      showAlert("Gagal terhubung ke server.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      window.location.href = user.role === "admin" ? "/admin/dashboard" : "/user/dashboard";
    }
  }, []);

  return (
    <div className="landing-bg">
      <div className="landing-card">
        <div className="landing-hero">
          <div className="landing-icon-wrap">
            <i className="fas fa-hands-helping"></i>
          </div>
          <div className="landing-title">Disaster Volunteer<br />Network</div>
          <div className="landing-sub">Sistem Informasi Relawan Bencana</div>
        </div>

        <div className="tab-pills">
          <button
            className={`tab-pill ${activeTab === "login" ? "active" : ""}`}
            onClick={() => { setActiveTab("login"); setAlert({ message: "", type: "danger" }); }}
          >
            Masuk
          </button>
          <button
            className={`tab-pill ${activeTab === "register" ? "active" : ""}`}
            onClick={() => { setActiveTab("register"); setAlert({ message: "", type: "danger" }); }}
          >
            Daftar
          </button>
        </div>

        {alert.message && (
          <div className={`alert-box ${alert.type}`}>
            <i className={getAlertIcon(alert.type)}></i>
            {alert.message}
          </div>
        )}

        {activeTab === "login" && (
          <div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button className="btn-submit" onClick={handleLogin}>
              <i className="fas fa-sign-in-alt"></i>
              Masuk ke Akun
            </button>
          </div>
        )}

        {activeTab === "register" && (
          <div>
            <div className="mb-3">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nama Anda"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Min. 6 karakter"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            <button className="btn-submit" onClick={handleRegister}>
              <i className="fas fa-user-plus"></i>
              Buat Akun
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
