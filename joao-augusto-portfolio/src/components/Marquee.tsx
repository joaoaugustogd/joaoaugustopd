import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Infinite horizontal marquee whose baseline drift is CSS-driven, with a
 * scroll-linked offset layered on top: scrolling the page pushes the band,
 * so the type feels connected to the reader's input rather than autoplaying
 * past them.
 *
 * The track is duplicated once and translated by -50%, which is what makes the
 * loop seamless. The duplicate is aria-hidden so the phrase is announced once.
 */
export function Marquee({
  items,
  speed = 42,
  direction = 1,
  className = "",
}: {
  items: string[];
  /** Seconds for one full cycle. Larger = slower. */
  speed?: number;
  direction?: 1 | -1;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -160 * direction]);

  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="font-display text-title whitespace-nowrap">{item}</span>
          <span
            aria-hidden="true"
            className="mx-[0.6em] inline-block size-[0.18em] rounded-full bg-flare align-middle"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Edge fades keep the band from colliding with the page gutters. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-32" />

      <motion.div className="flex w-max" style={reduced ? undefined : { x }}>
        <div
          className="flex w-max"
          style={
            reduced
              ? undefined
              : {
                  animation: `marquee-slide ${speed}s linear infinite`,
                  animationDirection: direction === 1 ? "normal" : "reverse",
                }
          }
        >
          <Track />
          <Track hidden />
        </div>
      </motion.div>

      <style>{`
        @keyframes marquee-slide {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  );
}
