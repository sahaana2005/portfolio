import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterHero from "./CharacterHero";
import ProjectsPage from "./ProjectsPage";
import { ArrowLeft, Orbit } from "lucide-react";

// Dynamically split Spline runtime chunk, but trigger early preload immediately on app mount
const Spline = React.lazy(() => import("@splinetool/react-spline"));
const ContactPhone = React.lazy(() => import("./ContactPhone"));
const CANVA_ABOUT_URL = "https://saana07.my.canva.site/";

// ── Laptop object names to watch for in the Spline scene ────────────────────
// These will be matched case-insensitively. Adjust if the exact name differs.
const LAPTOP_OBJECT_NAMES = [
  "Laptop", "laptop", "MacBook", "macbook", "Computer", "computer",
  "PC", "Mac", "mac", "Screen", "screen", "Monitor", "monitor",
  "Desk", "desk", "Room", "room", "Object", "object", "Mesh", "mesh",
  "Keyboard", "keyboard", "Table", "table", "Device", "device",
];

export interface EyeCoordinates {
  /** Relative horizontal center of her eyes inside the 720px source image (0.0 - 1.0) */
  imageXRatio?: number;
  /** Relative vertical center of her eyes inside the 1280px source image (0.0 - 1.0) */
  imageYRatio?: number;
  /** Custom CSS transformOrigin string override if desired (e.g. "50% 31%" or "960px 290px") */
  customOrigin?: string;
}

/**
 * Default calibrated eye coordinates from the character portrait (720x1280 source).
 * Measured eye center is at (350.5px, 401.5px) -> x: ~48.68%, y: ~31.37%.
 */
export const DEFAULT_EYE_COORDINATES: Required<Omit<EyeCoordinates, "customOrigin">> = {
  imageXRatio: 0.4868,
  imageYRatio: 0.3137,
};

export type TransitionPhase =
  | "idle"              // Normal Hero view, Spline loading/paused in background
  | "zooming"           // Zooming deeply into character's eyes
  | "holding"           // Holding in deep iris veil if Spline is still initializing
  | "crossfading"       // Seamless crossfade from zoomed hero into 3D Spline scene
  | "spline-active"     // Full interactive 3D room with orbit controls & back button
  | "reversing"         // Smooth zoom-out and crossfade back to Hero
  | "laptop-zooming"    // CSS zoom on Spline canvas towards laptop screen position
  | "projects-fading"   // Crossfade from Spline to Projects page (through black)
  | "projects-active"   // Projects page is visible & interactive
  | "projects-reversing"; // Fade Projects back to Spline room

export interface HeroToSplineTransitionProps {
  splineUrl?: string;
  eyeCoordinates?: EyeCoordinates;
  zoomScale?: number;
  zoomDuration?: number;
  crossfadeDuration?: number;
  reverseDuration?: number;
  irisVeilColor?: string;
  onPhaseChange?: (phase: TransitionPhase) => void;
}

export function getHeroEyeScreenCoords(
  w = typeof window !== "undefined" ? window.innerWidth : 1920,
  h = typeof window !== "undefined" ? window.innerHeight : 1080,
  coords: EyeCoordinates = DEFAULT_EYE_COORDINATES
): { x: number; y: number; originString: string } {
  if (coords.customOrigin) {
    return { x: w / 2, y: h * 0.31, originString: coords.customOrigin };
  }

  const imgW = 720;
  const imgH = 1280;
  let scale: number;
  if (w / h > imgW / imgH) {
    scale = (h / imgH) * 1.06;
  } else {
    scale = (w / imgW) * 1.02;
  }

  const renderW = imgW * scale;
  const renderH = imgH * scale;
  const renderX = (w - renderW) / 2;
  const renderY = h - renderH;

  const ratioX = coords.imageXRatio ?? DEFAULT_EYE_COORDINATES.imageXRatio;
  const ratioY = coords.imageYRatio ?? DEFAULT_EYE_COORDINATES.imageYRatio;

  const eyeX = Math.round(renderX + renderW * ratioX);
  const eyeY = Math.round(renderY + renderH * ratioY);

  return { x: eyeX, y: eyeY, originString: `${eyeX}px ${eyeY}px` };
}

// ── Laptop screen position in viewport (calibrated to character's laptop in Spline room)
// Used as the transform-origin when zooming into the laptop screen
const LAPTOP_SCREEN = { x: "18%", y: "84%" } as const;

