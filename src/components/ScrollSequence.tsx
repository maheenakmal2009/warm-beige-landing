import { useEffect, useRef, useState } from "react";

type Props = {
  frameCount: number;
  framePath: (index: number) => string;
  stages?: string[];
  scrollLengthVh?: number;
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function ScrollSequence({
  frameCount,
  framePath,
  stages = [],
  scrollLengthVh = 600,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const lastDrawn = useRef(-1);
  const [loaded, setLoaded] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let count = 0;
    images.current = Array.from({ length: frameCount }, (_, i) => {
      const img = new Image();
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        count++;
        setLoaded(count);
        if (i === 0) lastDrawn.current = -1;
      };
      return img;
    });
  }, [frameCount, framePath]);

  const draw = (index: number) => {
    const cv = canvasRef.current;
    const img = images.current[index];
    if (!cv || !img || !img.complete || !img.naturalWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== w * dpr || cv.height !== h * dpr) {
      cv.width = w * dpr;
      cv.height = h * dpr;
    }
    const ctx = cv.getContext("2d")!;
    const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
  };

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      target.current = clamp(-r.top / (r.height - window.innerHeight));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { lastDrawn.current = -1; onScroll(); });

    let raf = 0;
    const loop = () => {
      current.current += (target.current - current.current) * 0.12;
      const idx = Math.round(current.current * (frameCount - 1));
      if (idx !== lastDrawn.current) {
        draw(idx);
        lastDrawn.current = idx;
        setProgress(current.current);
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [frameCount]);

  const activeStage = stages.length
    ? Math.min(stages.length - 1, Math.floor(progress * stages.length))
    : -1;

  return (
    <div ref={wrapRef} style={{ height: `${scrollLengthVh}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {loaded < frameCount && (
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center",
                        background: "#efe8da", color: "#4a4337", fontSize: 14 }}>
            Loading {Math.round((loaded / frameCount) * 100)}%
          </div>
        )}

        <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
                      display: "flex", flexDirection: "column", gap: 12 }}>
          {stages.map((s, i) => (
            <span key={s} title={s} style={{
              width: 7, height: 7, borderRadius: "50%", border: "1px solid #4a4337",
              background: i === activeStage ? "#4a4337" : "transparent",
              transform: i === activeStage ? "scale(1.5)" : "none", transition: ".3s",
            }} />
          ))}
        </div>

        <div style={{ position: "absolute", right: 24, top: "25%", height: "50%", width: 1,
                      background: "rgba(74,67,55,.35)" }}>
          <i style={{ position: "absolute", left: -2, width: 5, height: 22, borderRadius: 3,
                      background: "#4a4337", top: `calc(${progress * 100}% - 11px)` }} />
        </div>

        {activeStage >= 0 && (
          <h1 style={{ position: "absolute", bottom: 40, width: "100%", textAlign: "center",
                       margin: 0, fontWeight: 300, letterSpacing: ".12em",
                       textTransform: "uppercase", color: "#4a4337" }}>
            {stages[activeStage]}
          </h1>
        )}
      </div>
    </div>
  );
}
