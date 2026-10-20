import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter, MemoryRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

/* ============================================================================
   ROUTER SELECTION
   ----------------------------------------------------------------------------
   Chosen by capability probe, not by a list of environments someone remembered.

   React Router builds every href through
       new URL(href, location.origin !== "null" ? location.origin : location.href)
   so the router only works where that base URL is constructible:

     http(s)          origin is real                 -> BrowserRouter (dev, deploy)
     file://          origin is "null", href is a
                      hierarchical file: URL          -> HashRouter (opened from disk)
     about:srcdoc,
     sandboxed frames origin is the STRING "null" and
                      href is opaque -> new URL throws -> MemoryRouter

   That last case is not hypothetical: an earlier version of this file picked
   BrowserRouter there and React Router threw
   "Failed to construct 'URL': Invalid URL" during render, blanking the page.
   MemoryRouter keeps history in memory and never touches window.location, so
   in-app navigation works; only deep links and browser back/forward don't,
   which is the right trade in a preview frame.
   ========================================================================= */

/**
 * Mirrors React Router's own base resolution, so the probe can't drift from it.
 *
 * The probe resolves a PATH ("/"), not a fragment. That distinction is the whole
 * point: an opaque base like "about:srcdoc" happily accepts a fragment-only
 * reference (`new URL("#/", "about:srcdoc")` → "about:srcdoc#/") but rejects any
 * path. React Router resolves paths, so probing with "#/" reports success in
 * exactly the environment that is about to fail.
 *
 *   http://host                     "/" -> ok
 *   file:///Users/…/index.html      "/" -> ok      (hierarchical)
 *   about:srcdoc, blob:null/…       "/" -> throws  (opaque)
 */
function canResolvePathAgainstLocation(): boolean {
  try {
    const base =
      window.location.origin !== "null" ? window.location.origin : window.location.href;
    new URL("/", base);
    return true;
  } catch {
    return false;
  }
}

function pickRouter() {
  if (/^https?:$/.test(window.location.protocol)) {
    return { Router: BrowserRouter, props: { basename: import.meta.env.BASE_URL } };
  }
  if (canResolvePathAgainstLocation()) {
    return { Router: HashRouter, props: {} };
  }
  return { Router: MemoryRouter, props: { initialEntries: ["/"] } };
}

const { Router, props: routerProps } = pickRouter();

/**
 * og:image must be absolute for crawlers, and the deploy base path isn't known
 * at author time — so it's resolved at runtime.
 *
 * Guarded twice on purpose. This runs before createRoot, so an uncaught throw
 * here takes down the entire site for the sake of a social-preview nicety. No
 * cosmetic metadata is worth that.
 */
function resolveSocialImage() {
  const { origin } = window.location;
  if (!origin || origin === "null") return;

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) return;

  try {
    ogImage.setAttribute(
      "content",
      new URL(`${import.meta.env.BASE_URL}og.png`, origin).href,
    );
  } catch {
    // Leave the authored relative path. Never block the render.
  }
}

resolveSocialImage();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router {...routerProps}>
      <App />
    </Router>
  </StrictMode>,
);
