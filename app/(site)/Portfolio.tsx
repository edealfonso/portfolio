"use client";

import { useEffect, useRef, useState } from "react";
import type { About, Project } from "@/sanity/data";

type Panel =
  | { kind: "project"; index: number }
  | { kind: "about" }
  | { kind: "contact" };

// Same condition as the touch / narrow media query in globals.css.
const NO_HOVER = "(hover: none), (max-width: 720px)";

const pad = (i: number) => String(i + 1).padStart(2, "0");

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

const uses = (p: Project, tech: string) =>
  [...(p.keyTech ?? []), ...(p.stack ?? [])].some((t) => same(t, tech));

// Sanity's image CDN can resize on the fly; leave other URLs untouched.
const sized = (url: string, width: number) =>
  url.includes("cdn.sanity.io") ? `${url}?w=${width}&auto=format` : url;

export default function Portfolio({
  projects,
  about,
  formKey,
}: {
  projects: Project[];
  about: About;
  formKey: string;
}) {
  const [active, setActive] = useState(-1);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [open, setOpen] = useState(false);
  // One technology at a time; null shows every project.
  const [filter, setFilter] = useState<string | null>(null);

  // Keep each project's original index: it is its number and its media slot.
  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => !filter || uses(project, filter));

  const filterBy = (tech: string) => {
    setFilter(tech);
    setOpen(false);
    setActive(-1);
  };

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const show = (p: Panel) => {
    setPanel(p);
    setOpen(true);
    setActive(-1);
  };
  const close = () => setOpen(false);

  // The preview window eases towards the cursor.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let frame = 0;
    let placed = false;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      stage.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      const settled =
        Math.abs(target.x - pos.x) < 0.3 && Math.abs(target.y - pos.y) < 0.3;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const w = stage.offsetWidth;
      const h = stage.offsetHeight;
      target.x = Math.min(e.clientX + 28, window.innerWidth - w - 16);
      target.y = Math.min(
        Math.max(e.clientY - h / 2, 16),
        window.innerHeight - h - 16,
      );
      if (!placed) {
        pos.x = target.x;
        pos.y = target.y;
        placed = true;
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Only the hovered project's video plays.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active) video.play().catch(() => {});
      else video.pause();
    });
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="top">
        <div className="me">
          <span className="dot" />
          Elsa de Alfonso
          <span className="mono role">Full Stack Software Engineer</span>
        </div>
        <nav className="mono">
          <button onClick={() => show({ kind: "about" })}>About</button>
          <button onClick={() => show({ kind: "contact" })}>Contact</button>
        </nav>
      </header>

      <main>
        <div className="work">
          <div className="filterbar mono">
            <span className="list-title">Selected projects</span>
            {filter && (
              <>
                <span className="filter-label">Filtered by</span>
                <button
                  className="filter-tag"
                  onClick={() => setFilter(null)}
                  aria-label={`Remove filter ${filter}`}
                >
                  {filter} <span aria-hidden>✕</span>
                </button>
              </>
            )}
          </div>
          {/* Re-keyed so the entrance animation replays on every filter change. */}
          <ul
            className="list"
            key={filter ?? "all"}
            onMouseLeave={() => setActive(-1)}
          >
            {visible.map(({ project: p, index }, position) => (
              <li
                key={p._id}
                style={{ "--i": position } as React.CSSProperties}
              >
                <div
                  className={`row${active === index ? " on" : ""}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => show({ kind: "project", index })}
                >
                  <span className="idx mono">{pad(index)}</span>
                  <button className="ttl">
                    <b>{p.title}</b>
                  </button>
                  <span className="tech mono">
                    {p.keyTech?.map((tech) => (
                      <button
                        key={tech}
                        className={filter && same(filter, tech) ? "is-on" : ""}
                        // Labels with a cursor, filters on touch: see globals.css.
                        tabIndex={-1}
                        onClick={(e) => {
                          if (!window.matchMedia(NO_HOVER).matches) return;
                          e.stopPropagation();
                          filterBy(tech);
                        }}
                      >
                        {tech}
                      </button>
                    ))}
                  </span>
                  <span className="yr mono">{p.year}</span>
                  <Thumb project={p} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <footer className="foot mono">© 2026 Elsa de Alfonso</footer>
      </main>

      <div
        ref={stageRef}
        className={`stage${active >= 0 ? " on" : ""}`}
        aria-hidden
      >
        {projects.map((p, i) => (
          <div key={p._id} className={`shot${active === i ? " on" : ""}`}>
            {p.video ? (
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={p.video}
                poster={p.image ? sized(p.image, 800) : undefined}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sized(p.image, 800)} alt="" />
            ) : (
              <Placeholder />
            )}
          </div>
        ))}
      </div>

      <div
        className={`veil${open ? " open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {panel && (
          <div
            className="card"
            role="dialog"
            aria-modal="true"
            key={panel.kind === "project" ? `p${panel.index}` : panel.kind}
          >
            {panel.kind === "project" && projects[panel.index] && (
              <ProjectCard
                project={projects[panel.index]}
                index={panel.index}
                filter={filter}
                onFilter={filterBy}
                onClose={close}
              />
            )}
            {panel.kind === "about" && (
              <AboutCard about={about} onClose={close} />
            )}
            {panel.kind === "contact" && (
              <ContactCard formKey={formKey} onClose={close} />
            )}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Small preview shown in the row on touch screens, where there is no hover.
 * Every row gets one: without media it is an empty frame, so the list stays even.
 */
function Thumb({ project }: { project: Project }) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="thumb" src={sized(project.image, 320)} alt="" />;
  }
  if (project.video) {
    return (
      <video
        className="thumb"
        src={`${project.video}#t=0.1`}
        muted
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    <span className="thumb">
      <Placeholder />
    </span>
  );
}

/**
 * Stand-in for projects with no video or screenshot (internal products):
 * an invented interface, always the same, blurred until nothing can be read.
 */
function Placeholder() {
  return (
    <span className="ph" aria-hidden>
      <span className="ph-ui">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
    </span>
  );
}

const KINDS = {
  website: "Website",
  platform: "Web platform",
  contribution: "Platform contribution",
} as const;

function Close({ onClose }: { onClose: () => void }) {
  return (
    <button className="x mono" onClick={onClose}>
      Close ✕
    </button>
  );
}

function ProjectCard({
  project: p,
  index,
  filter,
  onFilter,
  onClose,
}: {
  project: Project;
  index: number;
  filter: string | null;
  onFilter: (tech: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="card-meta mono">
        <span className="accent">
          {pad(index)}
          {p.year ? ` / ${p.year}` : ""}
        </span>
        {p.kind && KINDS[p.kind] && <span>{KINDS[p.kind]}</span>}
      </div>
      <h2>{p.title}</h2>
      <div className="card-media">
        {p.video ? (
          <video src={p.video} muted loop playsInline autoPlay />
        ) : p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sized(p.image, 900)} alt="" />
        ) : (
          <Placeholder />
        )}
      </div>
      <dl>
        {p.summary && (
          <>
            <dt className="mono">What it is</dt>
            <dd>{p.summary}</dd>
          </>
        )}
        {p.role && (
          <>
            <dt className="mono near">My part</dt>
            <dd className="near">{p.role}</dd>
          </>
        )}
        {p.stack && p.stack.length > 0 && (
          <>
            <dt className="mono">Stack</dt>
            <dd className="chips mono">
              {p.stack.map((tech) => (
                <button
                  key={tech}
                  className={filter && same(filter, tech) ? "is-on" : ""}
                  onClick={() => onFilter(tech)}
                >
                  {tech}
                </button>
              ))}
            </dd>
          </>
        )}
      </dl>
      <footer>
        {/* "Visit site" is my own work; "About the company" is only context. */}
        <span className="card-links mono">
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer">
              Visit site ↗
            </a>
          )}
          {p.companyUrl && (
            <a href={p.companyUrl} target="_blank" rel="noreferrer">
              About the company ↗
            </a>
          )}
        </span>
        <Close onClose={onClose} />
      </footer>
    </>
  );
}

function AboutCard({ about, onClose }: { about: About; onClose: () => void }) {
  return (
    <>
      <div className="mono accent">About</div>
      <div className={`about${about.photo ? "" : " no-photo"}`}>
        {about.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="photo" src={sized(about.photo, 500)} alt="" />
        )}
        <div>
          {about.heading && <h2>{about.heading}</h2>}
          {about.bio && <p>{about.bio}</p>}
        </div>
      </div>
      <div className="links mono">
        {about.cv && (
          <a href={`${about.cv}?dl=`} target="_blank" rel="noreferrer">
            Download CV ↓
          </a>
        )}
        {about.github && (
          <a href={about.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        )}
        {about.linkedin && (
          <a href={about.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
        )}
      </div>
      <footer>
        <span />
        <Close onClose={onClose} />
      </footer>
    </>
  );
}

function ContactCard({
  formKey,
  onClose,
}: {
  formKey: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = new FormData(e.currentTarget);
    body.append("access_key", formKey);
    body.append("subject", "New message from your portfolio");
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body,
      });
      const json = await res.json();
      setStatus(json.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div className="mono accent">Contact</div>
      <h2>{status === "sent" ? "Thank you." : "Say hello."}</h2>
      {status === "sent" ? (
        <p className="note">Your message is on its way. I will reply soon.</p>
      ) : (
        <form className="form" id="contact" onSubmit={submit}>
          <label className="mono">
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label className="mono">
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label className="mono wide">
            Message
            <textarea name="message" rows={4} required />
          </label>
          <p className="privacy">
            Your details are only used to reply to you.
          </p>
          {/* Honeypot: real visitors never see or tick this. */}
          <input
            type="checkbox"
            name="botcheck"
            className="trap"
            tabIndex={-1}
            autoComplete="off"
          />
        </form>
      )}
      <footer>
        {status === "sent" ? (
          <span />
        ) : (
          <span className="send-wrap">
            <button
              className="send mono"
              form="contact"
              disabled={status === "sending" || !formKey}
            >
              {status === "sending" ? "Sending" : "Send"}
            </button>
            {!formKey && (
              <span className="mono hint">Form key not set yet</span>
            )}
            {status === "error" && (
              <span className="mono hint">Could not send. Try again.</span>
            )}
          </span>
        )}
        <Close onClose={onClose} />
      </footer>
    </>
  );
}
