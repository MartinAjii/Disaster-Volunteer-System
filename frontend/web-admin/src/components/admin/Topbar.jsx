const Topbar = () => {
  return (
    <div className='topbar'>
      <div>
        <h4 className='mb-0'>Admin Dashboard</h4>
        <small>Disaster Volunteer Network</small>
      </div>

      <div>
        <button className='btn btn-danger'>
          <i className='fas fa-sign-out-alt me-2'></i>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar