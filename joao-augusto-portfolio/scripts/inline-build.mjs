/**
 * Builds a single self-contained index.html — no server, no npm install, no
 * sibling files. Double-click it, or drop it into any preview pane.
 *
 * Everything is inlined, and each decision is forced by a real constraint:
 *
 * - JS/CSS: browsers refuse to fetch an external `<script type="module" src>`
 *   from file:// (origin is "null", so CORS blocks it) — the page renders blank.
 *   An *inline* module script has nothing to fetch, so it runs.
 *
 * - Images: when this file is rendered inside a sandboxed srcdoc frame there is
 *   no document base URL, so a relative "./projects/x.svg" resolves against the
 *   host page and 404s. So images ship as data: URIs via `__INLINE_ASSETS__`,
 *   which src/lib/asset.ts consults before falling back to BASE_URL.
 *
 * Run with:  npm run build:offline
 * Output:    preview-offline/index.html  (one file, nothing else needed)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync } from "node:fs";
import { resolve, join, extname } from "node:path";

const DIST = resolve("dist");
const OUT = resolve("preview-offline");

if (!existsSync(DIST)) {
  console.error("No dist/ found. Run: BASE_PATH=./ npx vite build");
  process.exit(1);
}

const MIME = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

/** Collects every image under dist/, keyed by its path relative to dist/. */
function collectImages(dir, prefix = "") {
  const out = {};
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const key = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === "assets") continue; // Vite's JS/CSS output.
      Object.assign(out, collectImages(join(dir, entry.name), key));
      continue;
    }
    const mime = MIME[extname(entry.name).toLowerCase()];
    if (!mime) continue;
    // og.png is social metadata only — never rendered, and 640 kB of base64.
    if (entry.name === "og.png") continue;
    // Read from dir + name; `key` already carries the prefix and must not be
    // joined onto dir as well.
    out[key] = `data:${mime};base64,${readFileSync(join(dir, entry.name)).toString("base64")}`;
  }
  return out;
}

/* ---------------------------------------------------------------------------
   ASCII-only output.

   A srcdoc document inherits its character encoding from the parent page and
   ignores its own <meta charset>. So when this file is rendered in a preview
   pane whose host page doesn't declare UTF-8, every em dash, arrow and accented
   character mojibakes ("2024 Â—", "JoÃ£o"). Escaping to pure ASCII makes the
   output encoding-independent.

   Two escape syntaxes, because the context differs:
     markup -> &#xNNNN;   (entities are not parsed inside <script>)
     script -> \uNNNN     (valid in string, template and regex literals)
   The regex has no /u flag on purpose, so it matches per UTF-16 code unit and
   surrogate pairs escape correctly as two units.
   --------------------------------------------------------------------------- */
const hex = (ch) => ch.charCodeAt(0).toString(16).padStart(4, "0");
const asciiMarkup = (s) => s.replace(/[^\x00-\x7F]/g, (c) => `&#x${hex(c)};`);
const asciiScript = (s) => s.replace(/[^\x00-\x7F]/g, (c) => `\\u${hex(c)}`);

let html = asciiMarkup(readFileSync(join(DIST, "index.html"), "utf8"));
const images = collectImages(DIST);

// Inline stylesheets.
html = html.replace(
  /<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g,
  (_m, href) => {
    const css = readFileSync(join(DIST, href.replace(/^\.?\//, "")), "utf8");
    const nonAscii = css.match(/[^\x00-\x7F]/g);
    if (nonAscii) {
      console.warn(
        `  ! ${nonAscii.length} non-ASCII char(s) in CSS left as-is: ${[...new Set(nonAscii)].join("")}`,
      );
    }
    return `<style>\n${css}\n</style>`;
  },
);

// Inline the module script, prefixed by the asset map so it exists before the
// app's first render. Both are ASCII-escaped.
html = html.replace(
  /<script type="module"[^>]+src="([^"]+)"[^>]*><\/script>/g,
  (_m, src) => {
    const js = readFileSync(join(DIST, src.replace(/^\.?\//, "")), "utf8");
    return (
      `<script>window.__INLINE_ASSETS__=${asciiScript(JSON.stringify(images))};</script>\n` +
      `<script type="module">\n${asciiScript(js)}\n</script>`
    );
  },
);

// The favicon would be a second network request; inline it too.
if (images["favicon.svg"]) {
  html = html.replace(/href="[^"]*favicon\.svg"/, `href="${images["favicon.svg"]}"`);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, "index.html"), html);

const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(
  `preview-offline/index.html — ${kb} kB, ${Object.keys(images).length} images inlined, zero external requests`,
);
