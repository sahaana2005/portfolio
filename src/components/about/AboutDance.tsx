import * as React from "react";
import { motion } from "framer-motion";

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
      }}
    >
      <div
        style={{
          maxWidth: "1080px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        {/* Subtle scrim behind content for contrast against textured watercolor canvas */}
        <div
          style={{
            position: "absolute",
            inset: "5% 10%",
            borderRadius: "32px",
            background:
              "radial-gradient(ellipse at center, rgba(84, 20, 36, 0.15) 0%, rgba(84, 20, 36, 0.05) 55%, transparent 75%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* ── DANCE PHOTO ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "min(400px, 85vw)",
            height: "min(520px, 68vh)",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow:
              "0 24px 50px -10px rgba(76, 15, 28, 0.35), 0 10px 24px -5px rgba(76, 15, 28, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.4)",
          }}
        >
          <img
            src="/about/dance.jpg"
            alt="Sahaana in classical Indian dance pose"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 25%",
              display: "block",
            }}
          />

          {/* Soft warm vignette & border sheen */}
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

        {/* ── DANCE STATEMENT TEXT ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "760px",
            padding: "0 1rem",
          }}
        >
          {/* Cultural beat badge */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#541422",
              marginBottom: "1rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.45)",
              border: "1px solid rgba(84, 20, 36, 0.18)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 12px rgba(84, 20, 36, 0.06)",
            }}
          >
            Rhythm & Expression
          </span>

          <h2
            style={{
              fontFamily: "'Syne', 'Inter', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 700,
              color: "#350711",
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              margin: 0,
              textShadow: "0 2px 14px rgba(255, 255, 255, 0.4), 0 4px 20px rgba(76, 15, 28, 0.12)",
            }}
          >
            &ldquo;I&apos;ve been crazy about dance since I could walk&rdquo;
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
