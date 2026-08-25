import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { duration, ease } from "../lib/motion";
import { profile } from "../data/profile";
import { Magnetic } from "./Magnetic";
import { SectionLink } from "./SectionLink";

/* Section ids, not hrefs. SectionLink turns these into route-aware navigation,
   because "/#work" only means "scroll to work" under BrowserRouter — under the
   hash-routing fallback it means "route to /work" and 404s. */
const NAV_ITEMS = [
  { label: "Work", id: "work" },
  { label: "Process", id: "process" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
];

/**
 * Header that hides on scroll-down and returns on scroll-up.
 *
 * The rule is intent-based, not position-based: scrolling down means the reader
 * wants the content, scrolling up means they want the controls. A 12px
 * threshold keeps trackpad jitter and Lenis overscroll from flickering it.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = current - previous;
    setScrolled(current > 24);
    if (Math.abs(delta) < 12) return;
    setHidden(delta > 0 && current > 240);
  });

  // Close the overlay on route change and lock the page while it's open.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", menuOpen);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[96] gutter"
        initial={{ y: -80 }}
        animate={{ y: hidden && !menuOpen ? -96 : 0 }}
        transition={{ duration: duration.short, ease: ease.outExpo }}
      >
        <div
          className={`flex items-center justify-between py-5 transition-[border-color,backdrop-filter] duration-500 ${
            scrolled ? "border-b border-bone-10" : "border-b border-transparent"
          }`}
        >
          <Link
            to="/"
            className="group flex items-baseline gap-2.5"
            aria-label={`${profile.name} — home`}
          >
            <span
              aria-hidden="true"
              className="inline-block size-2 shrink-0 rounded-full bg-flare transition-transform duration-500 group-hover:scale-150"
            />
            <span className="font-display text-lg leading-none tracking-tight sm:text-xl">
              {profile.name}
            </span>
            <span className="eyebrow hidden text-bone-45 sm:inline">
              {profile.role}
            </span>
          </Link>

          {/* Desktop: inline links with an underline that wipes in. */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Sections">
            {NAV_ITEMS.map((item) => (
              <SectionLink
                key={item.label}
                id={item.id}
                className="group eyebrow relative py-1 text-bone-70 transition-colors hover:text-bone"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-flare transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
              </SectionLink>
            ))}
            <Magnetic strength={0.3}>
              <a
                href={`mailto:${profile.email}`}
                data-cursor="link"
                className="eyebrow inline-flex items-center gap-2 rounded-full border border-bone-20 px-4 py-2 text-bone transition-colors duration-300 hover:border-flare hover:bg-flare hover:text-ink"
              >
                Available for work
                <span aria-hidden="true" className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-flare opacity-75" />
                  <span className="relative size-1.5 rounded-full bg-flare" />
                </span>
              </a>
            </Magnetic>
          </nav>

          {/* Mobile: overlay trigger. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="nav-overlay"
            className="eyebrow flex items-center gap-2 md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
            <span aria-hidden="true" className="flex flex-col gap-1">
              <motion.span
                className="block h-px w-4 bg-bone"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 2.5 : 0 }}
              />
              <motion.span
                className="block h-px w-4 bg-bone"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -2.5 : 0 }}
              />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-overlay"
            className="fixed inset-0 z-[95] flex flex-col justify-end bg-ink-sunken gutter pb-14 md:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: duration.base, ease: ease.inOutQuart }}
          >
            <nav className="flex flex-col gap-2" aria-label="Sections">
              {NAV_ITEMS.map((item, i) => (
                <span key={item.label} className="mask-line">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: duration.base,
                      ease: ease.outExpo,
                      delay: 0.14 + i * 0.06,
                    }}
                  >
                    <SectionLink
                      id={item.id}
                      onActivate={() => setMenuOpen(false)}
                      className="block font-display text-title"
                    >
                      {item.label}
                    </SectionLink>
                  </motion.div>
                </span>
              ))}
            </nav>
            <motion.a
              href={`mailto:${profile.email}`}
              className="eyebrow mt-10 text-flare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {profile.email}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
