import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { duration, ease } from "../lib/motion";
import { asset } from "../lib/asset";

type Props = {
  /** Path inside /public, e.g. "projects/cover.svg". Resolved against BASE_URL. */
  src: string;
  alt: string;
  /** CSS aspect-ratio string, e.g. "4 / 3". */
  ratio?: string;
  /** Vertical drift of the inner image across the viewport, in percent. */
  parallax?: number;
  className?: string;
  priority?: boolean;
};

/**
 * The signature image treatment: a clip-path window wipes open from the bottom
 * while the image inside is over-scaled and drifts against the scroll.
 *
 * Three layers, each with one job — and that separation is load-bearing:
 *   1. plain <div>   — owns the ref, the aspect ratio and the layout box.
 *                      Observation targets must be plain DOM nodes; hanging
 *                      useInView / useScroll off an animating motion element
 *                      produced an observer that never reported an
 *                      intersection, leaving the clip window shut forever.
 *   2. motion.div    — the clip window. One-shot, viewport-triggered.
 *   3. motion.img    — the parallax drift. Continuous, scroll-linked.
 */
export function MaskImage({
  src,
  alt,
  ratio = "4 / 3",
  parallax = 12,
  className = "",
  priority = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Over-scale by exactly the parallax travel so no edge is ever exposed.
  const overscale = 1 + parallax / 100;
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax / 2}%`, `${parallax / 2}%`]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ aspectRatio: ratio }}>
      <motion.div
        className="absolute inset-0 overflow-hidden bg-ink-raised"
        initial={false}
        animate={
          reduced
            ? { opacity: isInView ? 1 : 0 }
            : { clipPath: isInView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }
        }
        transition={{ duration: duration.epic, ease: ease.outExpo }}
      >
        <motion.img
          src={asset(src)}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={reduced ? undefined : { y, scale: overscale }}
        />
      </motion.div>
    </div>
  );
}
