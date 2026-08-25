import type { Transition, Variants } from "motion/react";

/* ============================================================================
   MOTION TOKENS
   ----------------------------------------------------------------------------
   The same curves declared in index.css, expressed for JS-driven motion.
   Components must import from here — never inline a bezier.
   ========================================================================= */

export const ease = {
  /** Long, decisive settle. Entrances of large type and images. */
  outExpo: [0.16, 1, 0.3, 1],
  /** Slightly softer settle. Cards, list items, secondary content. */
  outQuint: [0.22, 1, 0.36, 1],
  /** Symmetrical. Overlays, route curtains, anything that must feel deliberate. */
  inOutQuart: [0.76, 0, 0.24, 1],
  /** Short and functional. Hover, focus, state toggles. */
  swift: [0.4, 0, 0.2, 1],
} as const;

export const duration = {
  micro: 0.22,
  short: 0.4,
  base: 0.7,
  long: 1.1,
  epic: 1.6,
} as const;

/** Physical spring used for anything that follows the pointer. */
export const pointerSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.55,
};

/** Heavier spring for magnetic elements — reads as weight, not latency. */
export const magneticSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 22,
  mass: 0.9,
};

/* ---- Shared variants ----------------------------------------------------- */

/** Parent that staggers children. Pair with `riseChild`. */
export const staggerParent = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** The house entrance: mask-clipped rise with an expo settle. */
export const riseChild: Variants = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: duration.long, ease: ease.outExpo },
  },
};

/** Softer entrance for body copy and small UI. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.outQuint },
  },
};

/** Hairline rules that draw themselves in. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: duration.epic, ease: ease.outExpo },
  },
};

/** Default viewport config: fire once, a third of the way in. */
export const inView = { once: true, amount: 0.25 } as const;
