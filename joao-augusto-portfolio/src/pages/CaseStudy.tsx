import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { getNextProject, getProject, type CaseStudyBlock } from "../data/projects";
import { duration, ease, inView } from "../lib/motion";
import { SplitText } from "../components/SplitText";
import { MaskImage } from "../components/MaskImage";
import { Reveal, RevealGroup, RevealItem, Rule } from "../components/Reveal";
import { Counter } from "../components/Counter";
import { Magnetic } from "../components/Magnetic";
import { SectionLink } from "../components/SectionLink";
import NotFound from "./NotFound";

/** One narrative block. Kept as a switch so content authors add blocks, not components. */
function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.kind) {
    case "image":
      return (
        <figure className="col-span-full my-4">
          <MaskImage
            src={block.src!}
            alt={block.alt ?? ""}
            ratio={block.ratio ?? "16 / 9"}
            parallax={9}
          />
          {block.caption && (
            <Reveal>
              <figcaption className="eyebrow mt-4 max-w-xl text-bone-45">
                {block.caption}
              </figcaption>
            </Reveal>
          )}
        </figure>
      );

    case "quote":
      return (
        <Reveal className="col-span-full my-6 md:col-start-3 md:col-end-11">
          <blockquote className="border-l border-flare pl-6 sm:pl-10">
            <p className="text-lead font-display italic">“{block.body}”</p>
            {block.caption && (
              <cite className="eyebrow mt-5 block text-bone-45 not-italic">
                {block.caption}
              </cite>
            )}
          </blockquote>
        </Reveal>
      );

    case "list":
      return (
        <div className="col-span-full grid gap-6 md:grid-cols-12">
          {block.heading && (
            <Reveal className="md:col-span-4">
              <h2 className="font-display text-3xl leading-tight">{block.heading}</h2>
            </Reveal>
          )}
          <RevealGroup stagger={0.08} className="flex flex-col md:col-span-8">
            {block.items!.map((item) => (
              <RevealItem key={item}>
                <div className="flex gap-5 border-b border-bone-10 py-4">
                  <span aria-hidden="true" className="mt-2.5 h-px w-5 shrink-0 bg-flare" />
                  <p className="leading-relaxed text-bone-70">{item}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      );

    case "text":
    default:
      return (
        <div className="col-span-full grid gap-6 md:grid-cols-12">
          {block.heading && (
            <Reveal className="md:col-span-4">
              <h2 className="font-display text-3xl leading-tight">{block.heading}</h2>
            </Reveal>
          )}
          <Reveal className={block.heading ? "md:col-span-8" : "md:col-span-8 md:col-start-5"}>
            <p className="text-lead max-w-prose leading-relaxed text-bone-70">
              {block.body}
            </p>
          </Reveal>
        </div>
      );
  }
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProject(slug);

  // Per-page document title: shows up in tabs, history and shared links.
  useEffect(() => {
    if (!project) return;
    const previous = document.title;
    document.title = `${project.title} — João Augusto`;
    return () => {
      document.title = previous;
    };
  }, [project]);

  if (!project) return <NotFound />;
  const next = getNextProject(project.slug);

  const meta = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    { label: "Team", value: project.team },
    { label: "Timeline", value: project.timeline },
    { label: "Platform", value: project.platform },
  ];

  return (
    <article>
      {/* ---- Title block ---- */}
      <header className="pt-[24vh] pb-[6vh] gutter">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.short }}
        >
          <SectionLink
            id="work"
            className="eyebrow inline-flex items-center gap-2 text-bone-45 transition-colors hover:text-flare"
          >
            <span aria-hidden="true">←</span> All work
          </SectionLink>
        </motion.div>

        <h1 className="text-hero mt-8 font-display">
          <SplitText immediate by="char" stagger={0.018} delay={0.15} className="block">
            {project.title}
          </SplitText>
        </h1>

        <motion.p
          className="text-lead mt-6 max-w-2xl font-display italic text-bone-70"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.long, ease: ease.outExpo, delay: 0.5 }}
        >
          {project.subtitle}
        </motion.p>

        <motion.ul
          className="mt-12 flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="eyebrow rounded-full border border-bone-20 px-3 py-1.5 text-bone-45"
            >
              {tag}
            </li>
          ))}
        </motion.ul>
      </header>

      {/* ---- Cover ---- */}
      <div className="gutter">
        <MaskImage
          src={project.cover}
          alt={project.coverAlt}
          ratio="16 / 9"
          parallax={10}
          priority
        />
      </div>

      {/* ---- Meta + excerpt ---- */}
      <div className="gutter pt-[8vh]">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <RevealGroup stagger={0.05} className="grid grid-cols-2 gap-y-8 md:col-span-5 md:grid-cols-2">
            {meta.map((row) => (
              <RevealItem key={row.label} className="pr-6">
                <dt className="eyebrow text-bone-45">{row.label}</dt>
                <dd className="mt-2 text-sm leading-snug">{row.value}</dd>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="md:col-span-6 md:col-start-7">
            <p className="text-lead font-display">{project.excerpt}</p>
          </Reveal>
        </div>

        {/* ---- Outcome metrics ---- */}
        <Rule className="mt-16 mb-10" />
        <dl className="grid gap-10 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <Reveal key={metric.label}>
              <dd className="font-display text-6xl leading-none tracking-tight text-flare sm:text-7xl">
                <Counter value={metric.value} />
              </dd>
              <dt className="eyebrow mt-4 text-bone-45">{metric.label}</dt>
            </Reveal>
          ))}
        </dl>
        <Rule className="mt-10" />
      </div>

      {/* ---- Narrative ---- */}
      <div className="gutter grid gap-[7vh] pt-[9vh] pb-[11vh] md:grid-cols-12">
        {project.blocks.map((block, i) => (
          <div key={i} className="col-span-full">
            <Block block={block} />
          </div>
        ))}
      </div>

      {/* ---- Next project ---- */}
      <section className="invert-surface gutter py-[10vh]">
        <span className="eyebrow text-flare">Next case study</span>
        <Link
          to={`/work/${next.slug}`}
          data-cursor="view"
          data-cursor-label="View case"
          className="group mt-6 grid items-end gap-8 md:grid-cols-12"
        >
          <div className="md:col-span-7">
            <motion.h2
              className="text-hero font-display leading-[0.9]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: duration.long, ease: ease.outExpo }}
            >
              {next.title}
            </motion.h2>
            <p className="mt-4 max-w-md text-bone-70">{next.subtitle}</p>
            <Magnetic strength={0.3}>
              <span className="eyebrow mt-8 inline-flex items-center gap-3 rounded-full border border-bone-20 px-5 py-3 transition-colors duration-300 group-hover:border-flare group-hover:bg-flare group-hover:text-paper">
                Read it <span aria-hidden="true">→</span>
              </span>
            </Magnetic>
          </div>
          <div className="md:col-span-5">
            <MaskImage src={next.cover} alt={next.coverAlt} ratio="5 / 4" parallax={8} />
          </div>
        </Link>
      </section>
    </article>
  );
}
