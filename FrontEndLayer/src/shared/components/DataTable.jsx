const DataTable = ({ columns, data, onRowClick }) => {
  return (
    <div className="flex flex-col items-start w-full bg-white border border-border rounded-xl overflow-hidden">
      <div className="border-b border-border w-full">
        <div className="flex flex-row w-full">
          {columns.map((col, i) => (
            <div
              key={col.key || i}
              className="flex flex-col items-start px-8 py-4"
              style={{
                flex: col.flex || 1,
                alignItems: col.align === "right" ? "flex-end" : "flex-start",
                width: col.width,
              }}
            >
              <span className="font-heading font-semibold text-xs leading-[12px] tracking-wider uppercase text-text-secondary">
                {col.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        {data.length === 0 ? (
          <div className="p-8 text-center font-heading text-text-muted text-base">
            No data available
          </div>
        ) : (
          data.map((row, rowIdx) => (
            <div
              key={row._id || row.id || rowIdx}
              onClick={() => onRowClick?.(row)}
              className={`flex flex-row w-full ${rowIdx > 0 ? "border-t border-border" : ""} ${onRowClick ? "cursor-pointer" : ""}`}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F2ECF4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {columns.map((col, i) => (
                <div
                  key={col.key || i}
                  className="flex flex-col items-start px-8"
                  style={{
                    flex: col.flex || 1,
                    alignItems: col.align === "right" ? "flex-end" : "flex-start",
                    width: col.width,
                    padding: col.render ? "16px 32px" : "18.5px 32px",
                  }}
                >
                  {col.render ? (
                    col.render(row)
                  ) : (
                    <span className="font-heading font-normal text-base leading-6 text-text-primary">
                      {row[col.key] ?? "-"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DataTable;
