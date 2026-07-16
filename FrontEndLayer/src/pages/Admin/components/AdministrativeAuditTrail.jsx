const statusStyles = {
  SUCCESS: { color: "#4ADE80", text: "SUCCESS" },
  BLOCKED: { color: "#FFB4AB", text: "BLOCKED" },
  PENDING_SYNC: { color: "#FFB4AB", text: "PENDING_SYNC" },
};

const AdministrativeAuditTrail = ({ logs }) => {
  const list = logs || [
    {
      id: 1,
      timestamp: "2025-06-28 10:45:22",
      admin: "Admin Sarah J.",
      action: "UPDATE_SEMESTER_RULES",
      entity: "Spring 2025",
      status: "SUCCESS",
    },
    {
      id: 2,
      timestamp: "2025-06-28 09:13:09",
      admin: "System Automator",
      action: "BULK_ENROLLMENT_SYNC",
      entity: "CS Dept (120 records)",
      status: "SUCCESS",
    },
    {
      id: 3,
      timestamp: "2025-06-27 23:22:41",
      admin: "Security Shield",
      action: "LOGIN_FAILURE_THRESHOLD",
      entity: "IP: 192.168.1.45",
      status: "BLOCKED",
    },
    {
      id: 4,
      timestamp: "2025-06-27 15:30:10",
      admin: "Admin Mike R.",
      action: "COURSE_OVERRIDE_APPROVED",
      entity: "#2025-4071 (CS-301)",
      status: "PENDING_SYNC",
    },
  ];

  return (
    <div className="box-border flex flex-col items-start w-full bg-admin-card border border-admin-border rounded overflow-hidden">
      {/* Header overlay */}
      <div
        className="box-border flex flex-row justify-between items-center px-6 py-4 w-full border-b border-admin-border"
        style={{ background: "rgba(39, 42, 44, 0.5)" }}
      >
        <h4 className="font-heading font-semibold text-lg leading-6 text-admin-text m-0">
          Recent Administrative Activity
        </h4>
        <button
          onClick={() => alert("Loading all audit logs...")}
          className="bg-transparent border-none cursor-pointer font-heading font-bold text-[11px] leading-4 text-admin-text-muted hover:text-admin-text transition-colors uppercase"
          style={{ letterSpacing: "0.55px" }}
        >
          View All Logs
        </button>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-admin-border bg-admin-card">
              <th className="py-3 px-6 font-heading font-bold text-[11px] uppercase text-admin-text-muted tracking-wider">
                Timestamp
              </th>
              <th className="py-3 px-6 font-heading font-bold text-[11px] uppercase text-admin-text-muted tracking-wider">
                Admin
              </th>
              <th className="py-3 px-6 font-heading font-bold text-[11px] uppercase text-admin-text-muted tracking-wider">
                Action
              </th>
              <th className="py-3 px-6 font-heading font-bold text-[11px] uppercase text-admin-text-muted tracking-wider">
                Entity
              </th>
              <th className="py-3 px-6 font-heading font-bold text-[11px] uppercase text-admin-text-muted tracking-wider text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((row, idx) => {
              const statusInfo = statusStyles[row.status] || {
                color: "#C2C6D6",
                text: row.status,
              };
              return (
                <tr
                  key={idx}
                  className="border-b border-admin-border/50 hover:bg-[#272A2C]/50 transition-colors font-courier text-xs text-admin-text"
                >
                  <td className="py-4 px-6 font-courier text-admin-text-muted">
                    {row.timestamp}
                  </td>
                  <td className="py-4 px-6 font-heading font-medium text-admin-text">
                    {row.admin}
                  </td>
                  <td className="py-4 px-6 font-courier text-admin-accent">
                    {row.action}
                  </td>
                  <td className="py-4 px-6 font-heading text-admin-text-muted">
                    {row.entity}
                  </td>
                  <td className="py-4 px-6 font-courier font-bold text-right" style={{ color: statusInfo.color }}>
                    {statusInfo.text}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdministrativeAuditTrail;
