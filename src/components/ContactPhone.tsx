import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  GraduationCap,
  MapPin,
  ExternalLink,
  X,
  Copy,
  Check,
  Send,
  Wifi,
  Battery,
} from "lucide-react";

export interface ContactPhoneProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Minimalist Feather/Lucide-compliant brand line icons ─────────────────────
const LinkedinLineIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubLineIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function ContactPhone({ isOpen, onClose }: ContactPhoneProps) {
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocusedElem = React.useRef<HTMLElement | null>(null);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [timeString, setTimeString] = React.useState("9:41");

  // Keep phone status-bar clock synchronized with current time
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard accessibility: Escape to dismiss & focus trap
  React.useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElem.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button or modal container
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const firstBtn = modalRef.current.querySelector<HTMLElement>("button");
        firstBtn?.focus();
      }
    }, 150);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      if (previouslyFocusedElem.current) {
        previouslyFocusedElem.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="My Contacts"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* ── DIMMED & BLURRED BACKDROP ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(18, 12, 16, 0.45)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              cursor: "pointer",
            }}
          />

          {/* ── PHONE STAGE WRAPPER WITH FLOOR SHADOW ── */}
          <div
            ref={modalRef}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              maxHeight: "96vh",
              padding: "1rem",
              userSelect: "none",
            }}
          >
            {/* ── NATURAL FLOOR DROP SHADOW (NO NEON) ── */}
            <motion.div
              initial={{ scaleX: 0.15, scaleY: 0.15, opacity: 0 }}
              animate={{ scaleX: 1, scaleY: 1, opacity: 0.45 }}
              exit={{ scaleX: 0.15, scaleY: 0.15, opacity: 0 }}
              transition={{
                scaleX: { type: "spring", stiffness: 120, damping: 13, mass: 1 },
                scaleY: { type: "spring", stiffness: 120, damping: 13, mass: 1 },
                opacity: { duration: 0.45, ease: "easeOut" },
              }}
              style={{
                position: "absolute",
                bottom: "6px",
                width: "min(330px, 80vw)",
                height: "24px",
                borderRadius: "50%",
                background:
                  "radial-gradient(ellipse at center, rgba(30, 20, 25, 0.6) 0%, rgba(30, 20, 25, 0.18) 45%, transparent 75%)",
                filter: "blur(14px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* ── PHONE MOCKUP BODY (FALLING & BOUNCING SPRING CONTAINER) ── */}
            <motion.div
              initial={{
                y: -1100,
                rotate: -5,
                opacity: 0,
              }}
              animate={{
                y: 0,
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                y: -1050,
                rotate: 3.5,
                opacity: 0,
                transition: {
                  duration: 0.45,
                  ease: [0.32, 0, 0.67, 0],
                },
              }}
              transition={{
                y: {
                  type: "spring",
                  stiffness: 115,
                  damping: 12.5,
                  mass: 1,
                },
                rotate: {
                  type: "spring",
                  stiffness: 95,
                  damping: 11.5,
                  mass: 1,
                },
                opacity: { duration: 0.2 },
              }}
              style={{
                position: "relative",
                width: "clamp(320px, 86vw, 365px)",
                height: "clamp(600px, 84vh, 690px)",
                zIndex: 2,
                transformOrigin: "50% 20%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── PHYSICAL SIDE BUTTONS (LEFT EDGE) - SOFT PINK, NO NEON ── */}
              {/* Silent / Action switch */}
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  top: "105px",
                  width: "4px",
                  height: "24px",
                  borderTopLeftRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  background: "linear-gradient(to right, #f472b6, #fbcfe8)",
                  boxShadow: "-1px 1px 2px rgba(0, 0, 0, 0.15)",
                }}
              />
              {/* Volume Up */}
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  top: "148px",
                  width: "4px",
                  height: "46px",
                  borderTopLeftRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  background: "linear-gradient(to right, #f472b6, #fbcfe8)",
                  boxShadow: "-1px 1px 2px rgba(0, 0, 0, 0.15)",
                }}
              />
              {/* Volume Down */}
              <div
                style={{
                  position: "absolute",
                  left: "-4px",
                  top: "206px",
                  width: "4px",
                  height: "46px",
                  borderTopLeftRadius: "3px",
                  borderBottomLeftRadius: "3px",
                  background: "linear-gradient(to right, #f472b6, #fbcfe8)",
                  boxShadow: "-1px 1px 2px rgba(0, 0, 0, 0.15)",
                }}
              />

              {/* ── PHYSICAL POWER BUTTON (RIGHT EDGE) ── */}
              <div
                style={{
                  position: "absolute",
                  right: "-4px",
                  top: "155px",
                  width: "4px",
                  height: "68px",
                  borderTopRightRadius: "3px",
                  borderBottomRightRadius: "3px",
                  background: "linear-gradient(to left, #f472b6, #fbcfe8)",
                  boxShadow: "1px 1px 2px rgba(0, 0, 0, 0.15)",
                }}
              />

              {/* ── ELEGANT GLOSSY PINK PHONE CASE (NO NEON GLOW) ── */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50px",
                  padding: "10px",
                  background:
                    "linear-gradient(145deg, #ffe4ec 0%, #fbcfe8 32%, #f472b6 70%, #ec4899 100%)",
                  boxShadow:
                    "0 24px 60px -12px rgba(0, 0, 0, 0.35), 0 8px 24px -4px rgba(0, 0, 0, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(190, 24, 93, 0.35)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Diagonal Glossy Highlight Sheen across phone case */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50px",
                    background:
                      "linear-gradient(125deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.12) 30%, transparent 58%)",
                    pointerEvents: "none",
                    zIndex: 20,
                  }}
                />

                {/* ── LIGHT MODE SCREEN WITH GLASSMORPHISM BACKGROUND ── */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    borderRadius: "40px",
                    background:
                      "linear-gradient(168deg, #ffffff 0%, #fdf4f8 42%, #fae8f0 100%)",
                    boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.08), inset 0 2px 8px rgba(0, 0, 0, 0.04)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Subtle soft blush glass orbs in background to amplify frosted glassmorphism */}
                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      left: "-20px",
                      width: "180px",
                      height: "180px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(244, 114, 182, 0.28) 0%, transparent 70%)",
                      filter: "blur(24px)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      right: "-30px",
                      width: "200px",
                      height: "200px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(251, 207, 232, 0.35) 0%, transparent 70%)",
                      filter: "blur(28px)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* ── TOP STATUS BAR & DYNAMIC ISLAND (LIGHT MODE) ── */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 30,
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 18px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#18181b",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {/* Clock */}
                    <span style={{ letterSpacing: "-0.01em", color: "#18181b" }}>{timeString}</span>

                    {/* Dynamic Island Cutout */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "9px",
                        transform: "translateX(-50%)",
                        width: "106px",
                        height: "26px",
                        borderRadius: "9999px",
                        backgroundColor: "#000000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 9px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {/* Camera Lens */}
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#0a1322",
                          border: "1px solid #1e293b",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            backgroundColor: "#38bdf8",
                            opacity: 0.8,
                          }}
                        />
                      </div>

                      {/* Sensor dot */}
                      <div
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: "#18181b",
                        }}
                      />
                    </div>

                    {/* Status icons + Sleek Close Button */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#18181b" }}>
                      <Wifi size={13} strokeWidth={2.2} />
                      <Battery size={15} strokeWidth={2.2} />
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Dismiss contact phone"
                        title="Close (Esc)"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(0, 0, 0, 0.06)",
                          border: "1px solid rgba(0, 0, 0, 0.08)",
                          color: "#3f3f46",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          marginLeft: "2px",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.12)";
                          e.currentTarget.style.color = "#09090b";
                          e.currentTarget.style.transform = "scale(1.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.06)";
                          e.currentTarget.style.color = "#3f3f46";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <X size={13} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>

                  {/* ── IMPACT SCREEN SETTLE CONTAINER ── */}
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{
                      scale: [1, 1, 1.025, 0.995, 1],
                    }}
                    transition={{
                      duration: 1.15,
                      times: [0, 0.48, 0.65, 0.82, 1],
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "relative",
                      zIndex: 25,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      padding: "0.85rem 1.15rem 0.95rem 1.15rem",
                      overflowY: "auto",
                      scrollbarWidth: "none",
                    }}
                  >
                    {/* ── HEADER: "MY CONTACTS" (CLEAN LIGHT MODE, NO NEON) ── */}
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "0.25rem",
                        marginBottom: "1rem",
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "'Syne', 'Inter', -apple-system, sans-serif",
                          fontSize: "1.45rem",
                          fontWeight: 700,
                          margin: 0,
                          letterSpacing: "-0.01em",
                          color: "#18181b",
                          textTransform: "capitalize",
                        }}
                      >
                        My Contacts
                      </h2>
                    </div>

                    {/* ── FROSTED GLASSMORPHISM CONTACT CARD CONTAINER ── */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(255, 255, 255, 0.62)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.85)",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow:
                          "0 12px 30px rgba(160, 100, 125, 0.08), 0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 2px rgba(255, 255, 255, 0.95)",
                      }}
                    >
                      {/* 1. Email: sahaanaraajkumar@gmail.com */}
                      <a
                        href="mailto:sahaanaraajkumar@gmail.com"
                        className="glass-contact-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                          padding: "10px 12px",
                          textDecoration: "none",
                          color: "inherit",
                          borderBottom: "1px solid rgba(235, 215, 225, 0.6)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          className="glass-icon-box"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            border: "1px solid rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 2px 6px rgba(180, 110, 135, 0.08)",
                            color: "#db2777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <Mail size={16} strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.62rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#83757d",
                              fontWeight: 600,
                            }}
                          >
                            Email
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              color: "#18181b",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            sahaanaraajkumar@gmail.com
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCopy("sahaanaraajkumar@gmail.com", "email", e)}
                          title="Copy email address"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: copiedKey === "email" ? "#059669" : "#a1a1aa",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s ease",
                          }}
                        >
                          {copiedKey === "email" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </a>

                      {/* 2. Academic/Institutional Email: sr0009@srmist.edu.in */}
                      <a
                        href="mailto:sr0009@srmist.edu.in"
                        className="glass-contact-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                          padding: "10px 12px",
                          textDecoration: "none",
                          color: "inherit",
                          borderBottom: "1px solid rgba(235, 215, 225, 0.6)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          className="glass-icon-box"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            border: "1px solid rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 2px 6px rgba(180, 110, 135, 0.08)",
                            color: "#db2777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <GraduationCap size={16} strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.62rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#83757d",
                              fontWeight: 600,
                            }}
                          >
                            Academic Email
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              color: "#18181b",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            sr0009@srmist.edu.in
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleCopy("sr0009@srmist.edu.in", "academic", e)}
                          title="Copy academic email"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: copiedKey === "academic" ? "#059669" : "#a1a1aa",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "color 0.2s ease",
                          }}
                        >
                          {copiedKey === "academic" ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </a>

                      {/* 3. LinkedIn: https://www.linkedin.com/in/sahaana-raajkumar-b1526a323/ */}
                      <a
                        href="https://www.linkedin.com/in/sahaana-raajkumar-b1526a323/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-contact-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                          padding: "10px 12px",
                          textDecoration: "none",
                          color: "inherit",
                          borderBottom: "1px solid rgba(235, 215, 225, 0.6)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          className="glass-icon-box"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            border: "1px solid rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 2px 6px rgba(180, 110, 135, 0.08)",
                            color: "#db2777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <LinkedinLineIcon size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.62rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#83757d",
                              fontWeight: 600,
                            }}
                          >
                            LinkedIn
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              color: "#18181b",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            sahaana-raajkumar
                          </div>
                        </div>
                        <ExternalLink size={13} style={{ color: "#a1a1aa" }} />
                      </a>

                      {/* 4. GitHub: https://github.com/sahaana2005 */}
                      <a
                        href="https://github.com/sahaana2005"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-contact-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                          padding: "10px 12px",
                          textDecoration: "none",
                          color: "inherit",
                          borderBottom: "1px solid rgba(235, 215, 225, 0.6)",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          className="glass-icon-box"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            border: "1px solid rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 2px 6px rgba(180, 110, 135, 0.08)",
                            color: "#db2777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <GithubLineIcon size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.62rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#83757d",
                              fontWeight: 600,
                            }}
                          >
                            GitHub
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              color: "#18181b",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            github.com/sahaana2005
                          </div>
                        </div>
                        <ExternalLink size={13} style={{ color: "#a1a1aa" }} />
                      </a>

                      {/* 5. Location: Chennai */}
                      <div
                        className="glass-contact-row"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                          padding: "10px 12px",
                          color: "inherit",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div
                          className="glass-icon-box"
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            border: "1px solid rgba(255, 255, 255, 0.95)",
                            boxShadow: "0 2px 6px rgba(180, 110, 135, 0.08)",
                            color: "#db2777",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <MapPin size={16} strokeWidth={2} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "0.62rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              color: "#83757d",
                              fontWeight: 600,
                            }}
                          >
                            Location
                          </div>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              color: "#18181b",
                            }}
                          >
                            Chennai, India
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: "0.68rem",
                            color: "#8a7b82",
                            fontFamily: "monospace",
                          }}
                        >
                          IST (UTC+5:30)
                        </span>
                      </div>
                    </div>

                    {/* Quick Call-to-action button: Clean Frosted Glass Style */}
                    <div style={{ marginTop: "0.95rem" }}>
                      <a
                        href="mailto:sahaanaraajkumar@gmail.com?subject=Hello%20Sahaana!"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "0.72rem",
                          borderRadius: "14px",
                          background: "rgba(255, 255, 255, 0.75)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.95)",
                          color: "#9d174d",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          letterSpacing: "0.02em",
                          textDecoration: "none",
                          boxShadow:
                            "0 4px 16px rgba(180, 110, 135, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.95)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.92)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(180, 110, 135, 0.18), inset 0 1px 1px rgba(255, 255, 255, 1)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 16px rgba(180, 110, 135, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.95)";
                          e.currentTarget.style.transform = "none";
                        }}
                      >
                        <Send size={13} strokeWidth={2.2} />
                        <span>Send an Email</span>
                      </a>
                    </div>
                  </motion.div>

                  {/* ── HOME INDICATOR BAR (LIGHT MODE) ── */}
                  <div
                    style={{
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 30,
                    }}
                  >
                    <div
                      style={{
                        width: "115px",
                        height: "4px",
                        borderRadius: "9999px",
                        backgroundColor: "rgba(0, 0, 0, 0.22)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── EMBEDDED STYLES FOR GLASSMORPHISM HOVER & ACCESSIBILITY ── */}
          <style>{`
            .glass-contact-row:hover {
              background: rgba(255, 255, 255, 0.9) !important;
            }
            .glass-contact-row:hover .glass-icon-box {
              transform: scale(1.06);
              background-color: #ffffff !important;
              box-shadow: 0 4px 12px rgba(219, 39, 119, 0.15) !important;
            }
            .glass-contact-row:focus-visible {
              outline: 2px solid #db2777;
              outline-offset: -2px;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
}
