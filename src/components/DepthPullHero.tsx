import * as React from "react";

export default function DepthPullHero() {
  React.useEffect(() => {
    let rafId: number;

    // Safety: clear any letters injected by a previous HMR reload
    const nameEl = document.getElementById("hdp-name");
    if (!nameEl) return;
    nameEl.innerHTML = "";

    // ── Build letter spans ──
    const nameText = "R. Sahaana";
    const letters: HTMLSpanElement[] = [];
    [...nameText].forEach((ch) => {
      const s = document.createElement("span");
      s.className = "letter";
      s.textContent = ch === " " ? "\u00A0" : ch;
      nameEl.appendChild(s);
      letters.push(s);
    });

    const track = document.getElementById("hero-name-reveal");
    const vignette = document.getElementById("hdp-vignette");
    const hairline = document.getElementById("hdp-line");
    const stage = document.getElementById("hdp-stage");

    if (!track || !vignette || !hairline || !stage) return;

    function clamp01(v: number) {
      return Math.min(1, Math.max(0, v));
    }

    function progressFor(el: HTMLElement) {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return rect.top <= 0 ? 1 : 0;
      return clamp01(-rect.top / total);
    }

  // ── Cursor parallax ──
    const NAME_START = 0.20;
    const NAME_END = 0.55;
    let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;

    function onMouseMove(e: MouseEvent) {
      const r = stage!.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      targetRX = ny * -6;
      targetRY = nx * 8;
    }

    function onMouseLeave() {
      targetRX = 0;
      targetRY = 0;
    }

    stage.addEventListener("mousemove", onMouseMove);
    stage.addEventListener("mouseleave", onMouseLeave);

    function render() {
      const p = progressFor(track!);

      // Vignette — always partially visible, deepen on scroll
      (vignette as HTMLElement).style.setProperty("--hdp-vig-op", String(0.45 + clamp01(p * 0.55)));

      // Name letters: staggered fade + blur
      const pn = clamp01((p - NAME_START) / (NAME_END - NAME_START));
      letters.forEach((el, i) => {
        const stagger = i * 0.045;
        const lp = clamp01((pn - stagger) / 0.5);
        const ease = lp * lp * (3 - 2 * lp); // smoothstep
        el.style.opacity = String(ease);
        el.style.filter = `blur(${(1 - ease) * 10}px)`;
        el.style.transform = `translateY(${(1 - ease) * 16}px)`;
      });

      // Hairline width expand
      (hairline as HTMLElement).style.width =
        (pn > 0.05 ? clamp01((pn - 0.05) / 0.3) * 120 : 0) + "px";
      (hairline as HTMLElement).style.opacity = String(clamp01((pn - 0.05) / 0.3) * 0.7);
    }

    function loop() {
      curRX += (targetRX - curRX) * 0.08;
      curRY += (targetRY - curRY) * 0.08;
      render();
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", render);
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", render);
      stage.removeEventListener("mousemove", onMouseMove);
      stage.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <section className="hero-depth-pull" id="hero-name-reveal">
      <div className="hdp-stage" id="hdp-stage">
        <div className="hdp-card-wrap">
          <div className="hdp-vignette" id="hdp-vignette" />
          <div className="hdp-content">
            <h1 className="hdp-name-row" id="hdp-name" aria-label="R. Sahaana" />
            <div className="hdp-hairline" id="hdp-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
