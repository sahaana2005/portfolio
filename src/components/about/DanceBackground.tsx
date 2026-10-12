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
  size = 200,
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
        <linearGradient id={`lotusWash-${size}-${flip ? "f" : "n"}`} x1="100" y1="30" x2="100" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a1c30" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#4c0f1c" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#2e050f" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Graceful curved stem */}
      <path
        d={`M 100 162 C 102 ${180 + stemLength * 0.4}, 88 ${190 + stemLength * 0.7}, 94 ${200 + stemLength}`}
        stroke={color}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      {/* Secondary tender stem tendril / leaf thorn */}
      <path
        d={`M 98 ${170 + stemLength * 0.3} C 112 ${175 + stemLength * 0.35}, 116 ${165 + stemLength * 0.4}, 118 ${162 + stemLength * 0.45}`}
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />

      {/* Lotus Base / Sepals */}
      <path
        d="M 85 162 C 92 169, 108 169, 115 162 C 122 170, 78 170, 85 162 Z"
        fill={color}
        fillOpacity="0.85"
      />

      {/* ── Outer Petals (Layer 1 - back wash) ── */}
      <path
        d="M 100 160 C 50 148, 12 110, 20 85 C 32 75, 68 112, 100 156 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M 100 160 C 150 148, 188 110, 180 85 C 168 75, 132 112, 100 156 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Mid-Outer Flaring Petals (Layer 2) ── */}
      <path
        d="M 100 158 C 65 142, 38 108, 48 70 C 62 62, 85 105, 100 154 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M 100 158 C 135 142, 162 108, 152 70 C 138 62, 115 105, 100 154 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Mid-Interior Upright Petals (Layer 3) ── */}
      <path
        d="M 100 156 C 80 135, 62 90, 72 48 C 84 45, 96 90, 100 152 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M 100 156 C 120 135, 138 90, 128 48 C 116 45, 104 90, 100 152 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* ── Central Majestic Petal (Brahma Kamala peak) ── */}
      <path
        d="M 100 154 C 88 120, 84 65, 100 28 C 116 65, 112 120, 100 154 Z"
        fill={`url(#lotusWash-${size}-${flip ? "f" : "n"})`}
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Internal petal veining lines for intricate classical Indian art look */}
      <path d="M 100 148 C 98 105, 96 68, 100 38" stroke={color} strokeWidth="1.6" strokeOpacity="0.75" />
      <path d="M 100 146 C 86 112, 78 78, 76 56" stroke={color} strokeWidth="1.4" strokeOpacity="0.6" />
      <path d="M 100 146 C 114 112, 122 78, 124 56" stroke={color} strokeWidth="1.4" strokeOpacity="0.6" />
    </svg>
  );
};

