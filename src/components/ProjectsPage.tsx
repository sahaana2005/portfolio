import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectsDesktop } from "./projects/ProjectsDesktop";

interface ProjectsPageProps {
  isVisible: boolean;
  onBack: () => void;
  onContactClick?: () => void;
}

export default function ProjectsPage({
  isVisible,
  onBack,
  onContactClick,
}: ProjectsPageProps) {
  const isDirectProjects = typeof window !== "undefined" && window.location.search.includes("projects");
  // Sequence stages: "glitch" -> "booting" -> "desktop"
  const [stage, setStage] = React.useState<"idle" | "glitch" | "booting" | "desktop">(
    isDirectProjects ? "desktop" : "idle"
  );
  const [terminalOutput, setTerminalOutput] = React.useState("");

  // Transition sequence trigger
  React.useEffect(() => {
    if (!isVisible) {
      setStage("idle");
      return;
    }

    if (isDirectProjects) {
      setStage("desktop");
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
          // Stage 3: Dissolve boot terminal, transition to desktop
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
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
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

      {/* ── 3. KDE PLASMA LINUX DESKTOP (Full-viewport Wallpaper + Pink Folders + Taskbar) ── */}
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
        <ProjectsDesktop
          onBackToRoom={onBack}
          onContactClick={onContactClick}
        />
      </motion.div>
    </div>
  );
}
