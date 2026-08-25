import { motion } from "motion/react";
import { fadeUp, inView, staggerParent, drawLine } from "../lib/motion";

/** Fade-and-rise on scroll. The workhorse for body copy and small UI. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Reveal container that staggers its direct children. */
export function RevealGroup({
  children,
  stagger = 0.08,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
    >
      {children}
    </motion.div>
  );
}

/** A single staggered child inside RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

/** Hairline rule that draws itself left-to-right when scrolled into view. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`h-px w-full origin-left bg-bone-20 ${className}`}
      variants={drawLine}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 1 }}
    />
  );
}
