import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

const CANVA_URL = "https://saana07.my.canva.site/";

interface AboutProps {
  isVisible: boolean;
  onBack: () => void;
  onContactClick?: () => void;
}

function Card({ children, style, delay = 0, rotate = 0 }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  delay?: number;
  rotate?: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      transform: visible ? `rotate(${rotate}deg) translateY(0)` : `rotate(${rotate}deg) translateY(40px)`,
      opacity: visible ? 1 : 0,
      transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.classList.add("in-view");
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Canva embed with IntersectionObserver lazy-load ──────────────────────
   • data-src holds the URL; JS copies it to src when ≥50% visible
   • src is cleared on exit so Canva animations replay every time
   • Falls back to a styled button if the iframe fails to load
   • root: scrollerRef keeps the observer scoped to our scroll container
──────────────────────────────────────────────────────────────────────────── */
const CANVA_EMBED_URL = "https://www.canva.com/design/DAHXsiI7ClQ/_EX1_4ytiCP8k4bYrhjonQ/view?embed";

function CanvaEmbed({ scrollRoot }: { scrollRoot: React.RefObject<HTMLDivElement | null> }) {
  const sectionRef  = useRef<HTMLElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const iframeRef   = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [iframeError, setIframeError] = useState(false);

  // Apply scroll-reveal to the section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const revealObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("in-view"); },
      { threshold: 0.08 }
    );
    revealObs.observe(el);
    return () => revealObs.disconnect();
  }, []);

  // IntersectionObserver for the iframe: threshold 0.5
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const iframe  = iframeRef.current;
    if (!wrapper || !iframe) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (!iframeRef.current) return;
        if (entry.isIntersecting) {
          // Load only when at least 50% is visible
          if (!iframeRef.current.src || iframeRef.current.src === window.location.href) {
            iframeRef.current.src = CANVA_EMBED_URL;
          }
        } else {
          // Remove src on exit → animations replay on next entry
          iframeRef.current.src = "";
        }
      },
      {
        root: scrollRoot.current,  // scoped to the About scroll container
        threshold: 0.5,            // ← change this to load earlier (0) or later (1)
      }
    );
    observerRef.current.observe(wrapper);
    return () => observerRef.current?.disconnect();
  }, [scrollRoot, iframeError]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="about-scroll-reveal"
      style={{
        background: "linear-gradient(180deg,#eebad3 0%,#f0c8d8 100%)",
        padding: "clamp(2.5rem,6vh,5rem) clamp(1rem,4vw,3rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Gochi Hand',cursive", fontSize: "clamp(0.8rem,1.8vw,1rem)", color: "rgba(84,20,34,0.6)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
          my canva portfolio
        </div>
        <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: "clamp(2rem,5.5vw,3.8rem)", fontWeight: 700, color: "#5e17eb", margin: 0, textShadow: "0 2px 12px rgba(94,23,235,0.12)" }}>
          All about me ♡
        </h2>
      </div>

      {/* ── Canva embed wrapper (.canva-embed) ── */}
      <div ref={wrapperRef} className="canva-embed">
        {!iframeError ? (
          <iframe
            ref={iframeRef}
            /* src is intentionally left empty — IntersectionObserver sets it */
            data-src={CANVA_EMBED_URL}
            title="Sahaana's Canva portfolio"
            allow="fullscreen"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            onError={() => setIframeError(true)}
          />
        ) : (
          /* Fallback: shown if Canva refuses to embed */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "1.2rem", padding: "2rem", textAlign: "center" }}>
            <span style={{ fontFamily: "'Gochi Hand',cursive", fontSize: "clamp(1rem,2.5vw,1.4rem)", color: "#541422", opacity: 0.7 }}>Couldn't embed — open it directly ✨</span>
            <a
              href={CANVA_EMBED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-solid-white"
            >
              <ExternalLink size={16} style={{ marginRight: 6 }} />
              View my full Canva portfolio
            </a>
          </div>
        )}
      </div>

      {/* Always-visible fallback link underneath */}
      <a
        href={CANVA_EMBED_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "'Inter',sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "rgba(84,20,34,0.6)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s ease", opacity: 0.75 }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#5e17eb"; e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(84,20,34,0.6)"; e.currentTarget.style.opacity = "0.75"; }}
      >
        <ExternalLink size={12} />
        Open in new tab
      </a>
    </section>
  );
}

