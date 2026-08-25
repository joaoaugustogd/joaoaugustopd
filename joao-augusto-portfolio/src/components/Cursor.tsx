import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { pointerSpring } from "../lib/motion";
import { useHasPointer } from "../lib/useHasPointer";

/**
 * Custom cursor: a hard dot that tracks the pointer 1:1 and a soft ring that
 * lags behind it on a spring. The lag is the whole point — it gives the pointer
 * mass, and it lets the ring morph into a labelled disc over interactive
 * targets without the label ever feeling detached from the hand.
 *
 * Contract: any element can declare its cursor state with
 *   data-cursor="link" | "view" | "hidden"
 *   data-cursor-label="View case"
 * There is no per-component wiring, so new elements opt in for free.
 *
 * Never rendered for touch pointers or reduced-motion users, and the native
 * cursor is only hidden while this is actually mounted (see index.css).
 */
export function Cursor() {
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, pointerSpring);
  const ringY = useSpring(y, pointerSpring);

  const [state, setState] = useState<"default" | "link" | "view" | "hidden">("default");
  const [label, setLabel] = useState<string>("");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.body.removeAttribute("data-custom-cursor");
      return;
    }
    document.body.setAttribute("data-custom-cursor", "on");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button",
      );
      if (!target) {
        setState("default");
        setLabel("");
        return;
      }
      const declared = target.dataset.cursor as typeof state | undefined;
      setState(declared ?? "link");
      setLabel(target.dataset.cursorLabel ?? "");
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setState("hidden");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.removeAttribute("data-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ring = {
    default: { size: 34, opacity: 0.55, border: 1, fill: "transparent" },
    link: { size: 58, opacity: 1, border: 1, fill: "transparent" },
    view: { size: 104, opacity: 1, border: 0, fill: "var(--color-flare)" },
    hidden: { size: 0, opacity: 0, border: 0, fill: "transparent" },
  }[state];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      {/* Ring / disc — springy, carries the label. */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center rounded-full border-bone mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ring.size * (pressed ? 0.82 : 1),
          height: ring.size * (pressed ? 0.82 : 1),
          opacity: ring.opacity,
          borderWidth: ring.border,
          backgroundColor: ring.fill,
        }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        {state === "view" && label && (
          <motion.span
            className="eyebrow text-ink"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.06 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Dot — exact, unlagged, so precision never suffers for style. */}
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-flare"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: state === "view" || state === "hidden" ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
    </div>
  );
}
