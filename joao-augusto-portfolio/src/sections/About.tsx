import { profile } from "../data/profile";
import { SplitText } from "../components/SplitText";
import { MaskImage } from "../components/MaskImage";
import { Reveal, RevealGroup, RevealItem, Rule } from "../components/Reveal";
import { Counter } from "../components/Counter";

/**
 * ABOUT — asymmetric two-column, portrait pinned against scrolling prose.
 *
 * The portrait sits in the narrow column and stays put while the text moves,
 * which is the inverse of the Process section's pin. Reusing the mechanic on
 * the opposite side keeps the page feeling composed rather than templated.
 */
export function About() {
  return (
    <section id="about" className="relative py-[12vh] gutter">
      <header className="pb-12 sm:pb-20">
        <span className="eyebrow text-flare">About</span>
        <SplitText as="h2" by="word" className="text-title mt-4 block font-display">
          Structure before surface. Evidence before opinion.
        </SplitText>
      </header>

      <div className="grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-[18vh]">
            <MaskImage
              src="portrait.svg"
              alt={`${profile.name}, ${profile.role}`}
              ratio="4 / 5"
              parallax={14}
            />
            <Reveal delay={0.15}>
              <div className="mt-5 flex items-baseline justify-between">
                <span className="eyebrow text-bone-45">
                  {profile.role} · {profile.company}
                </span>
                <span className="eyebrow text-bone-20">{profile.location}</span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-7 md:pt-4">
          <RevealGroup stagger={0.12} className="flex flex-col gap-7">
            {profile.about.map((paragraph, i) => (
              <RevealItem key={i}>
                <p
                  className={
                    i === 0
                      ? "text-lead font-display"
                      : "max-w-prose leading-relaxed text-bone-70"
                  }
                >
                  {paragraph}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Rule className="mt-14 mb-10" />

          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {profile.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-5xl leading-none tracking-tight sm:text-6xl">
                  <Counter value={stat.value} />
                </dd>
                <dt className="eyebrow mt-3 text-bone-45">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
