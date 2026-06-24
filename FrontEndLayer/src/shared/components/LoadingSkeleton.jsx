const SkeletonBar = ({ width = "100%", height = 16, style }) => (
  <div
    className="rounded-lg"
    style={{
      width,
      height,
      background: "linear-gradient(90deg, #F2ECF4 25%, #E6E0E9 50%, #F2ECF4 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      ...style,
    }}
  />
);

const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  if (!document.getElementById("shimmer-keyframes")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "shimmer-keyframes";
    styleSheet.textContent = `
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  if (type === "table") {
    return (
      <div className="flex flex-col gap-3 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3">
            <SkeletonBar width="20%" height={20} />
            <SkeletonBar width="40%" height={20} />
            <SkeletonBar width="15%" height={20} />
            <SkeletonBar width="10%" height={20} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-4 flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm flex-1 min-w-[200px]"
        >
          <SkeletonBar width="60%" height={12} />
          <SkeletonBar width="40%" height={36} />
          <SkeletonBar width="80%" height={6} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
