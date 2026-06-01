export const severityBadge = (s) => {
  const map = { critical: "danger", high: "warning", medium: "primary", low: "success" };
  return <span className={`badge bg-${map[s] || "secondary"}`}>{s || "-"}</span>;
};

export const statusBadge = (s) => {
  const map = {
    active: "success",
    available: "success",
    completed: "primary",
    assigned: "info",
    pending: "warning",
    cancelled: "danger",
    unavailable: "secondary",
    on_the_way: "warning",
    on_site: "primary",
    handled: "warning",
    closed: "secondary",
  };

  return <span className={`badge bg-${map[s] || "secondary"}`}>{s || "-"}</span>;
};
