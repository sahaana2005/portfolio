import * as React from "react";
import { motion, MotionValue } from "framer-motion";

export interface SkincareBackgroundProps {
  opacity?: MotionValue<number> | number;
  className?: string;
  isMobile?: boolean;
}

// ── Glassy Translucent Serum Bubble ─────────────────────────────────────────
interface BubbleItem {
  id: number;
  size: number;
  x: string;
  y: string;
  driftY: number;
  duration: number;
  delay: number;
}

const SERUM_BUBBLES: BubbleItem[] = [
  { id: 1, size: 26, x: "12%", y: "24%", driftY: -32, duration: 6.2, delay: 0 },
  { id: 2, size: 16, x: "18%", y: "38%", driftY: -24, duration: 5.5, delay: 1.2 },
  { id: 3, size: 34, x: "82%", y: "20%", driftY: -38, duration: 7.1, delay: 0.5 },
  { id: 4, size: 20, x: "88%", y: "42%", driftY: -28, duration: 6.8, delay: 2.1 },
  { id: 5, size: 28, x: "28%", y: "68%", driftY: -35, duration: 6.0, delay: 0.8 },
  { id: 6, size: 18, x: "34%", y: "82%", driftY: -22, duration: 5.2, delay: 1.8 },
  { id: 7, size: 38, x: "72%", y: "74%", driftY: -42, duration: 7.6, delay: 1.1 },
  { id: 8, size: 22, x: "64%", y: "86%", driftY: -26, duration: 5.9, delay: 2.4 },
  { id: 9, size: 15, x: "48%", y: "15%", driftY: -20, duration: 6.5, delay: 1.5 },
  { id: 10, size: 24, x: "52%", y: "88%", driftY: -30, duration: 7.0, delay: 0.3 },
];

export default function SkincareBackground({
  opacity = 1,
  className = "",
  isMobile = false,
}: SkincareBackgroundProps) {
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
      className={`skincare-background-container ${className}`}
      style={{
        opacity: opacity as any,
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#ffe4ec", // Soft serum pink base
        zIndex: 0,
      }}
    >
      {/* ── SOFT SERUM BASE GRADIENT ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, #fff0f5 0%, #ffe4ec 55%, #fcd2e1 100%)",
        }}
      />

      {/* ── LARGE POOLED LIQUID DROPLETS / PETRI-DISH MENISCUS SHAPES ── */}

      {/* Pool 1: Upper Left Liquid Pool (translucent, meniscus highlight & shadow) */}
      <motion.div
        animate={
          mobileMode
            ? undefined
            : {
                scale: [1, 1.03, 1],
                rotate: [0, 2, 0],
              }
        }
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "6%",
          left: "5%",
          width: "min(420px, 60vw)",
          height: "min(380px, 55vw)",
          borderRadius: "56% 44% 62% 38% / 45% 52% 48% 55%",
          background:
            "radial-gradient(circle at 35% 32%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 225, 238, 0.5) 45%, rgba(244, 114, 182, 0.22) 80%, rgba(225, 29, 72, 0.15) 100%)",
          boxShadow:
            "inset 0 3px 12px rgba(255, 255, 255, 0.95), inset 0 -4px 14px rgba(219, 39, 119, 0.2), 0 20px 45px rgba(219, 39, 119, 0.08)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          border: "1px solid rgba(255, 255, 255, 0.7)",
        }}
      >
        {/* Specular meniscus highlight arc */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "18%",
            width: "36%",
            height: "18%",
            borderRadius: "50%",
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), transparent)",
            transform: "rotate(-25deg)",
            filter: "blur(1px)",
          }}
        />
      </motion.div>

      {/* Pool 2: Center Right Large Liquid Pool */}
      <motion.div
        animate={
          mobileMode
            ? undefined
            : {
                scale: [1, 1.035, 1],
                rotate: [0, -2, 0],
              }
        }
        transition={{
          duration: 11.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          position: "absolute",
          top: "42%",
          right: "4%",
          width: "min(460px, 65vw)",
          height: "min(400px, 58vw)",
          borderRadius: "44% 56% 38% 62% / 54% 42% 58% 46%",
          background:
            "radial-gradient(circle at 40% 30%, rgba(255, 255, 255, 0.88) 0%, rgba(255, 222, 236, 0.52) 48%, rgba(244, 114, 182, 0.24) 82%, rgba(225, 29, 72, 0.16) 100%)",
          boxShadow:
            "inset 0 3px 14px rgba(255, 255, 255, 0.95), inset 0 -5px 16px rgba(219, 39, 119, 0.22), 0 24px 50px rgba(219, 39, 119, 0.09)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          border: "1px solid rgba(255, 255, 255, 0.75)",
        }}
      >
        {/* Specular highlight crescent */}
        <div
          style={{
            position: "absolute",
            top: "16%",
            left: "22%",
            width: "32%",
            height: "16%",
            borderRadius: "50%",
            background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), transparent)",
            transform: "rotate(-18deg)",
            filter: "blur(1px)",
          }}
        />
      </motion.div>

      {/* Pool 3: Bottom Left Organic Drop */}
      <motion.div
        animate={
          mobileMode
            ? undefined
            : {
                scale: [1, 1.025, 1],
              }
        }
        transition={{
          duration: 9.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        style={{
          position: "absolute",
          bottom: "4%",
          left: "14%",
          width: "min(340px, 50vw)",
          height: "min(300px, 45vw)",
          borderRadius: "58% 42% 52% 48% / 46% 56% 44% 54%",
          background:
            "radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 225, 238, 0.45) 45%, rgba(244, 114, 182, 0.2) 80%, rgba(225, 29, 72, 0.12) 100%)",
          boxShadow:
            "inset 0 2px 10px rgba(255, 255, 255, 0.9), inset 0 -3px 12px rgba(219, 39, 119, 0.18), 0 16px 36px rgba(219, 39, 119, 0.07)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
        }}
      />

      {/* ── SCATTERED SERUM MICRO-BUBBLES (WITH LOOPING DRIFT & SCALE PULSE) ── */}
      {SERUM_BUBBLES.map((bubble) => (
        <motion.div
          key={bubble.id}
          animate={
            mobileMode
              ? undefined
              : {
                  y: [0, bubble.driftY, 0],
                  scale: [1, 1.09, 1],
                }
          }
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
          style={{
            position: "absolute",
            top: bubble.y,
            left: bubble.x,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 215, 232, 0.65) 45%, rgba(244, 114, 182, 0.35) 85%, rgba(219, 39, 119, 0.25) 100%)",
            boxShadow:
              "inset 0 1px 3px rgba(255, 255, 255, 0.95), inset 0 -1.5px 3px rgba(219, 39, 119, 0.35), 0 4px 10px rgba(219, 39, 119, 0.12)",
            border: "0.5px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          {/* Specular gleam pinprick */}
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "24%",
              width: "28%",
              height: "28%",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              opacity: 0.9,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
