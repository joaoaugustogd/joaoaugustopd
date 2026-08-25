import { Hero } from "../sections/Hero";
import { Work } from "../sections/Work";
import { Process } from "../sections/Process";
import { About } from "../sections/About";
import { Capabilities } from "../sections/Capabilities";
import { Contact } from "../sections/Contact";

/**
 * Section order is an argument, not a convention:
 * Hero (claim) → Work (proof) → Process (method) → About (person) →
 * Capabilities (fit) → Contact (action).
 *
 * Work comes second because a hiring reader's first question is "show me",
 * and Process comes before About because the method is the differentiator.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Process />
      <About />
      <Capabilities />
      <Contact />
    </>
  );
}
