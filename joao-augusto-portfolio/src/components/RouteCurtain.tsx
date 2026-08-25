import { useEffect, useRef } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import { duration, ease } from "../lib/motion";

/**
 * Route transition curtain.
 *
 * Decoupled from AnimatePresence on purpose: the curtain is a one-shot,
 * imperative sweep driven by pathname changes, while the pages themselves
 * cross-fade. Coupling them would mean the curtain's timing is hostage to
 * whichever page is slowest to unmount.
 *
 * Sweeps up to cover, then continues up to uncover — a single directional
 * gesture rather than an accordion, so it reads as pages being dealt.
 */
export function RouteCurtain() {
  const [scope, animate] = useAnimate();
  const { pathname } = useLocation();
  const first = useRef(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced || !scope.current) return;

    const sweep = async () => {
      await animate(
        scope.current,
        { scaleY: [0, 1], transformOrigin: ["bottom", "bottom"] },
        { duration: duration.short, ease: ease.inOutQuart },
      );
      await animate(
        scope.current,
        { scaleY: [1, 0], transformOrigin: ["top", "top"] },
        { duration: duration.base, ease: ease.outExpo, delay: 0.05 },
      );
    };
    void sweep();
  }, [pathname, animate, scope, reduced]);

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[98] origin-bottom bg-flare"
      style={{ transform: "scaleY(0)" }}
    />
  );
}