function InfoCard({ emoji, title, desc, delay }: { emoji: string; title: string; desc: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.setTimeout(() => setVisible(true), delay);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.18)", backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)", border: "1.5px solid rgba(255,255,255,0.4)",
      borderRadius: 16, padding: "clamp(1rem,2.5vw,1.5rem)",
      display: "flex", flexDirection: "column", gap: "0.5rem",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.95)",
      transition: "opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    }}>
      <span style={{ fontSize: "2rem" }}>{emoji}</span>
      <span style={{ fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: "clamp(0.95rem,2vw,1.1rem)", color: "#fff" }}>{title}</span>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(0.8rem,1.5vw,0.9rem)", color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{desc}</span>
    </div>
  );
}

function BulletItem({ text, index }: { text: string; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.setTimeout(() => setVisible(true), index * 90);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);
  return (
    <li ref={ref} style={{
      fontFamily: "'Gochi Hand',cursive,sans-serif", fontSize: "clamp(0.8rem,1.8vw,1.05rem)",
      color: "#1a0010", lineHeight: 1.4, display: "flex", gap: "0.6em", alignItems: "flex-start",
      opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(16px)",
      transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <span style={{ color: "#C2255C", fontWeight: 900, flexShrink: 0, marginTop: 1 }}>•</span>
      {index === 0 ? (
        <span>B.TECH CSE – <span style={{ color: "#5e17eb", fontWeight: 900, textShadow: "0 0 8px rgba(94,23,235,0.35)" }}>CYBERSECURITY</span></span>
      ) : (<span>{text}</span>)}
    </li>
  );
}

function InterestChip({ emoji, label, delay }: { emoji: string; label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) window.setTimeout(() => setVisible(true), delay);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} style={{
      display: "flex", alignItems: "center", gap: "0.5rem",
      background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)", border: "1.5px solid rgba(255,255,255,0.9)",
      borderRadius: 9999, padding: "0.6rem 1.2rem",
      fontFamily: "'Inter',sans-serif", fontWeight: 600,
      fontSize: "clamp(0.85rem,1.8vw,1rem)", color: "#390003",
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1) translateY(0)" : "scale(0.85) translateY(12px)",
      transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
    }}>
      <span style={{ fontSize: "1.3rem" }}>{emoji}</span>
      {label}
    </div>
  );
}

function Section2({ onContactClick }: { onContactClick?: () => void }) {
  const ref = useScrollReveal();
  const cards = [
    { emoji: "👩‍💻", title: "CS Student", desc: "B.Tech CSE – Cybersecurity at VIT Vellore" },
    { emoji: "🛡️", title: "Blue Teamer", desc: "Passionate about Defensive Security & threat hunting" },
    { emoji: "🌐", title: "Web Creator", desc: "Love building creative, interactive websites" },
    { emoji: "🗄️", title: "SQL Nerd", desc: "Enjoy working with databases & optimization" },
    { emoji: "🎨", title: "3D Explorer", desc: "Exploring 3D modelling, Spline & design" },
    { emoji: "✨", title: "Always Curious", desc: "Always learning, building, and experimenting" },
  ];
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="about-scroll-reveal" style={{
      minHeight: "100dvh", background: "linear-gradient(160deg,#e02e68 0%,#d4568a 35%,#eebad3 100%)",
      position: "relative", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "clamp(3rem,8vh,6rem) clamp(1rem,5vw,4rem)", gap: "3rem", overflow: "hidden",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Gochi Hand',cursive", fontSize: "clamp(0.85rem,2vw,1.1rem)", color: "rgba(255,255,255,0.75)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          a little about me
        </div>
        <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 700, color: "#fff", margin: 0, textShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
          Nice to meet you! ♡
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(clamp(220px,28vw,300px),1fr))", gap: "clamp(0.8rem,2vw,1.5rem)", width: "100%", maxWidth: 960 }}>
        {cards.map((c, i) => <InfoCard key={c.title} {...c} delay={i * 80} />)}
      </div>
      {onContactClick && (
        <button type="button" onClick={onContactClick} className="btn-solid-white" style={{ fontSize: "1rem", padding: "0.9rem 2.2rem" }}>
          Say Hi ✉
        </button>
      )}
    </section>
  );
}

