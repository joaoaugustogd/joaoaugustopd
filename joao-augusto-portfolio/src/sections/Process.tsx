import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "../data/profile";
import { duration, ease, inView } from "../lib/motion";
import { SplitText } from "../components/SplitText";
import { Reveal, Rule } from "../components/Reveal";

/**
 * PROCESS — a pinned index against a scrolling narrative.
 *
 * The left column stays put and swaps its phase number and title as each step
 * enters; the right column does the scrolling. The pin is what turns a list of
 * five paragraphs into a sequence you feel yourself moving through, and it also
 * keeps the current phase label on screen while the reader is deep in the copy.
 *
 * The pin is `position: sticky` on ≥md only — on a phone it would eat half the
 * viewport, so small screens get an inline label per step instead.
 */
export function Process() {
  const [active, setActive] = useState(0);
  const current = profile.process[active];

  return (
    <section id="process" className="relative py-[12vh] gutter">
      <header className="pb-12 sm:pb-20">
        <span className="eyebrow text-flare">How I work</span>
        <SplitText as="h2" by="word" className="text-title mt-4 block font-display">
          Five phases, in the order that keeps projects out of trouble
        </SplitText>
      </header>

      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        {/* ---- Pinned phase index ---- */}
        <div className="hidden md:col-span-4 md:block">
          <div className="sticky top-[22vh]">
            <div className="relative h-[9rem] overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={current.phase}
                  className="block font-display text-[8.5rem] leading-[0.8] text-flare"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: duration.base, ease: ease.outExpo }}
                >
                  {current.phase}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="relative mt-2 h-[2.4rem] overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={current.title}
                  className="block font-display text-4xl"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: duration.base, ease: ease.outExpo }}
                >
                  {current.title}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Progress rail — one segment per phase, filled up to the active one. */}
            <ol className="mt-10 flex flex-col gap-3">
              {profile.process.map((step, i) => (
                <li key={step.phase} className="flex items-center gap-4">
                  <motion.span
                    aria-hidden="true"
                    className="h-px origin-left bg-bone"
                    animate={{
                      width: i === active ? 44 : 18,
                      opacity: i <= active ? 1 : 0.25,
                    }}
                    transition={{ duration: duration.short, ease: ease.outExpo }}
                  />
                  <motion.span
                    className="eyebrow"
                    animate={{ opacity: i === active ? 1 : 0.35 }}
                    transition={{ duration: duration.short }}
                  >
                    {step.title}
                  </motion.span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ---- Scrolling narrative ---- */}
        <ol className="flex flex-col gap-[12vh] md:col-span-8 md:gap-[17vh]">
          {profile.process.map((step, i) => (
            <motion.li
              key={step.phase}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.55, margin: "-20% 0px -30% 0px" }}
              className="max-w-2xl"
            >
              <div className="mb-5 flex items-baseline gap-4 md:hidden">
                <span className="font-display text-5xl leading-none text-flare">
                  {step.phase}
                </span>
                <span className="font-display text-3xl">{step.title}</span>
              </div>

              <Rule className="mb-7" />

              <Reveal>
                <p className="text-lead font-display italic">{step.lead}</p>
                <p className="mt-5 max-w-prose leading-relaxed text-bone-70">{step.body}</p>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {step.artifacts.map((artifact) => (
                    <motion.li
                      key={artifact}
                      className="eyebrow rounded-full border border-bone-20 px-3 py-1.5 text-bone-45"
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={inView}
                      transition={{ duration: duration.short }}
                    >
                      {artifact}
                    </motion.li>
                  ))}
                </ul>
              </Reveal>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