// ── Classical Lotus Bud SVG ────────────────────────────────────────────────
export const ClassicalLotusBud: React.FC<{
  size?: number;
  color?: string;
  stemLength?: number;
  style?: React.CSSProperties;
}> = ({
  size = 110,
  color = "#4c0f1c",
  stemLength = 100,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size + stemLength * 0.75}
      viewBox={`0 0 120 ${130 + stemLength}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d={`M 60 108 C 66 ${130 + stemLength * 0.4}, 54 ${140 + stemLength * 0.7}, 58 ${130 + stemLength}`}
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M 60 105 C 42 90, 36 60, 48 38 C 58 54, 58 84, 60 105 Z"
        fill="#5a1324"
        fillOpacity="0.38"
        stroke={color}
        strokeWidth="2.2"
      />
      <path
        d="M 60 105 C 78 90, 84 60, 72 38 C 62 54, 62 84, 60 105 Z"
        fill="#5a1324"
        fillOpacity="0.38"
        stroke={color}
        strokeWidth="2.2"
      />
      <path
        d="M 60 102 C 50 78, 52 42, 60 22 C 68 42, 70 78, 60 102 Z"
        fill="#4c0f1c"
        fillOpacity="0.45"
        stroke={color}
        strokeWidth="2.4"
      />
    </svg>
  );
};

export default function DanceBackground({
  opacity = 1,
  className = "",
  isMobile = false,
}: DanceBackgroundProps) {
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
        backgroundColor: "#e29c9c", // Warm muted blush base
        zIndex: 0,
      }}
    >
      {/* ── AGED PAINTED PAPER / CANVAS TEXTURE WASH ── */}
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
          background: "radial-gradient(circle, rgba(194, 107, 114, 0.45) 0%, transparent 68%)",
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
          background: "radial-gradient(circle, rgba(168, 77, 86, 0.42) 0%, transparent 70%)",
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

      {/* ── ASYMMETRICAL LOTUS PAIRS (VISIBLE & SWAYING) ── */}

      {/* 1. TOP-LEFT PAIR: Large Lotus Bloom + Companion Bud with stems */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "3%",
          left: "3%",
          zIndex: 1,
        }}
      >
        {/* Animated gentle swaying bloom */}
        <motion.div
          animate={{
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transformOrigin: "40% 90%",
            display: "inline-block",
            filter: "drop-shadow(0 10px 22px rgba(76, 15, 28, 0.25))",
          }}
        >
          <ClassicalLotusBloom size={240} stemLength={120} color="#450d18" />
        </motion.div>

        {/* Companion opening bud leaning alongside */}
        <motion.div
          animate={{
            rotate: [2.5, -2.5, 2.5],
          }}
          transition={{
            duration: 5.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
          style={{
            position: "absolute",
            top: "60px",
            left: "150px",
            transformOrigin: "30% 90%",
            filter: "drop-shadow(0 6px 14px rgba(76, 15, 28, 0.2))",
          }}
        >
          <ClassicalLotusBud size={115} stemLength={130} color="#450d18" />
        </motion.div>
      </motion.div>

      {/* 2. BOTTOM-RIGHT PAIR: Inverted angle & natural asymmetry */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        style={{
          position: "absolute",
          bottom: "2%",
          right: "3%",
          zIndex: 1,
        }}
      >
        {/* Companion bud angled outwards */}
        <motion.div
          animate={{
            rotate: [-3, 2.5, -3],
          }}
          transition={{
            duration: 7.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "95px",
            right: "190px",
            transformOrigin: "60% 90%",
            filter: "drop-shadow(0 6px 14px rgba(76, 15, 28, 0.2))",
          }}
        >
          <ClassicalLotusBud size={125} stemLength={100} color="#450d18" />
        </motion.div>

        {/* Primary right bloom */}
        <motion.div
          animate={{
            rotate: [3, -3, 3],
          }}
          transition={{
            duration: 6.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          style={{
            transformOrigin: "60% 90%",
            display: "inline-block",
            filter: "drop-shadow(0 12px 24px rgba(76, 15, 28, 0.25))",
          }}
        >
          <ClassicalLotusBloom size={260} stemLength={110} color="#450d18" flip={true} />
        </motion.div>
      </motion.div>

      {/* Delicate floating lotus petals drifting in the breeze */}
      {!mobileMode && (
        <>
          <motion.div
            animate={{
              y: [-12, 18, -12],
              x: [-10, 10, -10],
              rotate: [-15, 15, -15],
            }}
            transition={{
              duration: 8.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "25%",
              left: "18%",
              opacity: 0.6,
            }}
          >
            <svg width="44" height="26" viewBox="0 0 40 24" fill="none">
              <path
                d="M 2 12 C 12 3, 28 3, 38 12 C 28 21, 12 21, 2 12 Z"
                fill="#541120"
                stroke="#3f0814"
                strokeWidth="1.4"
              />
            </svg>
          </motion.div>
          <motion.div
            animate={{
              y: [14, -16, 14],
              x: [8, -8, 8],
              rotate: [18, -18, 18],
            }}
            transition={{
              duration: 9.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2,
            }}
            style={{
              position: "absolute",
              bottom: "30%",
              right: "22%",
              opacity: 0.55,
            }}
          >
            <svg width="38" height="22" viewBox="0 0 34 20" fill="none">
              <path
                d="M 2 10 C 10 2, 24 2, 32 10 C 24 18, 10 18, 2 10 Z"
                fill="#541120"
                stroke="#3f0814"
                strokeWidth="1.4"
              />
            </svg>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
