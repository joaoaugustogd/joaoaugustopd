import type Lenis from "lenis";

/**
 * A single registry for whatever is currently doing the scrolling.
 *
 * Section navigation and smooth scrolling used to be handled in two places —
 * a document-level anchor listener inside SmoothScroll, and the links
 * themselves — which meant two scrollers could fire for one click. Now
 * SmoothScroll registers its Lenis instance here and every caller goes through
 * scrollToSection, so there is exactly one path.
 */
let instance: Lenis | null = null;

export function registerScroller(next: Lenis | null) {
  instance = next;
}

/**
 * Scrolls to a section by id. Returns false if the element isn't on this page,
 * so callers can route first and scroll after.
 */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  if (instance) {
    instance.scrollTo(el, { offset: -8, duration: 1.4 });
  } else {
    // Reduced motion, or Lenis not mounted: let the platform decide.
    el.scrollIntoView({ block: "start" });
  }
  return true;
}
