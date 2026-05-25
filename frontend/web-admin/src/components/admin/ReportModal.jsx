import { useState, useEffect } from "react";
import { API_URL, authHeaders } from "../../services/api";

const ReportModal = ({ assignment, onClose }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assignment) return;
    
    fetchReports();
  }, [assignment]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch reports untuk assignment ini
      const url = `${API_URL}/reports?assignment_id=${assignment.id}`;
      const res = await fetch(url, { headers: authHeaders() });
      const json = await res.json();

      if (Array.isArray(json)) {
        setReports(json);
      } else if (json.data && Array.isArray(json.data)) {
        setReports(json.data);
      } else {
        setReports([]);
      }
    } catch (err) {
      setError(err.message || "Gagal mengambil laporan");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    submitted: "#3b82f6",
    reviewed: "#10b981",
    approved: "#06b6d4",
    rejected: "#ef4444"
  };

  const statusLabel = {
    submitted: "Submitted",
    reviewed: "Ditinjau",
    approved: "Disetujui",
    rejected: "Ditolak"
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: 650,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#f8fafc"
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>
              <i className="fas fa-file-alt" style={{ marginRight: 8, color: "#3b82f6" }}></i>
              Laporan Assignment
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {assignment?.volunteer_name} • {assignment?.disaster_title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: "#94a3b8",
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", flex: 1 }}>
          {loading && (
            <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 20px" }}>
              <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
              Memuat laporan...
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: "12px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16
              }}
            >
              <i className="fas fa-exclamation-circle" style={{ marginRight: 6 }}></i>
              {error}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div style={{ textAlign: "center", color: "#cbd5e1", padding: "40px 20px" }}>
              <i
                className="fas fa-inbox"
                style={{ fontSize: 40, display: "block", marginBottom: 10 }}
              ></i>
              <div style={{ fontSize: 14 }}>Belum ada laporan dikirim</div>
            </div>
          )}

          {!loading && reports.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reports.map((report, idx) => (
                <div
                  key={report.id || idx}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: 16,
                    background: "#f8fafc"
                  }}
                >
                  {/* Judul dan Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>
                        {report.title || "Laporan"}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {report.volunteer_name || "Volunteer"} • {new Date(report.created_at).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        background: statusColor[report.report_status] || "#94a3b8",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: "nowrap"
                      }}
                    >
                      {statusLabel[report.report_status] || report.report_status}
                    </span>
                  </div>

                  {/* Foto */}
                  {report.photo_url && (
                    <div style={{ marginBottom: 12 }}>
                      <img
                        src={report.photo_url}
                        alt="Report"
                        style={{
                          width: "100%",
                          maxHeight: 300,
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid #cbd5e1"
                        }}
                      />
                    </div>
                  )}

                  {/* Deskripsi */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                      {report.content || "-"}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div style={{ fontSize: 12, color: "#94a3b8", borderTop: "1px solid #cbd5e1", paddingTop: 10 }}>
                    <div>
                      <strong>Bencana:</strong> {report.disaster_title}
                    </div>
                    <div>
                      <strong>Dibuat:</strong> {new Date(report.created_at).toLocaleString("id-ID")}
                    </div>
                    {report.updated_at && (
                      <div>
                        <strong>Diperbarui:</strong> {new Date(report.updated_at).toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "flex-end",
            background: "#f8fafc"
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              background: "#f1f5f9",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: "#475569"
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
