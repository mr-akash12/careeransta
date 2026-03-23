import { useEffect, useRef } from "react";

interface Ripple {
  type?: "particle";
  x: number;
  y: number;
  r: number;
  maxR?: number;
  alpha: number;
  speed?: number;
  color: string;
  lw?: number;
  vx?: number;
  vy?: number;
  life?: number;
}

const RippleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnRipple = (x: number, y: number, color = "200,241,53") => {
      for (let i = 0; i < 4; i++) {
        ripplesRef.current.push({
          x, y, r: 0, maxR: 80 + i * 70,
          alpha: 0.6 - i * 0.12, speed: 6 + i * 2,
          color, lw: 2 - i * 0.25,
        });
      }
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        ripplesRef.current.push({
          type: "particle", x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 2 + Math.random() * 2.5, alpha: 0.8, color, life: 1,
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY);
    };
    document.addEventListener("click", onClick);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ripplesRef.current = ripplesRef.current.filter((r) => {
        if (r.type === "particle") {
          r.x += r.vx!;
          r.y += r.vy!;
          r.vy! += 0.15;
          r.vx! *= 0.97;
          r.alpha -= 0.03;
          if (r.alpha <= 0) return false;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r.color},${r.alpha})`;
          ctx.fill();
          return true;
        }
        r.r += r.speed!;
        r.alpha -= r.alpha / (r.maxR! / r.speed!);
        if (r.r >= r.maxR! || r.alpha <= 0.01) return false;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color},${r.alpha})`;
        ctx.lineWidth = r.lw || 1.5;
        ctx.stroke();
        return true;
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[99990]"
    />
  );
};

export default RippleCanvas;
