function AssignmentTable({ assignments }) {
  return (
    <div className="card bg-dark border-secondary p-3">

      <table className="table table-dark table-hover">

        <thead>
          <tr>
            <th>Bencana</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Catatan</th>
          </tr>
        </thead>

        <tbody>

          {assignments.length > 0 ? (
            assignments.map((a) => (
              <tr key={a.id}>

                <td>{a.disaster_title}</td>

                <td>
                  <span className="badge bg-success">
                    {a.assignment_status}
                  </span>
                </td>

                <td>
                  {new Date(
                    a.assigned_at
                  ).toLocaleDateString("id-ID")}
                </td>

                <td>{a.notes || "-"}</td>

              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center text-secondary"
              >
                Belum ada penugasan.
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
}

export default AssignmentTable;