// Parallax.jsx
import React, { useRef, useEffect } from "react";
import gsap from "gsap";


const DEFAULT_CONFIG = {
  positionX: 50,
  positionY: 50,
  positionZ: 0,
  rotate: 0,
  rotateX: 0,
  rotateY: 0,
  moveX: 0,
  moveY: 0,
};

const ParallaxContainer = ({ config = {}, children }) => {
  const containerRef = useRef(null);
  const cfg = { coefficientX: 0.5, coefficientY: 0.5, ...config };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const UPDATE = (ev) => {
      // support PointerEvent {x,y} and fallback to clientX/clientY
      const x = typeof ev.x === "number" ? ev.x : ev.clientX;
      const y = typeof ev.y === "number" ? ev.y : ev.clientY;

      const containerBounds = el.parentNode.getBoundingClientRect();
      const centerX = containerBounds.left + containerBounds.width / 2;
      const centerY = containerBounds.top + containerBounds.height / 2;

      const startX = cfg.coefficientX
        ? centerX - cfg.coefficientX * window.innerWidth
        : 0;
      const endX = cfg.coefficientX
        ? centerX + cfg.coefficientX * window.innerWidth
        : window.innerWidth;
      const startY = cfg.coefficientY
        ? centerY - cfg.coefficientY * window.innerHeight
        : 0;
      const endY = cfg.coefficientY
        ? centerY + cfg.coefficientY * window.innerHeight
        : window.innerHeight;

      const POS_X = gsap.utils.mapRange(startX, endX, -100, 100)(x);
      const POS_Y = gsap.utils.mapRange(startY, endY, -100, 100)(y);

      el.style.setProperty("--range-x", gsap.utils.clamp(-100, 100, POS_X));
      el.style.setProperty("--range-y", gsap.utils.clamp(-100, 100, POS_Y));
    };

    window.addEventListener("pointermove", UPDATE, { passive: true });
    return () => window.removeEventListener("pointermove", UPDATE);
  }, [cfg]);

  return (
    <div
      ref={containerRef}
      className="parallax comment-parallax"
      style={{
        "--r": cfg.rotate ?? 0,
        "--rx": cfg.rotateX ?? 0,
        "--ry": cfg.rotateY ?? 0,
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

const ParallaxItem = ({ children, config = {} }) => {
  const params = { ...DEFAULT_CONFIG, ...config };
  return (
    <div
      className="parallax-item"
      style={{
        left: `calc(${params.positionX} * 1%)`,
        top: `calc(${params.positionY} * 1%)`,
        height: params.height ? `${params.height}%` : "auto",
        width: params.width ? `${params.width}%` : "auto",
        transform: `translate(-50%,-50%) translate3d(calc(${params.moveX} * var(--range-x,0)%), calc(${params.moveY} * var(--range-y,0)% ), calc(${params.positionZ} * 1vmin)) rotateX(calc(${params.rotateX} * var(--range-y,0) * 1deg)) rotateY(calc(${params.rotateY} * var(--range-x,0) * 1deg)) rotate(calc(${params.rotate} * var(--range-x,0) * 1deg))`,
      }}
    >
      {children}
    </div>
  );
};

export { ParallaxContainer as default, ParallaxItem };
