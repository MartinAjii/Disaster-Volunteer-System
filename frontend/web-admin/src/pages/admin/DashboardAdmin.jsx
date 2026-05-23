import { useState } from 'react'

import '../../styles/admin/dashboardAdmin.css'
import '../../styles/admin/sidebar.css'
import '../../styles/admin/topbar.css'
import '../../styles/admin/statCard.css'
import '../../styles/admin/table.css'

const DashboardAdmin = () => {
  const [activeSection, setActiveSection] = useState('dashboard')

  return (
    <>
      {/* SIDEBAR */}
      <div className='sidebar'>
        <div className='brand'>
          <i className='fas fa-hands-helping me-2'></i>
          Disaster Admin
        </div>

        <nav className='mt-4'>
          <button
            className={`nav-link ${
              activeSection === 'dashboard' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('dashboard')}
          >
            <i className='fas fa-chart-line me-2'></i>
            Dashboard
          </button>

          <button
            className={`nav-link ${
              activeSection === 'volunteers' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('volunteers')}
          >
            <i className='fas fa-users me-2'></i>
            Volunteers
          </button>

          <button
            className={`nav-link ${
              activeSection === 'disasters' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('disasters')}
          >
            <i className='fas fa-fire me-2'></i>
            Disasters
          </button>

          <button
            className={`nav-link ${
              activeSection === 'shelters' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('shelters')}
          >
            <i className='fas fa-home me-2'></i>
            Shelters
          </button>

          <button
            className={`nav-link ${
              activeSection === 'assignments' ? 'active' : ''
            }`}
            onClick={() => setActiveSection('assignments')}
          >
            <i className='fas fa-tasks me-2'></i>
            Assignments
          </button>

          <hr className='sidebar-divider' />

          <button className='nav-link text-danger'>
            <i className='fas fa-sign-out-alt me-2'></i>
            Logout
          </button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className='main-content'>
        {/* TOPBAR */}
        <div className='topbar'>
          <div>
            <h3 className='fw-bold mb-1'>Dashboard Admin</h3>
            <small>Disaster Volunteer Network System</small>
          </div>

          <div>
            <button className='btn btn-danger'>
              <i className='fas fa-bell me-2'></i>
              Alerts
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
          <>
            <div className='row g-4'>
              <div className='col-md-3'>
                <div className='stat-card'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <p className='text-white-50 mb-1'>Volunteers</p>
                      <h2 className='stat-number'>124</h2>
                    </div>

                    <i className='fas fa-users fa-2x text-danger'></i>
                  </div>
                </div>
              </div>

              <div className='col-md-3'>
                <div className='stat-card blue'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <p className='text-white-50 mb-1'>Disasters</p>
                      <h2 className='stat-number'>18</h2>
                    </div>

                    <i className='fas fa-fire fa-2x text-info'></i>
                  </div>
                </div>
              </div>

              <div className='col-md-3'>
                <div className='stat-card green'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <p className='text-white-50 mb-1'>Shelters</p>
                      <h2 className='stat-number'>42</h2>
                    </div>

                    <i className='fas fa-home fa-2x text-success'></i>
                  </div>
                </div>
              </div>

              <div className='col-md-3'>
                <div className='stat-card orange'>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <p className='text-white-50 mb-1'>Assignments</p>
                      <h2 className='stat-number'>67</h2>
                    </div>

                    <i className='fas fa-tasks fa-2x text-warning'></i>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT DISASTER */}
            <div className='card border-0 shadow-sm mt-4'>
              <div className='card-body'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <h5 className='fw-bold'>Recent Disaster Reports</h5>

                  <button className='btn btn-primary'>
                    <i className='fas fa-plus me-2'></i>
                    Add Report
                  </button>
                </div>

                <div className='table-responsive'>
                  <table className='table align-middle'>
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
                        <td>
                          <span className='badge bg-danger'>
                            Critical
                          </span>
                        </td>
                        <td>
                          <span className='badge bg-success'>
                            Active
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td>Jakarta</td>
                        <td>Earthquake</td>
                        <td>
                          <span className='badge bg-warning text-dark'>
                            Medium
                          </span>
                        </td>
                        <td>
                          <span className='badge bg-success'>
                            Active
                          </span>
                        </td>
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
          <div className='card border-0 shadow-sm mt-4'>
            <div className='card-body'>
              <div className='d-flex justify-content-between align-items-center mb-4'>
                <h5 className='fw-bold'>Volunteer Management</h5>

                <button className='btn btn-primary'>
                  <i className='fas fa-user-plus me-2'></i>
                  Add Volunteer
                </button>
              </div>

              <div className='table-responsive'>
                <table className='table align-middle'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john@gmail.com</td>
                      <td>08123456789</td>
                      <td>
                        <span className='badge bg-success'>
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardAdmin