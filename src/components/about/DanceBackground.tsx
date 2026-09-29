import * as React from "react";
import { motion, MotionValue } from "framer-motion";

export interface DanceBackgroundProps {
  opacity?: MotionValue<number> | number;
  className?: string;
  isMobile?: boolean;
}

// ── Classical Indian Lotus Flower Line-Art SVG ──────────────────────────────
export const ClassicalLotusBloom: React.FC<{
  size?: number;
  color?: string;
  stemLength?: number;
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({
  size = 180,
  color = "#4c0f1c", // Deep classical maroon / burgundy
  stemLength = 120,
  flip = false,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size + stemLength * 0.75}
      viewBox={`0 0 200 ${200 + stemLength}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: flip ? "scaleX(-1)" : "none",
        overflow: "visible",
        ...style,
      }}
    >
      <defs>
        <linearGradient id="lotusWash" x1="100" y1="30" x2="100" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a1c30" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#4c0f1c" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#2e050f" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Graceful curved stem */}
      <path
        d={`M 100 162 C 102 ${180 + stemLength * 0.4}, 88 ${190 + stemLength * 0.7}, 94 ${200 + stemLength}`}
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      {/* Secondary tender stem tendril / leaf thorn */}
      <path
        d={`M 98 ${170 + stemLength * 0.3} C 112 ${175 + stemLength * 0.35}, 116 ${165 + stemLength * 0.4}, 118 ${162 + stemLength * 0.45}`}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.65"
      />

      {/* Lotus Base / Sepals */}
      <path
        d="M 85 162 C 92 169, 108 169, 115 162 C 122 170, 78 170, 85 162 Z"
        fill={color}
        fillOpacity="0.75"
      />

      {/* ── Outer Petals (Layer 1 - back wash) ── */}
      <path
        d="M 100 160 C 50 148, 12 110, 20 85 C 32 75, 68 112, 100 156 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M 100 160 C 150 148, 188 110, 180 85 C 168 75, 132 112, 100 156 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Mid Petals (Layer 2) ── */}
      <path
        d="M 100 158 C 65 142, 38 98, 48 64 C 62 58, 86 102, 100 152 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M 100 158 C 135 142, 162 98, 152 64 C 138 58, 114 102, 100 152 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* ── Inner Accent Petals (Layer 3) ── */}
      <path
        d="M 100 155 C 80 135, 65 82, 75 48 C 88 44, 96 90, 100 148 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.4"
      />
      <path
        d="M 100 155 C 120 135, 135 82, 125 48 C 112 44, 104 90, 100 148 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.4"
      />

      {/* ── Central Crown Petal ── */}
      <path
        d="M 100 152 C 86 118, 86 52, 100 24 C 114 52, 114 118, 100 152 Z"
        fill="url(#lotusWash)"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Classical delicate vein lines on central petal */}
      <path d="M 100 32 L 100 146" stroke={color} strokeWidth="1.4" strokeOpacity="0.6" strokeDasharray="3 4" />
      <path d="M 100 70 C 93 84, 90 102, 94 122" stroke={color} strokeWidth="1.2" strokeOpacity="0.45" />
      <path d="M 100 70 C 107 84, 110 102, 106 122" stroke={color} strokeWidth="1.2" strokeOpacity="0.45" />
    </svg>
  );
};

// Smaller companion lotus bud for pairing
export const ClassicalLotusBud: React.FC<{
  size?: number;
  color?: string;
  stemLength?: number;
}> = ({ size = 95, color = "#4c0f1c", stemLength = 100 }) => {
  return (
    <svg
      width={size}
      height={size + stemLength * 0.75}
      viewBox={`0 0 120 ${130 + stemLength}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M 60 108 C 66 ${130 + stemLength * 0.4}, 54 ${140 + stemLength * 0.7}, 58 ${130 + stemLength}`}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M 60 105 C 42 90, 36 60, 48 38 C 58 54, 58 84, 60 105 Z"
        fill="#5a1324"
        fillOpacity="0.32"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M 60 105 C 78 90, 84 60, 72 38 C 62 54, 62 84, 60 105 Z"
        fill="#5a1324"
        fillOpacity="0.32"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M 60 102 C 50 78, 52 42, 60 22 C 68 42, 70 78, 60 102 Z"
        fill="#4c0f1c"
        fillOpacity="0.4"
        stroke={color}
        strokeWidth="2.2"
      />
    </svg>
  );
};

export default function DanceBackground({
  opacity = 1,
  className = "",
  isMobile = false,
}: DanceBackgroundProps) {
  // Mobile check fallback
  const [mobileMode, setMobileMode] = React.useState(isMobile);
  React.useEffect(() => {
    const checkMobile = () => {
      setMobileMode(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <motion.div
      className={`dance-background-container ${className}`}
      style={{
        opacity: opacity as any,
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#e5a1a1", // Warm muted blush base
        zIndex: 0,
      }}
    >
      {/* ── AGED PAINTED PAPER / CANVAS TEXTURE WASH ── */}
      {/* Organic watercolor paper gradient with soft vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 35% 25%, #f1b7b7 0%, #e29797 45%, #cb7f81 85%, #b66d70 100%)",
          opacity: 0.95,
        }}
      />

      {/* Watercolor pigment blooms / wash patches */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(194, 107, 114, 0.42) 0%, transparent 68%)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 77, 86, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── SVG CANVAS GRAIN & PAPER FIBERS ── */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.28,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      >
        <filter id="dancePaperGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#dancePaperGrain)" />
      </svg>

      {/* ── ASYMMETRICAL LOTUS PAIRS ── */}

      {/* 1. TOP-LEFT PAIR: Large Lotus Bloom + Companion Bud with stems */}
      <motion.div
        initial={mobileMode ? false : { opacity: 0, y: 30, rotate: -6 }}
        whileInView={mobileMode ? undefined : { opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "4%",
          left: "4%",
          zIndex: 1,
        }}
      >
        {/* Animated gentle swaying bloom */}
        <motion.div
          animate={
            mobileMode
              ? undefined
              : {
                  rotate: [-2.5, 2.5, -2.5],
                }
          }
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: "40% 90%",
            display: "inline-block",
            filter: "drop-shadow(0 8px 18px rgba(76, 15, 28, 0.18))",
          }}
        >
          <ClassicalLotusBloom size={220} stemLength={110} color="#450d18" />
        </motion.div>

        {/* Companion opening bud leaning alongside */}
        <motion.div
          animate={
            mobileMode
              ? undefined
              : {
                  rotate: [2, -2, 2],
                }
          }
          transition={{
            duration: 5.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          style={{
            position: "absolute",
            top: "60px",
            left: "140px",
            transformOrigin: "30% 90%",
            filter: "drop-shadow(0 6px 14px rgba(76, 15, 28, 0.15))",
          }}
        >
          <ClassicalLotusBud size={105} stemLength={120} color="#450d18" />
        </motion.div>
      </motion.div>

      {/* 2. BOTTOM-RIGHT PAIR: Inverted angle & natural asymmetry */}
      <motion.div
        initial={mobileMode ? false : { opacity: 0, y: 30, rotate: 6 }}
        whileInView={mobileMode ? undefined : { opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        style={{
          position: "absolute",
          bottom: "2%",
          right: "4%",
          zIndex: 1,
        }}
      >
        {/* Companion bud angled outwards */}
        <motion.div
          animate={
            mobileMode
              ? undefined
              : {
                  rotate: [-3, 2, -3],
                }
          }
          transition={{
            duration: 7.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "85px",
            right: "170px",
            transformOrigin: "60% 90%",
            filter: "drop-shadow(0 6px 14px rgba(76, 15, 28, 0.14))",
          }}
        >
          <ClassicalLotusBud size={115} stemLength={90} color="#450d18" />
        </motion.div>

        {/* Primary right bloom */}
        <motion.div
          animate={
            mobileMode
              ? undefined
              : {
                  rotate: [2.5, -2.5, 2.5],
                }
          }
          transition={{
            duration: 6.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          style={{
            transformOrigin: "60% 90%",
            display: "inline-block",
            filter: "drop-shadow(0 10px 22px rgba(76, 15, 28, 0.18))",
          }}
        >
          <ClassicalLotusBloom size={240} stemLength={100} color="#450d18" flip={true} />
        </motion.div>
      </motion.div>

      {/* Delicate floating lotus petals drifting in the breeze */}
      {!mobileMode && (
        <>
          <motion.div
            animate={{
              y: [-10, 15, -10],
              x: [-8, 8, -8],
              rotate: [-12, 12, -12],
            }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "28%",
              left: "18%",
              opacity: 0.45,
            }}
          >
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
              <path
                d="M 2 12 C 12 3, 28 3, 38 12 C 28 21, 12 21, 2 12 Z"
                fill="#541120"
                stroke="#3f0814"
                strokeWidth="1.2"
              />
            </svg>
          </motion.div>
          <motion.div
            animate={{
              y: [12, -14, 12],
              x: [6, -6, 6],
              rotate: [15, -15, 15],
            }}
            transition={{
              duration: 9.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            style={{
              position: "absolute",
              bottom: "32%",
              right: "22%",
              opacity: 0.4,
            }}
          >
            <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
              <path
                d="M 2 10 C 10 2, 24 2, 32 10 C 24 18, 10 18, 2 10 Z"
                fill="#541120"
                stroke="#3f0814"
                strokeWidth="1.2"
              />
            </svg>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
