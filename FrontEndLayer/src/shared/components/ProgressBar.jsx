const ProgressBar = ({ value, max, color, height = 8, showPercent, style }) => {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className="w-full" style={style}>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, background: "rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color || "#CFBCFF",
          }}
        />
      </div>
      {showPercent && (
        <span className="font-body font-semibold text-xs leading-[12px] tracking-wider text-text-muted mt-1 block">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
