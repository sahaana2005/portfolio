import * as React from "react";
import { motion } from "framer-motion";

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
        {/* Subtle scrim behind content for legibility against glossy serum background */}
        <div
          style={{
            position: "absolute",
            inset: "5% 10%",
            borderRadius: "32px",
            background:
              "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 50%, transparent 75%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* ── SKINCARE PHOTO ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "min(400px, 85vw)",
            height: "min(500px, 65vh)",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow:
              "0 24px 50px -10px rgba(219, 39, 119, 0.18), 0 10px 24px -5px rgba(219, 39, 119, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)",
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

          {/* Clean glassy highlight sheen */}
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

        {/* ── SKINCARE STATEMENT TEXT ── */}
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
          {/* Aesthetician badge */}
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#be185d",
              marginBottom: "1rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              border: "1px solid rgba(244, 114, 182, 0.4)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 14px rgba(219, 39, 119, 0.08)",
            }}
          >
            Science & Self-Care
          </span>

          <h2
            style={{
              fontFamily: "'Syne', 'Inter', sans-serif",
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 700,
              color: "#831843",
              lineHeight: 1.25,
              letterSpacing: "-0.015em",
              margin: 0,
              textShadow: "0 2px 14px rgba(255, 255, 255, 0.6)",
            }}
          >
            &ldquo;Geeky about skincare and aestheticians&rdquo;
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
