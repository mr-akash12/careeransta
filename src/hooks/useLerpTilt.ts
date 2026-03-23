import { useRef, useCallback, useEffect } from "react";

export function useLerpTilt(
  strength: number = 10,
  lerpFactor: number = 0.09,
  extraTransform: string = ""
) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ tX: 0, tY: 0, cX: 0, cY: 0, rafId: null as number | null });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    const s = state.current;
    const el = ref.current;
    if (!el) return;

    s.cX = lerp(s.cX, s.tX, lerpFactor);
    s.cY = lerp(s.cY, s.tY, lerpFactor);
    el.style.transform = `${extraTransform} rotateX(${s.cX}deg) rotateY(${s.cY}deg)`.trim();

    if (Math.abs(s.cX - s.tX) > 0.01 || Math.abs(s.cY - s.tY) > 0.01) {
      s.rafId = requestAnimationFrame(animate);
    } else {
      s.rafId = null;
    }
  }, [lerpFactor, extraTransform]);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      state.current.tX = -y * strength;
      state.current.tY = x * strength;
      if (!state.current.rafId) state.current.rafId = requestAnimationFrame(animate);
    },
    [strength, animate]
  );

  const onLeave = useCallback(() => {
    state.current.tX = 0;
    state.current.tY = 0;
    const reset = () => {
      const s = state.current;
      const el = ref.current;
      if (!el) return;
      s.cX = lerp(s.cX, 0, 0.07);
      s.cY = lerp(s.cY, 0, 0.07);
      el.style.transform = `${extraTransform} rotateX(${s.cX}deg) rotateY(${s.cY}deg)`.trim();
      if (Math.abs(s.cX) > 0.01 || Math.abs(s.cY) > 0.01) {
        requestAnimationFrame(reset);
      } else {
        el.style.transform = "";
      }
    };
    requestAnimationFrame(reset);
  }, [extraTransform]);

  useEffect(() => {
    return () => {
      if (state.current.rafId) cancelAnimationFrame(state.current.rafId);
    };
  }, []);

  return { ref, onMove, onLeave };
}
