import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_URL } from "../services/api";

function LandingPage() {
  const navigate = useNavigate();

  const [alert, setAlert] = useState({ message: "", type: "danger" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type = "danger") => setAlert({ message, type });

  const getAlertIcon = (type) => {
    if (type === "success") return "fas fa-check-circle";
    if (type === "info") return "fas fa-info-circle";
    return "fas fa-exclamation-circle";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      user = null;
    }

    if (token && user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard", {
        replace: true,
      });
    }
  }, [navigate]);
  const handleLogin = async () => {
    const { email, password } = loginData;
    if (!email || !password) return showAlert("Email dan password wajib diisi.");
    setLoading(true);
    try {
      console.log("LOGIN URL:", `${AUTH_URL}/login`);
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));

        navigate(data.data.role === "admin" ? "/admin/dashboard" : "/user/dashboard", {
          replace: true,
        });
      } else {
        showAlert(data.message);
      }
    } catch {
      showAlert("Gagal terhubung ke server. Pastikan service berjalan.");
    } finally {
      setLoading(false);
    }
  };

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

        {alert.message && (
          <div className={`alert-box ${alert.type}`}>
            <i className={getAlertIcon(alert.type)}></i>
            {alert.message}
          </div>
        )}

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
          <button className="btn-submit" onClick={handleLogin} disabled={loading}>
            <i className={`fas ${loading ? "fa-spinner fa-spin" : "fa-sign-in-alt"}`}></i>
            {loading ? "Memproses..." : "Masuk ke Akun"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;