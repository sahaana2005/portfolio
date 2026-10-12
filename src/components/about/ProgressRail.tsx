
interface ProgressRailProps {
  current: number;   // 0-based chapter index
  total: number;
}

export default function ProgressRail({ current, total }: ProgressRailProps) {
  return (
    <div
      aria-label={`Chapter ${current + 1} of ${total}`}
      style={{
        position: "fixed",
        right: "clamp(12px, 2vw, 24px)",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Chapter counter */}
      <span
        style={{
          fontFamily: "'Gochi Hand', cursive, sans-serif",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.05em",
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
          marginBottom: 4,
          writingMode: "vertical-rl",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>

      {/* Dot rail */}
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 8 : 5,
            height: i === current ? 8 : 5,
            borderRadius: "50%",
            backgroundColor:
              i === current
                ? "#F2B6C6"
                : "rgba(255,255,255,0.35)",
            boxShadow:
              i === current
                ? "0 0 8px rgba(242,182,198,0.8)"
                : "none",
            transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      ))}
    </div>
  );
}
