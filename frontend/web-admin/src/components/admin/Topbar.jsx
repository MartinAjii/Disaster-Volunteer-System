const Topbar = ({ title, sub, user }) => {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>

      <div className="topbar-actions">
        <div className="navbar-user-chip">
          <div className="navbar-avatar"><i className="fas fa-user-shield"></i></div>
          {user?.name || "Admin"}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
