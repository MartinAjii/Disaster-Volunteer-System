import { useState } from 'react'
import '../../index.css'

const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menus = [
    { key: 'dashboard',   icon: 'fas fa-chart-line', label: 'Dashboard' },
    { key: 'volunteers',  icon: 'fas fa-users',       label: 'Volunteers' },
    { key: 'disasters',   icon: 'fas fa-fire',        label: 'Disasters' },
    { key: 'shelters',    icon: 'fas fa-home',        label: 'Shelters' },
    { key: 'assignments', icon: 'fas fa-tasks',       label: 'Assignments' },
  ];

  const sectionTitles = {
    dashboard: { title: 'Dashboard', sub: 'Ringkasan data sistem' },
    volunteers: { title: 'Volunteer Management', sub: 'Kelola data relawan' },
    disasters: { title: 'Disaster Reports', sub: 'Data laporan bencana' },
    shelters: { title: 'Shelter Management', sub: 'Data tempat pengungsian' },
    assignments: { title: 'Assignments', sub: 'Penugasan relawan' },
  };

  return (
    <>
      {/* SIDEBAR */}
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

          <button className="nav-link logout-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <div className="topbar-title">{sectionTitles[activeSection]?.title}</div>
            <div className="topbar-sub">{sectionTitles[activeSection]?.sub}</div>
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

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <>
            <div className="row g-4">
              <div className="col-md-3">
                <div className="stat-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="stat-card-label">Volunteers</div>
                      <div className="stat-number">124</div>
                    </div>
                    <div className="stat-card-icon red">
                      <i className="fas fa-users"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="stat-card blue">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="stat-card-label">Disasters</div>
                      <div className="stat-number">18</div>
                    </div>
                    <div className="stat-card-icon blue">
                      <i className="fas fa-fire"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="stat-card green">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="stat-card-label">Shelters</div>
                      <div className="stat-number">42</div>
                    </div>
                    <div className="stat-card-icon green">
                      <i className="fas fa-home"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="stat-card orange">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="stat-card-label">Assignments</div>
                      <div className="stat-number">67</div>
                    </div>
                    <div className="stat-card-icon orange">
                      <i className="fas fa-tasks"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-body" style={{ padding: '24px' }}>
                <div className="card-header-row">
                  <div className="card-title">Recent Disaster Reports</div>
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-plus"></i>
                    Add Report
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Bandung</td>
                        <td>Flood</td>
                        <td><span className="badge bg-danger">Critical</span></td>
                        <td><span className="badge bg-success">Active</span></td>
                      </tr>
                      <tr>
                        <td>Jakarta</td>
                        <td>Earthquake</td>
                        <td><span className="badge bg-warning">Medium</span></td>
                        <td><span className="badge bg-success">Active</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* VOLUNTEERS */}
        {activeSection === 'volunteers' && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: '24px' }}>
              <div className="card-header-row">
                <div className="card-title">Volunteer Management</div>
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-user-plus"></i>
                  Add Volunteer
                </button>
              </div>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john@gmail.com</td>
                      <td>08123456789</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td>
                        <button className="btn btn-ghost btn-sm">
                          <i className="fas fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other sections */}
        {['disasters','shelters','assignments'].includes(activeSection) && (
          <div className="card shadow-sm">
            <div className="card-body" style={{ padding: '24px' }}>
              <div className="card-header-row">
                <div className="card-title">{sectionTitles[activeSection]?.title}</div>
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-plus"></i>
                  Tambah
                </button>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '32px 0', textAlign: 'center' }}>
                <i className="fas fa-inbox" style={{ fontSize: 32, marginBottom: 12, display: 'block', opacity: 0.3 }}></i>
                Tidak ada data untuk ditampilkan
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardAdmin
