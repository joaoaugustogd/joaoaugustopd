import { motion, useReducedMotion } from "motion/react";
import { duration, ease, inView } from "../lib/motion";

type Props = {
  children: string;
  /** Granularity of the reveal. Characters for headlines, words for long lines. */
  by?: "char" | "word";
  /** Seconds between each unit. Keep small for char-level: 0.012–0.03. */
  stagger?: number;
  delay?: number;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  /** Animate on mount instead of waiting for the viewport (hero only). */
  immediate?: boolean;
};

/**
 * Character- or word-level masked reveal.
 *
 * Accessibility: the visible glyph spans are aria-hidden and the readable string
 * is exposed once via aria-label, so screen readers announce "Product designer"
 * rather than spelling it out letter by letter.
 *
 * Reduced motion: renders the plain string with no split and no transform.
 */
export function SplitText({
  children,
  by = "char",
  stagger = by === "char" ? 0.016 : 0.06,
  delay = 0,
  className,
  as: Tag = "span",
  immediate = false,
}: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const words = children.split(" ");
  let unitIndex = 0;

  const animationProps = immediate
    ? { initial: "hidden" as const, animate: "visible" as const }
    : { initial: "hidden" as const, whileInView: "visible" as const, viewport: inView };

  return (
    <Tag className={className} aria-label={children}>
      <motion.span
        aria-hidden="true"
        className="inline"
        variants={{ hidden: {}, visible: {} }}
        {...animationProps}
      >
        {words.map((word, w) => {
          const units = by === "char" ? Array.from(word) : [word];
          return (
            // Words never break mid-mask: whitespace-nowrap keeps the clip window intact.
            <span key={`${word}-${w}`} className="inline-flex whitespace-nowrap">
              {units.map((unit, u) => {
                const i = unitIndex++;
                return (
                  <span key={`${unit}-${u}`} className="mask-line inline-block">
                    <motion.span
                      className="inline-block will-change-transform"
                      variants={{
                        hidden: { y: "112%", rotate: 4 },
                        visible: {
                          y: "0%",
                          rotate: 0,
                          transition: {
                            duration: duration.long,
                            ease: ease.outExpo,
                            delay: delay + i * stagger,
                          },
                        },
                      }}
                    >
                      {unit}
                    </motion.span>
                  </span>
                );
              })}
              {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
