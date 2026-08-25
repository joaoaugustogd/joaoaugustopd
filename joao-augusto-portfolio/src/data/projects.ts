/* ============================================================================
   CONTENT — CASE STUDIES
   ----------------------------------------------------------------------------
   ⚠️  One object per project. Add, remove or reorder freely — the work index,
   the routes and the "next project" links all derive from this array.

   Everything marked [PLACEHOLDER] is scaffolding: the structure is right, the
   specifics are invented. Replace with your real narrative and real numbers.
   A case study with honest, modest metrics beats one with impressive ones a
   reader can tell you made up.

   Images live in /public/projects/. Drop real exports in with the same
   filenames and nothing else needs to change.
   ========================================================================= */

export type CaseStudyBlock = {
  kind: "text" | "image" | "list" | "quote";
  heading?: string;
  body?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  ratio?: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  /** Short discipline tags shown on the index card. Max 4. */
  tags: string[];
  role: string;
  team: string;
  timeline: string;
  platform: string;
  cover: string;
  coverAlt: string;
  /** One-paragraph hook for the index. */
  excerpt: string;
  /** Headline outcomes. Keep to 3 — more reads as padding. */
  metrics: { value: string; label: string }[];
  /** The narrative. Ordered blocks, rendered top to bottom. */
  blocks: CaseStudyBlock[];
};

