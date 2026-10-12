import * as React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import { ArrowLeft } from "lucide-react";

// Lazily import the beat sections to keep initial bundle small
const AboutCredentials = React.lazy(() => import("./about/AboutCredentials"));
const AboutDance = React.lazy(() => import("./about/AboutDance"));
const AboutSkincare = React.lazy(() => import("./about/AboutSkincare"));

interface AboutPageProps {
  isVisible: boolean;
  onBack: () => void;
  onContactClick?: () => void;
}

// Spring-pop animation for speech bubbles: scale 0 -> 1.05 -> 1 with fade-in under 400ms
const bubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 480,
      damping: 24,
      mass: 0.7,
      duration: 0.35,
    },
  },
};

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

  // Parallax for intro photo (moves up slowly as user scrolls)
  const introPhotoY = useTransform(smoothProgress, [0, 0.3], [0, -50]);

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
          transition={{ duration: 0.45, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 900,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "#f5cad1", // 100% opaque light blush-pink base
          }}
        >
          {/* ════════════════════════════════════════════════════════════
              BASE BACKGROUND: Light Pink Wavy Texture across the whole page
          ════════════════════════════════════════════════════════════ */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#f5cad1",
              backgroundImage: "url('/about/pink_wavy_texture.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "repeat-y",
              zIndex: 0,
            }}
          />

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
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(219, 39, 119, 0.4) transparent",
            }}
          >
            {/* ── TOP NAV BAR (Light frosted glass matching the light pink aesthetic) ── */}
            <header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                height: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                background: "rgba(255, 245, 248, 0.85)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: "1px solid rgba(220, 100, 140, 0.22)",
                boxShadow: "0 4px 16px rgba(180, 60, 100, 0.05)",
              }}
            >
              <button
                type="button"
                onClick={onBack}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(220, 100, 140, 0.3)",
                  borderRadius: 10,
                  color: "#541422",
                  fontSize: "0.8rem",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  padding: "7px 16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(180, 60, 100, 0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f72585";
                  e.currentTarget.style.borderColor = "#f72585";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.borderColor = "rgba(220, 100, 140, 0.3)";
                  e.currentTarget.style.color = "#541422";
                }}
              >
                <ArrowLeft size={15} strokeWidth={2.4} />
                <span>Back</span>
              </button>

              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#831843",
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
                    borderRadius: 10,
                    color: "#be185d",
                    fontSize: "0.8rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    padding: "7px 16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f72585";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(247, 37, 133, 0.12)";
                    e.currentTarget.style.color = "#be185d";
                  }}
                >
                  <span>Say Hi</span>
                  <span>✉</span>
                </button>
              )}
            </header>

            {/* ════════════════════════════════════════════════
                BEAT 1 — Greeting Hero (on Light Pink Wavy Texture)
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
              {/* Intro Photo enlarged ~18% */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "relative",
                  y: introPhotoY,
                }}
              >
                <div
                  style={{
                    width: "min(460px, 88vw)",
                    height: "min(580px, 72vh)",
                    borderRadius: "28px",
                    overflow: "hidden",
                    boxShadow:
                      "0 24px 60px -10px rgba(140, 40, 70, 0.28), 0 0 35px rgba(247, 37, 133, 0.15), 0 0 0 2px rgba(255, 255, 255, 0.8)",
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
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent 60%, rgba(140, 40, 70, 0.35) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </motion.div>

              {/* Greeting Speech Bubble with Chewy Font */}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <motion.div
                  variants={bubbleVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    padding: "1.25rem 2.5rem",
                    borderRadius: "28px",
                    background: "rgba(255, 255, 255, 0.94)",
                    boxShadow:
                      "0 14px 45px rgba(180, 60, 100, 0.18), 0 4px 16px rgba(0, 0, 0, 0.06)",
                    border: "2px solid rgba(255, 255, 255, 0.9)",
                  }}
                >
                  {/* Pointed tail pointing upward toward photo */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-15px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "15px solid transparent",
                      borderRight: "15px solid transparent",
                      borderBottom: "16px solid rgba(255, 255, 255, 0.94)",
                      filter: "drop-shadow(0 -3px 3px rgba(180, 60, 100, 0.12))",
                    }}
                  />

                  <h1
                    className="story-text"
                    style={{
                      fontSize: "clamp(2.4rem, 5.5vw, 4rem)",
                      color: "#280517",
                      letterSpacing: "0.01em",
                      margin: 0,
                      lineHeight: 1.15,
                    }}
                  >
                    hey y&apos;all, I&apos;m{" "}
                    <span style={{ color: "#e61a7a" }}>
                      Saana.
                    </span>
                  </h1>
                </motion.div>

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
                    color: "rgba(84, 20, 34, 0.6)",
                    fontSize: "0.74rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Scroll to explore</span>
                  <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <rect x="7" y="3" width="2" height="7" rx="1" fill="currentColor" />
                    <path d="M4 14 L8 20 L12 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                BEAT 2 — Personal Blurb in Speech Bubble (on Light Pink Wavy Texture)
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
              <div style={{ maxWidth: "800px", width: "100%", textAlign: "center" }}>
                <motion.div
                  variants={bubbleVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.35 }}
                  style={{
                    position: "relative",
                    padding: "2rem 2.5rem",
                    borderRadius: "30px",
                    background: "rgba(255, 255, 255, 0.94)",
                    boxShadow:
                      "0 16px 50px rgba(180, 60, 100, 0.16), 0 4px 16px rgba(0, 0, 0, 0.06)",
                    border: "2px solid rgba(255, 255, 255, 0.9)",
                    textAlign: "center",
                  }}
                >
                  {/* Pointed tail pointing upward */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-15px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "15px solid transparent",
                      borderRight: "15px solid transparent",
                      borderBottom: "16px solid rgba(255, 255, 255, 0.94)",
                      filter: "drop-shadow(0 -3px 3px rgba(180, 60, 100, 0.12))",
                    }}
                  />

                  <p
                    className="story-text"
                    style={{
                      fontSize: "clamp(1.35rem, 2.8vw, 1.85rem)",
                      color: "#2b0517",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    Computer scientist by training, designer by inclination, and someone who{" "}
                    <span style={{ color: "#d61c74" }}>
                      genuinely loves being curious
                    </span>{" "}
                    about how everything works — from network packets to skin barriers.
                  </p>
                </motion.div>
              </div>
            </section>

            {/* ════════════════════════════════════════════════
                BEAT 3 — Credentials (Wavy Pink Texture + 5 Bio Speech Bubbles)
            ════════════════════════════════════════════════ */}
            <React.Suspense fallback={null}>
              <AboutCredentials />
            </React.Suspense>

            {/* ════════════════════════════════════════════════
                BEAT 4 — Dance (LOTUS FLOWER BACKGROUND)
            ════════════════════════════════════════════════ */}
            <React.Suspense fallback={null}>
              <AboutDance />
            </React.Suspense>

            {/* ════════════════════════════════════════════════
                BEAT 5 — Skincare (LIQUID/SERUM BUBBLE BACKGROUND)
            ════════════════════════════════════════════════ */}
            <React.Suspense fallback={null}>
              <AboutSkincare />
            </React.Suspense>

            {/* ════════════════════════════════════════════════
                BEAT 6 — Closing / Back to Work prompt (on Light Pink Wavy Texture)
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Closing Speech Bubble */}
                <motion.div
                  variants={bubbleVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  style={{
                    position: "relative",
                    padding: "1.35rem 2.2rem",
                    borderRadius: "26px",
                    background: "rgba(255, 255, 255, 0.94)",
                    boxShadow:
                      "0 12px 40px rgba(180, 60, 100, 0.16), 0 4px 12px rgba(0, 0, 0, 0.06)",
                    border: "2px solid rgba(255, 255, 255, 0.9)",
                    marginBottom: "2.5rem",
                    display: "inline-block",
                  }}
                >
                  <p
                    className="story-text"
                    style={{
                      fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                      color: "#2b0517",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    That&apos;s a bit of me. Curious about the work?
                  </p>

                  {/* Tail pointing down toward CTA button */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 0,
                      height: 0,
                      borderLeft: "14px solid transparent",
                      borderRight: "14px solid transparent",
                      borderTop: "15px solid rgba(255, 255, 255, 0.94)",
                      filter: "drop-shadow(0 3px 3px rgba(180, 60, 100, 0.12))",
                    }}
                  />
                </motion.div>

                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.85rem 2.2rem",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #f72585 0%, #7209b7 100%)",
                    border: "none",
                    color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(247, 37, 133, 0.35)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(247, 37, 133, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(247, 37, 133, 0.35)";
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
