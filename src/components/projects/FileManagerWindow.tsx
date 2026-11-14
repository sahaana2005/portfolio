import * as React from "react";
import {
  X,
  Minus,
  Square,
  Home,
  FileText,
  Music,
  Image as ImageIcon,
  Video,
  Download,
  Trash2,
  FolderOpen,
  ChevronRight,
  Search,
} from "lucide-react";
import type { GitHubProject } from "./projectDescriptions";

interface FileManagerWindowProps {
  projects: GitHubProject[];
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

export const FileManagerWindow: React.FC<FileManagerWindowProps> = ({
  projects,
  isOpen,
  onClose,
  zIndex,
  onFocus,
}) => {
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = React.useState(false);
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const initialWidth = Math.min(520, window.innerWidth - 32);
    const targetX = Math.max(16, window.innerWidth / 2 - initialWidth / 2 + 50);
    const targetY = Math.max(70, window.innerHeight * 0.18);
    setPos({ x: targetX, y: targetY });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".fm-win-controls")) return;
    isDragging.current = true;
    onFocus();
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const maxX = Math.max(10, window.innerWidth - 300);
    const maxY = Math.max(10, window.innerHeight - 100);

    setPos({
      x: Math.max(10, Math.min(maxX, dragStart.current.initialX + dx)),
      y: Math.max(45, Math.min(maxY, dragStart.current.initialY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onMouseDown={onFocus}
      className="hidden md:block"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex,
        width: 540,
        maxWidth: "calc(100vw - 28px)",
        backgroundColor: "rgba(22, 10, 32, 0.94)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 79, 163, 0.4)",
        boxShadow: "0 24px 65px rgba(0, 0, 0, 0.88), 0 0 32px rgba(255, 79, 163, 0.2)",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        color: "#ffffff",
        animation: "kdeTooltipPop 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Dolphin Pink Header Bar (matches reference screenshot) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 14px",
          background: "linear-gradient(90deg, #ff4fa3, #d92b7c)",
          color: "#ffffff",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {/* Controls */}
        <div className="fm-win-controls" style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ff5f56",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <X size={8} color="#450000" strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => setIsMinimized((prev) => !prev)}
            title="Minimize"
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Minus size={7} color="#452a00" strokeWidth={3} />
          </button>
          <button
            type="button"
            title="Maximize"
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#27c93f",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <Square size={6} color="#003500" strokeWidth={3} />
          </button>
        </div>

        {/* Path Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.74rem", fontWeight: 600 }}>
          <span>Home</span>
          <ChevronRight size={12} />
          <span>sahaana</span>
          <ChevronRight size={12} />
          <span style={{ color: "#ffffff", textDecoration: "underline" }}>Projects</span>
        </div>

        <Search size={14} opacity={0.8} />
      </div>

      {!isMinimized && (
        <div style={{ display: "flex", height: 260 }}>
          {/* Left Sidebar */}
          <div
            style={{
              width: 140,
              backgroundColor: "rgba(14, 6, 20, 0.7)",
              borderRight: "1px solid rgba(255, 79, 163, 0.2)",
              padding: "10px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              fontSize: "0.72rem",
            }}
          >
            <div style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.64rem", padding: "4px 8px", textTransform: "uppercase" }}>
              Places
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ color: "#ffffff", opacity: 0.7 }}>
              <Home size={13} />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ color: "#ffffff", opacity: 0.7 }}>
              <FileText size={13} />
              <span>Documents</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ color: "#ffffff", opacity: 0.7 }}>
              <Download size={13} />
              <span>Downloads</span>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded"
              style={{
                backgroundColor: "rgba(255, 79, 163, 0.3)",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              <FolderOpen size={13} color="#ff85c0" />
              <span>Projects</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ color: "#ffffff", opacity: 0.7 }}>
              <Music size={13} />
              <span>Music</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ color: "#ffffff", opacity: 0.7 }}>
              <ImageIcon size={13} />
              <span>Pictures</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ color: "#ffffff", opacity: 0.7 }}>
              <Video size={13} />
              <span>Videos</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded mt-auto" style={{ color: "#ffffff", opacity: 0.5 }}>
              <Trash2 size={13} />
              <span>Trash</span>
            </div>
          </div>

          {/* Main Folder Grid */}
          <div
            style={{
              flex: 1,
              padding: "14px",
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
              gap: 12,
              backgroundColor: "rgba(18, 8, 26, 0.8)",
            }}
          >
            {projects.map((proj) => (
              <a
                key={proj.id}
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${proj.name} - Open in GitHub`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px 4px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "#ffffff",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div style={{ fontSize: "2rem", lineHeight: 1 }}>📁</div>
                <span
                  style={{
                    marginTop: 4,
                    fontSize: "0.68rem",
                    textAlign: "center",
                    maxWidth: 80,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {proj.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      {!isMinimized && (
        <div
          style={{
            padding: "5px 12px",
            background: "rgba(10, 4, 16, 0.9)",
            borderTop: "1px solid rgba(255, 79, 163, 0.2)",
            fontSize: "0.66rem",
            color: "rgba(255, 255, 255, 0.6)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>~/Projects ({projects.length} repositories)</span>
          <span>Free: 412.8 GB / 512 GB</span>
        </div>
      )}
    </div>
  );
};
