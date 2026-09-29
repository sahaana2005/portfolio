import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterHero from "./CharacterHero";
import ProjectsPage from "./ProjectsPage";
import { ArrowLeft, Sparkles, Orbit } from "lucide-react";

// Dynamically split Spline runtime chunk, but trigger early preload immediately on app mount
const Spline = React.lazy(() => import("@splinetool/react-spline"));
const ContactPhone = React.lazy(() => import("./ContactPhone"));
const AboutPage = React.lazy(() => import("./AboutPage"));

// ── Laptop object names to watch for in the Spline scene ────────────────────
// These will be matched case-insensitively. Adjust if the exact name differs.
const LAPTOP_OBJECT_NAMES = ["Laptop", "laptop", "MacBook", "macbook", "Computer", "computer", "PC", "Mac"];

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

// ── Laptop screen position in viewport (approximate %; tune after seeing scene)
// These are the CSS transform-origin percentages used to zoom toward the laptop
const LAPTOP_SCREEN = { x: "50%", y: "42%" } as const;

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
  const [phase, setPhase] = React.useState<TransitionPhase>("idle");
  const [splineReady, setSplineReady] = React.useState(false);
  const [showSplineBadge, setShowSplineBadge] = React.useState(true);
  const [laptopHovered, setLaptopHovered] = React.useState(false);
  // Dynamic laptop screen position (updated on mouseHover event from Spline)
  const [laptopOrigin, setLaptopOrigin] = React.useState(`${LAPTOP_SCREEN.x} ${LAPTOP_SCREEN.y}`);
  const [showProjectsHint, setShowProjectsHint] = React.useState(false);
  const [isContactOpen, setIsContactOpen] = React.useState(false);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

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

  // ── Helper: is the event target a laptop object? ─────────────────────────
  const isLaptopObject = (targetName?: string): boolean => {
    if (!targetName) return false;
    const lower = targetName.toLowerCase();
    return LAPTOP_OBJECT_NAMES.some((n) => lower.includes(n.toLowerCase()));
  };

  // ── Projects transition sequence ─────────────────────────────────────────
  const triggerLaptopTransition = React.useCallback(() => {
    if (phase !== "spline-active") return;
    clearAllTimeouts();

    // Step A: Zoom canvas toward laptop screen over 700ms
    setPhase("laptop-zooming");

    // Step B: After 600ms, begin fading to black
    addTimeout(() => {
      setPhase("projects-fading");

      // Pause Spline render AFTER fade begins (keeps frame going during transition)
      addTimeout(() => {
        try {
          if (splineAppRef.current?.stop) splineAppRef.current.stop();
        } catch (_) {}
      }, (crossfadeDuration * 1000) / 2);

      // Step C: Reveal Projects page once fade completes
      addTimeout(() => {
        setPhase("projects-active");
      }, crossfadeDuration * 1000 + 60);
    }, 680);
  }, [phase, crossfadeDuration]);

  // ── SPLINE LOAD HANDLER ──────────────────────────────────────────────────
  const handleSplineLoaded = React.useCallback((splineApp: any) => {
    splineAppRef.current = splineApp;

    // Log all object names so we can confirm laptop name
    try {
      if (typeof splineApp.getAllObjects === "function") {
        const objs = splineApp.getAllObjects();
        const names = objs.map((o: any) => ({ name: o.name, id: o.id }));
        console.log("SPLINE_OBJECTS:", JSON.stringify(names));

        // Show hint badge if we detect a laptop object
        const hasLaptop = names.some((o: any) => isLaptopObject(o.name));
        if (hasLaptop) {
          console.log("✓ Laptop object found in scene");
          setTimeout(() => setShowProjectsHint(true), 2500);
        } else {
          // Fallback: always show laptop hint since scene has clickable objects
          setTimeout(() => setShowProjectsHint(true), 2500);
        }
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

  // ── SPLINE MOUSE DOWN — detect laptop click ──────────────────────────────
  const handleSplineMouseDown = React.useCallback(
    (e: any) => {
      const name: string = e?.target?.name ?? "";
      console.log("Spline mouseDown on:", name);
      if (isLaptopObject(name)) {
        triggerLaptopTransition();
      }
    },
    [triggerLaptopTransition]
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
        addTimeout(() => setShowProjectsHint(true), 3000);
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

  const splineZoomScale = phase === "laptop-zooming" || phase === "projects-fading" ? 7 : 1;

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
              : phase === "projects-fading"
              ? `opacity ${crossfadeDuration}s ease-in`
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
        {phase === "spline-active" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 40,
            }}
          >
            {/* Return to Hero */}
            <div style={{ position: "absolute", top: "1.75rem", left: "2rem", pointerEvents: "auto" }}>
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
                pointerEvents: "auto",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.55rem 1.15rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(247, 37, 133, 0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(247, 37, 133, 0.4)",
                  color: "#ffffff",
                  fontSize: "0.8rem",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.04em",
                  fontWeight: 600,
                  boxShadow: "0 0 16px rgba(247, 37, 133, 0.3), 0 8px 24px rgba(0, 0, 0, 0.25)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(247, 37, 133, 0.35)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(247, 37, 133, 0.55)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(247, 37, 133, 0.18)";
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(247, 37, 133, 0.3), 0 8px 24px rgba(0, 0, 0, 0.25)";
                  e.currentTarget.style.transform = "none";
                }}
                title="Say Hi / Contact Sahaana"
              >
                <span>Say Hi</span>
                <span>✉</span>
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.8rem",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.05em",
                  fontWeight: 500,
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Sparkles size={14} color="#eea3a1" />
                <span>3D INTERACTIVE ROOM</span>
              </div>
            </div>

            {/* Laptop hint badge */}
            {showProjectsHint && (
              <AnimatePresence>
                <motion.div
                  key="laptop-hint"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "5.5rem",
                    left: "50%",
                    transform: "translateX(-50%)",
                    pointerEvents: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.55rem",
                    padding: "0.55rem 1.25rem",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(255, 45, 149, 0.12)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 45, 149, 0.45)",
                    color: "#ff2d95",
                    fontSize: "0.8rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    boxShadow: "0 0 24px rgba(255, 45, 149, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                  onClick={triggerLaptopTransition}
                >
                  <span>💻</span>
                  <span>Click the laptop to view Projects</span>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Bottom orbit hint */}
            {showSplineBadge && (
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
              onAboutClick={() => setIsAboutOpen(true)}
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

      {/* ── ABOUT PAGE OVERLAY ── */}
      <React.Suspense fallback={null}>
        <AboutPage
          isVisible={isAboutOpen}
          onBack={() => setIsAboutOpen(false)}
          onContactClick={() => setIsContactOpen(true)}
        />
      </React.Suspense>
    </div>
  );
}
