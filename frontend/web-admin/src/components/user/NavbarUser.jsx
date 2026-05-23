function NavbarUser({ section, changeSection, user, logout }) {
  const navItems = [
    { key: "disasters",   icon: "fas fa-fire",    label: "Bencana" },
    { key: "assignments", icon: "fas fa-tasks",   label: "Penugasan Saya" },
    { key: "profile",     icon: "fas fa-user",    label: "Profil" },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <nav className="navbar-user">
      <div className="navbar-brand-dvn">
        <div className="brand-icon">
          <i className="fas fa-hands-helping"></i>
        </div>
        DVN Relawan
      </div>

      <div className="navbar-nav-links">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`navbar-nav-btn ${section === item.key ? "active" : ""}`}
            onClick={() => changeSection(item.key)}
          >
            <i className={item.icon}></i>
            {item.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        <div className="navbar-user-chip">
          <div className="navbar-avatar">{getInitials(user?.name)}</div>
          <span>{user?.name || "User"}</span>
        </div>
        <button className="btn btn-logout btn-sm" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavbarUser;
