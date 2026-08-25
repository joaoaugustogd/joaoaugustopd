import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useLocation } from "react-router-dom";
import { registerScroller } from "../lib/scroller";

/**
 * Lenis smooth scroll, wired into Motion's frame loop rather than its own RAF,
 * so scroll-linked animations resolve in the same frame as the scroll position.
 * Without this, parallax and pinned sections visibly lag by one frame.
 *
 * Disabled entirely under prefers-reduced-motion — momentum scrolling is a
 * vestibular trigger, and no amount of craft justifies overriding that.
 *
 * Anchor clicks are NOT intercepted here. Section navigation lives in
 * SectionLink, which routes first and scrolls after; a document-level listener
 * here as well meant two scrollers competing for one click.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    if (reduced) {
      registerScroller(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
      // Native scroll on touch: iOS momentum is better than any JS emulation.
      syncTouch: false,
    });
    registerScroller(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      registerScroller(null);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  // Every route change starts at the top, instantly — an eased scroll here
  // would collide with the route curtain animation.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return <>{children}</>;
}
