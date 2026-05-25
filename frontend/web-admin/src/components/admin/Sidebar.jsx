const Sidebar = ({ menus, activeSection, setActiveSection, handleLogout }) => {
  return (
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
          <button
            key={m.key}
            className={`nav-link ${activeSection === m.key ? "active" : ""}`}
            onClick={() => setActiveSection(m.key)}
          >
            <i className={m.icon}></i>{m.label}
          </button>
        ))}
        <div className="sidebar-divider" />
        <button className="nav-link logout-link" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
