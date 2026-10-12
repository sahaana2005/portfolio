import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterContactProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  onContactClick?: () => void;
}

const CONTACT_TEXT = "check out my contact!";

export default function ChapterContact({ containerRef, onContactClick }: ChapterContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const arrow1Ref = useRef<SVGPathElement>(null);
  const arrow2Ref = useRef<SVGPathElement>(null);
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const typingRef = useRef({ chars: 0 });
  const [displayedText, setDisplayedText] = React.useState("");
  const [caretVisible, setCaretVisible] = React.useState(true);

  React.useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const caretInterval = setInterval(() => setCaretVisible((v) => !v), 530);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, (self.progress - 0.3) / 0.55));
            const targetChars = Math.floor(p * CONTACT_TEXT.length);
            if (targetChars !== typingRef.current.chars) {
              typingRef.current.chars = targetChars;
              setDisplayedText(CONTACT_TEXT.slice(0, targetChars));
            }
          },
        },
      });

      // Train photo slides up
      tl.fromTo(
        trainRef.current,
        { y: "30%", opacity: 0 },
        { y: "0%", opacity: 1, ease: "power3.out", duration: 0.4 },
        0
      );

      // Train window scenery parallax
      tl.to(".train-scenery", { x: "-8%", ease: "none", duration: 1 }, 0);

      // Arrow 1 draws
      if (arrow1Ref.current) {
        const len1 = arrow1Ref.current.getTotalLength?.() ?? 200;
        gsap.set(arrow1Ref.current, { strokeDasharray: len1, strokeDashoffset: len1 });
        tl.to(arrow1Ref.current, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 0.15);
      }

      // Arrow 2 draws
      if (arrow2Ref.current) {
        const len2 = arrow2Ref.current.getTotalLength?.() ?? 200;
        gsap.set(arrow2Ref.current, { strokeDasharray: len2, strokeDashoffset: len2 });
        tl.to(arrow2Ref.current, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 0.2);
      }

      // Bubble pops in
      tl.fromTo(
        bubbleRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.35 },
        0.1
      );

      // Thought dots
      [dot1Ref, dot2Ref].forEach((ref, i) => {
        tl.fromTo(
          ref.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, ease: "back.out(2)", duration: 0.2 },
          0.15 + i * 0.07
        );
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      clearInterval(caretInterval);
    };
  }, [containerRef]);

  const handleBubbleHover = (e: React.MouseEvent<HTMLButtonElement>, entering: boolean) => {
    gsap.to(e.currentTarget, {
      rotate: entering ? [0, -3, 3, -2, 0].join(",") : 0,
      scale: entering ? 1.04 : 1,
      duration: entering ? 0.5 : 0.3,
      ease: entering ? "elastic.out(1,0.3)" : "power2.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="chapter-contact"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#A8182E",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <PaperGrain />

      {/* Top half: arrow + bubble content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(1rem,4vh,4rem) clamp(1rem,4vw,4rem)",
          gap: "clamp(0.5rem,2vh,2rem)",
          position: "relative",
          zIndex: 30,
        }}
      >
        {/* SVG curly arrows */}
        <svg
          aria-hidden="true"
          viewBox="0 0 500 200"
          style={{
            width: "clamp(200px,55vw,540px)",
            height: "auto",
            overflow: "visible",
            position: "absolute",
            top: "clamp(2%,5vh,8%)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 35,
          }}
        >
          {/* Left arrow curling down to bubble */}
          <path
            ref={arrow1Ref}
            d="M 80 30 C 80 80 120 120 200 160 M 200 160 L 185 145 M 200 160 L 190 175"
            stroke="#111"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Loop on left */}
          <path
            d="M 70 40 C 60 15 85 5 95 20 C 105 35 90 50 75 42"
            stroke="#111"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right arrow */}
          <path
            ref={arrow2Ref}
            d="M 420 30 C 420 80 380 120 300 160 M 300 160 L 315 145 M 300 160 L 310 175"
            stroke="#111"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Loop on right */}
          <path
            d="M 430 40 C 440 15 415 5 405 20 C 395 35 410 50 425 42"
            stroke="#111"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Thought bubble */}
        <button
          ref={bubbleRef}
          type="button"
          id="contact-bubble"
          onClick={onContactClick}
          onMouseEnter={(e) => handleBubbleHover(e, true)}
          onMouseLeave={(e) => handleBubbleHover(e, false)}
          aria-label="Go to contact section"
          style={{
            position: "relative",
            background: "#C9D9F2",
            borderRadius: "50%",
            width: "clamp(220px, 50vw, 540px)",
            aspectRatio: "4/3",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem,3vw,3rem)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            zIndex: 50,
            outline: "none",
            marginTop: "clamp(2rem,6vh,6rem)",
          }}
          style-focus="outline: 3px solid white; outline-offset: 4px;"
        >
          {/* Cloud bumps */}
          {[
            { top: "-20%", left: "15%", size: "30%" },
            { top: "-25%", left: "35%", size: "38%" },
            { top: "-22%", left: "55%", size: "32%" },
            { top: "-15%", right: "10%", size: "24%" },
            { top: "-10%", left: "5%", size: "22%" },
          ].map((bump, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position: "absolute",
                top: bump.top,
                left: "left" in bump ? bump.left : undefined,
                right: "right" in bump ? (bump as { right?: string }).right : undefined,
                width: bump.size,
                aspectRatio: "1",
                background: "#C9D9F2",
                borderRadius: "50%",
              }}
            />
          ))}

          <p
            style={{
              fontFamily: "'Baloo 2', 'Fredoka', sans-serif",
              fontSize: "clamp(1rem,3vw,2rem)",
              color: "#1a1a1a",
              textAlign: "center",
              lineHeight: 1.4,
              margin: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            {displayedText}
            <span
              style={{
                display: "inline-block",
                width: "2px",
                height: "1em",
                background: "#1a1a1a",
                marginLeft: "2px",
                verticalAlign: "middle",
                opacity: caretVisible ? 1 : 0,
              }}
            />
          </p>
        </button>

        {/* Trailing thought dots */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
            marginTop: "8px",
            alignSelf: "flex-start",
            marginLeft: "clamp(12%,22vw,30%)",
          }}
        >
          <div
            ref={dot1Ref}
            aria-hidden="true"
            style={{
              width: "clamp(14px,3vw,28px)",
              height: "clamp(14px,3vw,28px)",
              borderRadius: "50%",
              background: "#C9D9F2",
              scale: 0,
            }}
          />
          <div
            ref={dot2Ref}
            aria-hidden="true"
            style={{
              width: "clamp(10px,2vw,18px)",
              height: "clamp(10px,2vw,18px)",
              borderRadius: "50%",
              background: "#C9D9F2",
              scale: 0,
              marginLeft: "8px",
            }}
          />
        </div>
      </div>

      {/* Train window photo – bottom band */}
      <div
        ref={trainRef}
        style={{
          height: "40vh",
          position: "relative",
          zIndex: 20,
          overflow: "hidden",
        }}
      >
        <div
          className="train-scenery"
          style={{
            width: "110%",
            height: "100%",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          <img
            src="/assets/19_closing-check-out-my-contact.jpg"
            alt="Sahaana looking out of a train window"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 60%",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}
