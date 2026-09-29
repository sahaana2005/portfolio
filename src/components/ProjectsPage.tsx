import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Minus, Square } from "lucide-react";

export interface ProjectItem {
  id: string;
  name: string;
  repoName: string;
  url: string;
  description: string;
  tags: string[];
  accentColor: string;
  glowColor: string;
  coords: { x: string; y: string; depth: number };
}

interface ProjectsPageProps {
  isVisible: boolean;
  onBack: () => void;
  onContactClick?: () => void;
}

// ── The 5 Projects specified by user ──────────────────────────────────────────
const PROJECTS: ProjectItem[] = [
  {
    id: "piggypie",
    name: "Piggypie",
    repoName: "sahaana2005 / Piggypie",
    url: "https://github.com/sahaana2005/Piggypie",
    description:
      "A playful, gamified micro-savings and personal budgeting application engineered to make financial discipline rewarding with dynamic milestones and coin-drop mechanics.",
    tags: ["Finance", "Gamification", "React", "Node.js", "TypeScript"],
    accentColor: "#ffd166",
    glowColor: "rgba(255, 209, 102, 0.45)",
    coords: { x: "16%", y: "24%", depth: 0.02 },
  },
  {
    id: "plant-ai",
    name: "AI-PLANT-DISEASE-DETECTION",
    repoName: "sahaana2005 / AI-PLANT-DISEASE-DETECTION",
    url: "https://github.com/sahaana2005/AI-PLANT-DISEASE-DETECTION",
    description:
      "Deep learning computer vision pipeline utilizing convolutional neural networks to rapidly diagnose foliar pathogens and crop leaf diseases from real-time field photography.",
    tags: ["Computer Vision", "PyTorch", "CNN", "FastAPI", "Python"],
    accentColor: "#06d6a0",
    glowColor: "rgba(6, 214, 160, 0.45)",
    coords: { x: "74%", y: "22%", depth: -0.025 },
  },
  {
    id: "sofasogood",
    name: "sofasogood-",
    repoName: "sahaana2005 / sofasogood-",
    url: "https://github.com/sahaana2005/sofasogood-",
    description:
      "An aesthetic interior living and minimalist furniture commerce platform focused on tactile typography, spatial previews, and frictionless modern checkout experiences.",
    tags: ["E-Commerce", "UX Design", "Full-Stack", "TailwindCSS"],
    accentColor: "#f72585",
    glowColor: "rgba(247, 37, 133, 0.45)",
    coords: { x: "47%", y: "48%", depth: 0.03 },
  },
  {
    id: "sqlisquid",
    name: "SQLiSquidScanner",
    repoName: "sahaana2005 / SQLiSquidScanner",
    url: "https://github.com/sahaana2005/SQLiSquidScanner",
    description:
      "Multi-threaded security penetration auditing scanner that autonomously spiders web endpoints to execute recursive payload injection and heuristic SQL injection analysis.",
    tags: ["Cybersecurity", "SQLi", "Penetration Testing", "Python"],
    accentColor: "#b5179e",
    glowColor: "rgba(181, 23, 158, 0.5)",
    coords: { x: "24%", y: "72%", depth: -0.02 },
  },
  {
    id: "honeypot",
    name: "ssh-honeypot-monitor",
    repoName: "sahaana2005 / ssh-honeypot-monitor",
    url: "https://github.com/sahaana2005/ssh-honeypot-monitor",
    description:
      "Low-interaction SSH trap decoy capturing brute-force intrusion telemetry, malicious payloads, and unauthorized shell interactions with real-time threat monitoring.",
    tags: ["Network Security", "SSH Decoy", "Threat Intel", "Telemetry"],
    accentColor: "#4cc9f0",
    glowColor: "rgba(76, 201, 240, 0.45)",
    coords: { x: "78%", y: "70%", depth: 0.025 },
  },
];

