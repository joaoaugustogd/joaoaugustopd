import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { magneticSpring } from "../lib/motion";
import { useHasPointer } from "../lib/useHasPointer";

/**
 * Magnetic hover: the child leans toward the pointer within its own bounds and
 * springs back on exit. Displacement is capped as a fraction of the element's
 * own size, so a small button never travels far enough to break the hit area
 * it advertises — the interaction stays honest.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: {
  children: React.ReactNode;
  /** Fraction of half-width/height the element may travel. Keep ≤ 0.35. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, magneticSpring);
  const sy = useSpring(y, magneticSpring);

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={enabled ? { x: sx, y: sy } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      // Keyboard users get the same affordance without pointer geometry.
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}
