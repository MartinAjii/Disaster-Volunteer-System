function DisasterCard({ disaster, severityBadge }) {
  return (
    <div className="card bg-dark border-secondary mb-3">

      <div className="card-body">

        <div className="d-flex justify-content-between">

          <div>

            <h5 className="fw-bold">
              {disaster.title}
            </h5>

            <p className="text-secondary mb-1">
              <i className="fas fa-map-marker-alt me-2"></i>

              {disaster.location ||
                "Lokasi tidak diketahui"}
            </p>

            <p className="text-secondary">
              <i className="fas fa-calendar me-2"></i>

              {disaster.disaster_date ||
                "-"}
            </p>

            {disaster.description && (
              <p>{disaster.description}</p>
            )}

          </div>

          <div>

            <span
              className={`badge bg-${severityBadge(
                disaster.severity
              )}`}
            >
              {disaster.severity}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DisasterCard;