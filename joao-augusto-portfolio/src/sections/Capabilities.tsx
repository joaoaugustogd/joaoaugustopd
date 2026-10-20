import { motion } from "motion/react";
import { profile } from "../data/profile";
import { duration, ease, inView } from "../lib/motion";
import { SplitText } from "../components/SplitText";
import { Marquee } from "../components/Marquee";
import { RevealGroup, RevealItem, Rule } from "../components/Reveal";

/**
 * CAPABILITIES — three registers in one section, deliberately:
 *   1. What I do        → a four-column capability grid
 *   2. What I do it in  → a kinetic tool band (the only loud element on the page)
 *   3. Where I've done it → a timeline
 *
 * Splitting these into three sections would pad the page; stacking them under
 * one heading lets the reader skim to whichever register they came for.
 */
export function Capabilities() {
  return (
    <section id="capabilities" className="relative py-[12vh]">
      <div className="gutter">
        <header className="pb-12 sm:pb-20">
          <span className="eyebrow text-flare">Capabilities</span>
          <SplitText as="h2" by="word" className="text-title mt-4 block font-display">
            End to end, and specific about it
          </SplitText>
        </header>

        <RevealGroup stagger={0.09} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {profile.capabilities.map((group) => (
            <RevealItem key={group.title} className="group">
              <motion.div
                aria-hidden="true"
                className="h-px w-full origin-left bg-bone-20"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={inView}
                transition={{ duration: duration.long, ease: ease.outExpo }}
              />
              <h3 className="mt-5 font-display text-2xl">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-snug text-bone-70 transition-colors duration-300 hover:text-bone"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-flare" />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* ---- Tool band: full-bleed, two counter-rotating rows ---- */}
      <div className="mt-[10vh] border-y border-bone-10 py-8">
        <Marquee items={[...profile.tools]} speed={52} direction={1} />
        <div className="h-4" />
        <Marquee
          items={[...profile.tools].reverse()}
          speed={64}
          direction={-1}
          className="opacity-40"
        />
      </div>

      {/* ---- Experience timeline ---- */}
      <div className="gutter mt-[10vh]">
        <span className="eyebrow text-bone-45">Experience</span>
        <ol className="mt-8">
          {profile.experience.map((role, i) => (
            <li key={`${role.org}-${i}`}>
              <Rule />
              <motion.div
                className="grid gap-3 py-8 md:grid-cols-12 md:gap-8"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: duration.base, ease: ease.outQuint }}
              >
                <span className="eyebrow pt-2 text-bone-45 md:col-span-2">
                  {role.period}
                </span>
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl leading-tight">{role.role}</h3>
                  <p className="eyebrow mt-2 text-flare">{role.org}</p>
                </div>
                <p className="max-w-prose text-sm leading-relaxed text-bone-70 md:col-span-6">
                  {role.note}
                </p>
              </motion.div>
            </li>
          ))}
        </ol>
        <Rule />
      </div>
    </section>
  );
}
