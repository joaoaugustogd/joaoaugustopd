import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import { Rule } from "./Reveal";

/** Live clock in the author's timezone — a small signal that a person maintains this. */
function LocalTime() {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo",
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="eyebrow text-bone-45">
      {profile.location} · {now} {profile.timezone}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="gutter pb-10">
      <Rule />
      <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <LocalTime />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="eyebrow text-bone-45 transition-colors hover:text-flare"
            >
              {link.label}
            </a>
          ))}
        </div>
        <span className="eyebrow text-bone-20">
          © {new Date().getFullYear()} {profile.name}
        </span>
      </div>
    </footer>
  );
}
