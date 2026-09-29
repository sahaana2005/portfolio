import * as React from "react";
import { motion } from "framer-motion";
import { Shield, Award } from "lucide-react";

export default function AboutCredentials() {
  return (
    <section
      className="about-beat-section about-credentials-section"
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
        {/* Ambient neon backdrop glow */}
        <div
          style={{
            position: "absolute",
            inset: "5% 10%",
            borderRadius: "32px",
            background:
              "radial-gradient(ellipse at center, rgba(247, 37, 133, 0.12) 0%, rgba(114, 9, 183, 0.05) 50%, transparent 75%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* ── FORMAL PHOTO ── */}
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
              "0 24px 60px -10px rgba(0, 0, 0, 0.7), 0 0 35px rgba(247, 37, 133, 0.25), 0 0 0 1px rgba(255, 77, 166, 0.3)",
          }}
        >
          <img
            src="/about/formal_credentials.jpg"
            alt="Sahaana formal portrait"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              display: "block",
            }}
          />

          {/* Crisp bottom gradient for depth */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 60%, rgba(10, 5, 14, 0.8) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Top-right subtle badge */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "9999px",
              backgroundColor: "rgba(13, 6, 20, 0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 77, 166, 0.3)",
              color: "#ff80bf",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
          >
            <Award size={13} color="#f72585" />
            <span>Undergrad</span>
          </div>
        </motion.div>

        {/* ── CREDENTIALS STATEMENT TEXT ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: "center",
            maxWidth: "840px",
            padding: "0 1rem",
          }}
        >
          {/* Institutional pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "0.4rem 1.1rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(247, 37, 133, 0.12)",
              border: "1px solid rgba(247, 37, 133, 0.35)",
              color: "#ff6bb3",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
              boxShadow: "0 0 16px rgba(247, 37, 133, 0.2)",
            }}
          >
            <Shield size={14} />
            <span>Academic Background</span>
          </div>

          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.92)",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            From <span style={{ fontWeight: 600, color: "#ffffff" }}>SRMIST</span>, currently studying{" "}
            <span style={{ fontWeight: 600, color: "#ffffff" }}>BTECH Computer Science</span> with specialization in{" "}
            <span
              style={{
                fontWeight: 800,
                color: "#ff2d95",
                textShadow:
                  "0 0 14px rgba(255, 45, 149, 0.8), 0 0 32px rgba(255, 45, 149, 0.45)",
                letterSpacing: "0.04em",
              }}
            >
              CYBERSECURITY
            </span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
