import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterDanceProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const FULL_QUOTE = `"BEEN CRAZY ABOUT DANCE SINCE I COULD WALK"`;

export default function ChapterDance({ containerRef }: ChapterDanceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const typingRef = useRef({ chars: 0, rafId: 0 });
  const [displayedText, setDisplayedText] = React.useState("");
  const [caretVisible, setCaretVisible] = React.useState(true);

  React.useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    // Caret blink
    const caretInterval = setInterval(() => setCaretVisible((v) => !v), 530);

    const ctx = gsap.context(() => {
      // Scroll-scrubbed paper scroll + typewriter reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            // Type the quote proportional to scroll progress (0.2 to 0.8 range)
            const p = Math.max(0, Math.min(1, (self.progress - 0.2) / 0.6));
            const targetChars = Math.floor(p * FULL_QUOTE.length);
            if (targetChars !== typingRef.current.chars) {
              typingRef.current.chars = targetChars;
              setDisplayedText(FULL_QUOTE.slice(0, targetChars));
            }
          },
        },
      });

      // Paper feeds up out of typewriter
      tl.fromTo(
        paperRef.current,
        { y: "30%" },
        { y: "-8%", ease: "none", duration: 1 },
        0
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      clearInterval(caretInterval);
    };
  }, [containerRef]);

  return (
    <section
      ref={sectionRef}
      id="chapter-dance"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#3A0000",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <PaperGrain />

      {/* Vignette overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Large faint DANCE text in bg */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(6rem,20vw,18rem)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.04)",
          whiteSpace: "nowrap",
          zIndex: 5,
          userSelect: "none",
          letterSpacing: "0.15em",
        }}
      >
        DANCE
      </div>

      {/* Paper + typewriter assembly */}
      <div
        style={{
          position: "relative",
          zIndex: 30,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Paper sheet */}
        <div
          ref={paperRef}
          style={{
            background: "#F4EFE8",
            width: "clamp(220px, 48vw, 580px)",
            minHeight: "clamp(300px, 55vh, 620px)",
            padding: "clamp(1rem,3vw,3rem)",
            boxShadow: "0 -4px 30px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "clamp(0.5rem,2vh,1.5rem)",
            borderTop: "3px solid #aaa",
            borderLeft: "3px solid #aaa",
            borderRight: "3px solid #aaa",
            position: "relative",
          }}
        >
          {/* Dance poster image */}
          <div
            style={{
              width: "clamp(140px,30vw,320px)",
              height: "auto",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            <img
              src="/assets/12_dance-quote-typed.jpg"
              alt="Sahaana dance poster"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>

          {/* Quote text – typewriter style */}
          <p
            ref={quoteRef}
            style={{
              fontFamily: "'Chango', 'Titan One', 'Syne', sans-serif",
              fontSize: "clamp(1.2rem,3.5vw,2.8rem)",
              color: "#3A0000",
              textAlign: "center",
              lineHeight: 1.3,
              margin: 0,
              minHeight: "6em",
              position: "relative",
            }}
          >
            {displayedText}
            <span
              style={{
                display: "inline-block",
                width: "3px",
                height: "1em",
                background: "#3A0000",
                marginLeft: "2px",
                verticalAlign: "middle",
                opacity: caretVisible ? 1 : 0,
              }}
            />
          </p>
        </div>

        {/* Typewriter body */}
        <div
          aria-hidden="true"
          style={{
            width: "clamp(260px, 58vw, 680px)",
            background: "linear-gradient(135deg, #8B0000 0%, #6B0000 40%, #500000 100%)",
            height: "clamp(100px,18vh,200px)",
            borderRadius: "12px 12px 0 0",
            boxShadow: "0 -8px 30px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Keys row */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(10px,2vh,20px)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "clamp(2px,0.5vw,6px)",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "90%",
            }}
          >
            {"QWERTYUIOPASDFGHJKLZXCVBNM".split("").slice(0, 20).map((k) => (
              <div
                key={k}
                style={{
                  width: "clamp(16px,2.5vw,28px)",
                  height: "clamp(16px,2.5vw,28px)",
                  background: "#f8f8f0",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(6px,1vw,11px)",
                  fontWeight: 700,
                  color: "#333",
                  boxShadow: "0 2px 0 #aaa",
                }}
              >
                {k}
              </div>
            ))}
          </div>

          {/* Paper guide slot */}
          <div
            style={{
              position: "absolute",
              top: "clamp(8px,1.5vh,16px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "clamp(6px,1vh,10px)",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
