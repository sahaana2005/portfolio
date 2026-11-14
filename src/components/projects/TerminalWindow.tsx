import * as React from "react";
import { X, Minus, Square } from "lucide-react";
import type { GitHubProject } from "./projectDescriptions";

interface TerminalWindowProps {
  projects: GitHubProject[];
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  projects,
  isOpen,
  onClose,
  zIndex,
  onFocus,
}) => {
  // Default position: positioned on right side of viewport so folders on left are clear
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [typewriterStage, setTypewriterStage] = React.useState<number>(0);

  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  // Initialize initial responsive coordinate once
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const initialWidth = Math.min(460, window.innerWidth - 32);
    const targetX = Math.max(20, window.innerWidth - initialWidth - 40);
    const targetY = Math.max(54, window.innerHeight * 0.12);
    setPos({ x: targetX, y: targetY });
  }, []);

  // Typewriter sequence when window opens
  React.useEffect(() => {
    if (!isOpen) {
      setTypewriterStage(0);
      return;
    }

    const t1 = setTimeout(() => setTypewriterStage(1), 350); // command typed
    const t2 = setTimeout(() => setTypewriterStage(2), 750); // ls results
    const t3 = setTimeout(() => setTypewriterStage(3), 1150); // neofetch block

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest(".term-win-controls")) return;
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
        width: 480,
        maxWidth: "calc(100vw - 28px)",
        backgroundColor: "rgba(14, 7, 22, 0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 79, 163, 0.4)",
        boxShadow: "0 22px 60px rgba(0, 0, 0, 0.88), 0 0 30px rgba(255, 79, 163, 0.22)",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        color: "#ffffff",
        animation: "kdeTooltipPop 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* Titlebar with KDE / Linux pink/yellow/green dots */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "linear-gradient(90deg, rgba(255, 79, 163, 0.2), rgba(26, 10, 31, 0.95))",
          borderBottom: "1px solid rgba(255, 79, 163, 0.25)",
          cursor: "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        {/* Window controls */}
        <div className="term-win-controls" style={{ display: "flex", alignItems: "center", gap: 7 }}>
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

        {/* Title */}
        <span
          style={{
            fontSize: "0.74rem",
            color: "#ffb3d9",
            fontWeight: 600,
            letterSpacing: "0.03em",
          }}
        >
          konsole — sahaana@portfolio:~
        </span>

        <span style={{ fontSize: "0.68rem", color: "rgba(255, 255, 255, 0.4)" }}>
          zsh
        </span>
      </div>

      {/* Terminal Body */}
      {!isMinimized && (
        <div
          style={{
            padding: "16px 18px",
            fontSize: "0.78rem",
            lineHeight: 1.6,
            maxHeight: 380,
            overflowY: "auto",
            background: "rgba(10, 4, 16, 0.8)",
          }}
        >
          {/* Prompt line 1 */}
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: "#ff4fa3", fontWeight: 700 }}>sahaana@portfolio</span>
            <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>:</span>
            <span style={{ color: "#00ffc8", fontWeight: 600 }}>~</span>
            <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>$ </span>
            {typewriterStage >= 1 ? (
              <span style={{ color: "#ffffff" }}>ls ~/projects</span>
            ) : (
              <span className="animate-pulse" style={{ color: "#ff4fa3" }}>▍</span>
            )}
          </div>

          {/* LS Output */}
          {typewriterStage >= 2 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "4px 10px",
                padding: "4px 0 12px 10px",
                color: "#ff85c0",
                fontWeight: 600,
              }}
            >
              {projects.slice(0, 6).map((proj) => (
                <span key={proj.id} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ color: "#ff4fa3" }}>📁</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {proj.name}/
                  </span>
                </span>
              ))}
            </div>
          )}

          {/* Neofetch block */}
          {typewriterStage >= 3 && (
            <div
              style={{
                marginTop: 8,
                paddingTop: 10,
                borderTop: "1px dashed rgba(255, 79, 163, 0.3)",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              {/* ASCII Mascot Logo */}
              <pre
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  lineHeight: 1.25,
                  color: "#ff4fa3",
                  textShadow: "0 0 8px rgba(255, 79, 163, 0.6)",
                  userSelect: "none",
                }}
              >
{` /\\_/\\
( o.o )
 > ^ <`}
              </pre>

              {/* Neofetch fields */}
              <div style={{ fontSize: "0.72rem", lineHeight: 1.5, color: "rgba(255, 255, 255, 0.88)" }}>
                <div>
                  <span style={{ color: "#ff4fa3", fontWeight: 700 }}>OS: </span>
                  <span>PortfolioOS (Linux 6.8 Plasma)</span>
                </div>
                <div>
                  <span style={{ color: "#ff4fa3", fontWeight: 700 }}>Host: </span>
                  <span>Sahaana&apos;s DevStation</span>
                </div>
                <div>
                  <span style={{ color: "#ff4fa3", fontWeight: 700 }}>Shell: </span>
                  <span>zsh 5.9</span>
                </div>
                <div>
                  <span style={{ color: "#ff4fa3", fontWeight: 700 }}>Focus: </span>
                  <span style={{ color: "#00ffc8" }}>Cybersecurity + Full-stack</span>
                </div>
                <div>
                  <span style={{ color: "#ff4fa3", fontWeight: 700 }}>Status: </span>
                  <span style={{ color: "#ffd166" }}>Open to opportunities</span>
                </div>
              </div>
            </div>
          )}

          {/* Final active prompt */}
          {typewriterStage >= 3 && (
            <div style={{ marginTop: 12 }}>
              <span style={{ color: "#ff4fa3", fontWeight: 700 }}>sahaana@portfolio</span>
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>:</span>
              <span style={{ color: "#00ffc8", fontWeight: 600 }}>~</span>
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>$ </span>
              <span className="animate-pulse" style={{ color: "#ff4fa3" }}>▍</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
