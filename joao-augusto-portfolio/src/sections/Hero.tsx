import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { profile } from "../data/profile";
import { SplitText } from "../components/SplitText";
import { duration, ease } from "../lib/motion";
import { SectionLink } from "../components/SectionLink";

/**
 * Hero.
 *
 * One orchestrated load: eyebrow → three headline lines (character-masked,
 * cascading) → standfirst → scroll cue. Then the whole block becomes
 * scroll-linked, drifting up and dissolving as the next section arrives, so
 * the transition out of the hero is a continuation rather than a cut.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(6px)"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-[19vh] pb-[7vh] gutter"
    >
      {/* Atmosphere: an off-centre warm bloom plus a hairline grid. Depth without
          a single decorative image request. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-[20%] -right-[15%] size-[70vw] rounded-full opacity-[0.55] blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--color-flare-glow) 0%, transparent 68%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-bone-10) 1px, transparent 1px)",
            backgroundSize: "clamp(80px, 12.5vw, 200px) 100%",
          }}
        />
      </div>

      <motion.div style={reduced ? undefined : { y, opacity, filter: blur }}>
        {/* Eyebrow: index-card metadata, the "printed annual" cue. */}
        <motion.div
          className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, delay: 0.15 }}
        >
          <span className="eyebrow text-flare">{profile.role}</span>
          <span aria-hidden="true" className="hidden h-px bg-bone-20 sm:block sm:w-16" />
          <span className="eyebrow text-bone-45">
            {profile.location} · {profile.timezone}
          </span>
          <span aria-hidden="true" className="hidden h-px bg-bone-20 sm:block sm:w-16" />
          <span className="eyebrow text-bone-45">Portfolio ’26</span>
        </motion.div>

        <h1 className="text-hero font-display">
          {profile.headline.map((line, i) => (
            <SplitText
              key={line}
              as="span"
              immediate
              by="char"
              stagger={0.014}
              delay={0.28 + i * 0.16}
              // Middle line set in italic: the display serif's italic is where its
              // personality lives, and it breaks the block's symmetry on purpose.
              className={`block ${i === 1 ? "pl-[8vw] italic text-flare" : ""}`}
            >
              {line}
            </SplitText>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-8 sm:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            className="text-lead max-w-2xl text-bone-70"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.long, ease: ease.outExpo, delay: 0.95 }}
          >
            {profile.standfirst}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: 1.2 }}
          >
          <SectionLink
            id="work"
            className="group flex shrink-0 items-center gap-4"
          >
            <span className="eyebrow text-bone-45 transition-colors group-hover:text-bone">
              Selected work
            </span>
            <span className="relative flex size-11 items-center justify-center rounded-full border border-bone-20 transition-colors duration-500 group-hover:border-flare">
              <motion.span
                aria-hidden="true"
                className="text-bone"
                animate={reduced ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
            </span>
          </SectionLink>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