// ── Custom SVG Glyphs ────────────────────────────────────────────────────────
const ProjectGlyph: React.FC<{ id: string; accentColor: string }> = ({ id, accentColor }) => {
  switch (id) {
    case "piggypie":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "100%", height: "100%" }}>
          <ellipse cx="23" cy="26" rx="14" ry="11" />
          <path d="M12 28 C9 30 7 35 9 37 C11 39 15 36 15 35" />
          <path d="M16 16 C16 12 20 12 21 16" />
          <path d="M37 24 C39 23 42 24 42 27 C42 30 39 30 36 29" />
          <circle cx="28" cy="23" r="1.5" fill="currentColor" />
          <path d="M17 37 L17 42 M29 37 L29 42" strokeLinecap="round" />
          <circle cx="23" cy="11" r="5" stroke={accentColor} strokeWidth="2.2" />
          <path d="M23 8.5 L23 13.5" stroke={accentColor} strokeLinecap="round" />
        </svg>
      );
    case "plant-ai":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "100%", height: "100%" }}>
          <path d="M14 34 C12 22 23 13 35 12 C35 24 26 35 14 34 Z" />
          <path d="M14 34 C21 28 27 21 35 12" strokeLinecap="round" />
          <path d="M6 14 L6 6 L14 6 M42 14 L42 6 L34 6 M6 34 L6 42 L14 42 M42 34 L42 42 L34 42" stroke={accentColor} strokeLinecap="round" />
          <line x1="4" y1="24" x2="44" y2="24" stroke={accentColor} strokeDasharray="3 3" opacity="0.75" />
        </svg>
      );
    case "sofasogood":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "100%", height: "100%" }}>
          <path d="M9 22 C9 17 12 15 16 15 L32 15 C36 15 39 17 39 22" />
          <path d="M6 23 C6 21 8 20 10 20 L10 32 L6 32 Z" />
          <path d="M38 20 C40 20 42 21 42 23 L42 32 L38 32 Z" />
          <rect x="9" y="24" width="30" height="9" rx="2" />
          <line x1="12" y1="33" x2="10" y2="38" strokeLinecap="round" />
          <line x1="36" y1="33" x2="38" y2="38" strokeLinecap="round" />
        </svg>
      );
    case "sqlisquid":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "100%", height: "100%" }}>
          <path d="M16 19 C16 11 20 7 24 7 C28 7 32 11 32 19 L32 26 L16 26 Z" />
          <circle cx="20" cy="18" r="1.5" fill={accentColor} />
          <circle cx="28" cy="18" r="1.5" fill={accentColor} />
          <path d="M17 26 C15 31 13 36 15 40 M21 26 C21 33 20 37 22 41 M27 26 C27 33 28 37 26 41 M31 26 C33 31 35 36 33 40" strokeLinecap="round" />
          <path d="M7 10 L24 4 L41 10 L41 22 C41 33 24 42 24 42 C24 42 7 33 7 22 Z" stroke={accentColor} opacity="0.45" />
        </svg>
      );
    case "honeypot":
      return (
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: "100%", height: "100%" }}>
          <path d="M24 7 L34 13 L34 25 L24 31 L14 25 L14 13 Z" stroke="#7209b7" />
          <path d="M34 25 L44 31 L44 43 L34 49 L24 43 L24 31 Z" stroke="#f72585" opacity="0.5" />
          <path d="M14 25 L24 31 L24 43 L14 49 L4 43 L4 31 Z" stroke={accentColor} opacity="0.5" />
          <circle cx="24" cy="19" r="3" fill={accentColor} />
          <path d="M24 10 L24 13 M31 16 L29 17 M31 22 L29 21 M17 16 L19 17 M17 22 L19 21" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

// ── Floating OS Window Component (Multi-Window + Draggable) ───────────────────
interface OpenWindow {
  project: ProjectItem;
  x: number;
  y: number;
  zIndex: number;
}