export const projects: Project[] = [
  {
    slug: "pay-the-pyper",
    title: "Pay the Pyper",
    subtitle: "Getting amateur sports organisers out of the group chat",
    client: "Chop Dawg",
    year: "2024 — 2025",
    tags: ["Mobile", "Payments", "0→1", "Design system"],
    role: "Lead product designer — research, IA, interaction, system, handoff",
    team: "1 designer, 1 PM, 4 engineers",
    timeline: "9 months to public beta",
    platform: "iOS & Android (React Native)",
    cover: "projects/pay-the-pyper-cover.svg",
    coverAlt: "Pay the Pyper — payment collection screens for recreational sports organisers",
    excerpt:
      "Adult recreational sports run on volunteers who chase money over text message. We designed the collection flow so an organiser can close out a season without ever asking twice.",
    metrics: [
      { value: "-71%", label: "Time to collect a full roster [PLACEHOLDER]" },
      { value: "94%", label: "Task completion, first-run setup [PLACEHOLDER]" },
      { value: "4.7", label: "Beta CSAT, organisers [PLACEHOLDER]" },
    ],
    blocks: [
      {
        kind: "text",
        heading: "The problem",
        body: "Organisers of adult rec leagues are not finance people. They're the one person in a group of twenty who volunteered, and they are personally out of pocket until everyone pays. Our discovery interviews (14 organisers, 6 leagues) surfaced the same failure every time: the money conversation happens in a group chat, where it competes with jokes, scheduling and dropouts. Nobody is trying to avoid paying. The request is simply invisible.",
      },
      {
        kind: "list",
        heading: "What research actually told us",
        items: [
          "Organisers avoid chasing because it costs them social capital, not time.",
          "Players pay instantly when asked directly — the median delay was attention, not intent.",
          "Every organiser had a shadow spreadsheet. None of them trusted it.",
          "Splitting an irregular cost (a forfeited field, a ref no-show) was the single most-dreaded task.",
        ],
      },
      {
        kind: "image",
        src: "projects/pay-the-pyper-research.svg",
        alt: "Affinity map of organiser interview findings clustered into four themes",
        caption: "Synthesis of 14 organiser interviews. Four themes, ranked by frequency × pain.",
        ratio: "16 / 10",
      },
      {
        kind: "text",
        heading: "The reframe",
        body: "We stopped designing a payments product and started designing an absence of a conversation. The design goal became: the organiser performs one action, once, and the system does all subsequent asking. That reframe killed three planned features — an in-app chat, a manual ledger, and a reminder composer — and it made the roadmap shorter, not longer.",
      },
      {
        kind: "quote",
        body: "I don't want a better way to ask people for money. I want to not be the guy who asks.",
        caption: "Organiser, 8-season kickball league — the interview that changed the brief",
      },
      {
        kind: "text",
        heading: "Interaction design",
        body: "Roster-first, not invoice-first. The organiser's home is the roster, and payment state is a property of a person rather than a separate document to reconcile. Every row carries one of five states — unsent, sent, seen, paid, failed — with a single dominant action per state. Escalation is automatic and visible: the organiser can always see what the system said and when, so they never double-ask.",
      },
      {
        kind: "image",
        src: "projects/pay-the-pyper-flow.svg",
        alt: "Service flow diagram showing roster creation, request, reminder escalation and reconciliation paths",
        caption:
          "Service flow with the happy path, plus the four branches we shipped: partial pay, card decline, player drop-out, and organiser refund.",
        ratio: "16 / 9",
      },
      {
        kind: "list",
        heading: "Decisions worth defending",
        items: [
          "Amount owed is always rendered as currency at full type scale — never abbreviated. Money is the one place ambiguity is unacceptable.",
          "No red for 'unpaid'. Unpaid is the default state of a new season, not an error, and colouring it red trained organisers to feel behind on day one.",
          "Reminders are scheduled by the system with an organiser-visible cadence, not composed by hand. Composing invites hedging; hedging is why people don't send.",
          "Split-an-extra-cost lives in the roster, not in a wizard. Two taps, because the moment it's needed is a moment of frustration.",
        ],
      },
      {
        kind: "text",
        heading: "System & handoff",
        body: "Built on a tokenised foundation: 3 type scales, a 4/8px spacing set, semantic colour roles for payment state, and full light/dark parity. 38 components, each documented with variants, states, focus order, touch-target size and motion spec. Handoff shipped as annotated frames plus a written spec covering breakpoints, empty and error states, and WCAG 2.2 AA contrast for every state pair. Engineering built the first eleven screens without a single clarification thread — that was the metric I actually cared about.",
      },
      {
        kind: "text",
        heading: "What I'd do differently",
        body: "We validated the organiser side hard and the player side late. Players are the volume users, and two of our three post-beta fixes were on their receipt and dispute flow. Next time the second research round gets split evenly, not weighted toward whoever the buyer is.",
      },
    ],
  },

  {
    slug: "field-ops",
    title: "Field Ops",
    subtitle: "A dispatch console for people who work with gloves on",
    client: "[PLACEHOLDER] Logistics client",
    year: "2023",
    tags: ["B2B SaaS", "Complex tables", "Accessibility"],
    role: "Product designer — IA, interaction, accessibility, handoff",
    team: "2 designers, 1 PM, 6 engineers",
    timeline: "5 months",
    platform: "Web (desktop-first) + ruggedised Android tablet",
    cover: "projects/field-ops-cover.svg",
    coverAlt: "Field Ops — dispatch console with dense scheduling table",
    excerpt:
      "A dispatch tool where every second of hesitation costs a truck. We rebuilt the information architecture around the two questions dispatchers actually ask, and cut the console from eleven screens to three.",
    metrics: [
      { value: "-43%", label: "Time-on-task, reassign a job [PLACEHOLDER]" },
      { value: "11→3", label: "Screens in the core loop" },
      { value: "AA", label: "WCAG 2.2 conformance, verified" },
    ],
    blocks: [
      {
        kind: "text",
        heading: "The problem",
        body: "Dispatchers were running an eleven-screen console on two monitors and a paper notepad. The notepad is the tell: when users build an analogue layer on top of your software, the software has failed at synthesis, not at features.",
      },
      {
        kind: "list",
        heading: "Constraints that shaped everything",
        items: [
          "Primary users work in a noisy room, standing, often on a 10-minute handover.",
          "Field crews use the tablet outdoors, in gloves, in direct sunlight.",
          "The legacy data model could not change within the project window.",
          "Two of nine dispatchers had a diagnosed colour vision deficiency.",
        ],
      },
      {
        kind: "image",
        src: "projects/field-ops-ia.svg",
        alt: "Before and after information architecture diagrams, eleven screens reduced to three",
        caption: "IA before and after. Same data model, a third of the surface.",
        ratio: "16 / 9",
      },
      {
        kind: "text",
        heading: "Approach",
        body: "I shadowed four dispatchers for a full shift each and logged every question they asked out loud. They reduced to two: “who can take this now?” and “what is about to go wrong?”. Those became the two persistent regions of the console. Everything that answered neither question became progressive disclosure or got deleted.",
      },
      {
        kind: "list",
        heading: "Accessibility as a design driver, not an audit",
        items: [
          "Status is never colour-alone — every state carries a shape and a text label. This came from the CVD dispatchers and improved sunlight legibility for the field crews as a side effect.",
          "Minimum 48px touch targets on the tablet build, up from 32px. Glove testing, not a spec sheet, set that number.",
          "Full keyboard operation of the dispatch table, including range selection — dispatchers were faster with keys than with the mouse once it existed.",
          "Contrast verified at 4.5:1 for every state pair in both themes before handoff, not after.",
        ],
      },
      {
        kind: "text",
        heading: "Outcome",
        body: "Reassignment time-on-task dropped 43% in moderated testing against the legacy console. The paper notepads went away within three weeks of rollout — the strongest signal we got, and one no dashboard would have shown us.",
      },
    ],
  },

  {
    slug: "clinic-os",
    title: "Clinic OS",
    subtitle: "Scheduling for clinics where a no-show costs a bed",
    client: "[PLACEHOLDER] Healthtech client",
    year: "2022",
    tags: ["Healthtech", "Scheduling", "Research"],
    role: "Product designer — research, service design, interaction",
    team: "1 designer, 1 researcher, 5 engineers",
    timeline: "6 months",
    platform: "Web + patient-facing mobile web",
    cover: "projects/clinic-os-cover.svg",
    coverAlt: "Clinic OS — appointment scheduling interface with capacity view",
    excerpt:
      "Reception staff were double-booking on purpose to absorb no-shows. Instead of blocking the workaround, we designed for it — and made the real capacity visible for the first time.",
    metrics: [
      { value: "-28%", label: "No-show rate [PLACEHOLDER]" },
      { value: "-52%", label: "Reception overrides [PLACEHOLDER]" },
      { value: "9/10", label: "Staff would not go back [PLACEHOLDER]" },
    ],
    blocks: [
      {
        kind: "text",
        heading: "The problem",
        body: "The system's rule was one patient per slot. Reality was a 22% no-show rate, so reception deliberately overbooked and absorbed the fallout by hand. Product read this as misuse. Contextual research read it as expertise the software refused to model.",
      },
      {
        kind: "quote",
        body: "If I follow the system exactly, the doctor sits empty for forty minutes and someone waits three weeks. So I don't follow it exactly.",
        caption: "Reception lead, 11 years in role",
      },
      {
        kind: "text",
        heading: "Approach",
        body: "We modelled likelihood-to-attend as a visible property of a booking rather than a hidden risk, and gave reception an intentional overbook affordance with the consequence shown inline — expected load, worst case, and who gets bumped if everyone arrives. The workaround became a first-class feature with guardrails instead of a rule to enforce.",
      },
      {
        kind: "image",
        src: "projects/clinic-os-capacity.svg",
        alt: "Capacity view showing expected versus worst-case clinic load across a day",
        caption:
          "The capacity view. Expected load, worst case, and the bump order — the three things reception used to hold in their head.",
        ratio: "16 / 10",
      },
      {
        kind: "list",
        heading: "What made it defensible",
        items: [
          "Nothing is auto-booked on the patient's behalf. The prediction informs a human decision; it never makes one.",
          "The worst case is always shown next to the expected case. A model that only shows its happy path is a model that will eventually embarrass its user.",
          "Reminder copy was rewritten and tested separately — plain language and a one-tap confirm accounted for a meaningful share of the no-show drop on its own.",
        ],
      },
      {
        kind: "text",
        heading: "Outcome",
        body: "No-shows fell 28% and manual overrides halved, but the finding I keep reusing is smaller: when users build a workaround, they've already designed the feature. The job is to find out what it costs them and take that cost away.",
      },
    ],
  },

  {
    slug: "ledger",
    title: "Ledger",
    subtitle: "A design system that made the fifteenth screen cheap",
    client: "[PLACEHOLDER] Fintech client",
    year: "2021 — 2022",
    tags: ["Design system", "Tokens", "Documentation"],
    role: "Design systems lead — tokens, components, docs, governance",
    team: "2 designers, 3 engineers, 1 tech writer",
    timeline: "Ongoing, 8 months to v1",
    platform: "Web + iOS + Android",
    cover: "projects/ledger-cover.svg",
    coverAlt: "Ledger design system — token architecture and component library",
    excerpt:
      "Four squads, three platforms, eleven versions of a button. We built the token architecture and the governance model that stopped it recurring.",
    metrics: [
      { value: "11→1", label: "Button implementations" },
      { value: "-64%", label: "Design-to-dev rework [PLACEHOLDER]" },
      { value: "142", label: "Tokens, 3 themes" },
    ],
    blocks: [
      {
        kind: "text",
        heading: "The problem",
        body: "Not inconsistency — inconsistency is a symptom. The cause was that no squad had a cheaper path than building its own. Every component fork was a rational local decision. A system that loses to copy-paste has lost on ergonomics, not on discipline.",
      },
      {
        kind: "text",
        heading: "Token architecture",
        body: "Three tiers: primitives (raw ramps, never referenced by a component), semantic roles (surface, content, border, state — what designers and engineers actually use), and component tokens (only where a component genuinely needs to deviate). Theming happens entirely at the semantic tier, which is why light, dark and the high-contrast theme cost one afternoon each after the first.",
      },
      {
        kind: "image",
        src: "projects/ledger-tokens.svg",
        alt: "Three-tier token architecture diagram: primitives, semantic roles, component tokens",
        caption: "Three tiers. Components may only reference the middle one.",
        ratio: "16 / 9",
      },
      {
        kind: "list",
        heading: "Governance, in four rules",
        items: [
          "A component enters the library on its third use, not its first. Two uses is a pattern; three is a system.",
          "Every component ships with variants, states, focus order, a11y notes and a motion spec, or it isn't shipped.",
          "Contribution is a PR against the library, reviewed in a 30-minute weekly slot. Fast enough that nobody routes around it.",
          "Deprecation has a date and a codemod. Without both, nothing is ever actually removed.",
        ],
      },
      {
        kind: "text",
        heading: "Outcome",
        body: "One button. 142 tokens across three themes, mirrored between Figma variables and code. Rework between design and engineering dropped 64% over two quarters — mostly because 'what should this state look like?' stopped being a question anyone needed to ask.",
      },
    ],
  },
];

export const getProject = (slug?: string) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
};
