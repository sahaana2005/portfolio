import * as React from "react";
import type { GitHubProject } from "./projectDescriptions";
import { FolderTooltip } from "./FolderTooltip";

interface DesktopFolderProps {
  project: GitHubProject;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
  onTouchPreview?: (project: GitHubProject) => void;
}

export const DesktopFolder: React.FC<DesktopFolderProps> = ({
  project,
  index,
  isSelected = false,
  onSelect,
  onTouchPreview,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOpening, setIsOpening] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | null>(null);

  const containerRef = React.useRef<HTMLAnchorElement | null>(null);
  const hoverTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Staggered entrance animation delay: 60ms * index
  const animationDelay = `${index * 60}ms`;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (containerRef.current) {
      setAnchorRect(containerRef.current.getBoundingClientRect());
    }
    // KDE-style 120ms tooltip delay
    hoverTimerRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setShowTooltip(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (containerRef.current) {
      setAnchorRect(containerRef.current.getBoundingClientRect());
    }
    setShowTooltip(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowTooltip(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Touch device support: check if coarse pointer
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && onTouchPreview) {
      // If not already selected, first tap selects and triggers preview sheet
      if (!isSelected) {
        e.preventDefault();
        onSelect?.();
        onTouchPreview(project);
        return;
      }
    }

    onSelect?.();
    setIsOpening(true);
    // Allow the 200ms open animation to play before navigation finishes
    setTimeout(() => {
      setIsOpening(false);
    }, 240);
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const active = isHovered || isFocused || isSelected;

  return (
    <>
      <a
        ref={containerRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={`${project.name} – opens GitHub repository`}
        className="group relative flex flex-col items-center justify-start text-decoration-none outline-none focus:outline-none"
        style={{
          width: 104,
          minHeight: 114,
          padding: "8px 6px 6px 6px",
          borderRadius: "10px",
          cursor: "pointer",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          animation: `kdeFolderPopIn 380ms cubic-bezier(0.16, 1, 0.3, 1) ${animationDelay} backwards`,
          transform: active ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Click Pink Ripple */}
        {isOpening && (
          <span
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "14px",
              border: "2px solid #ff4fa3",
              animation: "kdeClickRipple 240ms ease-out forwards",
              pointerEvents: "none",
            }}
          />
        )}

        {/* ── FOLDER ICON CONTAINER (SVG LID + BODY) ── */}
        <div
          style={{
            position: "relative",
            width: 72,
            height: 56,
            perspective: 350,
          }}
        >
          {/* Back plate & tab (lighter pink) */}
          <svg
            viewBox="0 0 72 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
              filter: active
                ? "drop-shadow(0 0 14px rgba(255, 79, 163, 0.65))"
                : "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))",
              transition: "filter 220ms ease",
            }}
          >
            {/* Folder Back with Tab */}
            <path
              d="M4 10C4 6.68629 6.68629 4 10 4H26C28.2 4 30.2 5.2 31.4 7L34 11H62C65.3137 11 68 13.6863 68 17V48C68 51.3137 65.3137 54 62 54H10C6.68629 54 4 51.3137 4 48V10Z"
              fill="url(#folderBackGradient)"
            />
            {/* Interior shadow */}
            <rect x="8" y="16" width="56" height="32" rx="4" fill="#691238" opacity="0.35" />
            <defs>
              <linearGradient id="folderBackGradient" x1="4" y1="4" x2="68" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff85c0" />
                <stop offset="1" stopColor="#d92b7c" />
              </linearGradient>
            </defs>
          </svg>

          {/* Paper Sheet inside (slides up when folder opens) */}
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 10,
              height: 34,
              backgroundColor: "#ffffff",
              borderRadius: "4px 4px 1px 1px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.35)",
              transform: isOpening
                ? "translateY(-14px) scale(1.02)"
                : active
                ? "translateY(-7px)"
                : "translateY(0)",
              opacity: active ? 1 : 0.6,
              transition: "transform 220ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease",
              padding: "4px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Miniature paper code lines */}
            <div style={{ height: 2.5, width: "65%", backgroundColor: "#ff4fa3", borderRadius: 2 }} />
            <div style={{ height: 2, width: "85%", backgroundColor: "#e2e8f0", borderRadius: 1 }} />
            <div style={{ height: 2, width: "70%", backgroundColor: "#cbd5e1", borderRadius: 1 }} />
            <div style={{ height: 2, width: "50%", backgroundColor: "#94a3b8", borderRadius: 1 }} />
          </div>

          {/* Front Folder Flap / Lid (Animates open) */}
          <div
            style={{
              position: "absolute",
              left: 4,
              right: 4,
              bottom: 2,
              height: 38,
              transformOrigin: "bottom center",
              transform: isOpening
                ? "rotateX(-50deg) translateY(3px)"
                : active
                ? "rotateX(-28deg) translateY(2px)"
                : "rotateX(0deg)",
              transition: "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <svg viewBox="0 0 64 38" fill="none" style={{ width: "100%", height: "100%" }}>
              <path
                d="M0 6C0 3.79086 1.79086 2 4 2H60C62.2091 2 64 3.79086 64 6V32C64 34.2091 62.2091 36 60 36H4C1.79086 36 0 34.2091 0 32V6Z"
                fill="url(#folderFrontGradient)"
              />
              {/* Highlight ridge */}
              <line x1="2" y1="4" x2="62" y2="4" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" />
              {/* Subtle center KDE emblem or diagonal seam */}
              <path
                d="M26 18L32 24L38 18"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={active ? 0.9 : 0.5}
              />
              <defs>
                <linearGradient id="folderFrontGradient" x1="0" y1="2" x2="64" y2="36" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ff5ea9" />
                  <stop offset="0.6" stopColor="#ff4fa3" />
                  <stop offset="1" stopColor="#c71f6d" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Language dot / mini badge in top right corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: -2,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "rgba(18, 8, 26, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.6)",
            }}
            title={project.language}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: project.languageColor || "#ff4fa3",
                boxShadow: `0 0 6px ${project.languageColor || "#ff4fa3"}`,
              }}
            />
          </div>
        </div>

        {/* ── PROJECT NAME LABEL ── */}
        <span
          style={{
            marginTop: 7,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            fontSize: "0.76rem",
            fontWeight: 500,
            lineHeight: 1.25,
            color: active ? "#ffffff" : "rgba(255, 255, 255, 0.92)",
            textAlign: "center",
            maxWidth: 96,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.95), 0 0 8px rgba(0, 0, 0, 0.7)",
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: active
              ? "rgba(255, 79, 163, 0.35)"
              : "transparent",
            boxShadow: active
              ? "0 0 10px rgba(255, 79, 163, 0.3), inset 0 0 4px rgba(255, 79, 163, 0.4)"
              : "none",
            border: active
              ? "1px solid rgba(255, 179, 217, 0.4)"
              : "1px solid transparent",
            transition: "background-color 150ms ease, border-color 150ms ease",
          }}
        >
          {project.name}
        </span>
      </a>

      {/* KDE Plasma Tooltip beside the folder */}
      <FolderTooltip
        project={project}
        anchorRect={anchorRect}
        isOpen={showTooltip}
      />
    </>
  );
};
