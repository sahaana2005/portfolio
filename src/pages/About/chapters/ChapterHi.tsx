import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterHiProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChapterHi({ containerRef }: ChapterHiProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const hiStickerRef = useRef<HTMLDivElement>(null);
  const brushRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const star1Ref = useRef<HTMLDivElement>(null);
  const star2Ref = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: containerRef.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
        },
      });

      // Photo scales up and moves to center
      tl.fromTo(
        photoRef.current,
        { scale: 0.35, x: "-35%", y: "20%", opacity: 0.4 },
        { scale: 1, x: "0%", y: "0%", opacity: 1, ease: "power3.out" },
        0
      );

      // HI sticker pops in
      tl.fromTo(
        hiStickerRef.current,
        { scale: 0, rotate: -8 },
        { scale: 1, rotate: -4, ease: "back.out(1.7)", duration: 0.3 },
        0.1
      );

      // Brush draw
      if (brushRef.current) {
        const len = brushRef.current.getTotalLength?.() ?? 400;
        gsap.set(brushRef.current, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(brushRef.current, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 0.2);
      }

      // Arrow draw
      if (arrowRef.current) {
        const len = arrowRef.current.getTotalLength?.() ?? 300;
        gsap.set(arrowRef.current, { strokeDasharray: len, strokeDashoffset: len });
        tl.to(arrowRef.current, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 0.3);
      }

      // Stars twinkle
      [star1Ref, star2Ref].forEach((ref, i) => {
        tl.to(ref.current, { opacity: 1, scale: 1.1, duration: 0.2, ease: "power2.out" }, 0.25 + i * 0.1);
      });

      // White flash exit wipe
      tl.fromTo(flashRef.current, { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 0.25 }, 0.85);
    }, sectionRef);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <section
      ref={sectionRef}
      id="chapter-hi"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#D8B4C8",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PaperGrain />

      {/* Torn white paper bottom-left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "55%",
          height: "32%",
          background: "white",
          clipPath:
            "polygon(0 30%, 8% 20%, 15% 28%, 22% 18%, 30% 26%, 38% 16%, 45% 24%, 53% 14%, 60% 22%, 68% 12%, 75% 20%, 82% 10%, 90% 18%, 100% 8%, 100% 100%, 0 100%)",
          zIndex: 10,
        }}
      />

      {/* Purple brush scribble top-left */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 220"
        style={{
          position: "absolute",
          top: "4%",
          left: "2%",
          width: "clamp(90px,16vw,180px)",
          height: "auto",
          zIndex: 30,
          overflow: "visible",
        }}
      >
        <path
          ref={brushRef}
          d="M 30 200 C 20 150 10 100 30 60 C 50 20 80 10 100 40 C 120 70 90 120 70 140 C 50 160 40 180 60 200"
          stroke="#4B1FE0"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 60 200 C 80 210 100 200 110 190 C 120 180 110 160 95 170"
          stroke="#4B1FE0"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* HI sticker top-center */}
      <div
        ref={hiStickerRef}
        style={{
          position: "absolute",
          top: "8%",
          left: "clamp(18%, 25vw, 32%)",
          zIndex: 50,
          background: "white",
          padding: "8px 18px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.25), 0 0 0 3px white",
          transform: "rotate(-4deg)",
        }}
      >
        <span
          style={{
            fontFamily: "'Gochi Hand', cursive, sans-serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 900,
            color: "#111",
            letterSpacing: "0.02em",
          }}
        >
          HI
        </span>
      </div>

      {/* Arrow doodle top-right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 200"
        style={{
          position: "absolute",
          top: "6%",
          right: "clamp(8%, 14vw, 22%)",
          width: "clamp(100px, 18vw, 200px)",
          height: "auto",
          zIndex: 40,
          overflow: "visible",
        }}
      >
        <path
          ref={arrowRef}
          d="M 190 160 C 190 120 160 80 120 60 C 90 44 60 50 40 70 M 40 70 L 20 50 M 40 70 L 60 50"
          stroke="#111"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Loop */}
        <path
          d="M 110 90 C 130 70 160 75 165 95 C 170 115 155 130 135 125 C 115 120 105 105 110 90"
          stroke="#111"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Stars top-right */}
      <div
        ref={star1Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "3%",
          right: "2%",
          opacity: 0.5,
          zIndex: 30,
        }}
      >
        <svg viewBox="0 0 80 80" width="clamp(50px,10vw,90px)" height="auto">
          <polygon
            points="40,5 47,29 73,29 52,45 59,69 40,53 21,69 28,45 7,29 33,29"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      <div
        ref={star2Ref}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "12%",
          right: "10%",
          opacity: 0.4,
          zIndex: 30,
        }}
      >
        <svg viewBox="0 0 60 60" width="clamp(35px,7vw,65px)" height="auto">
          <polygon
            points="30,3 35,21 55,21 39,33 44,52 30,40 16,52 21,33 5,21 25,21"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* B&W Photo – polaroid-style */}
      <div
        ref={photoRef}
        style={{
          position: "relative",
          zIndex: 20,
          filter: "grayscale(100%) drop-shadow(0 8px 20px rgba(0,0,0,0.3)) drop-shadow(0 0 0 4px white)",
          transform: "rotate(-3deg)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "clamp(10px,2vw,20px)",
            paddingBottom: "clamp(40px,7vw,70px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            maxWidth: "clamp(240px,45vw,500px)",
          }}
        >
          <img
            src="/assets/02_intro-bw-cutout-HI.jpg"
            alt="Sahaana – B&W intro photo"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              filter: "grayscale(100%) contrast(1.05)",
            }}
          />
        </div>
      </div>

      {/* White flash exit overlay */}
      <div
        ref={flashRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 150,
          transformOrigin: "bottom",
          transform: "scaleY(0)",
          pointerEvents: "none",
        }}
      />

      {/* Scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(28px,4vh,48px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          color: "rgba(60,20,40,0.6)",
          fontFamily: "'Gochi Hand', cursive",
          fontSize: "clamp(0.75rem,1.5vw,0.95rem)",
          animation: "scrollBounce 2s ease-in-out infinite",
        }}
      >
        <span>scroll ↓</span>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
}
