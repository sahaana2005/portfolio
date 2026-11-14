import * as React from "react";
import {
  Terminal,
  FolderOpen,
  Globe,
  Code2,
  Wifi,
  Volume2,
  BatteryCharging,
  Sparkles,
  LogOut,
  Mail,
  RefreshCw,
} from "lucide-react";

interface TaskbarProps {
  isTerminalOpen: boolean;
  isFileManagerOpen: boolean;
  onToggleTerminal: () => void;
  onToggleFileManager: () => void;
  onBackToRoom: () => void;
  onContactClick?: () => void;
  onRefreshDesktop?: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isTerminalOpen,
  isFileManagerOpen,
  onToggleTerminal,
  onToggleFileManager,
  onBackToRoom,
  onContactClick,
  onRefreshDesktop,
}) => {
  const [timeStr, setTimeStr] = React.useState("12:00");
  const [dateStr, setDateStr] = React.useState("Nov 15");
  const [isLauncherOpen, setIsLauncherOpen] = React.useState(false);

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
      setDateStr(
        now.toLocaleDateString([], { month: "short", day: "numeric" })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── KDE Plasma Application Launcher Menu Popup ── */}
      {isLauncherOpen && (
        <>
          {/* Backdrop click dismiss */}
          <div
            onClick={() => setIsLauncherOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
            }}
          />
          <div
            style={{
              position: "fixed",
              left: 14,
              bottom: 56,
              zIndex: 95,
              width: 320,
              backgroundColor: "rgba(18, 9, 26, 0.94)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              borderRadius: "14px",
              border: "1px solid rgba(255, 79, 163, 0.35)",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 79, 163, 0.2)",
              padding: "16px",
              color: "#ffffff",
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
              animation: "kdeTooltipPop 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            {/* Header: User Profile banner */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255, 79, 163, 0.2)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff4fa3, #7209b7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  fontWeight: 700,
                  boxShadow: "0 0 14px rgba(255, 79, 163, 0.5)",
                }}
              >
                SR
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff" }}>
                  Sahaana R.
                </div>
                <div style={{ fontSize: "0.7rem", color: "#ff85c0" }}>
                  sahaana@portfolio-os
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button
                type="button"
                onClick={() => {
                  onToggleTerminal();
                  setIsLauncherOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                style={{
                  background: isTerminalOpen ? "rgba(255, 79, 163, 0.2)" : "transparent",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isTerminalOpen ? "rgba(255, 79, 163, 0.2)" : "transparent")}
              >
                <Terminal size={16} color="#ff4fa3" />
                <span>Konsole Terminal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleFileManager();
                  setIsLauncherOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                style={{
                  background: isFileManagerOpen ? "rgba(255, 79, 163, 0.2)" : "transparent",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isFileManagerOpen ? "rgba(255, 79, 163, 0.2)" : "transparent")}
              >
                <FolderOpen size={16} color="#ff85c0" />
                <span>Dolphin File Manager</span>
              </button>

              <a
                href="https://github.com/sahaana2005"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsLauncherOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-left text-decoration-none"
                style={{
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub Repositories</span>
              </a>

              {onContactClick && (
                <button
                  type="button"
                  onClick={() => {
                    onContactClick();
                    setIsLauncherOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                  style={{
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Mail size={16} color="#ffd166" />
                  <span>Send Message (Contact)</span>
                </button>
              )}

              {onRefreshDesktop && (
                <button
                  type="button"
                  onClick={() => {
                    onRefreshDesktop();
                    setIsLauncherOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
                  style={{
                    color: "#ffffff",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.25)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <RefreshCw size={16} color="#4cc9f0" />
                  <span>Refresh Desktop</span>
                </button>
              )}
            </div>

            {/* Logout / Return to 3D room button */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid rgba(255, 79, 163, 0.2)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsLauncherOpen(false);
                  onBackToRoom();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left"
                style={{
                  background: "rgba(255, 79, 163, 0.18)",
                  border: "1px solid rgba(255, 79, 163, 0.4)",
                  color: "#ff85c0",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.35)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.18)";
                  e.currentTarget.style.color = "#ff85c0";
                }}
              >
                <span>Leave Desktop (Back to room)</span>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── BOTTOM DOCK / TASKBAR ── */}
      <footer
        role="region"
        aria-label="Desktop Taskbar"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 48,
          zIndex: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          backgroundColor: "rgba(18, 8, 26, 0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(255, 79, 163, 0.3)",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.5), 0 -1px 12px rgba(255, 79, 163, 0.15)",
          color: "#ffffff",
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        }}
      >
        {/* Left: Launcher Button & Pinned Apps */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* KDE / Linux Pink Launcher Button */}
          <button
            type="button"
            onClick={() => setIsLauncherOpen((prev) => !prev)}
            aria-label="Application Launcher"
            title="Application Launcher"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: isLauncherOpen
                ? "linear-gradient(135deg, #ff4fa3, #ff85c0)"
                : "linear-gradient(135deg, #ff4fa3, #9d174d)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: isLauncherOpen
                ? "0 0 16px #ff4fa3"
                : "0 0 10px rgba(255, 79, 163, 0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              transition: "transform 180ms ease, box-shadow 180ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Sparkles size={17} strokeWidth={2.4} />
          </button>

          {/* Vertical Separator */}
          <div style={{ width: 1, height: 22, backgroundColor: "rgba(255, 79, 163, 0.2)" }} />

          {/* Pinned App Icons (Scale on hover) */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Konsole / Terminal */}
            <button
              type="button"
              onClick={onToggleTerminal}
              title="Terminal (Konsole)"
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                background: isTerminalOpen ? "rgba(255, 79, 163, 0.28)" : "transparent",
                border: isTerminalOpen ? "1px solid rgba(255, 79, 163, 0.6)" : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ff4fa3",
                cursor: "pointer",
                transition: "transform 150ms ease, background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18) translateY(-2px)";
                e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.backgroundColor = isTerminalOpen ? "rgba(255, 79, 163, 0.28)" : "transparent";
              }}
            >
              <Terminal size={17} strokeWidth={2.2} />
            </button>

            {/* Dolphin Files */}
            <button
              type="button"
              onClick={onToggleFileManager}
              title="Files (~/Projects)"
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                background: isFileManagerOpen ? "rgba(255, 79, 163, 0.28)" : "transparent",
                border: isFileManagerOpen ? "1px solid rgba(255, 79, 163, 0.6)" : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ff85c0",
                cursor: "pointer",
                transition: "transform 150ms ease, background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18) translateY(-2px)";
                e.currentTarget.style.backgroundColor = "rgba(255, 79, 163, 0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.backgroundColor = isFileManagerOpen ? "rgba(255, 79, 163, 0.28)" : "transparent";
              }}
            >
              <FolderOpen size={17} strokeWidth={2.2} />
            </button>

            {/* Browser */}
            <a
              href="https://github.com/sahaana2005"
              target="_blank"
              rel="noopener noreferrer"
              title="Browser (Mozilla Firefox / GitHub)"
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffd166",
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 150ms ease, background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18) translateY(-2px)";
                e.currentTarget.style.backgroundColor = "rgba(255, 209, 102, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Globe size={17} strokeWidth={2.2} />
            </a>

            {/* GitHub Profile */}
            <a
              href="https://github.com/sahaana2005"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub Profile (@sahaana2005)"
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#00ffc8",
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 150ms ease, background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18) translateY(-2px)";
                e.currentTarget.style.backgroundColor = "rgba(0, 255, 200, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#00ffc8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>

            {/* VS Code */}
            <a
              href="https://github.com/sahaana2005/PORTFOLIO"
              target="_blank"
              rel="noopener noreferrer"
              title="VS Code / View Source"
              style={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4cc9f0",
                textDecoration: "none",
                cursor: "pointer",
                transition: "transform 150ms ease, background-color 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.18) translateY(-2px)";
                e.currentTarget.style.backgroundColor = "rgba(76, 201, 240, 0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) translateY(0)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Code2 size={17} strokeWidth={2.2} />
            </a>
          </div>

          {/* Running-window pills (desktop only) */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {isTerminalOpen && (
              <button
                type="button"
                onClick={onToggleTerminal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 79, 163, 0.22)",
                  border: "1px solid rgba(255, 79, 163, 0.45)",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ff4fa3" }} />
                <span>sahaana@portfolio:~</span>
              </button>
            )}
            {isFileManagerOpen && (
              <button
                type="button"
                onClick={onToggleFileManager}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 79, 163, 0.22)",
                  border: "1px solid rgba(255, 79, 163, 0.45)",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  cursor: "pointer",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ff85c0" }} />
                <span>~/Projects</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: System Tray & Clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Tray Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255, 255, 255, 0.7)" }}>
            <span title="Wi-Fi: Connected (Plasma Net)">
              <Wifi size={14} />
            </span>
            <span title="Audio: 100%">
              <Volume2 size={14} />
            </span>
            <span title="Battery: 100% Charging">
              <BatteryCharging size={15} color="#00ffc8" />
            </span>
          </div>

          {/* Clock & Date */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              lineHeight: 1.1,
              paddingLeft: 6,
              borderLeft: "1px solid rgba(255, 79, 163, 0.25)",
            }}
          >
            <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#ffffff" }}>
              {timeStr}
            </span>
            <span style={{ fontSize: "0.62rem", color: "rgba(255, 179, 217, 0.85)" }}>
              {dateStr}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};
