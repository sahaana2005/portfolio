import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CharacterHero from "./CharacterHero";
import { ArrowLeft, Sparkles, Orbit } from "lucide-react";

// Dynamically split Spline runtime chunk, but trigger early preload immediately on app mount
const Spline = React.lazy(() => import("@splinetool/react-spline"));

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
  | "idle"          // Normal Hero view, Spline loading/paused in background
  | "zooming"       // Zooming deeply into character's eyes
  | "holding"       // Holding in deep iris veil if Spline is still initializing on slow connections
  | "crossfading"   // Seamless crossfade from zoomed hero into 3D Spline scene
  | "spline-active" // Full interactive 3D room with orbit controls & back button
  | "reversing";    // Smooth zoom-out and crossfade back to Hero

export interface HeroToSplineTransitionProps {
  /** Spline scene runtime URL */
  splineUrl?: string;
  /** Easily adjustable eye coordinates for fine-tuning the zoom focal point */
  eyeCoordinates?: EyeCoordinates;
  /** Scale factor at peak zoom into eyes (default: 11) */
  zoomScale?: number;
  /** Duration of camera push-in in seconds (default: 0.85s) */
  zoomDuration?: number;
  /** Duration of crossfade in seconds (default: 0.35s) */
  crossfadeDuration?: number;
  /** Duration of reverse return transition in seconds (default: 0.75s) */
  reverseDuration?: number;
  /** Deep iris / black veil hex color during transition */
  irisVeilColor?: string;
  /** Optional callback for phase changes */
  onPhaseChange?: (phase: TransitionPhase) => void;
}

