import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterBtechProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const BULLETS = [
  { text: "B.TECH CSE – CYBERSECURITY", neonFirst: true },
  { text: "PASSIONATE ABOUT DEFENSIVE SECURITY & BLUE TEAMING", neonFirst: false },
  { text: "LOVE WORKING WITH SQL & DATABASE OPTIMIZATION", neonFirst: false },
  { text: "ENJOY CREATING CREATIVE, INTERACTIVE WEBSITES", neonFirst: false },
  { text: "EXPLORING 3D MODELLING & DESIGN", neonFirst: false },
  { text: "ALWAYS CURIOUS TO LEARN, BUILD, AND EXPERIMENT", neonFirst: false },
];

export default function ChapterBtech({ containerRef }: ChapterBtechProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const bulletRefs = useRef<HTMLLIElement[]>([]);

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

      // Photo slides up
      tl.fromTo(
        photoRef.current,
        { y: "30%", opacity: 0 },
        { y: "0%", opacity: 1, ease: "power3.out", duration: 0.4 },
        0
      );

      // Pink note unfolds (clip-path reveal)
      tl.fromTo(
        noteRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, ease: "power2.out", duration: 0.4 },
        0.15
      );

      // Folder icon drops in
      tl.fromTo(
        folderRef.current,
        { y: "-40px", opacity: 0, scale: 0.7 },
        { y: "0px", opacity: 1, scale: 1, ease: "back.out(1.7)", duration: 0.3 },
        0.25
      );

      // Bullets stagger reveal
      bulletRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" },
          0.4 + i * 0.12
        );
      });

      // Cursor "click" bounce
      tl.to(folderRef.current, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 }, 0.5);
    }, sectionRef);

    return () => ctx.revert();
  }, [containerRef]);

  return (
    <section
      ref={sectionRef}
      id="chapter-btech"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#B9C9D9",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr",
        alignItems: "center",
      }}
    >
      <PaperGrain />

      {/* White spiky starburst top-left */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "clamp(80px,18vw,200px)",
          zIndex: 10,
          opacity: 0.9,
        }}
      >
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="100"
            x2={100 + 95 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 95 * Math.sin((angle * Math.PI) / 180)}
            stroke="white"
            strokeWidth="20"
            strokeLinecap="round"
          />
        ))}
        <circle cx="100" cy="100" r="30" fill="white" />
      </svg>

      {/* Purple brush top-right */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 60"
        style={{ position: "absolute", top: "4%", right: "2%", width: "clamp(80px,18vw,200px)", zIndex: 20 }}
      >
        <rect x="0" y="10" width="200" height="20" rx="6" fill="#4B1FE0" transform="rotate(-15 100 20)" />
        <rect x="20" y="35" width="160" height="18" rx="6" fill="#4B1FE0" transform="rotate(-18 100 44)" />
      </svg>

      {/* Purple brush bottom */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 60"
        style={{ position: "absolute", bottom: "4%", left: 0, width: "100%", zIndex: 20 }}
      >
        <rect x="-10" y="20" width="180" height="22" rx="6" fill="#4B1FE0" transform="rotate(-8 80 31)" opacity="0.9" />
        <rect x="200" y="15" width="230" height="22" rx="6" fill="#4B1FE0" transform="rotate(-12 315 26)" opacity="0.85" />
      </svg>

      {/* ── Left: Full-body photo ── */}
      <div
        ref={photoRef}
        style={{
          position: "relative",
          zIndex: 30,
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        <img
          src="/assets/07_blue-paper-btech-cse-start.jpg"
          alt="Sahaana in blue striped shirt"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            filter: "drop-shadow(4px 0 12px rgba(0,0,0,0.15))",
          }}
        />
      </div>

      {/* ── Right: Pink note + bullets ── */}
      <div
        style={{
          position: "relative",
          zIndex: 40,
          padding: "clamp(1rem,3vw,3rem)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "clamp(0.5rem,1.5vh,1.5rem)",
        }}
      >
        {/* Pixel folder + cursor */}
        <div
          ref={folderRef}
          aria-hidden="true"
          style={{
            fontSize: "clamp(2rem,6vw,5rem)",
            filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.2))",
            alignSelf: "flex-end",
            marginBottom: "-8px",
          }}
        >
          📁🖱️
        </div>

        {/* Pink torn-paper sticky note */}
        <div
          ref={noteRef}
          style={{
            background: "#F2B6C6",
            borderRadius: "4px 4px 30px 4px",
            padding: "clamp(1rem,2.5vw,2rem)",
            width: "100%",
            boxShadow: "4px 6px 20px rgba(0,0,0,0.15), inset 0 -3px 0 rgba(0,0,0,0.06)",
            clipPath: "inset(0 0 0% 0)",
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "clamp(4px,1vh,12px)" }}>
            {BULLETS.map((b, i) => (
              <li
                key={b.text}
                ref={(el) => { if (el) bulletRefs.current[i] = el; }}
                style={{
                  fontFamily: "'Gochi Hand', cursive, sans-serif",
                  fontSize: "clamp(0.7rem,1.6vw,1.05rem)",
                  color: "#1a0010",
                  lineHeight: 1.35,
                  display: "flex",
                  gap: "0.5em",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "#C2255C", fontWeight: 900, flexShrink: 0 }}>•</span>
                {b.neonFirst ? (
                  <span>
                    B.TECH CSE –{" "}
                    <span
                      style={{
                        color: "#FF2D95",
                        textShadow: "0 0 8px rgba(255,45,149,0.7), 0 0 16px rgba(255,45,149,0.4)",
                      }}
                    >
                      CYBERSECURITY
                    </span>
                  </span>
                ) : (
                  <span>{b.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Torn white edge top-left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "30%",
          height: "22%",
          background: "white",
          clipPath:
            "polygon(0 0, 100% 0, 88% 40%, 75% 30%, 62% 45%, 48% 35%, 35% 50%, 22% 38%, 10% 55%, 0 40%)",
          zIndex: 15,
        }}
      />
    </section>
  );
}
