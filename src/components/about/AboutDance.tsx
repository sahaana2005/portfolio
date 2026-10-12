import { motion, type Variants } from "framer-motion";
import DanceBackground from "./DanceBackground";

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

export default function AboutDance() {
  return (
    <section
      className="about-beat-section about-dance-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.5rem",
        zIndex: 10,
        backgroundColor: "#e29c9c", // Fully opaque warm muted blush
        overflow: "hidden",
      }}
    >
      {/* ── THE LOTUS FLOWER BACKGROUND (fully active, swaying lotuses & drifting petals) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <DanceBackground />
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
        {/* Subtle center scrim for maximum contrast against lotus canvas */}
        <div
          style={{
            position: "absolute",
            inset: "5% 10%",
            borderRadius: "32px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 240, 244, 0.45) 0%, rgba(255, 240, 244, 0.15) 55%, transparent 75%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* DANCE PHOTO enlarged ~18% */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "min(470px, 90vw)",
            height: "min(610px, 76vh)",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow:
              "0 24px 50px -10px rgba(76, 15, 28, 0.35), 0 10px 24px -5px rgba(76, 15, 28, 0.22), 0 0 0 2px rgba(255, 255, 255, 0.65)",
          }}
        >
          <img
            src="/about/dance.jpg"
            alt="Sahaana in classical Indian dance pose"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(76, 15, 28, 0.05) 0%, transparent 40%, rgba(76, 15, 28, 0.45) 100%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* DANCE SPEECH BUBBLE */}
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
              "0 12px 40px rgba(84, 20, 36, 0.22), 0 2px 8px rgba(84, 20, 36, 0.12)",
            border: "1.5px solid rgba(255, 200, 210, 0.7)",
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
              filter: "drop-shadow(0 -3px 4px rgba(84,20,36,0.14))",
            }}
          />

          {/* Badge */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#541422",
              marginBottom: "0.75rem",
              padding: "0.3rem 0.85rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 220, 228, 0.85)",
              border: "1px solid rgba(84, 20, 36, 0.2)",
            }}
          >
            Rhythm &amp; Expression
          </span>

          <p
            className="story-text"
            style={{
              margin: 0,
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              lineHeight: 1.3,
              color: "#350711",
            }}
          >
            &ldquo;I&apos;ve been crazy about dance since I could walk&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
