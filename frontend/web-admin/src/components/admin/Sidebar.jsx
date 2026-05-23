const Sidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const menus = [
    { key: 'dashboard',   icon: 'fas fa-chart-line', label: 'Dashboard' },
    { key: 'volunteers',  icon: 'fas fa-users',       label: 'Volunteers' },
    { key: 'disasters',   icon: 'fas fa-fire',        label: 'Disasters' },
    { key: 'shelters',    icon: 'fas fa-home',        label: 'Shelters' },
    { key: 'assignments', icon: 'fas fa-tasks',       label: 'Assignments' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <i className="fas fa-hands-helping"></i>
        </div>
        <div>
          <div className="sidebar-logo-text">DVN Admin</div>
          <div className="sidebar-logo-sub">Disaster Volunteer Network</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Menu Utama</div>
        {menus.map((menu) => (
          <button
            key={menu.key}
            className={`nav-link ${activeSection === menu.key ? 'active' : ''}`}
            onClick={() => setActiveSection(menu.key)}
          >
            <i className={menu.icon}></i>
            {menu.label}
          </button>
        ))}

        <div className="sidebar-divider" />

        <button
          className="nav-link logout-link"
          onClick={onLogout}
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
