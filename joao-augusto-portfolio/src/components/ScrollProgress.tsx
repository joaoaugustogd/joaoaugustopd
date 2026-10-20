import { motion, useScroll, useSpring } from "motion/react";

/**
 * Hairline read-progress indicator pinned to the top edge.
 * Spring-smoothed so it glides rather than snapping with each wheel tick.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[95] h-px w-full origin-left bg-flare"
      style={{ scaleX }}
    />
  );
}
