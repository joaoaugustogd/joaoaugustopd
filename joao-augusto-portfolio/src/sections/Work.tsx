import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { duration, ease, inView } from "../lib/motion";
import { MaskImage } from "../components/MaskImage";
import { useHasPointer } from "../lib/useHasPointer";
import { asset } from "../lib/asset";

/**
 * WORK — an index, not a card grid.
 *
 * Set on inverted paper stock so it reads as a printed insert bound into the
 * dark book. On pointer devices it behaves as a table of contents: the hovered
 * row lifts and un-dims while a preview plate tracks the cursor. Touch devices
 * get the same content as stacked plates, because a hover-only reveal would
 * hide the work entirely on the device most recruiters use.
 */
export function Work() {
  const listRef = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const interactive = hasPointer && !reduced;

  const [active, setActive] = useState<number | null>(null);
  const primed = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
  const py = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !listRef.current) return;
    const rect = listRef.current.getBoundingClientRect();
    const nx = event.clientX - rect.left;
    const ny = event.clientY - rect.top;

    // First movement inside the list teleports the springs to the pointer
    // instead of easing from (0,0) — otherwise the plate flies in from the
    // section's top-left corner on every first hover, which reads as a bug.
    if (!primed.current) {
      primed.current = true;
      x.jump(nx);
      y.jump(ny);
      px.jump(nx);
      py.jump(ny);
    }
    x.set(nx);
    y.set(ny);
  };

  return (
    <section id="work" className="invert-surface relative py-[12vh] gutter">
      <header className="flex flex-wrap items-end justify-between gap-6 pb-10 sm:pb-16">
        <div>
          <span className="eyebrow text-flare">Selected work</span>
          <h2 className="text-title mt-4 font-display">
            Four projects, <span className="italic">told honestly</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-bone-70">
          Each case study covers the problem, the decisions I'd defend, and what I'd do
          differently. Metrics are labelled where they're estimates.
        </p>
      </header>

      {/* ---- Pointer devices: hover index with a tracking preview plate ---- */}
      <div
        ref={listRef}
        onPointerMove={onMove}
        onPointerLeave={() => {
          setActive(null);
          primed.current = false;
        }}
        className="relative hidden md:block"
      >
        {interactive && (
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={projects[active].slug}
                className="pointer-events-none absolute top-0 left-0 z-20 w-[26vw] max-w-[24rem] overflow-hidden bg-ink shadow-[0_40px_80px_-20px_rgba(11,11,12,0.45)]"
                style={{ x: px, y: py, translateX: "-50%", translateY: "-50%" }}
                initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
                exit={{ opacity: 0, scale: 0.94, rotate: -3 }}
                transition={{ duration: duration.short, ease: ease.outExpo }}
              >
                <img
                  src={asset(projects[active].cover)}
                  alt=""
                  className="aspect-[5/4] w-full object-cover"
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <ul className="border-t border-bone-20">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <Link
                to={`/work/${project.slug}`}
                data-cursor="view"
                data-cursor-label="View case"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-12 items-baseline gap-6 border-b border-bone-20 py-8 transition-opacity duration-500"
                style={{
                  opacity: active === null || active === i ? 1 : 0.32,
                }}
              >
                <span className="eyebrow col-span-1 pt-2 text-bone-45">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="col-span-6">
                  <h3 className="text-title font-display leading-[0.95]">
                    <motion.span
                      className="inline-block"
                      animate={{ x: active === i ? 14 : 0 }}
                      transition={{ duration: duration.short, ease: ease.outExpo }}
                    >
                      {project.title}
                    </motion.span>
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-bone-70">
                    {project.subtitle}
                  </p>
                </div>

                <ul className="col-span-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="eyebrow rounded-full border border-bone-20 px-2.5 py-1 text-bone-45"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="col-span-2 flex items-baseline justify-end gap-4">
                  <span className="eyebrow text-bone-45">{project.year}</span>
                  <motion.span
                    aria-hidden="true"
                    className="text-flare"
                    animate={{ x: active === i ? 6 : 0, opacity: active === i ? 1 : 0.35 }}
                    transition={{ duration: duration.short, ease: ease.outExpo }}
                  >
                    →
                  </motion.span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- Touch devices: stacked plates, no hover dependency ---- */}
      <ul className="flex flex-col gap-14 md:hidden">
        {projects.map((project, i) => (
          <li key={project.slug}>
            <Link to={`/work/${project.slug}`} className="block">
              <MaskImage
                src={project.cover}
                alt={project.coverAlt}
                ratio="5 / 4"
                parallax={10}
              />
              <motion.div
                className="mt-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: duration.base, ease: ease.outQuint }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow text-bone-45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow text-bone-45">{project.year}</span>
                </div>
                <h3 className="text-title mt-2 font-display leading-[0.95]">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bone-70">
                  {project.subtitle}
                </p>
                <span className="eyebrow mt-4 inline-flex items-center gap-2 text-flare">
                  View case <span aria-hidden="true">→</span>
                </span>
              </motion.div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