function Section3() {
  const ref = useScrollReveal();
  const bullets = [
    "B.TECH CSE – CYBERSECURITY",
    "PASSIONATE ABOUT DEFENSIVE SECURITY & BLUE TEAMING",
    "LOVE WORKING WITH SQL & DATABASE OPTIMIZATION",
    "ENJOY CREATING CREATIVE, INTERACTIVE WEBSITES",
    "EXPLORING 3D MODELLING & DESIGN",
    "ALWAYS CURIOUS TO LEARN, BUILD, AND EXPERIMENT",
  ];
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="about-scroll-reveal" style={{
      minHeight: "100dvh", background: "#390003", position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "clamp(3rem,8vh,6rem) clamp(1rem,6vw,5rem)", gap: "2.5rem", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", background: "radial-gradient(ellipse,rgba(94,23,235,0.2) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        <div style={{ fontFamily: "'Gochi Hand',cursive", fontSize: "clamp(0.8rem,1.8vw,1rem)", color: "rgba(238,186,211,0.6)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>what I do</div>
        <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: "clamp(2.2rem,6vw,4.5rem)", fontWeight: 700, color: "#eebad3", margin: 0 }}>Skills & Interests</h2>
      </div>
      <div style={{ background: "#bfd8ec", borderRadius: "4px 4px 28px 4px", padding: "clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,4vw,3rem)", maxWidth: 680, width: "100%", boxShadow: "0 16px 48px rgba(0,0,0,0.35),inset 0 -3px 0 rgba(0,0,0,0.08)", position: "relative", zIndex: 2 }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "clamp(0.6rem,1.5vh,1rem)" }}>
          {bullets.map((b, i) => <BulletItem key={b} text={b} index={i} />)}
        </ul>
      </div>
      <div style={{ fontSize: "clamp(2.5rem,5vw,4rem)", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))", position: "relative", zIndex: 2 }}>📁🖱️</div>
    </section>
  );
}

function Section4({ onContactClick, canvaUrl }: { onContactClick?: () => void; canvaUrl: string }) {
  const ref = useScrollReveal();
  const interests = [
    { emoji: "💃", label: "Dancing" }, { emoji: "🎵", label: "Music" },
    { emoji: "🏋️", label: "Gym" }, { emoji: "✨", label: "Skincare" },
    { emoji: "🎨", label: "Design" }, { emoji: "🔒", label: "Cybersec" },
  ];
  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="about-scroll-reveal" style={{
      minHeight: "100dvh", background: "linear-gradient(180deg,#eebad3 0%,#f5c6d8 50%,#eebad3 100%)",
      position: "relative", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "clamp(3rem,8vh,6rem) clamp(1rem,5vw,4rem)", gap: "2.5rem",
      textAlign: "center", overflow: "hidden",
    }}>
      <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 700, color: "#5e17eb", margin: 0, textShadow: "0 2px 16px rgba(94,23,235,0.15)" }}>
        Things I love ♡
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(0.6rem,1.5vw,1rem)", justifyContent: "center", maxWidth: 640 }}>
        {interests.map((it, i) => <InterestChip key={it.label} {...it} delay={i * 70} />)}
      </div>
      <div style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: 20, padding: "clamp(1.2rem,3vw,2rem) clamp(1.5rem,4vw,3rem)", maxWidth: 560, boxShadow: "0 8px 32px rgba(94,23,235,0.08)" }}>
        <p style={{ fontFamily: "'Gochi Hand',cursive", fontSize: "clamp(1rem,2.5vw,1.4rem)", color: "#390003", margin: 0, lineHeight: 1.6 }}>
          "Always curious, always building — turning ideas into interactive experiences one line of code at a time." ✨
        </p>
      </div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        {onContactClick && (
          <button type="button" onClick={onContactClick} className="btn-solid-white" style={{ fontSize: "0.95rem" }}>Say Hi ✉</button>
        )}
        <a href={canvaUrl} target="_blank" rel="noopener noreferrer" className="btn-frosted-white" style={{ fontSize: "0.9rem", color: "#5e17eb", border: "1.5px solid rgba(94,23,235,0.4)", background: "rgba(94,23,235,0.08)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <ExternalLink size={15} />
          View Canva site
        </a>
      </div>
    </section>
  );
}

