const AssignmentTable = () => {
  return (
    <div className='card bg-dark border-0 mt-4'>
      <div className='card-body'>
        <h5 className='mb-4'>Assignment List</h5>

        <table className='table'>
          <thead>
            <tr>
              <th>Volunteer</th>
              <th>Disaster</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Flood Bandung</td>
              <td>
                <span className='badge bg-warning text-dark'>
                  On Going
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AssignmentTable