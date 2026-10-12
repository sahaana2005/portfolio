import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterGymProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const WORDS_LINE1 = ["SOMETIMES", "GYM"];
const WORDS_LINE2 = ["MAKES", "IT", "BETTER"];

export default function ChapterGym({ containerRef }: ChapterGymProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const invertRef = useRef<HTMLDivElement>(null);
  const wordRefs1 = useRef<HTMLSpanElement[]>([]);
  const wordRefs2 = useRef<HTMLSpanElement[]>([]);

  React.useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
        },
      });

      // Photo Ken Burns push-in
      tl.fromTo(
        photoRef.current,
        { scale: 1.08, clipPath: "inset(0 100% 0 0)" },
        { scale: 1, clipPath: "inset(0 0% 0 0)", ease: "power2.out", duration: 0.5 },
        0
      );

      // Vertical text slides in with mask
      [...wordRefs1.current, ...wordRefs2.current].forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
          0.1 + i * 0.08
        );
      });

      // Invert beat
      tl.fromTo(
        invertRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        0.8
      );
      tl.to(invertRef.current, { opacity: 0, duration: 0.2 }, 0.95);
    }, sectionRef);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <section
      ref={sectionRef}
      id="chapter-gym"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#0E0E0E",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "clamp(120px,22vw,260px) 1fr",
      }}
    >
      <PaperGrain />

      {/* ── Left: Vertical bold text ── */}
      <div
        ref={textLeftRef}
        style={{
          position: "relative",
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(0.5rem,2vw,2rem) clamp(0.5rem,1.5vw,1.5rem)",
          gap: "clamp(4px,1vh,12px)",
          background: "#0E0E0E",
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "flex",
            flexDirection: "column",
            gap: "0.1em",
          }}
        >
          {WORDS_LINE1.map((w, i) => (
            <span
              key={w}
              ref={(el) => { if (el) wordRefs1.current[i] = el; }}
              style={{
                fontFamily: "'Syne', 'Anton', sans-serif",
                fontSize: "clamp(2rem,6vw,5.5rem)",
                fontWeight: 800,
                color: "white",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {w}
            </span>
          ))}
        </div>
        {/* Line 2 */}
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            display: "flex",
            flexDirection: "column",
            gap: "0.1em",
          }}
        >
          {WORDS_LINE2.map((w, i) => (
            <span
              key={w}
              ref={(el) => { if (el) wordRefs2.current[i] = el; }}
              style={{
                fontFamily: "'Syne', 'Anton', sans-serif",
                fontSize: "clamp(2rem,6vw,5.5rem)",
                fontWeight: 800,
                color: "white",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right: B&W mirror selfie ── */}
      <div
        ref={photoRef}
        style={{
          position: "relative",
          zIndex: 20,
          overflow: "hidden",
          clipPath: "inset(0 100% 0 0)",
        }}
      >
        <img
          src="/assets/14_gym-sometimes-gym-makes-it-better.jpg"
          alt="Sahaana gym mirror selfie"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            filter: "grayscale(100%) contrast(1.1)",
          }}
        />
      </div>

      {/* Invert / white flash overlay */}
      <div
        ref={invertRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 100,
          opacity: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(3rem,10vw,10rem)",
            fontWeight: 800,
            color: "#e0e0e0",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          MAKES IT BETTER
        </span>
      </div>
    </section>
  );
}
