import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Counts a numeric stat up when it scrolls into view, preserving any prefix or
 * suffix in the source string ("12+", "-71%", "11→1", "AA").
 *
 * If the string has no leading number it renders verbatim — so content authors
 * can put "AA" or "9/10" in the same field without a special case, and the
 * component degrades instead of printing NaN.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  // Memoised: String.match returns a fresh array every render, and using it as
  // an effect dependency restarted the animation on every parent re-render —
  // which, during a scroll, meant the number never left zero.
  const match = useMemo(() => value.match(/^(-?)(\d+(?:\.\d+)?)(.*)$/s), [value]);
  const [display, setDisplay] = useState(() => (match ? `${match[1]}0${match[3]}` : value));

  useEffect(() => {
    if (!match || reduced || !isInView) return;
    const [, sign, digits, suffix] = match;
    const target = Number(digits);
    const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;

    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(`${sign}${latest.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [isInView, match, reduced]);

  return (
    <span ref={ref} className={className}>
      {match && !reduced ? display : value}
    </span>
  );
}
