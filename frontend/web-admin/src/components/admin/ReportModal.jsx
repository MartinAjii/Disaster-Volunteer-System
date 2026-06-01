import {
  useEffect,
  useState
} from "react";

import {
  API_URL,
  authHeaders
} from "../../services/api";

const statusColor = (status) => {

  switch (status) {

    case "verified":
      return "#22c55e";

    case "rejected":
      return "#ef4444";

    default:
      return "#3b82f6";
  }
};

const ReportModal = ({
  assignment,
  onClose,
}) => {

  const [loading, setLoading] =
    useState(true);

  const [report, setReport] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {

    fetchReport();

  }, []);

  const fetchReport =
    async () => {

      try {

        const res = await fetch(

          `${API_URL}/reports?assignment_id=${assignment.id}`,

          {
            headers:
              authHeaders(),
          }
        );

        const json =
          await res.json();

        if (
          json.success &&
          json.data.length > 0
        ) {

          setReport(
            json.data[0]
          );
        }

      } catch (e) {

        console.error(e);

      } finally {

        setLoading(false);
      }
    };

  const verifyReport =
    async (status) => {

      try {

        setSaving(true);

        const res = await fetch(

          `${API_URL}/reports/${report.id}/verify`,

          {
            method: "PUT",

            headers: {

              ...authHeaders(),

              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

        const json =
          await res.json();

        if (!res.ok) {

          throw new Error(
            json.message
          );
        }

        alert(json.message);

        onClose();

        window.location.reload();

      } catch (e) {

        alert(e.message);

      } finally {

        setSaving(false);
      }
    };

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >

      <div
        style={{
          width: 650,
          maxWidth: "95vw",
          background: "#ffffff",
          borderRadius: 16,
          padding: 24,
          maxHeight: "90vh",
          overflowY: "auto",
          color: "#111827",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.3)",
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >

          <h3
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Laporan Volunteer
          </h3>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            ×
          </button>
        </div>

        {loading ? (

          <div
            style={{
              color: "#111827",
            }}
          >
            Loading...
          </div>

        ) : !report ? (

          <div
            style={{
              marginTop: 20,
              color: "#111827",
            }}
          >
            Belum ada laporan
          </div>

        ) : (

          <>

            <div
              style={{
                marginBottom: 18,
              }}
            >

              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 4,
                }}
              >
                Volunteer
              </div>

              <div
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {report.volunteer_name}
              </div>
            </div>

            <div
              style={{
                marginBottom: 18,
              }}
            >

              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 4,
                }}
              >
                Disaster
              </div>

              <div
                style={{
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {report.disaster_title}
              </div>
            </div>

            <div
              style={{
                marginBottom: 18,
              }}
            >

              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 4,
                }}
              >
                Judul Laporan
              </div>

              <div
                style={{
                  color: "#111827",
                }}
              >
                {report.title}
              </div>
            </div>

            <div
              style={{
                marginBottom: 18,
              }}
            >

              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 4,
                }}
              >
                Isi Laporan
              </div>

              <div
                style={{
                  color: "#111827",
                  lineHeight: 1.6,
                }}
              >
                {report.content}
              </div>
            </div>

            <div
              style={{
                marginBottom: 20,
              }}
            >

              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  marginBottom: 8,
                }}
              >
                Status
              </div>

              <span
                style={{
                  background:
                    statusColor(
                      report.report_status
                    ),
                  color: "#fff",
                  padding:
                    "6px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {report.report_status}
              </span>
            </div>

            {report.photo_url && (

              <div
                style={{
                  marginBottom: 20,
                }}
              >

                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b",
                    marginBottom: 10,
                  }}
                >
                  Foto Laporan
                </div>

                <img
                  src={
                    report.photo_url.startsWith(
                      "http"
                    ) ||
                    report.photo_url.startsWith(
                      "data:"
                    )

                      ? report.photo_url

                      : `${API_URL}${report.photo_url}`
                  }

                  alt="report"

                  style={{
                    width: "100%",
                    borderRadius: 14,
                    maxHeight: 350,
                    objectFit: "cover",
                    border:
                      "1px solid #e2e8f0",
                  }}
                />
              </div>
            )}

            {report.report_status ===
              "submitted" && (

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 30,
                }}
              >

                <button
                  className="btn btn-success"

                  disabled={saving}

                  onClick={() =>
                    verifyReport(
                      "verified"
                    )
                  }
                >
                  Verify
                </button>

                <button
                  className="btn btn-danger"

                  disabled={saving}

                  onClick={() =>
                    verifyReport(
                      "rejected"
                    )
                  }
                >
                  Reject
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;