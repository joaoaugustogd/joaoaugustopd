import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "../data/profile";
import { duration, ease } from "../lib/motion";
import { SplitText } from "../components/SplitText";
import { Magnetic } from "../components/Magnetic";

/**
 * CONTACT — the page's loudest moment, at the end where it belongs.
 *
 * The email is set at display scale and is the primary target; copy-to-clipboard
 * is offered alongside it because roughly half of readers want the address in a
 * buffer, not a mailto: handoff to an app they don't use. The copy button has a
 * real confirmed state — a silent clipboard write is indistinguishable from a
 * broken button.
 */
export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard blocked (insecure context, denied permission): the mailto
      // link beside this button is the fallback, so fail quietly.
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden pt-[10vh] pb-[8vh] gutter"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -bottom-[30%] left-[10%] size-[60vw] rounded-full opacity-60 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--color-flare-glow) 0%, transparent 70%)",
          }}
        />
      </div>

      <span className="eyebrow text-flare">Contact</span>

      <h2 className="text-mega mt-6 font-display">
        <SplitText as="span" by="char" stagger={0.02} className="block">
          Let's talk
        </SplitText>
        <SplitText
          as="span"
          by="char"
          stagger={0.02}
          delay={0.2}
          className="block pl-[6vw] italic text-bone-45"
        >
          about the problem
        </SplitText>
      </h2>

      <p className="text-lead mt-10 max-w-xl text-bone-70">
        Available for senior product design roles and selected consulting. Bring the
        messy version — the ambiguity is the interesting part.
      </p>

      <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-center">
        <Magnetic strength={0.16}>
          <a
            href={`mailto:${profile.email}`}
            data-cursor="link"
            className="group relative inline-block font-display text-[clamp(1.75rem,5vw,4rem)] leading-none tracking-tight"
          >
            {profile.email}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-flare transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </a>
        </Magnetic>

        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className="eyebrow relative inline-flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-bone-20 px-5 transition-colors duration-300 hover:border-flare"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              className={copied ? "text-flare" : "text-bone-70"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: duration.micro, ease: ease.outExpo }}
            >
              {copied ? "Copied ✓" : "Copy address"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <ul className="mt-16 flex flex-wrap gap-x-10 gap-y-4">
        {profile.links.slice(1).map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-baseline gap-2"
            >
              <span className="text-lg">{link.label}</span>
              <span className="eyebrow text-bone-45 transition-colors group-hover:text-flare">
                {link.handle}
              </span>
              <span
                aria-hidden="true"
                className="text-flare transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
