/* ============================================================================
   CONTENT — PROFILE
   ----------------------------------------------------------------------------
   ⚠️  This is the only file you need to touch to change who the site is about.
   Nothing here is hardcoded in components. Copy marked [PLACEHOLDER] is
   scaffolding written from context — replace it with your real numbers and
   your real words before you publish.
   ========================================================================= */

export const profile = {
  name: "João Augusto",
  role: "Senior Product Designer",
  location: "São Paulo, Brazil",
  timezone: "GMT-3",
  company: "Chop Dawg",
  email: "joao@chopdawg.com",

  /** Hero. Three lines, set in the display serif. Keep each line short. */
  headline: ["Product design", "that survives", "contact with reality"],

  /** One sentence under the headline. This is the whole positioning bet. */
  standfirst:
    "12+ years turning ambiguous problems into products people actually use — from user research and strategy through interaction design, systems and developer handoff.",

  /** About section. Two or three paragraphs, first-person, no buzzwords. */
  about: [
    "I design digital products end to end. That means I'm as comfortable running a discovery interview or arguing about an acquisition metric as I am building a variant set in Figma or writing the spec a developer ships from.",
    "My bias is structure before surface. Information architecture, flow and hierarchy get resolved first — colour, type and micro-interaction are how the structure gets its voice, not a substitute for having one.",
    "Currently senior product designer at Chop Dawg, where I lead design on Pay the Pyper and on client work across fintech, healthtech and marketplaces. Before that: agency, in-house SaaS, and a long stretch of freelance that taught me how to sell a decision, not just make one.",
  ],

  /** Numbers on the About block. [PLACEHOLDER] — put your real ones here. */
  stats: [
    { value: "12+", label: "Years in product design" },
    { value: "40+", label: "Products shipped" },
    { value: "6", label: "Design systems built" },
    { value: "180+", label: "Research sessions run" },
  ],

  /** Capability grid. Grouped the way you'd actually describe your practice. */
  capabilities: [
    {
      title: "Discovery & research",
      items: [
        "Generative & evaluative research",
        "Jobs-to-be-Done framing",
        "Usability testing (moderated & unmoderated)",
        "Research synthesis & insight decks",
      ],
    },
    {
      title: "Product & strategy",
      items: [
        "Problem framing & opportunity sizing",
        "Double Diamond / Design Sprints",
        "Roadmap & prioritisation input",
        "Metric design: task completion, conversion, CSAT",
      ],
    },
    {
      title: "Interaction & interface",
      items: [
        "Information architecture & flows",
        "Wireframe → hi-fi → prototype",
        "Motion & interaction specification",
        "Mobile-first, responsive, dark mode",
      ],
    },
    {
      title: "Systems & handoff",
      items: [
        "Design tokens & theming",
        "Atomic component libraries",
        "Dev handoff specs & redlines",
        "WCAG 2.2 AA accessibility review",
      ],
    },
  ],

  /** Tool marquee. Order matters — most-used first. */
  tools: [
    "Figma",
    "FigJam",
    "ProtoPie",
    "Framer",
    "Storybook",
    "Zeroheight",
    "Maze",
    "Hotjar",
    "Notion",
    "Linear",
    "Miro",
    "Lottie",
  ],

  /** Experience timeline. [PLACEHOLDER] dates and titles — correct these. */
  experience: [
    {
      period: "2022 — Now",
      role: "Senior Product Designer",
      org: "Chop Dawg",
      note: "Design lead on Pay the Pyper. Own the design system, research practice and dev handoff standard across client engagements.",
    },
    {
      period: "2019 — 2022",
      role: "Product Designer",
      org: "[PLACEHOLDER] Previous company",
      note: "Led end-to-end design on core product surfaces. Introduced the first tokenised component library and cut spec-to-ship rework substantially.",
    },
    {
      period: "2016 — 2019",
      role: "UX/UI Designer",
      org: "[PLACEHOLDER] Agency",
      note: "Multi-client delivery across fintech, retail and logistics. Where I learned to defend a design decision to a room that did not ask for it.",
    },
    {
      period: "2014 — 2016",
      role: "Interface Designer",
      org: "[PLACEHOLDER] Studio / freelance",
      note: "Web and early mobile work. Built the habit of shipping, measuring and revising rather than polishing in private.",
    },
  ],

  /** Process — the section that explains how you work. */
  process: [
    {
      phase: "01",
      title: "Frame",
      lead: "What is the actual problem, for whom, with what evidence?",
      body: "Stakeholder interviews, existing data, support tickets, analytics. I write the problem statement before anyone opens Figma, and I get it signed off. Half of bad design is a well-executed answer to the wrong question.",
      artifacts: ["Problem statement", "JTBD map", "Research plan"],
    },
    {
      phase: "02",
      title: "Explore",
      lead: "Widen before narrowing — cheaply, and in public.",
      body: "Flows, IA and lo-fi options first, deliberately more than one. Options get pressure-tested against the frame, not against taste. Trade-offs are written down with their costs so the decision is a decision, not a drift.",
      artifacts: ["User flows", "Wireframes", "Option trade-off doc"],
    },
    {
      phase: "03",
      title: "Resolve",
      lead: "Structure earns the surface.",
      body: "Hierarchy, states, edge cases, empty and error paths, then type, colour and motion. Everything bound to tokens and components so the fifteenth screen costs a fraction of the first.",
      artifacts: ["Hi-fi screens", "Component specs", "Prototype"],
    },
    {
      phase: "04",
      title: "Validate",
      lead: "Test the thing, not the opinion about the thing.",
      body: "Moderated sessions on the risky flows, unmoderated for reach. I report what failed and what I changed — a usability report with no failures is a usability report nobody ran.",
      artifacts: ["Test script", "Findings report", "Revision log"],
    },
    {
      phase: "05",
      title: "Hand off",
      lead: "Ambiguity is a defect. Specify it out.",
      body: "Redlines, tokens, breakpoints, interaction and motion specs, accessibility notes. I stay in the loop through build review, because the design isn't done until it's live and correct.",
      artifacts: ["Handoff spec", "Motion spec", "A11y checklist"],
    },
  ],

  /** Footer / contact links. */
  links: [
    { label: "Email", href: "mailto:joao@chopdawg.com", handle: "joao@chopdawg.com" },
    // [PLACEHOLDER] — swap these for your real profiles.
    { label: "LinkedIn", href: "https://www.linkedin.com/in/", handle: "/in/joaoaugusto" },
    { label: "Read.cv", href: "https://read.cv/", handle: "/joaoaugusto" },
    { label: "Dribbble", href: "https://dribbble.com/", handle: "/joaoaugusto" },
  ],
} as const;

export type Profile = typeof profile;