/**
 * Dynamically computes screen pixel coordinates for her eyes based on
 * the portrait aspect-fit framing logic used in CharacterHero canvas.
 */
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

  return {
    x: eyeX,
    y: eyeY,
    originString: `${eyeX}px ${eyeY}px`,
  };
}

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

  // References
  const splineAppRef = React.useRef<any>(null);
  const pendingTransitionRef = React.useRef(false);
  const timeoutsRef = React.useRef<number[]>([]);

  // Track eye transform origin
  const [eyeOrigin, setEyeOrigin] = React.useState<{ x: number; y: number; originString: string }>(() =>
    getHeroEyeScreenCoords(
      typeof window !== "undefined" ? window.innerWidth : 1920,
      typeof window !== "undefined" ? window.innerHeight : 1080,
      eyeCoordinates
    )
  );

  const updateEyePosition = React.useCallback(() => {
    setEyeOrigin(
      getHeroEyeScreenCoords(
        window.innerWidth,
        window.innerHeight,
        eyeCoordinates
      )
    );
  }, [eyeCoordinates]);

  React.useEffect(() => {
    window.addEventListener("resize", updateEyePosition);
    return () => window.removeEventListener("resize", updateEyePosition);
  }, [updateEyePosition]);

  // Phase notifier
  React.useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Safe timeout helper
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

  // ── 1. PRELOADING STRATEGY: EARLY IMPORT TRIGGER ────────────────────────
  React.useEffect(() => {
    // Proactively preload the Spline bundle chunk immediately on mount
    import("@splinetool/react-spline").catch((err) => {
      console.warn("Failed to early-load Spline chunk", err);
    });
  }, []);

  // ── 2. SPLINE LOAD HANDLER ─────────────────────────────────────────────
  const handleSplineLoaded = (splineApp: any) => {
    splineAppRef.current = splineApp;

    // PERFORMANCE: Pause internal render loop while hidden to save GPU cycles
    try {
      if (typeof splineApp.stop === "function") {
        splineApp.stop();
      }
    } catch (e) {
      console.warn("Could not pause Spline render loop:", e);
    }

    setSplineReady(true);

    // If user clicked while still loading, immediately trigger the crossfade reveal!
    if (pendingTransitionRef.current) {
      pendingTransitionRef.current = false;
      executeCrossfadeToSpline();
    }
  };

  // ── 3. CROSSFADE EXECUTION ─────────────────────────────────────────────
  const executeCrossfadeToSpline = React.useCallback(() => {
    // PERFORMANCE: Resume Spline render loop BEFORE the crossfade starts so zero stutter
    try {
      if (splineAppRef.current && typeof splineAppRef.current.play === "function") {
        splineAppRef.current.play();
      }
    } catch (e) {
      console.warn("Could not resume Spline render loop:", e);
    }

    setPhase("crossfading");

    // Once crossfade duration completes, transition to interactive spline-active phase
    addTimeout(() => {
      setPhase("spline-active");
    }, crossfadeDuration * 1000);
  }, [crossfadeDuration]);

  // ── 4. TRANSITION TRIGGER ("Let's Talk" Click) ──────────────────────────
  const handleLetsTalkClick = React.useCallback(() => {
    if (phase !== "idle") return;

    // Recalculate exact eye origin right before launch
    updateEyePosition();

    // Step A: Zoom into eyes
    setPhase("zooming");

    // As zoom nears peak (~220ms before zoom end), begin crossfade or hold for slow connection
    const zoomCrossfadeLead = Math.max(200, Math.round(zoomDuration * 1000 - 220));

    addTimeout(() => {
      if (splineReady) {
        executeCrossfadeToSpline();
      } else {
        // Slow connection fallback: hold in deep iris veil without flash or spinner
        setPhase("holding");
        pendingTransitionRef.current = true;
      }
    }, zoomCrossfadeLead);
  }, [phase, updateEyePosition, zoomDuration, splineReady, executeCrossfadeToSpline]);

  // ── 5. REVERSE TRANSITION (Back to Hero) ────────────────────────────────
  const handleBackToHero = React.useCallback(() => {
    if (phase !== "spline-active") return;

    clearAllTimeouts();
    setPhase("reversing");

    // Reverse crossfade & zoom back out to 1x
    addTimeout(() => {
      // Pause Spline again to conserve GPU cycles while on Hero
      try {
        if (splineAppRef.current && typeof splineAppRef.current.stop === "function") {
          splineAppRef.current.stop();
        }
      } catch (e) {
        console.warn("Could not pause Spline on return:", e);
      }

      setPhase("idle");
    }, Math.max(reverseDuration * 1000, crossfadeDuration * 1000));
  }, [phase, reverseDuration, crossfadeDuration]);

  const isHeroMounted = phase !== "spline-active";

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
      {/* ── 3D SPLINE SCENE LAYER (Preloaded in background) ── */}
      <div
        className="spline-scene-layer"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: phase === "spline-active" ? 30 : phase === "crossfading" ? 25 : 1,
          opacity: phase === "spline-active" || phase === "crossfading" ? 1 : 0,
          pointerEvents: phase === "spline-active" ? "auto" : "none",
          // Canvas will-change: opacity to avoid expensive repaint of WebGL
          willChange: "opacity",
          transition:
            phase === "crossfading"
              ? `opacity ${crossfadeDuration}s cubic-bezier(0.16, 1, 0.3, 1)`
              : phase === "reversing"
              ? `opacity ${crossfadeDuration}s ease-in-out`
              : "none",
          visibility: splineReady || phase !== "idle" ? "visible" : "hidden",
        }}
      >
        <React.Suspense fallback={null}>
          <Spline
            scene={splineUrl}
            onLoad={handleSplineLoaded}
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
            {/* Top Navigation Bar: Return to Hero Button */}
            <div
              style={{
                position: "absolute",
                top: "1.75rem",
                left: "2rem",
                pointerEvents: "auto",
              }}
            >
              <button
                type="button"
                onClick={handleBackToHero}
                className="btn-spline-back"
                title="Return to Hero"
              >
                <ArrowLeft size={16} strokeWidth={2.2} />
                <span>Return to Hero</span>
              </button>
            </div>

            {/* Top Right: Status Badge */}
            <div
              style={{
                position: "absolute",
                top: "1.75rem",
                right: "2rem",
                pointerEvents: "auto",
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

            {/* Bottom Orbit / Interaction Hint Badge */}
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
                  transition: "opacity 0.4s ease",
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
                  title="Dismiss hint"
                >
                  ×
                </button>
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
                    transition: {
                      scale: {
                        duration: zoomDuration,
                        // Custom cubic-bezier: starts gentle, accelerates exponentially into camera
                        ease: [0.6, 0, 0.9, 0.2],
                      },
                    },
                  }
                : phase === "holding"
                ? {
                    scale: zoomScale,
                    opacity: 0,
                    transition: {
                      opacity: { duration: 0.25, ease: "easeOut" },
                    },
                  }
                : phase === "crossfading"
                ? {
                    scale: zoomScale,
                    opacity: 0,
                    transition: {
                      opacity: {
                        duration: crossfadeDuration,
                        ease: [0.16, 1, 0.3, 1],
                      },
                    },
                  }
                : phase === "reversing"
                ? {
                    scale: 1,
                    opacity: 1,
                    transition: {
                      scale: {
                        duration: reverseDuration,
                        ease: [0.16, 1, 0.3, 1],
                      },
                      opacity: {
                        duration: crossfadeDuration,
                        ease: "easeIn",
                      },
                    },
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    transition: { duration: 0.3 },
                  }
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
              // Will-change transform on compositor thread
              willChange: "transform, opacity",
              pointerEvents: phase === "idle" ? "auto" : "none",
            }}
          >
            <CharacterHero
              onLetsTalkClick={handleLetsTalkClick}
              isSplineReady={splineReady}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
