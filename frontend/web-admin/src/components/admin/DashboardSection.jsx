const DashboardSection = ({ loading, volunteers, disasters, shelters, assignments }) => {
  const stats = [
    { label: "Volunteers", count: volunteers.length, color: "red", icon: "fa-users" },
    { label: "Disasters", count: disasters.length, color: "blue", icon: "fa-fire" },
    { label: "Shelters", count: shelters.length, color: "green", icon: "fa-home" },
    { label: "Assignments", count: assignments.length, color: "orange", icon: "fa-tasks" },
  ];

  return (
    <div className="row g-4">
      {stats.map((s) => (
        <div key={s.label} className="col-md-3">
          <div className={`stat-card ${s.color}`}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-number">{loading ? "..." : s.count}</div>
              </div>
              <div className={`stat-card-icon ${s.color}`}>
                <i className={`fas ${s.icon}`}></i>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSection;
