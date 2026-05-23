const VolunteerTable = () => {
  return (
    <div className='card bg-dark border-0 mt-4'>
      <div className='card-body'>
        <h5 className='mb-4'>Volunteer List</h5>

        <table className='table'>
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
              <td>john@email.com</td>
              <td>08123456789</td>
              <td>
                <span className='badge bg-success'>Active</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VolunteerTable