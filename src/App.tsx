import * as React from "react";
import { GooeyLoader } from "@/components/ui/loader-10";
import HeroToSplineTransition from "@/components/HeroToSplineTransition";

export default function App() {
  const [isLoading, setIsLoading]     = React.useState(true);
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
      }, 600);
      return () => clearTimeout(removeTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#eea3a1" }}>
      {/* ── LOADER SCREEN ── */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            padding: "2rem",
            transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: isFadingOut ? 0 : 1,
            transform: isFadingOut ? "translateY(-12px)" : "translateY(0)",
            pointerEvents: isFadingOut ? "none" : "auto",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              fontWeight: 500,
              userSelect: "none",
            }}
          >
            S.R
          </span>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <GooeyLoader
              primaryColor="#eea3a1"
              secondaryColor="#f9d3d2"
              borderColor="#f9fafb"
            />
          </div>

          <div style={{ height: "2rem" }} />
        </div>
      )}

      {/* ── LUXURY CHARACTER HERO & 3D SPLINE TRANSITION ── */}
      <div
        style={{
          width: "100%",
          height: "100%",
          opacity: showContent ? 1 : 0,
          transition: "opacity 500ms ease",
          pointerEvents: showContent ? "auto" : "none",
        }}
      >
        <HeroToSplineTransition />
      </div>
    </div>
  );
}
