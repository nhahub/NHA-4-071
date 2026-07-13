const KPICard = ({ label, value, subtitle, borderColor, progress, children }) => {
  return (
    <div
      className="box-border flex flex-col items-start p-3 sm:p-4 gap-2 bg-white shadow-sm rounded-xl flex-1 min-w-[140px] border-l-4"
      style={{ borderLeftColor: borderColor || "#4F378A" }}
    >
      <span className="font-heading font-semibold text-[10px] sm:text-xs leading-[12px] tracking-wider text-text-secondary">
        {label}
      </span>

      {children || (
        <div className="flex flex-row items-end gap-2 w-full">
          <span className="font-heading font-normal text-2xl sm:text-[36px] leading-tight sm:leading-[36px] text-primary">
            {value}
          </span>
          {subtitle && (
            <span className="font-body font-normal text-sm sm:text-base leading-6 text-warning pb-1">
              {subtitle}
            </span>
          )}
        </div>
      )}

      {progress !== undefined && (
        <div className="w-full h-[6px] bg-bg-light rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: "#E1D4FD",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default KPICard;
