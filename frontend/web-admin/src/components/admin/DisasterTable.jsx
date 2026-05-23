const DisasterTable = () => {
  return (
    <div className='card bg-dark border-0 mt-4'>
      <div className='card-body'>
        <h5 className='mb-4'>Disaster List</h5>

        <table className='table'>
          <thead>
            <tr>
              <th>Location</th>
              <th>Type</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Bandung</td>
              <td>Flood</td>
              <td>
                <span className='badge bg-danger'>Critical</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DisasterTable