const ShelterTable = () => {
  return (
    <div className='card bg-dark border-0 mt-4'>
      <div className='card-body'>
        <h5 className='mb-4'>Shelter List</h5>

        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Shelter A</td>
              <td>Jakarta</td>
              <td>300</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ShelterTable