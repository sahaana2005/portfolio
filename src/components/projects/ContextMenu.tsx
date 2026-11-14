import * as React from "react";
import { RefreshCw, ArrowDownAZ, Info } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onSort: () => void;
  onAbout: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  isOpen,
  onClose,
  onRefresh,
  onSort,
  onAbout,
}) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickAway = () => {
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickAway);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickAway);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Prevent context menu from overflowing viewport
  const adjustedX = Math.min(x, window.innerWidth - 190);
  const adjustedY = Math.min(y, window.innerHeight - 150);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: adjustedX,
        top: adjustedY,
        zIndex: 1000,
        width: 180,
        backgroundColor: "rgba(18, 8, 26, 0.95)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 79, 163, 0.35)",
        boxShadow: "0 14px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 79, 163, 0.2)",
        padding: "6px",
        color: "#ffffff",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: "0.76rem",
        animation: "kdeTooltipPop 140ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      <button
        type="button"
        onClick={() => {
          onRefresh();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors"
        style={{
          color: "#ffffff",
          cursor: "pointer",
          border: "none",
          background: "transparent",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <RefreshCw size={13} color="#ff4fa3" />
        <span>Refresh</span>
      </button>

      <button
        type="button"
        onClick={() => {
          onSort();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors"
        style={{
          color: "#ffffff",
          cursor: "pointer",
          border: "none",
          background: "transparent",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <ArrowDownAZ size={13} color="#00ffc8" />
        <span>Sort by name</span>
      </button>

      <div style={{ height: 1, backgroundColor: "rgba(255, 79, 163, 0.2)", margin: "4px 0" }} />

      <button
        type="button"
        onClick={() => {
          onAbout();
          onClose();
        }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors"
        style={{
          color: "#ffffff",
          cursor: "pointer",
          border: "none",
          background: "transparent",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <Info size={13} color="#ffd166" />
        <span>About PlasmaOS</span>
      </button>
    </div>
  );
};