export default function HeroToSplineTransition({
  splineUrl = "https://prod.spline.design/eLLqXafDmfLEYwW4/scene.splinecode",
  eyeCoordinates = DEFAULT_EYE_COORDINATES,
  zoomScale = 11,
  zoomDuration = 0.85,
  crossfadeDuration = 0.35,
  reverseDuration = 0.75,
  irisVeilColor = "#0e090c",
  onPhaseChange,
}: HeroToSplineTransitionProps) {
  const isDirectProjects = typeof window !== "undefined" && window.location.search.includes("projects");
  const [phase, setPhase] = React.useState<TransitionPhase>(isDirectProjects ? "projects-active" : "idle");
  const [splineReady, setSplineReady] = React.useState(false);
  const [showSplineBadge, setShowSplineBadge] = React.useState(true);
  const [laptopHovered, setLaptopHovered] = React.useState(false);
  // Dynamic laptop screen position (calibrated to the laptop held by the character)
  const [laptopOrigin, setLaptopOrigin] = React.useState(`${LAPTOP_SCREEN.x} ${LAPTOP_SCREEN.y}`);
  const [showProjectsHint, setShowProjectsHint] = React.useState(true);
  const [isLaptopClicked, setIsLaptopClicked] = React.useState(false);
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  // About navigates to Canva in the same tab — browser Back returns to portfolio

  const splineAppRef = React.useRef<any>(null);
  const pendingTransitionRef = React.useRef(false);
  const timeoutsRef = React.useRef<number[]>([]);
  const splineContainerRef = React.useRef<HTMLDivElement>(null);

  const [eyeOrigin, setEyeOrigin] = React.useState<{ x: number; y: number; originString: string }>(() =>
    getHeroEyeScreenCoords(
      typeof window !== "undefined" ? window.innerWidth : 1920,
      typeof window !== "undefined" ? window.innerHeight : 1080,
      eyeCoordinates
    )
  );

  const updateEyePosition = React.useCallback(() => {
    setEyeOrigin(getHeroEyeScreenCoords(window.innerWidth, window.innerHeight, eyeCoordinates));
  }, [eyeCoordinates]);

  React.useEffect(() => {
    window.addEventListener("resize", updateEyePosition);
    return () => window.removeEventListener("resize", updateEyePosition);
  }, [updateEyePosition]);

  React.useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const addTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  };

  React.useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // Early chunk preload
  React.useEffect(() => {
    import("@splinetool/react-spline").catch(() => {});
  }, []);

  // Remove Spline watermark badge if injected
  React.useEffect(() => {
    const removeSplineBadge = () => {
      // 1. Check known selectors
      const selectors = [
        '#spline',
        '#spline-badge',
        'a[href*="spline.design"]',
        'a[href*="spline.com"]',
        'a[href*="spline"]',
        '.spline-watermark',
        '[class*="spline-watermark"]',
        '[aria-label*="Spline"]',
      ];
      document.querySelectorAll(selectors.join(',')).forEach((el) => {
        (el as HTMLElement).style.setProperty('display', 'none', 'important');
        try { el.remove(); } catch (_) {}
      });

      // 2. Only check <a> links whose text includes "spline" (avoids matching large parent divs)
      document.querySelectorAll('a').forEach((el) => {
        const txt = el.textContent?.trim().toLowerCase() ?? '';
        if (txt.includes('built with spline') || txt === 'spline') {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          try { el.remove(); } catch (_) {}
        }
      });
    };

    removeSplineBadge();
    const interval = setInterval(removeSplineBadge, 250);
    const observer = new MutationObserver(removeSplineBadge);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // ── Helper: is the event target a laptop object? ─────────────────────────
  const isLaptopObject = (targetName?: string): boolean => {
    if (!targetName) return false;
    const lower = targetName.toLowerCase();
    return LAPTOP_OBJECT_NAMES.some((n) => lower.includes(n.toLowerCase()));
  };

  // ── Projects transition sequence (3.0 seconds total) ───────────────────────
  const triggerLaptopTransition = React.useCallback((forcePhase?: string) => {
    if (forcePhase !== "force" && phase !== "spline-active") return;
    clearAllTimeouts();

    setIsLaptopClicked(true);
    // Step A: Zoom canvas toward laptop screen over 3.0 seconds
    setPhase("laptop-zooming");

    // Step B: After 2400ms, begin fading into the projects OS
    addTimeout(() => {
      setPhase("projects-fading");

      // Pause Spline render AFTER fade begins (keeps frame going during transition)
      addTimeout(() => {
        try {
          if (splineAppRef.current?.stop) splineAppRef.current.stop();
        } catch (_) {}
      }, 300);
    }, 2400);

    // Step C: Exactly 3000ms (3.0s), reveal Projects page!
    addTimeout(() => {
      setPhase("projects-active");
      setIsLaptopClicked(false);
    }, 3000);
  }, [phase]);

  // ── SPLINE LOAD HANDLER ──────────────────────────────────────────────────
  const handleSplineLoaded = React.useCallback((splineApp: any) => {
    splineAppRef.current = splineApp;

    // Log all object names so we can confirm laptop name
    try {
      if (typeof splineApp.getAllObjects === "function") {
        const objs = splineApp.getAllObjects();
        const names = objs.map((o: any) => ({ name: o.name, id: o.id }));
        console.log("SPLINE_OBJECTS:", JSON.stringify(names));

        // Always show hint once scene loads
        setTimeout(() => setShowProjectsHint(true), 1800);
      }
    } catch (e) {
      console.warn("Could not list Spline objects:", e);
    }

    // Pause render loop while hidden
    try {
      if (typeof splineApp.stop === "function") splineApp.stop();
    } catch (_) {}

    setSplineReady(true);

    if (pendingTransitionRef.current) {
      pendingTransitionRef.current = false;
      executeCrossfadeToSpline();
    }
  }, []);

  // ── SPLINE MOUSE DOWN — any click in the room goes to Projects ──────────
  const handleSplineMouseDown = React.useCallback(
    (e: any) => {
      const name: string = e?.target?.name ?? "";
      console.log("Spline mouseDown on:", name, "| phase:", phase);
      // Primary: name matches a known laptop object
      if (isLaptopObject(name)) {
        triggerLaptopTransition();
        return;
      }
      // Fallback: ANY click while in the room triggers the laptop transition.
      // The scene is a private room — any interaction is intentional.
      if (phase === "spline-active") {
        triggerLaptopTransition();
      }
    },
    [triggerLaptopTransition, phase]
  );

  // ── SPLINE MOUSE HOVER — detect laptop hover ─────────────────────────────
  const handleSplineMouseHover = React.useCallback((e: any) => {
    const name: string = e?.target?.name ?? "";
    const isLaptop = isLaptopObject(name);
    setLaptopHovered(isLaptop);

    if (isLaptop && splineContainerRef.current) {
      // Try to get canvas bounding rect and estimate laptop screen coords
      const rect = splineContainerRef.current.getBoundingClientRect();
      if (rect) {
        // We'll use the mouse position as the zoom origin for the laptop zoom
        // This gives a very natural feel – zoom always targets where user is hovering
        const relX = ((e?.clientX ?? rect.width / 2) - rect.left) / rect.width;
        const relY = ((e?.clientY ?? rect.height / 2) - rect.top) / rect.height;
        setLaptopOrigin(`${Math.round(relX * 100)}% ${Math.round(relY * 100)}%`);
      }
    }
  }, []);

  // ── CROSSFADE TO SPLINE ──────────────────────────────────────────────────
  const executeCrossfadeToSpline = React.useCallback(() => {
    try {
      if (splineAppRef.current?.play) splineAppRef.current.play();
    } catch (_) {}

    setPhase("crossfading");
    addTimeout(() => {
      setPhase("spline-active");
    }, crossfadeDuration * 1000);
  }, [crossfadeDuration]);

  // ── LET'S TALK — Hero → Spline ───────────────────────────────────────────
  const handleLetsTalkClick = React.useCallback(() => {
    if (phase !== "idle") return;
    updateEyePosition();
    setPhase("zooming");

    const zoomCrossfadeLead = Math.max(200, Math.round(zoomDuration * 1000 - 220));
    addTimeout(() => {
      if (splineReady) {
        executeCrossfadeToSpline();
      } else {
        setPhase("holding");
        pendingTransitionRef.current = true;
      }
    }, zoomCrossfadeLead);
  }, [phase, updateEyePosition, zoomDuration, splineReady, executeCrossfadeToSpline]);

  // ── BACK: Spline → Hero ───────────────────────────────────────────────────
  const handleBackToHero = React.useCallback(() => {
    if (phase !== "spline-active") return;
    clearAllTimeouts();
    setPhase("reversing");
    setShowProjectsHint(false);

    addTimeout(() => {
      try {
        if (splineAppRef.current?.stop) splineAppRef.current.stop();
      } catch (_) {}
      setPhase("idle");
    }, Math.max(reverseDuration * 1000, crossfadeDuration * 1000));
  }, [phase, reverseDuration, crossfadeDuration]);

  // ── BACK: Projects → Spline ───────────────────────────────────────────────
  const handleBackFromProjects = React.useCallback(() => {
    if (phase !== "projects-active") return;
    clearAllTimeouts();
    setIsLaptopClicked(false);
    setPhase("projects-reversing");

    addTimeout(() => {
      // Resume Spline render BEFORE fade-in to avoid cold-start stutter
      try {
        if (splineAppRef.current?.play) splineAppRef.current.play();
      } catch (_) {}

      addTimeout(() => {
        setPhase("spline-active");
        setShowProjectsHint(false);
        // Re-show hint after a brief moment
        addTimeout(() => setShowProjectsHint(true), 1500);
      }, crossfadeDuration * 1000 + 80);
    }, 60);
  }, [phase, crossfadeDuration]);

  // Derived booleans
  const isHeroMounted = phase !== "spline-active" && !phase.startsWith("projects") && phase !== "laptop-zooming" && phase !== "projects-fading";

  const splineLayerOpacity =
    phase === "spline-active" ||
    phase === "crossfading" ||
    phase === "laptop-zooming"
      ? 1
      : phase === "projects-fading" || phase === "projects-reversing"
      ? 0
      : 0;

  const splineZoomScale = phase === "laptop-zooming" || phase === "projects-fading" ? 8.5 : 1;

  return (
    <div
      className="hero-to-spline-wrapper"
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: irisVeilColor,
      }}
    >
      {/* ── 3D SPLINE SCENE LAYER ── */}
      <div
        ref={splineContainerRef}
        className="spline-scene-layer"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex:
            phase === "spline-active" || phase === "laptop-zooming" ? 30
            : phase === "crossfading" ? 25
            : 1,
          opacity: splineLayerOpacity,
          pointerEvents: phase === "spline-active" ? "auto" : "none",
          willChange: "opacity, transform",
          transition:
            phase === "crossfading"
              ? `opacity ${crossfadeDuration}s cubic-bezier(0.16, 1, 0.3, 1)`
              : phase === "reversing"
              ? `opacity ${crossfadeDuration}s ease-in-out`
              : phase === "laptop-zooming"
              ? "transform 2.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease-out"
              : phase === "projects-fading"
              ? "transform 0.6s ease-in, opacity 0.6s ease-in"
              : phase === "projects-reversing"
              ? `opacity ${crossfadeDuration}s ease-out`
              : "none",
          visibility: splineReady || phase !== "idle" ? "visible" : "hidden",
          // Laptop zoom: scale up toward the laptop screen position
          transform:
            phase === "laptop-zooming" || phase === "projects-fading"
              ? `scale(${splineZoomScale})`
              : "scale(1)",
          transformOrigin:
            phase === "laptop-zooming" || phase === "projects-fading"
              ? laptopOrigin
              : "center center",
        }}
      >
        <React.Suspense fallback={null}>
          <Spline
            scene={splineUrl}
            onLoad={handleSplineLoaded}
            onSplineMouseDown={handleSplineMouseDown}
            onSplineMouseHover={handleSplineMouseHover}
            style={{ width: "100%", height: "100%" }}
          />
        </React.Suspense>

        {/* ── FLOATING CONTROLS FOR ACTIVE SPLINE SCENE ── */}
        {(phase === "spline-active" || phase === "laptop-zooming") && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 40,
            }}
          >
            {/* Return to Hero */}
            <div
              style={{
                position: "absolute",
                top: "1.75rem",
                left: "2rem",
                pointerEvents: phase === "spline-active" ? "auto" : "none",
                opacity: phase === "laptop-zooming" ? 0 : 1,
                transition: "opacity 0.35s ease",
              }}
            >
              <button type="button" onClick={handleBackToHero} className="btn-spline-back" title="Return to Hero">
                <ArrowLeft size={16} strokeWidth={2.2} />
                <span>Return to Hero</span>
              </button>
            </div>


            {/* Top Right: Status Badge & Contact Action */}
            <div
              style={{
                position: "absolute",
                top: "1.75rem",
                right: "2rem",
                pointerEvents: phase === "spline-active" ? "auto" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                opacity: phase === "laptop-zooming" ? 0 : 1,
                transition: "opacity 0.35s ease",
              }}
            >
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.35rem",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, #e01a76 0%, #be185d 100%)",
                  border: "1px solid rgba(224, 26, 118, 0.35)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.03em",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(224, 26, 118, 0.32), 0 2px 6px rgba(0, 0, 0, 0.08)",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(224, 26, 118, 0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(224, 26, 118, 0.32), 0 2px 6px rgba(0, 0, 0, 0.08)";
                }}
                title="Say Hi / Contact Sahaana"
              >
                <span>Say Hi</span>
                <span>✉</span>
              </button>

            </div>

            {/* ── LAPTOP INTERACTIVE HOTSPOT & "CLICK ME" BUTTON ── */}
            {/* Positioned directly on the laptop the girl is holding in the 3D room */}
            <AnimatePresence>
              {showProjectsHint && (phase === "spline-active" || phase === "laptop-zooming") && (
                <div
                  style={{
                    position: "absolute",
                    left: "18%",
                    bottom: "16%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: isLaptopClicked ? "none" : "auto",
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Laptop screen glow & shockwave effects when clicked */}
                  {isLaptopClicked && (
                    <>
                      {/* Shockwave expanding rings from laptop */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 4.8, opacity: 0 }}
                        transition={{ duration: 1.3, repeat: 2, ease: "easeOut" }}
                        style={{
                          position: "absolute",
                          width: "120px",
                          height: "80px",
                          borderRadius: "50%",
                          border: "2px solid #ff2e93",
                          boxShadow: "0 0 30px #ff2e93, inset 0 0 15px #ff2e93",
                          pointerEvents: "none",
                        }}
                      />
                      {/* Radiating screen glow bloom */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{
                          opacity: [0, 0.95, 0.85, 1],
                          scale: [0.6, 1.5, 2.5, 6],
                        }}
                        transition={{ duration: 2.8, ease: "easeInOut" }}
                        style={{
                          position: "absolute",
                          width: "140px",
                          height: "90px",
                          borderRadius: "20px",
                          background:
                            "radial-gradient(ellipse at center, rgba(255, 46, 147, 0.95) 0%, rgba(255, 117, 181, 0.65) 45%, rgba(0, 240, 255, 0.3) 70%, transparent 88%)",
                          filter: "blur(14px)",
                          pointerEvents: "none",
                        }}
                      />
                    </>
                  )}

                  {/* Pulsing rings around laptop while idle */}
                  {!isLaptopClicked && (
                    <motion.div
                      animate={{
                        scale: [1, 1.35, 1],
                        opacity: [0.35, 0.8, 0.35],
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        position: "absolute",
                        width: "130px",
                        height: "75px",
                        borderRadius: "50%",
                        border: "1.5px dashed rgba(255, 46, 147, 0.6)",
                        boxShadow: "0 0 20px rgba(255, 46, 147, 0.35)",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {/* The interactive "Click me" button right on the laptop */}
                  <motion.button
                    type="button"
                    key="laptop-click-btn"
                    onClick={() => triggerLaptopTransition("force")}
                    initial={{ opacity: 0, scale: 0.85, y: 8 }}
                    animate={{
                      opacity: 1,
                      scale: isLaptopClicked ? 0.92 : 1,
                      y: isLaptopClicked ? 0 : [0, -5, 0],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      y: {
                        duration: 2.0,
                        repeat: isLaptopClicked ? 0 : Infinity,
                        ease: "easeInOut",
                      },
                      scale: { duration: 0.2 },
                      opacity: { duration: 0.3 },
                    }}
                    whileHover={
                      !isLaptopClicked
                        ? {
                            scale: 1.08,
                            y: -7,
                            boxShadow: "0 0 35px rgba(255, 46, 147, 0.8), 0 10px 30px rgba(0,0,0,0.7)",
                          }
                        : {}
                    }
                    whileTap={!isLaptopClicked ? { scale: 0.93 } : {}}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.55rem",
                      padding: "0.58rem 1.3rem",
                      borderRadius: "9999px",
                      background: isLaptopClicked
                        ? "linear-gradient(135deg, rgba(255, 46, 147, 0.95) 0%, rgba(190, 24, 93, 0.95) 100%)"
                        : "linear-gradient(135deg, rgba(18, 7, 15, 0.94) 0%, rgba(45, 10, 32, 0.96) 100%)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1.5px solid rgba(255, 46, 147, 0.85)",
                      color: "#ffffff",
                      fontSize: "0.86rem",
                      fontFamily: "'Syne', 'Inter', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      boxShadow: isLaptopClicked
                        ? "0 0 50px rgba(255, 46, 147, 0.95), 0 0 20px #ffffff"
                        : "0 0 24px rgba(255, 46, 147, 0.45), 0 8px 32px rgba(0, 0, 0, 0.65)",
                      cursor: isLaptopClicked ? "default" : "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {/* Glowing beacon ping dot */}
                    <span
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "8px",
                        height: "8px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          backgroundColor: "#ff2e93",
                          animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
                          opacity: 0.75,
                        }}
                      />
                      <span
                        style={{
                          position: "relative",
                          display: "inline-flex",
                          borderRadius: "50%",
                          width: "8px",
                          height: "8px",
                          backgroundColor: "#ffffff",
                          boxShadow: "0 0 6px #ff2e93",
                        }}
                      />
                    </span>

                    <span>{isLaptopClicked ? "Opening..." : "Click me"}</span>

                    {/* Subtle laptop icon */}
                    <span style={{ fontSize: "0.95rem" }}>💻</span>
                  </motion.button>

                  {/* Little indicator badge pointing to laptop lid */}
                  {!isLaptopClicked && (
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        marginTop: "4px",
                        fontSize: "0.64rem",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255, 185, 225, 0.95)",
                        textShadow: "0 0 8px rgba(255, 46, 147, 0.8)",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <span>▼</span>
                      <span>Laptop</span>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* Bottom orbit hint */}
            {showSplineBadge && phase === "spline-active" && (
              <div
                style={{
                  position: "absolute",
                  bottom: "2rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  pointerEvents: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.6rem 1.35rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(14, 9, 12, 0.7)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  fontSize: "0.825rem",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  boxShadow: "0 12px 36px rgba(0, 0, 0, 0.45)",
                }}
              >
                <Orbit size={16} color="#eea3a1" />
                <span>Drag to orbit • Scroll to zoom • Click objects to interact</span>
                <button
                  type="button"
                  onClick={() => setShowSplineBadge(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.5)",
                    cursor: "pointer",
                    fontSize: "14px",
                    marginLeft: "4px",
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Laptop hover cursor indicator */}
            {laptopHovered && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -60%)",
                    background: "rgba(255, 45, 149, 0.9)",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "0.4rem 0.9rem",
                    borderRadius: "9999px",
                    boxShadow: "0 0 18px rgba(255, 45, 149, 0.6)",
                    textTransform: "uppercase",
                  }}
                >
                  Click to explore Projects
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── HERO LAYER WITH FRAMER MOTION CINEMATIC ZOOM ── */}
      <AnimatePresence mode="wait">
        {isHeroMounted && (
          <motion.div
            key="hero-zoom-container"
            className="hero-zoom-container"
            initial={{ scale: 1, opacity: 1 }}
            animate={
              phase === "zooming"
                ? {
                    scale: zoomScale,
                    opacity: 1,
                    transition: { scale: { duration: zoomDuration, ease: [0.6, 0, 0.9, 0.2] } },
                  }
                : phase === "holding"
                ? { scale: zoomScale, opacity: 0, transition: { opacity: { duration: 0.25, ease: "easeOut" } } }
                : phase === "crossfading"
                ? {
                    scale: zoomScale,
                    opacity: 0,
                    transition: { opacity: { duration: crossfadeDuration, ease: [0.16, 1, 0.3, 1] } },
                  }
                : phase === "reversing"
                ? {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      scale: { duration: reverseDuration, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: crossfadeDuration, ease: "easeIn" },
                    },
                  }
                : { scale: 1, opacity: 1, transition: { duration: 0.3 } }
            }
            exit={{
              opacity: 0,
              scale: zoomScale,
              transition: { duration: crossfadeDuration, ease: "easeOut" },
            }}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              transformOrigin: eyeOrigin.originString,
              willChange: "transform, opacity",
              pointerEvents: phase === "idle" ? "auto" : "none",
            }}
          >
            <CharacterHero
              onLetsTalkClick={handleLetsTalkClick}
              onContactClick={() => setIsContactOpen(true)}
              onAboutClick={() => { window.location.href = CANVA_ABOUT_URL; }}
              isSplineReady={splineReady}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PROJECTS PAGE LAYER ── */}
      <ProjectsPage
        isVisible={phase === "projects-active"}
        onBack={handleBackFromProjects}
        onContactClick={() => setIsContactOpen(true)}
      />

      {/* ── INTERACTIVE CONTACT PHONE DROP-IN POPUP ── */}
      <React.Suspense fallback={null}>
        <ContactPhone
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </React.Suspense>

      {/* About navigates directly to the Canva site (same tab) */}
    </div>
  );
}
