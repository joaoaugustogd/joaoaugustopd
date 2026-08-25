import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { SmoothScroll } from "./components/SmoothScroll";
import { Cursor } from "./components/Cursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { RouteCurtain } from "./components/RouteCurtain";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { duration, ease } from "./lib/motion";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();

  return (
    <SmoothScroll>
      {/* Overlays, in stacking order: grain (90) → progress (95) → nav (96)
          → route curtain (98) → cursor (100). */}
      <div aria-hidden="true" className="grain" />
      <ScrollProgress />
      <RouteCurtain />
      <Cursor />

      <a
        href="#main"
        className="eyebrow sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[101] focus:rounded-full focus:bg-flare focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        {/* mode="wait" so the outgoing page is gone before the next paints —
            two stacked pages during a cross-fade would double the page height
            and make the scroll position jump. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.micro, ease: ease.swift }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/work/:slug" element={<CaseStudy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
