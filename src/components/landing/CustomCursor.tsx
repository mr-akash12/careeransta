import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + "px";
      cur.style.top = my + "px";
    };

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring!.style.left = rx + "px";
      ring!.style.top = ry + "px";
      requestAnimationFrame(animRing);
    }

    const grow = () => {
      cur.style.width = "20px";
      cur.style.height = "20px";
      ring.style.width = "60px";
      ring.style.height = "60px";
      ring.style.borderColor = "rgba(200,241,53,.6)";
    };
    const shrink = () => {
      cur.style.width = "12px";
      cur.style.height = "12px";
      ring.style.width = "40px";
      ring.style.height = "40px";
      ring.style.borderColor = "rgba(200,241,53,.4)";
    };

    document.addEventListener("mousemove", onMove);
    animRing();

    const interactives = document.querySelectorAll("button,a,[data-cursor-grow]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    // Hide on touch devices
    const mql = window.matchMedia("(pointer: coarse)");
    if (mql.matches) {
      cur.style.display = "none";
      ring.style.display = "none";
    }

    return () => {
      document.removeEventListener("mousemove", onMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={curRef}
        className="fixed w-3 h-3 bg-primary rounded-full pointer-events-none z-[99999] mix-blend-difference"
        style={{ transform: "translate(-50%,-50%)", transition: "width .15s, height .15s" }}
      />
      <div
        ref={ringRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[99998] mix-blend-difference"
        style={{
          border: "1px solid rgba(200,241,53,.4)",
          transform: "translate(-50%,-50%)",
          transition: "all .12s ease",
        }}
      />
    </>
  );
};

export default CustomCursor;
