function NavbarUser({
  section,
  changeSection,
  user,
  logout,
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">

      <div className="container-fluid px-4">

        <span className="navbar-brand fw-bold">
          <i className="fas fa-hands-helping me-2 text-danger"></i>
          DVN Relawan
        </span>

        <ul className="navbar-nav me-auto">

          <li className="nav-item">
            <button
              className={`btn nav-link ${
                section === "disasters"
                  ? "active text-white"
                  : "text-secondary"
              }`}
              onClick={() =>
                changeSection("disasters")
              }
            >
              <i className="fas fa-fire me-2"></i>
              Bencana
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`btn nav-link ${
                section === "assignments"
                  ? "active text-white"
                  : "text-secondary"
              }`}
              onClick={() =>
                changeSection("assignments")
              }
            >
              <i className="fas fa-tasks me-2"></i>
              Penugasan Saya
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`btn nav-link ${
                section === "profile"
                  ? "active text-white"
                  : "text-secondary"
              }`}
              onClick={() =>
                changeSection("profile")
              }
            >
              <i className="fas fa-user me-2"></i>
              Profil
            </button>
          </li>

        </ul>

        <div className="d-flex align-items-center gap-3">

          <span className="text-secondary small">
            {user?.name}
          </span>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}

export default NavbarUser;