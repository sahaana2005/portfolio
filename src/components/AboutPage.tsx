import * as React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowLeft } from "lucide-react";
import DanceBackground from "./about/DanceBackground";
import SkincareBackground from "./about/SkincareBackground";

// Lazily import the beat sections to keep initial bundle small
const AboutCredentials = React.lazy(() => import("./about/AboutCredentials"));
const AboutDance = React.lazy(() => import("./about/AboutDance"));
const AboutSkincare = React.lazy(() => import("./about/AboutSkincare"));

interface AboutPageProps {
  isVisible: boolean;
  onBack: () => void;
  onContactClick?: () => void;
}

// ── Section-to-background thresholds (scroll progress 0–1) ──────────────────
// Each beat takes roughly 1/5 of the page scroll.
// bg opacity values interpolate between:  dark-neon | dance | skincare | dark-neon
//
// scrollY progress range → which bg dominates
// 0.00 – 0.28  →  dark neon (beats 1+2, into credentials)
// 0.28 – 0.45  →  crossfade neon → dance
// 0.45 – 0.60  →  dance fully visible
// 0.60 – 0.72  →  crossfade dance → skincare
// 0.72 – 0.88  →  skincare fully visible
// 0.88 – 1.00  →  crossfade skincare → dark neon (return)

export default function AboutPage({
  isVisible,
  onBack,
  onContactClick,
}: AboutPageProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll value to prevent jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  // ── Dance Background Opacity: peaks at scrollY ≈ 0.45–0.65 ──
  const danceOpacity = useTransform(
    smoothProgress,
    [0.22, 0.38, 0.52, 0.68, 0.78],
    [0, 1, 1, 1, 0]
  );

  // ── Skincare Background Opacity: peaks at scrollY ≈ 0.72–0.88 ──
  const skincareOpacity = useTransform(
    smoothProgress,
    [0.60, 0.75, 0.85, 0.93, 1.0],
    [0, 1, 1, 1, 0]
  );

  // ── Dark Neon Base Opacity (start + end, dimmed in the middle) ──
  const neonBgOpacity = useTransform(
    smoothProgress,
    [0, 0.22, 0.40, 0.65, 0.82, 1.0],
    [1, 1, 0, 0, 0.0, 1]
  );

  // Parallax for intro photo (moves up slowly as user scrolls)
  const introPhotoY = useTransform(smoothProgress, [0, 0.3], [0, -60]);

  // Escape key to close
  React.useEffect(() => {
    if (!isVisible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isVisible, onBack]);

  // Lock scroll on the main document while about page is open
  React.useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="about-page-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 900,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* ════════════════════════════════════════════════════════════
              LAYERED BACKGROUND SYSTEM — scroll-driven crossfades
          ════════════════════════════════════════════════════════════ */}

          {/* Layer 1: Dark Neon Background (site default — top/bottom of page) */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: neonBgOpacity,
              background:
                "radial-gradient(ellipse at 50% 25%, rgba(114, 9, 183, 0.35) 0%, rgba(8, 3, 16, 0.97) 70%)",
              zIndex: 0,
            }}
          />
          {/* Neon grid overlay */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: neonBgOpacity,
              backgroundImage:
                "linear-gradient(rgba(247, 37, 133, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(247, 37, 133, 0.07) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              zIndex: 1,
            }}
          />

          {/* Layer 2: Dance Background — watercolor paper + swaying lotuses */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: danceOpacity,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <DanceBackground />
          </motion.div>

          {/* Layer 3: Skincare Background — glossy serum pool + bubbles */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              opacity: skincareOpacity,
              zIndex: 3,
              pointerEvents: "none",
            }}
          >
            <SkincareBackground />
          </motion.div>

          {/* ════════════════════════════════════════════════════════════
              SCROLLABLE CONTENT
          ════════════════════════════════════════════════════════════ */}
          <div
            ref={containerRef}
            role="main"
            aria-label="About Sahaana"
            style={{
              position: "absolute",
              inset: 0,
              overflowY: "auto",
              overflowX: "hidden",
              scrollBehavior: "smooth",
              zIndex: 10,
              // custom scrollbar
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(247, 37, 133, 0.3) transparent",
            }}
          >
            {/* ── TOP NAV BAR ── */}
            <header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                height: "52px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                background: "rgba(8, 3, 16, 0.5)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1px solid rgba(247, 37, 133, 0.12)",
              }}
            >
              <button
                type="button"
                onClick={onBack}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: 8,
                  color: "rgba(255, 255, 255, 0.88)",
                  fontSize: "0.78rem",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(247, 37, 133, 0.2)";
                  e.currentTarget.style.borderColor = "#f72585";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.88)";
                }}
              >
                <ArrowLeft size={14} strokeWidth={2.2} />
                <span>Back</span>
              </button>

              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.45)",
                }}
              >
                About
              </span>

              {onContactClick && (
                <button
                  type="button"
                  onClick={onContactClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(247, 37, 133, 0.12)",
                    border: "1px solid rgba(247, 37, 133, 0.35)",
                    borderRadius: 8,
                    color: "#ff6bb3",
                    fontSize: "0.78rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    padding: "6px 14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(247, 37, 133, 0.28)";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(247, 37, 133, 0.12)";
                    e.currentTarget.style.color = "#ff6bb3";
                  }}
                >
                  <span>Say Hi</span>
                  <span>✉</span>
                </button>
              )}
            </header>

            {/* ════════════════════════════════════════════════
                BEAT 1 — Greeting Hero
            ════════════════════════════════════════════════ */}
            <section
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "5rem 1.5rem 4rem",
                position: "relative",
              }}
            >
              {/* Ambient neon glow behind Beat 1 */}
              <div
                style={{
                  position: "absolute",
                  top: "20%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "600px",
                  height: "400px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse, rgba(247, 37, 133, 0.18) 0%, rgba(114, 9, 183, 0.12) 50%, transparent 75%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                }}
              />

              {/* Intro Photo with parallax lift */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "relative",
                  y: introPhotoY,
                }}
              >
                <div
                  style={{
                    width: "min(380px, 82vw)",
                    height: "min(480px, 63vh)",
                    borderRadius: "28px",
                    overflow: "hidden",
                    boxShadow:
                      "0 28px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(247, 37, 133, 0.25), 0 0 0 1px rgba(255, 77, 166, 0.3)",
                  }}
                >
                  <img
                    src="/about/intro_beach.jpg"
                    alt="Sahaana at the beach — intro"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 35%",
                    }}
                  />
                  {/* Gradient vignette bottom */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent 55%, rgba(8, 3, 16, 0.75) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </motion.div>

              {/* Greeting Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ textAlign: "center", marginTop: "2.5rem" }}
              >
                <h1
                  style={{
                    fontFamily: "'Syne', 'Inter', sans-serif",
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.025em",
                    margin: 0,
                    lineHeight: 1.1,
                    textShadow:
                      "0 0 30px rgba(247, 37, 133, 0.5), 0 0 60px rgba(247, 37, 133, 0.25)",
                  }}
                >
                  hey y&apos;all, I&apos;m{" "}
                  <span
                    style={{
                      fontFamily: "'Dancing Script', cursive",
                      color: "#f9a8c9",
                      fontWeight: 700,
                      fontSize: "1.15em",
                    }}
                  >
                    Saana.
                  </span>
                </h1>

                {/* Scroll prompt */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    marginTop: "2.5rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                    color: "rgba(255, 255, 255, 0.4)",
                    fontSize: "0.72rem",
                    fontFamily: "'Inter', sans-serif",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Scroll to explore</span>
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <rect x="7" y="3" width="2" height="7" rx="1" fill="currentColor" />
                    <path d="M4 14 L8 20 L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </motion.div>
            </section>

            {/* ════════════════════════════════════════════════
                BEAT 2 — Personal Blurb
            ════════════════════════════════════════════════ */}
            <section
              style={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5rem 2rem",
              }}
            >
              <div style={{ maxWidth: "720px", textAlign: "center" }}>
                <motion.p
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1.2rem, 2.8vw, 1.8rem)",
                    fontWeight: 300,
                    color: "rgba(255, 255, 255, 0.82)",
                    lineHeight: 1.75,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Computer scientist by training, designer by inclination, and someone who{" "}
                  <span style={{ color: "#f9a8c9", fontWeight: 500 }}>
                    genuinely loves being curious
                  </span>{" "}
                  about how everything works — from network packets to skin barriers.
                </motion.p>
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                BEAT 3 — Credentials (Dark Neon)
            ════════════════════════════════════════════════ */}
            <React.Suspense fallback={null}>
              <AboutCredentials />
            </React.Suspense>

            {/* ════════════════════════════════════════════════
                BEAT 4 — Dance (Blush Watercolor + Lotus)
            ════════════════════════════════════════════════ */}
            <React.Suspense fallback={null}>
              <AboutDance />
            </React.Suspense>

            {/* ════════════════════════════════════════════════
                BEAT 5 — Skincare (Serum Droplet Field)
            ════════════════════════════════════════════════ */}
            <React.Suspense fallback={null}>
              <AboutSkincare />
            </React.Suspense>

            {/* ════════════════════════════════════════════════
                BEAT 6 — Closing / Back to Work prompt
            ════════════════════════════════════════════════ */}
            <section
              style={{
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "5rem 2rem",
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.6)",
                    marginBottom: "2rem",
                  }}
                >
                  That&apos;s a bit of me. Curious about the work?
                </p>
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.8rem 2rem",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #f72585 0%, #7209b7 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(247, 37, 133, 0.45)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(247, 37, 133, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(247, 37, 133, 0.45)";
                  }}
                >
                  <ArrowLeft size={16} strokeWidth={2.2} />
                  Back to Site
                </button>
              </motion.div>
            </section>

            {/* Bottom spacer */}
            <div style={{ height: "2rem" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
