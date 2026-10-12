import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PaperGrain from "../../../components/about/PaperGrain";

gsap.registerPlugin(ScrollTrigger);

interface ChapterSkincareProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const STICKERS = [
  { emoji: "🧴", top: "8%",  left: "4%",  size: "clamp(3rem,7vw,6rem)",  delay: 0.1, depth: 0.6 },
  { emoji: "🧴", top: "5%",  right: "5%", size: "clamp(3rem,7vw,6rem)",  delay: 0.2, depth: 0.4 },
  { emoji: "💊", top: "35%", left: "3%",  size: "clamp(2.5rem,5vw,4.5rem)", delay: 0.25, depth: 0.8 },
  { emoji: "🫙", top: "45%", right: "3%", size: "clamp(2.5rem,5vw,4.5rem)", delay: 0.3, depth: 0.5 },
  { emoji: "✨", top: "20%", left: "18%", size: "clamp(1.8rem,4vw,3.5rem)", delay: 0.15, depth: 0.3 },
  { emoji: "💎", top: "65%", left: "5%",  size: "clamp(2rem,4.5vw,4rem)", delay: 0.35, depth: 0.7 },
];

export default function ChapterSkincare({ containerRef }: ChapterSkincareProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const stickerRefs = useRef<HTMLDivElement[]>([]);

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

      // Photo bounces in from top
      tl.fromTo(
        photoRef.current,
        { y: "-20%", opacity: 0 },
        { y: "0%", opacity: 1, ease: "bounce.out", duration: 0.5 },
        0
      );

      // Caption bar slides up
      tl.fromTo(
        captionRef.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, ease: "power3.out", duration: 0.4 },
        0.2
      );

      // Stickers pop in with stagger
      stickerRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { scale: 0, opacity: 0, rotate: -20 },
          { scale: 1, opacity: 1, rotate: 0, ease: "back.out(1.7)", duration: 0.25 },
          0.15 + i * 0.08
        );
      });

      // Sticker float loops
      stickerRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: `${-8 - i * 2}px`,
          rotate: `${(i % 2 === 0 ? 1 : -1) * 4}deg`,
          duration: 2.5 + i * 0.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [containerRef]);


  return (
    <section
      ref={sectionRef}
      id="chapter-skincare"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        background: "#fff5f7",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PaperGrain />

      {/* Pink gradient bg wash */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 60% 30%, rgba(242,182,198,0.4) 0%, transparent 70%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      {/* Floating stickers */}
      {STICKERS.map((s, i) => (
        <div
          key={i}
          ref={(el) => { if (el) stickerRefs.current[i] = el; }}
          data-depth={s.depth}
          style={{
            position: "absolute",
            top: s.top,
            left: "left" in s ? (s as { left?: string }).left : undefined,
            right: "right" in s ? (s as { right?: string }).right : undefined,
            fontSize: s.size,
            zIndex: 40,
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.2))",
            willChange: "transform",
            userSelect: "none",
          }}
        >
          {s.emoji}
        </div>
      ))}

      {/* Main photo fills the frame */}
      <div
        ref={photoRef}
        style={{
          flex: 1,
          position: "relative",
          zIndex: 20,
          overflow: "hidden",
        }}
      >
        <img
          src="/assets/16_skincare-photo-enter.jpg"
          alt="Sahaana – skincare"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
      </div>

      {/* Caption bar full-width at bottom */}
      <div
        ref={captionRef}
        style={{
          position: "relative",
          zIndex: 50,
          background: "#F2B6C6",
          padding: "clamp(1rem,2.5vh,2rem) clamp(1rem,3vw,3rem)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontFamily: "'Baloo 2', 'Fredoka', sans-serif",
            fontSize: "clamp(1.2rem,3.5vw,3rem)",
            color: "#E0607E",
            margin: 0,
            lineHeight: 1.3,
            fontWeight: 700,
          }}
        >
          {`"geeky about all things skincare and aesthetician"`}
        </p>
      </div>

      {/* Sparkle CSS animations */}
      <style>{`
        @keyframes sparkle {
          0%,100% { opacity:0; transform: scale(0) rotate(0deg); }
          50% { opacity:1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
    </section>
  );
}