function OsWindow({
  item,
  isTop,
  onClose,
  onFocus,
}: {
  item: OpenWindow;
  isTop: boolean;
  onClose: () => void;
  onFocus: () => void;
}) {
  const [pos, setPos] = React.useState({ x: item.x, y: item.y });
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag by the header bar
    if ((e.target as HTMLElement).closest(".pm-win-controls")) return;
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

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPos({
      x: Math.max(12, Math.min(window.innerWidth - 440, dragStart.current.initialX + dx)),
      y: Math.max(50, Math.min(window.innerHeight - 150, dragStart.current.initialY + dy)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 15 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseDown={onFocus}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: item.zIndex,
        width: 430,
        maxWidth: "calc(100vw - 32px)",
        backgroundColor: "rgba(18, 9, 32, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "12px",
        border: `1px solid ${isTop ? item.project.accentColor : "rgba(255, 77, 166, 0.25)"}`,
        boxShadow: isTop
          ? `0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px ${item.project.glowColor}`
          : "0 18px 45px rgba(0, 0, 0, 0.75)",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Titlebar (Draggable Handle) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <div className="pm-win-controls" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
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
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#ffbd2e",
              border: "none",
              padding: 0,
            }}
          >
            <Minus size={7} color="#452a00" strokeWidth={3} />
          </button>
          <button
            type="button"
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#27c93f",
              border: "none",
              padding: 0,
            }}
          >
            <Square size={6} color="#003500" strokeWidth={3} />
          </button>
        </div>

        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "0.78rem",
            color: isTop ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
            fontWeight: 500,
            letterSpacing: "0.02em",
          }}
        >
          {item.project.repoName}
        </span>
      </div>

      {/* Body Content */}
      <div style={{ padding: "20px" }}>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "0.92rem",
            lineHeight: 1.6,
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {item.project.description}
        </p>

        {/* Tech Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "22px" }}>
          {item.project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "0.72rem",
                fontFamily: "'Courier New', monospace",
                padding: "3px 9px",
                borderRadius: "100px",
                backgroundColor: "rgba(247, 37, 133, 0.12)",
                color: item.project.accentColor,
                border: `1px solid ${item.project.glowColor}`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a
            href={item.project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              background: `linear-gradient(135deg, ${item.project.accentColor}, #7209b7)`,
              color: "#ffffff",
              borderRadius: "7px",
              fontSize: "0.82rem",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: `0 4px 16px ${item.project.glowColor}`,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 6px 24px ${item.project.glowColor}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 16px ${item.project.glowColor}`;
            }}
          >
            <span>Open in GitHub</span>
            <ExternalLink size={14} strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Projects Page Component ─────────────────────────────────────────────
export default function ProjectsPage({
  isVisible,
  onBack,
  onContactClick,
}: ProjectsPageProps) {
  // Sequence stages: "glitch" -> "booting" -> "desktop"
  const [stage, setStage] = React.useState<"idle" | "glitch" | "booting" | "desktop">("idle");
  const [terminalOutput, setTerminalOutput] = React.useState("");
  const [openWindows, setOpenWindows] = React.useState<OpenWindow[]>([]);
  const [topZ, setTopZ] = React.useState(100);
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
  const [clock, setClock] = React.useState("12:00:00");

  // System clock
  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toTimeString().split(" ")[0]);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mouse Parallax on Desktop
  React.useEffect(() => {
    if (!isVisible || stage !== "desktop") return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - window.innerWidth / 2) * 0.05;
      const dy = (e.clientY - window.innerHeight / 2) * 0.05;
      setMouseOffset({ x: dx, y: dy });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isVisible, stage]);

  // Transition sequence trigger
  React.useEffect(() => {
    if (!isVisible) {
      setStage("idle");
      setOpenWindows([]);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setStage("desktop");
      return;
    }

    // Stage 1: Glitch scanline flicker (200ms)
    setStage("glitch");
    const glitchTimer = setTimeout(() => {
      // Stage 2: Terminal typewriter boot (~1.4s)
      setStage("booting");
      const lines = [
        "> booting projects.sys...",
        "> 5 modules found",
        "> access granted",
      ];
      const fullText = lines.join("\n");
      let charIdx = 0;
      setTerminalOutput("");

      const typeInterval = setInterval(() => {
        if (charIdx < fullText.length) {
          setTerminalOutput((prev) => prev + fullText[charIdx]);
          charIdx++;
        } else {
          clearInterval(typeInterval);
          // Stage 3: Dissolve terminal, transition to desktop
          setTimeout(() => {
            setStage("desktop");
          }, 300);
        }
      }, 26);
    }, 200);

    return () => {
      clearTimeout(glitchTimer);
    };
  }, [isVisible]);

  // Window Management
  const handleOpenProject = (project: ProjectItem) => {
    // If already open, bring to front
    const exists = openWindows.find((w) => w.project.id === project.id);
    if (exists) {
      handleFocusWindow(project.id);
      return;
    }

    const nextZ = topZ + 1;
    setTopZ(nextZ);

    const winWidth = Math.min(430, window.innerWidth - 32);
    const initialX = Math.max(16, (window.innerWidth - winWidth) / 2 + (openWindows.length * 24 - 40));
    const initialY = Math.max(70, window.innerHeight * 0.22 + (openWindows.length * 20 - 30));

    setOpenWindows((prev) => [
      ...prev,
      {
        project,
        x: initialX,
        y: initialY,
        zIndex: nextZ,
      },
    ]);
  };

  const handleCloseWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.project.id !== id));
  };

  const handleFocusWindow = (id: string) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setOpenWindows((prev) =>
      prev.map((w) => (w.project.id === id ? { ...w, zIndex: nextZ } : w))
    );
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#080310",
        color: "#ffffff",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── 1. GLITCH / SCANLINE FLICKER (150-250ms) ── */}
      {stage === "glitch" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1000,
            background:
              "repeating-linear-gradient(0deg, rgba(255, 0, 128, 0.2) 0px, rgba(0, 255, 200, 0.2) 2px, transparent 2px, transparent 4px)",
            boxShadow: "inset 0 0 100px rgba(255, 0, 128, 0.7)",
            animation: "pmGlitchFlicker 200ms steps(3) forwards",
          }}
        />
      )}

      {/* ── 2. TERMINAL BOOT TYPEWRITER ── */}
      <AnimatePresence>
        {stage === "booting" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#080310",
            }}
          >
            <div
              style={{
                width: "90%",
                maxWidth: 520,
                background: "rgba(13, 6, 22, 0.95)",
                border: "1px solid rgba(255, 77, 166, 0.3)",
                borderRadius: 10,
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(247, 37, 133, 0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.04)",
                  borderBottom: "1px solid rgba(255, 77, 166, 0.15)",
                }}
              >
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56" }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c93f" }} />
                <span
                  style={{
                    marginLeft: 8,
                    fontFamily: "'Courier New', monospace",
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  terminal://kernel/boot.sys
                </span>
              </div>
              <div
                style={{
                  padding: "24px 28px",
                  minHeight: 120,
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                  color: "#00ffc8",
                  textShadow: "0 0 8px rgba(0, 255, 200, 0.6)",
                  whiteSpace: "pre-line",
                }}
              >
                {terminalOutput}
                <span style={{ display: "inline-block", color: "#f72585", marginLeft: 4 }}>_</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3. PROJECTS DESKTOP (Dark Moody Grid & Floating Icons) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "desktop" ? 1 : 0 }}
        transition={{ duration: 0.45 }}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: stage === "desktop" ? "block" : "none",
        }}
      >
        {/* Background Grids & Radial Glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(247, 37, 133, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 37, 133, 0.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 50% 50%, rgba(114, 9, 183, 0.25) 0%, rgba(8, 3, 16, 0.95) 75%)",
          }}
        />

        {/* Top OS Menu Bar */}
        <header
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 44,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 22px",
            background: "rgba(13, 6, 22, 0.75)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255, 77, 166, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#f72585", textShadow: "0 0 10px #f72585", fontSize: "1rem" }}>✦</span>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.85rem",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              sys.projects
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                padding: "2px 8px",
                background: "rgba(0, 255, 200, 0.12)",
                color: "#00ffc8",
                border: "1px solid rgba(0, 255, 200, 0.35)",
                borderRadius: 12,
              }}
            >
              ● 5 modules online
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: "0.8rem",
                color: "rgba(255, 255, 255, 0.45)",
              }}
            >
              {clock}
            </span>
            {onContactClick && (
              <button
                type="button"
                onClick={onContactClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "rgba(247, 37, 133, 0.15)",
                  border: "1px solid rgba(247, 37, 133, 0.4)",
                  borderRadius: 6,
                  color: "#ff6bb3",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 0 10px rgba(247, 37, 133, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(247, 37, 133, 0.35)";
                  e.currentTarget.style.boxShadow = "0 0 15px rgba(247, 37, 133, 0.5)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(247, 37, 133, 0.15)";
                  e.currentTarget.style.boxShadow = "0 0 10px rgba(247, 37, 133, 0.2)";
                  e.currentTarget.style.color = "#ff6bb3";
                }}
                title="Say Hi / Open Contact Card"
              >
                <span>Say Hi</span>
                <span>✉</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: 6,
                color: "#ffffff",
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(247, 37, 133, 0.25)";
                e.currentTarget.style.borderColor = "#f72585";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(247, 37, 133, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                e.currentTarget.style.boxShadow = "none";
              }}
              title="Return to 3D Room"
            >
              <X size={13} strokeWidth={2.4} />
              <span>Eject</span>
            </button>
          </div>
        </header>

        {/* ── Desktop Canvas with 5 Floating Icons ── */}
        <main
          style={{
            position: "absolute",
            inset: "44px 0 0 0",
            zIndex: 10,
          }}
        >
          {PROJECTS.map((proj) => {
            const tx = mouseOffset.x * proj.coords.depth;
            const ty = mouseOffset.y * proj.coords.depth;

            return (
              <div
                key={proj.id}
                onClick={() => handleOpenProject(proj)}
                style={{
                  position: "absolute",
                  left: proj.coords.x,
                  top: proj.coords.y,
                  transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`,
                  cursor: "crosshair",
                  transition: "transform 0.12s ease-out",
                }}
              >
                <div
                  className="project-desktop-icon"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    background: "rgba(22, 10, 38, 0.4)",
                    border: "1px solid transparent",
                    transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(36, 16, 62, 0.75)";
                    e.currentTarget.style.borderColor = proj.accentColor;
                    e.currentTarget.style.transform = "translateY(-6px) scale(1.05)";
                    e.currentTarget.style.boxShadow = `0 14px 30px rgba(0, 0, 0, 0.6), 0 0 24px ${proj.glowColor}`;
                    const badge = e.currentTarget.querySelector(".icon-badge") as HTMLElement;
                    if (badge) badge.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(22, 10, 38, 0.4)";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                    const badge = e.currentTarget.querySelector(".icon-badge") as HTMLElement;
                    if (badge) badge.style.opacity = "0";
                  }}
                >
                  {/* Custom Glyph Card */}
                  <div
                    style={{
                      width: 66,
                      height: 66,
                      borderRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 14,
                      background: "linear-gradient(135deg, rgba(32, 14, 56, 0.85), rgba(15, 6, 27, 0.95))",
                      border: `1.5px solid ${proj.accentColor}`,
                      boxShadow: `0 10px 24px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)`,
                    }}
                  >
                    <ProjectGlyph id={proj.id} accentColor={proj.accentColor} />
                  </div>

                  <span
                    style={{
                      marginTop: 9,
                      fontSize: "0.82rem",
                      fontWeight: 500,
                      color: "#ffffff",
                      textShadow: "0 1px 4px rgba(0, 0, 0, 0.8)",
                      maxWidth: 110,
                      textAlign: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    {proj.name}
                  </span>

                  <span
                    className="icon-badge"
                    style={{
                      marginTop: 4,
                      fontFamily: "'Courier New', monospace",
                      fontSize: "0.65rem",
                      color: proj.accentColor,
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    click to open
                  </span>
                </div>
              </div>
            );
          })}
        </main>

        {/* ── Windows Layer (Multi-window support) ── */}
        <div
          style={{
            position: "absolute",
            inset: "44px 0 0 0",
            pointerEvents: "none",
            zIndex: 30,
          }}
        >
          <AnimatePresence>
            {openWindows.map((win) => {
              const isTop = win.zIndex === topZ;
              return (
                <OsWindow
                  key={win.project.id}
                  item={win}
                  isTop={isTop}
                  onClose={() => handleCloseWindow(win.project.id)}
                  onFocus={() => handleFocusWindow(win.project.id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
