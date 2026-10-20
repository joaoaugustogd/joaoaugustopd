declare global {
  interface Window {
    /**
     * Optional map of "projects/cover.svg" -> data: URI, injected only by the
     * offline single-file build. Absent in dev and in the deployed site.
     */
    __INLINE_ASSETS__?: Record<string, string>;
  }
}

/**
 * Resolves a path in /public to something loadable in the current context.
 *
 * Three cases, in order:
 *
 * 1. The offline single-file build injects `__INLINE_ASSETS__` with every image
 *    as a data: URI. This matters because that file gets rendered inside
 *    sandboxed preview frames (srcdoc), where there is no document base URL —
 *    a relative "./projects/x.svg" resolves against the *host* page and 404s.
 *    Inlining is the only way one file works everywhere.
 *
 * 2. Otherwise resolve against Vite's BASE_URL. A relative "./x" would break on
 *    nested routes like /work/:slug; a root "/x" would break under
 *    /repo-name/ on GitHub Pages. BASE_URL is correct for both.
 */
export const asset = (path: string) => {
  const key = path.replace(/^\.?\//, "");
  const inlined = typeof window !== "undefined" ? window.__INLINE_ASSETS__?.[key] : undefined;
  if (inlined) return inlined;

  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${key}`;
};