export default function About({ isVisible, onBack, onContactClick }: AboutProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onBack(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isVisible, onBack]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && scrollerRef.current) scrollerRef.current.scrollTop = 0;
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, width: "100vw", height: "100dvh", overflow: "hidden", background: "#eebad3" }}>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 960, height: "clamp(44px,6vh,60px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(12px,3vw,32px)", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
        <button type="button" onClick={onBack} aria-label="Back to site" style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: 8, color: "#541422", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem", fontWeight: 600, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f72585"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.color = "#541422"; }}>
          <ArrowLeft size={14} strokeWidth={2.4} /><span>Back</span>
        </button>
        <span style={{ fontFamily: "'Gochi Hand',cursive,sans-serif", fontSize: "clamp(0.85rem,2vw,1.1rem)", color: "rgba(60,10,30,0.85)", letterSpacing: "0.08em" }}>about me ✦</span>
        {onContactClick && (
          <button type="button" onClick={onContactClick} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(247,37,133,0.12)", border: "1px solid rgba(247,37,133,0.35)", borderRadius: 8, color: "#be185d", fontFamily: "'Inter',sans-serif", fontSize: "0.8rem", fontWeight: 600, padding: "6px 14px", cursor: "pointer", transition: "all 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#f72585"; e.currentTarget.style.color = "white"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(247,37,133,0.12)"; e.currentTarget.style.color = "#be185d"; }}>
            Say Hi ✉
          </button>
        )}
      </header>

      <div ref={scrollerRef} style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", paddingTop: "clamp(44px,6vh,60px)" }}>
        {/* SECTION 1: HERO */}
        <section style={{ minHeight: "100dvh", background: "#eebad3", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "2rem" }}>
          <div style={{ position: "absolute", top: "-10%", left: "-8%", width: "clamp(200px,40vw,500px)", height: "clamp(200px,40vw,500px)", background: "radial-gradient(circle,rgba(255,255,255,0.4) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-5%", right: "-5%", width: "clamp(150px,30vw,400px)", height: "clamp(150px,30vw,400px)", background: "radial-gradient(circle,rgba(94,23,235,0.12) 0%,transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ textAlign: "center", position: "relative", zIndex: 10 }}>
            <Card delay={100} rotate={-2} style={{ display: "inline-block", marginBottom: "1.5rem" }}>
              <div style={{ background: "#e02e68", padding: "clamp(0.6rem,2vw,1.2rem) clamp(1.5rem,5vw,4rem)", borderRadius: 12, boxShadow: "0 8px 32px rgba(224,46,104,0.4),0 2px 8px rgba(0,0,0,0.15)" }}>
                <span style={{ fontFamily: "'Gochi Hand',cursive,sans-serif", fontSize: "clamp(1.6rem,5vw,3.2rem)", color: "#f2eee3", letterSpacing: "0.05em" }}>About Me ♡</span>
              </div>
            </Card>
            <Card delay={250} rotate={3} style={{ display: "block", marginBottom: "0.25rem" }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1rem,2.5vw,1.6rem)", fontWeight: 700, color: "#5e17eb", letterSpacing: "0.12em", textTransform: "uppercase", background: "#bfd8ec", padding: "4px 20px", borderRadius: 9999, display: "inline-block" }}>hi</span>
            </Card>
            <Card delay={350} rotate={0}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(1.4rem,3.5vw,2.2rem)", fontWeight: 700, color: "#5e17eb", letterSpacing: "0.05em", background: "#bfd8ec", padding: "2px 16px", borderRadius: 8, display: "inline-block", marginBottom: "0.5rem" }}>I'm</span>
            </Card>
            <Card delay={480} rotate={-1} style={{ display: "block" }}>
              <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: "clamp(4rem,14vw,10rem)", fontWeight: 700, color: "#5e17eb", margin: "0.2rem 0", lineHeight: 1.0, background: "#bfd8ec", padding: "0.1em 0.35em", borderRadius: 16, display: "inline-block", boxShadow: "0 8px 28px rgba(94,23,235,0.2)" }}>SAANA♡</h1>
            </Card>
            <Card delay={600} rotate={2} style={{ display: "block", marginTop: "0.4rem" }}>
              <span style={{ fontFamily: "'Gochi Hand',cursive,sans-serif", fontSize: "clamp(2.5rem,8vw,5.5rem)", color: "#5e17eb", background: "#bfd8ec", padding: "0.05em 0.4em", borderRadius: 12, display: "inline-block" }}>yall</span>
            </Card>
            <Card delay={900} style={{ display: "block", marginTop: "2.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(84,20,34,0.55)", fontFamily: "'Gochi Hand',cursive", fontSize: "clamp(0.8rem,1.8vw,1rem)", animation: "aboutScrollBounce 2s ease-in-out infinite" }}>
                <span>scroll ↓</span>
              </div>
            </Card>
          </div>
        </section>

        {/* Canva embed — IntersectionObserver loads src only when ≥50% visible */}
        <CanvaEmbed scrollRoot={scrollerRef} />
        <Section2 onContactClick={onContactClick} />
        <Section3 />
        <Section4 onContactClick={onContactClick} canvaUrl={CANVA_URL} />
      </div>

      <style>{`
        div[style*="overflow-y"]::-webkit-scrollbar { display: none; }
        @keyframes aboutScrollBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(8px); } }
        .about-scroll-reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .about-scroll-reveal.in-view { opacity: 1; transform: translateY(0); }

        /* ── Canva embed container ─────────────────────────────────────────── */
        .canva-embed {
          width: 100%;
          max-width: 1100px;
          height: 80vh;          /* desktop */
          margin: 0 auto;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.35);
          box-shadow: 0 16px 48px rgba(94,23,235,0.1), 0 4px 16px rgba(0,0,0,0.06);
        }
        /* mobile: 70vh */
        @media (max-width: 768px) {
          .canva-embed {
            height: 70vh;
            border-radius: 10px;
          }
        }
      `}</style>
    </div>
  );
}
