const Topbar = ({ title = "Dashboard Admin", subtitle = "Disaster Volunteer Network System" }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
        {/* Logout dihapus dari sini — ada di Sidebar */}
        <div className="navbar-user-chip">
          <div className="navbar-avatar">
            <i className="fas fa-user-shield"></i>
          </div>
          {user?.name || "Admin"}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
