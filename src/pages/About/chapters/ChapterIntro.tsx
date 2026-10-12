import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterIntroProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const LABELS = [
  { text: "hi", size: "clamp(2.8rem,7vw,6rem)" },
  { text: "YALL", size: "clamp(3.5rem,9vw,8rem)" },
  { text: "I'm", size: "clamp(2rem,5vw,4.5rem)" },
  { text: "SAANA<3", size: "clamp(3.2rem,8vw,7rem)" },
];

export default function ChapterIntro({ containerRef }: ChapterIntroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement[]>([]);
  const hibiscusRef = useRef<HTMLDivElement>(null);

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

      // Photo slides in from right, rotates to 0
      tl.fromTo(
        photoRef.current,
        { x: "60%", rotate: 10, opacity: 0, scale: 0.85 },
        { x: "0%", rotate: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 0.4 },
        0
      );

      // Labels wipe in one by one
      labelsRef.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { scaleX: 0, opacity: 0, transformOrigin: "left" },
          { scaleX: 1, opacity: 1, duration: 0.22, ease: "power3.out" },
          0.3 + i * 0.15
        );
      });

      // Hibiscus spins in
      tl.fromTo(
        hibiscusRef.current,
        { rotate: -90, scale: 0, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.35 },
        0.2
      );

      // Photo float
      tl.to(photoRef.current, { y: -8, yoyo: true, repeat: -1, duration: 2, ease: "sine.inOut" });
    }, sectionRef);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <section
      ref={sectionRef}
      id="chapter-intro"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#C2255C",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "clamp(1rem,3vw,3rem)",
        padding: "clamp(1rem,3vw,3rem)",
      }}
    >
      <PaperGrain />

      {/* Blue tape X marks top-left */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        style={{ position: "absolute", top: "4%", left: "3%", width: "clamp(60px,10vw,100px)", zIndex: 30 }}
      >
        <line x1="10" y1="10" x2="50" y2="50" stroke="#C9D9F2" strokeWidth="8" strokeLinecap="round" />
        <line x1="50" y1="10" x2="10" y2="50" stroke="#C9D9F2" strokeWidth="8" strokeLinecap="round" />
        <line x1="55" y1="45" x2="90" y2="80" stroke="#C9D9F2" strokeWidth="8" strokeLinecap="round" />
        <line x1="90" y1="45" x2="55" y2="80" stroke="#C9D9F2" strokeWidth="8" strokeLinecap="round" />
      </svg>

      {/* Outline stars top-right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 130 80"
        style={{ position: "absolute", top: "2%", right: "1%", width: "clamp(80px,15vw,160px)", zIndex: 30 }}
      >
        <polygon points="40,5 47,26 70,26 52,40 58,62 40,48 22,62 28,40 10,26 33,26" fill="none" stroke="white" strokeWidth="2" />
        <polygon points="100,10 106,28 125,28 110,39 116,58 100,47 84,58 90,39 75,28 94,28" fill="none" stroke="white" strokeWidth="2" />
      </svg>

      {/* Blue diagonal brush strokes */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 300"
        style={{ position: "absolute", right: "2%", top: "30%", width: "clamp(60px,12vw,140px)", zIndex: 10 }}
      >
        <rect x="20" y="20" width="160" height="18" rx="4" fill="#C9D9F2" transform="rotate(-35 100 29)" opacity="0.8" />
        <rect x="20" y="80" width="120" height="18" rx="4" fill="#C9D9F2" transform="rotate(-40 80 89)" opacity="0.7" />
        <rect x="30" y="140" width="140" height="18" rx="4" fill="#C9D9F2" transform="rotate(-38 100 149)" opacity="0.65" />
      </svg>

      {/* ── Left half: Text labels ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(6px,1.2vw,16px)",
          zIndex: 40,
          paddingLeft: "clamp(1rem,4vw,5rem)",
        }}
      >
        {LABELS.map((label, i) => (
          <div
            key={label.text}
            ref={(el) => { if (el) labelsRef.current[i] = el; }}
            style={{
              display: "inline-block",
              background: "#C9D9F2",
              padding: "4px clamp(10px,2vw,20px)",
              transformOrigin: "left",
            }}
          >
            <span
              style={{
                fontFamily: "'Gochi Hand', cursive, sans-serif",
                fontSize: label.size,
                color: "#3A0090",
                fontWeight: 900,
                lineHeight: 1.1,
                display: "block",
              }}
            >
              {label.text}
            </span>
          </div>
        ))}
      </div>

      {/* ── Right half: Photo with crown ── */}
      <div
        ref={photoRef}
        style={{
          position: "relative",
          zIndex: 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* White sticker frame */}
        <div
          style={{
            background: "white",
            padding: "clamp(6px,1.2vw,14px)",
            paddingBottom: "clamp(6px,1.2vw,14px)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
            position: "relative",
            maxWidth: "clamp(200px,42vw,480px)",
            width: "100%",
          }}
        >
          {/* Crown doodle */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 60"
            style={{
              position: "absolute",
              top: "-36px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(60px,12vw,120px)",
              zIndex: 50,
            }}
          >
            <polyline
              points="10,50 10,15 28,30 50,5 72,30 90,15 90,50"
              fill="none"
              stroke="#C2255C"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          {/* Duotone photo using reference frame as placeholder */}
          <img
            src="/assets/05_pink-magenta-photo.jpg"
            alt="Sahaana – hi yall intro photo"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "cover",
              objectPosition: "center 15%",
              maxHeight: "65vh",
            }}
          />

          {/* Pentagon star stickers on right of photo */}
          <svg
            aria-hidden="true"
            viewBox="0 0 60 80"
            style={{ position: "absolute", right: "-30px", top: "40%", width: "clamp(40px,7vw,70px)" }}
          >
            <polygon points="30,5 34,18 48,18 37,27 41,41 30,32 19,41 23,27 12,18 26,18" fill="none" stroke="#C2255C" strokeWidth="2" />
            <polygon points="30,48 33,57 43,57 36,62 39,72 30,67 21,72 24,62 17,57 27,57" fill="none" stroke="#C2255C" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Hibiscus bottom-right */}
      <div
        ref={hibiscusRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "clamp(20px,5vh,60px)",
          right: "clamp(16px,4vw,60px)",
          zIndex: 40,
          fontSize: "clamp(3rem,8vw,7rem)",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
        }}
      >
        🌸
      </div>

      {/* White torn strip left edge from ch1 exit */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "clamp(8px,2vw,20px)",
          height: "100%",
          background: "white",
          zIndex: 10,
        }}
      />
    </section>
  );
}
