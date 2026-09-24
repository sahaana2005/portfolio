import * as React from "react";

const TOTAL_FRAMES = 64;
const BG_HEX = "#eea3a1";

export default function CharacterHero() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  
  // Loaded images store
  const framesRef = React.useRef<HTMLImageElement[]>([]);
  const centerFrameRef = React.useRef<HTMLImageElement | null>(null);

  // Mouse & animation tracking
  const mousePos = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const auraPos = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentAngle = React.useRef(0);
  const [cursorHovered, setCursorHovered] = React.useState(false);
  const [resumeOpen, setResumeOpen] = React.useState(false);

  // DOM elements for cursor
  const cursorDotRef = React.useRef<HTMLDivElement | null>(null);
  const cursorAuraRef = React.useRef<HTMLDivElement | null>(null);

  // ── 1. PRELOAD ALL 64 WEBP FRAMES + CENTER WEBP ────────────────────────
  React.useEffect(() => {
    // Preload center
    const centerImg = new Image();
    centerImg.src = "/frames/center.webp";
    centerFrameRef.current = centerImg;

    // Preload 64 circular frames
    const frames: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${i}.webp`;
      frames.push(img);
    }
    framesRef.current = frames;
  }, []);

  // ── 2. MOUSE TRACKING ──────────────────────────────────────────────────
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ── 3. RESIZE HANDLING ─────────────────────────────────────────────────
  const setupCanvasSize = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }, []);

  React.useEffect(() => {
    setupCanvasSize();
    window.addEventListener("resize", setupCanvasSize);
    return () => window.removeEventListener("resize", setupCanvasSize);
  }, [setupCanvasSize]);

  // ── 4. 60 FPS ZERO-GHOSTING RENDER LOOP ────────────────────────────────
  React.useEffect(() => {
    let rafId: number;

    const render = () => {
      // Smooth cursor aura ring trailing
      auraPos.current.x += (mousePos.current.x - auraPos.current.x) * 0.16;
      auraPos.current.y += (mousePos.current.y - auraPos.current.y) * 0.16;
      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.transform = `translate(${auraPos.current.x}px, ${auraPos.current.y}px) translate(-50%, -50%)`;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Image native dimensions (portrait 720x1280)
      const imgW = 720;
      const imgH = 1280;

      // Portrait framing calculation:
      // On landscape/desktop screens: scale relative to height so head, face, eyes, and shoulders are framed
      // On portrait/mobile screens: scale to fill width comfortably
      let scale: number;
      if (w / h > imgW / imgH) {
        scale = (h / imgH) * 1.06;
      } else {
        scale = (w / imgW) * 1.02;
      }

      const renderW = imgW * scale;
      const renderH = imgH * scale;
      const renderX = (w - renderW) / 2;
      const renderY = h - renderH;

      // Face center coordinates in screen space (around x:50%, y:38% in image)
      const faceScreenX = renderX + renderW * 0.50;
      const faceScreenY = renderY + renderH * 0.38;

      const dx = mousePos.current.x - faceScreenX;
      const dy = mousePos.current.y - faceScreenY;
      const dist = Math.hypot(dx, dy);

      // Deadzone: within ~12% screen radius
      const deadzoneRadius = Math.min(w, h) * 0.12;
      const inDeadzone = dist < deadzoneRadius;

      // Cursor angle in radians [0, 2*PI)
      let targetAngle = Math.atan2(dy, dx);
      if (targetAngle < 0) {
        targetAngle += 2 * Math.PI;
      }

      // Shortest-path circular angular lerp (~0.26 factor for ~35ms zero-lag response)
      let diff = (targetAngle - currentAngle.current) % (2 * Math.PI);
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      currentAngle.current += diff * 0.26;

      // Map smoothed angle to nearest frame index (0..63)
      const normAngle = (currentAngle.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const frameIndex = Math.round((normAngle / (2 * Math.PI)) * TOTAL_FRAMES) % TOTAL_FRAMES;

      // Pick exactly ONE frame (Zero ghosting: NO alpha blending!)
      const targetImg = inDeadzone
        ? centerFrameRef.current
        : framesRef.current[frameIndex] || centerFrameRef.current;

      // Draw to canvas
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Seamless background fill
      ctx.fillStyle = BG_HEX;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw EXACTLY ONE frame at 100% opacity
      if (targetImg && targetImg.complete) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(targetImg, renderX, renderY, renderW, renderH);

        // 3. Smooth edge feather to guarantee 100% invisible transition into the background
        if (renderX > 0) {
          const featherWidth = 50;
          // Left edge blend
          const leftGrad = ctx.createLinearGradient(renderX - 2, 0, renderX + featherWidth, 0);
          leftGrad.addColorStop(0, BG_HEX);
          leftGrad.addColorStop(1, "rgba(238, 163, 161, 0)");
          ctx.fillStyle = leftGrad;
          ctx.fillRect(renderX - 2, renderY, featherWidth + 2, renderH);

          // Right edge blend
          const rightGrad = ctx.createLinearGradient(renderX + renderW + 2, 0, renderX + renderW - featherWidth, 0);
          rightGrad.addColorStop(0, BG_HEX);
          rightGrad.addColorStop(1, "rgba(238, 163, 161, 0)");
          ctx.fillStyle = rightGrad;
          ctx.fillRect(renderX + renderW - featherWidth, renderY, featherWidth + 4, renderH);

          // Top edge blend
          const topGrad = ctx.createLinearGradient(0, renderY - 2, 0, renderY + featherWidth);
          topGrad.addColorStop(0, BG_HEX);
          topGrad.addColorStop(1, "rgba(238, 163, 161, 0)");
          ctx.fillStyle = topGrad;
          ctx.fillRect(renderX, renderY - 2, renderW, featherWidth + 2);
        }
      }

      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="hero-container">
      {/* ── CUSTOM GLOWING MAGNETIC CURSOR ── */}
      <div ref={cursorDotRef} className="custom-cursor-dot" />
      <div 
        ref={cursorAuraRef} 
        className={`custom-cursor-aura ${cursorHovered ? "hovered" : ""}`} 
      />

      {/* ── FULLSCREEN 60FPS ZERO-GHOSTING CANVAS ── */}
      <canvas ref={canvasRef} className="hero-canvas" />

      {/* ── FLOATING FROSTED-GLASS HEADER PILL ── */}
      <header className="floating-nav">
        <a 
          href="#work" 
          className="nav-link"
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          [WORK]
        </a>
        <a 
          href="#about" 
          className="nav-link"
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          [ABOUT]
        </a>
        <a 
          href="#contact" 
          className="nav-link"
          onMouseEnter={() => setCursorHovered(true)}
          onMouseLeave={() => setCursorHovered(false)}
        >
          [CONTACT]
        </a>
      </header>

      {/* ── HERO TYPOGRAPHY (BOTTOM-LEFT) ── */}
      <div className="hero-content-bottom-left">
        <p className="hero-intro-text">Hi, I'm</p>
        <h1 className="hero-name-cursive">Sahaana</h1>

        {/* ── TWO STYLISH PILL BUTTONS ── */}
        <div className="hero-buttons-group">
          {/* Resume (Solid white with arrow icon) */}
          <button
            onClick={() => setResumeOpen(true)}
            className="btn-solid-white"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <span>Resume</span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>

          {/* ── RESUME MODAL ── */}
          {resumeOpen && (
            <div
              onClick={() => setResumeOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                backgroundColor: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
              }}
            >
              {/* Modal Card */}
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "relative",
                  width: "min(860px, 95vw)",
                  height: "min(90vh, 1100px)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                  background: "#fff",
                }}
              >
                {/* Close button */}
                <button
                  onClick={() => setResumeOpen(false)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "14px",
                    zIndex: 10,
                    background: "rgba(0,0,0,0.08)",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    fontSize: "18px",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#444",
                  }}
                >
                  ×
                </button>

                {/* Embedded Google Drive Preview */}
                <iframe
                  src="https://drive.google.com/file/d/1PVvSn5gNy8mGlYfyyj5O33OzI1QVbQjo/preview"
                  title="Sahaana Resume"
                  allow="autoplay"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                />
              </div>
            </div>
          )}

          {/* Let's Talk (Frosted glass with white border) */}
          <a
            href="#contact"
            className="btn-frosted-white"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <span>Let's Talk</span>
          </a>
        </div>
      </div>
    </div>
  );
}
