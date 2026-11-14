import * as React from "react";
import { ArrowLeft, ExternalLink, Sparkles, X } from "lucide-react";
import {
  type GitHubProject,
  FALLBACK_PROJECTS,
  fetchGitHubProjects,
} from "./projectDescriptions";
import { DesktopFolder } from "./DesktopFolder";
import { Taskbar } from "./Taskbar";
import { TerminalWindow } from "./TerminalWindow";
import { FileManagerWindow } from "./FileManagerWindow";
import { ContextMenu } from "./ContextMenu";

interface ProjectsDesktopProps {
  onBackToRoom: () => void;
  onContactClick?: () => void;
}

export const ProjectsDesktop: React.FC<ProjectsDesktopProps> = ({
  onBackToRoom,
  onContactClick,
}) => {
  const [projects, setProjects] = React.useState<GitHubProject[]>(FALLBACK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(null);
  const [touchPreviewProject, setTouchPreviewProject] = React.useState<GitHubProject | null>(null);

  // Desktop Windows & State
  const [isTerminalOpen, setIsTerminalOpen] = React.useState(true);
  const [isFileManagerOpen, setIsFileManagerOpen] = React.useState(false);
  const [activeZIndex, setActiveZIndex] = React.useState(50);
  const [terminalZ, setTerminalZ] = React.useState(51);
  const [fileManagerZ, setFileManagerZ] = React.useState(50);

  // Context Menu State
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; isOpen: boolean }>({
    x: 0,
    y: 0,
    isOpen: false,
  });

  // Stagger refresh key
  const [renderKey, setRenderKey] = React.useState(0);

  // Load repositories from GitHub on mount (or use resilient fallback)
  React.useEffect(() => {
    let isMounted = true;
    fetchGitHubProjects("sahaana2005").then((data) => {
      if (isMounted && data && data.length > 0) {
        setProjects(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const bringToFront = (type: "terminal" | "filemanager") => {
    const nextZ = activeZIndex + 1;
    setActiveZIndex(nextZ);
    if (type === "terminal") setTerminalZ(nextZ);
    if (type === "filemanager") setFileManagerZ(nextZ);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true });
  };

  const handleRefresh = () => {
    setSelectedProjectId(null);
    setRenderKey((prev) => prev + 1);
  };

  const handleSort = () => {
    setProjects((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
    handleRefresh();
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={() => setSelectedProjectId(null)}
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        backgroundColor: "#0b0610",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        color: "#ffffff",
      }}
    >
      {/* ── KEYFRAME ANIMATIONS & MONOSPACE RULES ── */}
      <style>{`
        @keyframes kdeFolderPopIn {
          0% {
            opacity: 0;
            transform: scale(0.65) translateY(14px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes kdeTooltipPop {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(4px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes kdeClickRipple {
          0% {
            opacity: 0.8;
            transform: scale(0.9);
          }
          100% {
            opacity: 0;
            transform: scale(1.4);
          }
        }
        @keyframes kdeGlowPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.08);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── 1. WALLPAPER: Dark purple gradient (#0b0610 to #1a0a1f) + Neon glow blobs ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, #0b0610 0%, #15081b 50%, #1a0a1f 100%)",
        }}
      />

      {/* Magenta/Pink Neon Glow Blobs */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "10%",
          left: "20%",
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(255, 79, 163, 0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "kdeGlowPulse 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: "15%",
          right: "15%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(181, 23, 158, 0.22) 0%, transparent 70%)",
          filter: "blur(75px)",
          animation: "kdeGlowPulse 10s ease-in-out infinite reverse",
        }}
      />

      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Faint Mascot Silhouette in Background */}
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          right: "8%",
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.08,
          filter: "drop-shadow(0 0 30px #ff4fa3)",
        }}
      >
        <svg width="420" height="420" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="36" ry="34" fill="#ff4fa3" />
          <polygon points="20,25 35,5 42,26" fill="#ff4fa3" />
          <polygon points="80,25 65,5 58,26" fill="#ff4fa3" />
          <circle cx="36" cy="48" r="4" fill="#ffffff" />
          <circle cx="64" cy="48" r="4" fill="#ffffff" />
          <path d="M46 56 Q50 60 54 56" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* ── 2. SLIM TOP BAR ("← Back to room" Logout Action) ── */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          zIndex: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          backgroundColor: "rgba(14, 6, 20, 0.65)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(255, 79, 163, 0.2)",
        }}
      >
        {/* Left: Desktop Session Info */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Sparkles size={14} color="#ff4fa3" />
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#ffffff", letterSpacing: "0.04em" }}>
            PlasmaOS
          </span>
          <span
            style={{
              fontSize: "0.68rem",
              padding: "1px 7px",
              borderRadius: 6,
              backgroundColor: "rgba(255, 79, 163, 0.15)",
              border: "1px solid rgba(255, 79, 163, 0.3)",
              color: "#ff85c0",
            }}
          >
            ~/projects
          </span>
        </div>

        {/* Right: Return / Logout button */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={onBackToRoom}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              backgroundColor: "rgba(255, 79, 163, 0.15)",
              border: "1px solid rgba(255, 79, 163, 0.4)",
              borderRadius: 6,
              color: "#ffffff",
              fontSize: "0.74rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.35)";
              e.currentTarget.style.boxShadow = "0 0 14px rgba(255, 79, 163, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.15)";
              e.currentTarget.style.boxShadow = "none";
            }}
            title="Leave Desktop and return to the 3D room"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            <span>← Back to room</span>
          </button>
        </div>
      </header>

      {/* ── 3. DESKTOP CANVAS: Column-first Auto-Flow Folder Grid ── */}
      <main
        key={renderKey}
        role="main"
        aria-label="Desktop Folders"
        style={{
          position: "absolute",
          top: 48,
          left: 18,
          bottom: 56,
          right: 18,
          zIndex: 20,
          pointerEvents: "auto",
        }}
      >
        {/*
          Column-first desktop layout:
          On wide screens: displays as a column-first grid (like a real KDE / Linux desktop),
          flowing from top to bottom, then next column to the right.
          On mobile: adjusts to 3-column wrap grid.
        */}
        <div
          className="hidden md:grid"
          style={{
            height: "100%",
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(auto-fill, minmax(118px, 1fr))",
            gap: "20px 24px",
            alignContent: "start",
            justifyContent: "start",
          }}
        >
          {projects.map((proj, idx) => (
            <DesktopFolder
              key={`${proj.id}-${idx}`}
              project={proj}
              index={idx}
              isSelected={selectedProjectId === proj.id}
              onSelect={() => setSelectedProjectId(proj.id)}
              onTouchPreview={(p) => setTouchPreviewProject(p)}
            />
          ))}
        </div>

        {/* Mobile / Compact Tablet Grid (Row wrap, 3 columns) */}
        <div
          className="grid md:hidden grid-cols-3 gap-y-4 gap-x-2 pt-2 pb-6 px-1 overflow-y-auto max-h-full"
          style={{ alignContent: "start", justifyItems: "center" }}
        >
          {projects.map((proj, idx) => (
            <DesktopFolder
              key={`mob-${proj.id}-${idx}`}
              project={proj}
              index={idx}
              isSelected={selectedProjectId === proj.id}
              onSelect={() => setSelectedProjectId(proj.id)}
              onTouchPreview={(p) => setTouchPreviewProject(p)}
            />
          ))}
        </div>
      </main>

      {/* ── 4. DECORATIVE LINUX WINDOWS (Non-blocking, Draggable) ── */}
      <TerminalWindow
        projects={projects}
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        zIndex={terminalZ}
        onFocus={() => bringToFront("terminal")}
      />

      <FileManagerWindow
        projects={projects}
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        zIndex={fileManagerZ}
        onFocus={() => bringToFront("filemanager")}
      />

      {/* ── 5. TOUCH DEVICE BOTTOM SHEET (First tap on mobile) ── */}
      {touchPreviewProject && (
        <>
          <div
            onClick={() => setTouchPreviewProject(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 p-5 rounded-t-2xl md:hidden"
            style={{
              backgroundColor: "rgba(22, 10, 32, 0.96)",
              borderTop: "2px solid #ff4fa3",
              boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 79, 163, 0.3)",
              color: "#ffffff",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📁</span>
                <h3 className="text-base font-bold text-white m-0">{touchPreviewProject.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setTouchPreviewProject(null)}
                className="p-1 rounded-full bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/80 leading-relaxed mb-4">
              {touchPreviewProject.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: touchPreviewProject.languageColor,
                  }}
                />
                <span>{touchPreviewProject.language}</span>
              </div>

              <a
                href={touchPreviewProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #ff4fa3, #7209b7)",
                  boxShadow: "0 4px 14px rgba(255, 79, 163, 0.4)",
                  textDecoration: "none",
                }}
              >
                <span>Open in GitHub</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </>
      )}

      {/* ── 6. RIGHT-CLICK CONTEXT MENU ── */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.isOpen}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onRefresh={handleRefresh}
        onSort={handleSort}
        onAbout={() => setIsTerminalOpen(true)}
      />

      {/* ── 7. BOTTOM TASKBAR DOCK ── */}
      <Taskbar
        isTerminalOpen={isTerminalOpen}
        isFileManagerOpen={isFileManagerOpen}
        onToggleTerminal={() => {
          setIsTerminalOpen((prev) => !prev);
          if (!isTerminalOpen) bringToFront("terminal");
        }}
        onToggleFileManager={() => {
          setIsFileManagerOpen((prev) => !prev);
          if (!isFileManagerOpen) bringToFront("filemanager");
        }}
        onBackToRoom={onBackToRoom}
        onContactClick={onContactClick}
        onRefreshDesktop={handleRefresh}
      />
    </div>
  );
};
