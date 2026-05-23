const DashboardSection = () => {
  return (
    <div className='row g-4'>
      <div className='col-md-3'>
        <div className='stat-card'>
          <h6>Total Volunteers</h6>
          <div className='stat-number'>124</div>
        </div>
      </div>

      <div className='col-md-3'>
        <div className='stat-card blue'>
          <h6>Active Disasters</h6>
          <div className='stat-number'>12</div>
        </div>
      </div>

      <div className='col-md-3'>
        <div className='stat-card green'>
          <h6>Shelters</h6>
          <div className='stat-number'>8</div>
        </div>
      </div>

      <div className='col-md-3'>
        <div className='stat-card orange'>
          <h6>Assignments</h6>
          <div className='stat-number'>56</div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSection