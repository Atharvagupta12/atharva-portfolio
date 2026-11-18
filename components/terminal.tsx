"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { achievements, education, experience, profile, projects, skillGroups } from "@/lib/data";

type Line = { id: number; node: ReactNode };

const K = ({ children }: { children: ReactNode }) => <span className="text-lime">{children}</span>;
const C = ({ children }: { children: ReactNode }) => <span className="text-cyan">{children}</span>;
const D = ({ children }: { children: ReactNode }) => <span className="text-dim">{children}</span>;

const COMMANDS = ["whoami", "experience", "projects", "stack", "education", "awards", "contact", "hire"] as const;

function output(cmd: string): ReactNode | "clear" {
  switch (cmd) {
    case "help":
      return (
        <div>
          <div>available commands:</div>
          {[...COMMANDS, "clear"].map((c) => (
            <div key={c}>  <K>{c.padEnd(12, " ")}</K><D>{
              ({ whoami: "who is this guy?", experience: "where I've worked", projects: "things I've built", stack: "tools I use", education: "degree & gpa", awards: "achievements", contact: "reach me", hire: "the important one", clear: "clear screen" } as Record<string, string>)[c]
            }</D></div>
          ))}
        </div>
      );
    case "whoami":
      return (
        <div>
          <K>{profile.name}</K> — {profile.role.toLowerCase()}<br />
          <D>focus:</D> {profile.focus.join(", ").toLowerCase()}<br />
          <D>location:</D> {profile.location.toLowerCase()}<br />
          <D>status:</D> <C>{profile.available ? profile.availability.toLowerCase() : "heads down, building"}</C>
        </div>
      );
    case "experience":
      return (
        <div>
          {experience.map((e) => (
            <div key={e.company} className="mb-1">
              <C>▸ {e.role}</C> @ <K>{e.company}</K> <D>({e.period})</D><br />
              <span className="text-fg/60">  {e.impact.map((i) => `${i.v} ${i.k}`).join(" · ")}</span>
            </div>
          ))}
        </div>
      );
    case "projects":
      return (
        <div>
          {projects.map((p) => (
            <div key={p.slug}><K>{p.name.padEnd(10, " ")}</K> <span className="text-fg/70">{p.kind.toLowerCase()}</span> <D>→ {p.result.value} {p.result.label}</D></div>
          ))}
        </div>
      );
    case "stack":
      return (
        <div>
          {skillGroups.slice(0, 5).map((g) => (
            <div key={g.key}><C>{g.label.toLowerCase().padEnd(15, " ")}</C><span className="text-fg/70">{g.skills.slice(0, 5).join(", ")}</span></div>
          ))}
        </div>
      );
    case "education":
      return (
        <div>
          <K>{education.school}</K><br />
          <span className="text-fg/70">{education.degree}</span><br />
          <D>gpa:</D> <C>{education.gpa}/10</C> <D>· {education.period}</D>
        </div>
      );
    case "awards":
      return (
        <div>{achievements.map((a) => <div key={a.key}><K>★</K> {a.title} <D>— {a.org}</D></div>)}</div>
      );
    case "contact":
      return (
        <div>
          <D>email:</D> <a className="text-cyan underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a><br />
          <D>phone:</D> <a className="text-cyan underline-offset-2 hover:underline" href={profile.phoneHref}>{profile.phone}</a>
          {profile.links.linkedin && <><br /><D>linkedin:</D> <a className="text-cyan hover:underline" href={profile.links.linkedin} target="_blank" rel="noreferrer">{profile.links.linkedin.replace(/^https?:\/\//, "")}</a></>}
          {profile.links.github && <><br /><D>github:</D> <a className="text-cyan hover:underline" href={profile.links.github} target="_blank" rel="noreferrer">{profile.links.github.replace(/^https?:\/\//, "")}</a></>}
        </div>
      );
    case "hire":
    case "sudo hire":
    case "sudo hire atharva":
      return (
        <div>
          <C>[sudo]</C> verifying candidate… <K>ok</K><br />
          <D>  ✓ ships to production   ✓ owns outcomes   ✓ 1650+ on leetcode</D><br />
          <K>→ next step:</K> <a className="text-cyan underline" href={`mailto:${profile.email}?subject=Let's%20talk%20about%20a%20role`}>send the offer to {profile.email}</a> 🚀
        </div>
      );
    case "ls":
      return <div><C>about.md</C>  <C>experience/</C>  <C>projects/</C>  <C>contact.txt</C></div>;
    case "clear":
      return "clear";
    case "":
      return null;
    default:
      if (cmd.startsWith("sudo")) return <div><span className="text-coral">nice try.</span> <D>but you could just type</D> <K>hire</K></div>;
      return <div><span className="text-coral">command not found:</span> {cmd}. <D>type</D> <K>help</K></div>;
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const idRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (node: ReactNode) => setLines((l) => [...l, { id: idRef.current++, node }]);

  const exec = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out = output(cmd);
    if (out === "clear") { setLines([]); return; }
    push(<div><K>atharva@portfolio</K><D>:</D><C>~</C><D>$</D> {raw}</div>);
    if (out) push(out);
    if (cmd) setHistory((h) => [raw, ...h].slice(0, 30));
    setHIdx(-1);
  };

  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    push(<div className="text-fg/60">Welcome! This terminal is real — try a command, or tap one below. Type <K>help</K> for the full list.</div>);
    exec("whoami");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [lines]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { exec(value); setValue(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(history.length - 1, hIdx + 1); if (history[n] !== undefined) { setHIdx(n); setValue(history[n]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const n = hIdx - 1; setHIdx(Math.max(-1, n)); setValue(n >= 0 ? history[n] : ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      const m = [...COMMANDS, "help", "clear"].find((c) => c.startsWith(value.trim().toLowerCase()) && value.trim());
      if (m) setValue(m);
    } else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    <div className="card flex h-[440px] flex-col sm:h-[460px] overflow-hidden rounded-[24px] border-white/10 bg-[#08090b] shadow-[0_30px_100px_-30px_rgba(0,0,0,0.9)]" onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="flex-1 text-center font-mono text-[11px] text-muted">atharva@portfolio: ~ — zsh</span>
        <span className="w-[42px]" />
      </div>

      <div ref={bodyRef} className="flex-1 space-y-2 overflow-y-auto px-3.5 py-4 font-mono text-[11.5px] leading-[1.75] text-fg/85 sm:px-4 sm:text-[12.5px]">
        {lines.map((l) => <div key={l.id} className="whitespace-pre-wrap break-words">{l.node}</div>)}
        <div className="flex items-center gap-2">
          <span className="shrink-0"><K>atharva@portfolio</K><D>:</D><C>~</C><D>$</D></span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            className="min-w-0 flex-1 bg-transparent text-fg caret-lime outline-none"
            aria-label="Terminal input"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto border-t border-white/[0.07] px-3 py-2.5 [scrollbar-width:none]">
        {COMMANDS.map((c) => (
          <button
            key={c}
            onClick={(e) => { e.stopPropagation(); exec(c); }}
            className="shrink-0 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-fg/70 transition-colors hover:border-lime/40 hover:text-lime"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
