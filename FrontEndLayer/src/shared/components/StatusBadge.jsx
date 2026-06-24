const statusStyles = {
  pending: "bg-[rgba(201,167,77,0.2)] text-warning",
  in_progress: "bg-primary/10 text-primary",
  resolved: "bg-primary/10 text-primary",
  rejected: "bg-danger/10 text-danger",
  completed: "bg-primary/10 text-primary",
  enrolled: "bg-primary/10 text-primary",
  dropped: "bg-danger/10 text-danger",
  paid: "bg-primary/10 text-primary",
  overdue: "bg-danger/10 text-danger",
  scheduled: "bg-primary/10 text-primary",
  cancelled: "bg-danger/10 text-danger",
  open: "bg-primary/10 text-primary",
  closed: "bg-bg-light text-text-muted",
  upcoming: "bg-[rgba(201,167,77,0.2)] text-warning",
};

const StatusBadge = ({ status }) => {
  const colorClass = statusStyles[status] || "bg-bg-light text-text-secondary";
  const label = status ? status.replace(/_/g, " ") : "unknown";

  return (
    <span
      className={`inline-flex flex-col items-start px-3 py-0.5 rounded-full font-heading font-semibold text-xs leading-[12px] tracking-wider capitalize whitespace-nowrap ${colorClass}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
