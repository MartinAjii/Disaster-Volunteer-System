const Topbar = ({ title = "Dashboard Admin", subtitle = "Disaster Volunteer Network System" }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{subtitle}</div>
      </div>

      <div className="topbar-actions">
        <button className="btn btn-ghost btn-sm">
          <i className="fas fa-bell"></i>
          Notifikasi
        </button>
        <button className="btn btn-logout btn-sm" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
