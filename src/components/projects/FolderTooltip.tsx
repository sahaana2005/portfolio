import * as React from "react";
import { ExternalLink, Star } from "lucide-react";
import type { GitHubProject } from "./projectDescriptions";

interface FolderTooltipProps {
  project: GitHubProject;
  anchorRect: DOMRect | null;
  isOpen: boolean;
}

export const FolderTooltip: React.FC<FolderTooltipProps> = ({
  project,
  anchorRect,
  isOpen,
}) => {
  const [coords, setCoords] = React.useState<{
    x: number;
    y: number;
    placement: "right" | "left" | "top" | "bottom";
  }>({
    x: 0,
    y: 0,
    placement: "right",
  });

  React.useEffect(() => {
    if (!anchorRect || !isOpen) return;

    const tooltipWidth = 310;
    const tooltipHeight = 170;
    const padding = 16;
    const gap = 14;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Default: try placing to the right of the folder icon
    let placement: "right" | "left" | "top" | "bottom" = "right";
    let x = anchorRect.right + gap;
    let y = anchorRect.top + anchorRect.height / 2 - tooltipHeight / 2;

    // Check right overflow -> flip to left
    if (x + tooltipWidth + padding > vw) {
      if (anchorRect.left - gap - tooltipWidth > padding) {
        placement = "left";
        x = anchorRect.left - gap - tooltipWidth;
      } else {
        // If narrow screen (tablet/mobile), place below or above
        if (anchorRect.bottom + gap + tooltipHeight < vh - 60) {
          placement = "bottom";
          x = Math.max(padding, Math.min(vw - tooltipWidth - padding, anchorRect.left + anchorRect.width / 2 - tooltipWidth / 2));
          y = anchorRect.bottom + gap;
        } else {
          placement = "top";
          x = Math.max(padding, Math.min(vw - tooltipWidth - padding, anchorRect.left + anchorRect.width / 2 - tooltipWidth / 2));
          y = anchorRect.top - gap - tooltipHeight;
        }
      }
    }

    // Check vertical bounds
    if (placement === "right" || placement === "left") {
      if (y + tooltipHeight + padding > vh - 60) {
        y = vh - 60 - tooltipHeight - padding;
      }
      if (y < padding + 40) {
        y = padding + 40;
      }
    }

    setCoords({ x, y, placement });
  }, [anchorRect, isOpen]);

  if (!isOpen || !anchorRect) return null;

  return (
    <div
      role="tooltip"
      style={{
        position: "fixed",
        left: coords.x,
        top: coords.y,
        width: 310,
        zIndex: 999,
        pointerEvents: "none",
        backgroundColor: "rgba(22, 10, 32, 0.92)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 79, 163, 0.38)",
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 79, 163, 0.22)",
        padding: "14px 16px",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        color: "#ffffff",
        animation: "kdeTooltipPop 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Title Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h4
          style={{
            margin: 0,
            fontSize: "0.88rem",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "0.02em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {project.name}
        </h4>
        <span
          style={{
            fontSize: "0.68rem",
            color: "rgba(255, 179, 217, 0.9)",
            background: "rgba(255, 79, 163, 0.15)",
            border: "1px solid rgba(255, 79, 163, 0.3)",
            padding: "1px 6px",
            borderRadius: 6,
          }}
        >
          folder
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          margin: "0 0 10px 0",
          fontSize: "0.76rem",
          lineHeight: 1.5,
          color: "rgba(255, 255, 255, 0.85)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {project.description}
      </p>

      {/* Meta Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
          borderTop: "1px solid rgba(255, 79, 163, 0.18)",
          fontSize: "0.72rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Language Dot */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: project.languageColor || "#ff4fa3",
                boxShadow: `0 0 6px ${project.languageColor || "#ff4fa3"}`,
              }}
            />
            <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>{project.language}</span>
          </span>

          {/* Stars */}
          {project.stars > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#ffd166" }}>
              <Star size={11} fill="#ffd166" strokeWidth={0} />
              <span>{project.stars}</span>
            </span>
          )}
        </div>

        {/* Action hint */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: "#ff85c0",
            fontWeight: 600,
          }}
        >
          <span>GitHub</span>
          <ExternalLink size={11} strokeWidth={2.4} />
        </span>
      </div>
    </div>
  );
};
