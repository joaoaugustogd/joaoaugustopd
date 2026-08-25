import { Link } from "react-router-dom";
import { SplitText } from "../components/SplitText";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-center gutter">
      <span className="eyebrow text-flare">Error 404</span>
      <h1 className="text-hero mt-6 font-display">
        <SplitText immediate by="char" className="block">
          Nothing here
        </SplitText>
        <SplitText immediate by="char" delay={0.25} className="block italic text-bone-45">
          yet
        </SplitText>
      </h1>
      <p className="text-lead mt-8 max-w-md text-bone-70">
        This page doesn't exist — which, in fairness, is also an edge case someone
        should have specified.
      </p>
      <Link
        to="/"
        className="eyebrow mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-bone-20 px-5 py-3 transition-colors duration-300 hover:border-flare hover:bg-flare hover:text-ink"
      >
        Back to the work <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
