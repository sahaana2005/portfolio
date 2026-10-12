import { motion, type Variants } from "framer-motion";
import { Award } from "lucide-react";

const BIO_PARAGRAPHS = [
  "A B.Tech Computer Science student specializing in Cybersecurity, fascinated by the things most people never see — what happens behind a login screen, how threats move through a network, and how defenders catch them before they become something bigger.",
  "I naturally gravitate towards the blue team — threat detection, SIEM, incident response, disaster recovery, EDR, and PAM are some of the areas I enjoy exploring. But I also love stepping into the attacker's shoes through CTFs, because understanding how something can be broken makes you better at understanding how to protect it.",
  "Outside the cyber world, I've been spending time building websites, experimenting with interfaces, and learning 3D modelling with Spline. I enjoy the creative side of technology just as much as the technical side.",
  "SQL is probably my favourite language — especially when there's a messy query waiting to be optimized. There's something satisfying about turning a slow query into an efficient one.",
  "Cybersecurity is a huge world, and I don't want to limit myself to one corner of it. I'm always curious about new domains, new tools, new vulnerabilities, and new ways of solving problems.",
];

// Spring-pop animation: scale 0 -> 1.05 -> 1 with fade-in under 400ms
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
        backgroundColor: "#f5cad1",
      }}
    >
      {/* Wave-texture background layer */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#f5cad1",
          backgroundImage: "url('/about/pink_wavy_texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1080px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        {/* FORMAL PHOTO enlarged ~20% */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            width: "min(470px, 90vw)",
            height: "min(590px, 72vh)",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow:
              "0 28px 70px -10px rgba(130, 30, 60, 0.30), 0 0 35px rgba(247, 37, 133, 0.18), 0 0 0 2px rgba(255, 180, 200, 0.6)",
          }}
        >
          <img
            src="/about/formal_credentials.jpg"
            alt="Sahaana formal portrait"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 60%, rgba(100, 20, 40, 0.5) 100%)",
              pointerEvents: "none",
            }}
          />
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
              backgroundColor: "rgba(255, 240, 244, 0.9)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(247, 100, 150, 0.4)",
              color: "#c0285a",
              fontSize: "0.72rem",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <Award size={13} color="#f72585" />
            <span>Undergrad</span>
          </div>
        </motion.div>

        {/* BIO SPEECH BUBBLES */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
            width: "100%",
            maxWidth: "820px",
          }}
        >
          {BIO_PARAGRAPHS.map((para, i) => (
            <motion.div
              key={i}
              variants={bubbleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              style={{
                position: "relative",
                padding: "1.25rem 1.75rem",
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.93)",
                boxShadow:
                  "0 10px 32px rgba(180, 60, 100, 0.16), 0 2px 8px rgba(180, 60, 100, 0.08)",
                border: "1.5px solid rgba(247, 160, 185, 0.55)",
                maxWidth: "800px",
                width: "100%",
                textAlign: "left",
              }}
            >
              {/* Pointed tail on the first bubble pointing up towards photo */}
              {i === 0 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "-13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "13px solid transparent",
                    borderRight: "13px solid transparent",
                    borderBottom: "14px solid rgba(255, 255, 255, 0.93)",
                    filter: "drop-shadow(0 -3px 3px rgba(180,60,100,0.12))",
                  }}
                />
              )}
              <p
                className="story-text"
                style={{
                  margin: 0,
                  fontSize: "clamp(1.1rem, 2.2vw, 1.35rem)",
                  lineHeight: 1.65,
                  color: "#4e1425",
                }}
              >
                {para}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
