import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "../lib/scroller";

/**
 * Links to a section of the home page from anywhere in the app.
 *
 * Why this exists instead of `<a href="/#work">`: that href is only correct
 * under BrowserRouter. Under HashRouter — which is what the site falls back to
 * when opened from disk — the fragment *is* the route, so "/#work" means
 * "navigate to /work" and lands on the 404 page. Under MemoryRouter it would
 * attempt a real document navigation, which a sandboxed frame blocks outright.
 *
 * So the click is handled programmatically in all cases: route home first if
 * needed, then scroll. The href is kept as a bare "#id" purely so the link
 * still reads as a link — hover preview, middle-click, copy — and so it
 * degrades to a plain in-page anchor with JS disabled.
 */
export function SectionLink({
  id,
  children,
  className,
  onActivate,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Fired before navigating — used by the mobile nav to close its overlay. */
  onActivate?: () => void;
}) {
  const navigate = useNavigate();

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // Let the browser handle modified clicks (new tab, download, etc.).
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      onActivate?.();

      if (scrollToSection(id)) return;

      // Section isn't on this page: go home, then scroll once it has mounted.
      // Two frames — one for React to commit, one for layout to settle.
      navigate("/");
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)));
    },
    [id, navigate, onActivate],
  );

  return (
    <a href={`#${id}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
