import { motion, type Variants } from "framer-motion";
import SkincareBackground from "./SkincareBackground";

const bubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0, originX: 0.5, originY: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 480,
      damping: 24,
      mass: 0.7,
    },
  },
};

export default function AboutSkincare() {
  return (
    <section
      className="about-beat-section about-skincare-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.5rem",
        zIndex: 10,
        backgroundColor: "#ffe4ec", // Fully opaque soft serum pink base
        overflow: "hidden",
      }}
    >
      {/* ── THE LIQUID/SERUM BUBBLE BACKGROUND (glossy pools & rising pulsing droplets) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <SkincareBackground />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1080px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        {/* Subtle scrim behind content for legibility */}
        <div
          style={{
            position: "absolute",
            inset: "5% 10%",
            borderRadius: "32px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.2) 50%, transparent 75%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* ── SKINCARE PHOTO (enlarged ~18%) ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "min(470px, 90vw)",
            height: "min(600px, 74vh)",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow:
              "0 26px 55px -10px rgba(219, 39, 119, 0.22), 0 10px 24px -5px rgba(219, 39, 119, 0.12), 0 0 0 2px rgba(255, 255, 255, 0.9)",
          }}
        >
          <img
            src="/about/skincare.jpg"
            alt="Sahaana candid skincare mirror moment"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              display: "block",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 40%, rgba(219, 39, 119, 0.1) 100%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* ── SKINCARE SPEECH BUBBLE ── */}
        <motion.div
          variants={bubbleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          style={{
            position: "relative",
            padding: "1.4rem 2.2rem",
            borderRadius: "28px",
            background: "rgba(255, 255, 255, 0.94)",
            boxShadow:
              "0 10px 40px rgba(219, 39, 119, 0.16), 0 2px 10px rgba(219, 39, 119, 0.08)",
            border: "1.5px solid rgba(244, 114, 182, 0.45)",
            maxWidth: "720px",
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Tail pointing up toward photo */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-14px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "14px solid transparent",
              borderRight: "14px solid transparent",
              borderBottom: "15px solid rgba(255, 255, 255, 0.94)",
              filter: "drop-shadow(0 -3px 4px rgba(219, 39, 119, 0.12))",
            }}
          />

          {/* Aesthetician badge */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#be185d",
              marginBottom: "0.75rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 240, 246, 0.9)",
              border: "1px solid rgba(244, 114, 182, 0.4)",
            }}
          >
            Science &amp; Self-Care
          </span>

          <p
            className="story-text"
            style={{
              margin: 0,
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              lineHeight: 1.3,
              color: "#831843",
            }}
          >
            &ldquo;Geeky about skincare and aestheticians&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
