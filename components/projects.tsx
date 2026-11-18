"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile, projects, type Project } from "@/lib/data";
import { AttendifyMock, DispatchMock, GroeiMock } from "./mockups";
import { GithubIcon, Reveal, SectionHeading } from "./ui";

const theme: Record<Project["slug"], { glow: string; ring: string; bg: string }> = {
  attendify: { glow: "bg-[#5fd39a]/20", ring: "from-[#5fd39a]/40", bg: "bg-[radial-gradient(ellipse_at_30%_20%,#1c3a2e,transparent_65%)]" },
  groei: { glow: "bg-[#ff8a4c]/20", ring: "from-[#ff8a4c]/40", bg: "bg-[radial-gradient(ellipse_at_70%_20%,#3d2219,transparent_65%)]" },
  dispatch: { glow: "bg-cyan/20", ring: "from-cyan/40", bg: "bg-[radial-gradient(ellipse_at_30%_80%,#10303a,transparent_65%)]" },
};

const Mock = { attendify: AttendifyMock, groei: GroeiMock, dispatch: DispatchMock };

function useIsDesktop() {
  const [desk, setDesk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desk;
}

function Title({ p, i }: { p: Project; i: number }) {
  return (
    <>
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
        <span className="text-lime">0{i + 1}</span>
        <span className="h-px w-8 bg-white/20" />
        {p.kind}
      </div>
      <h3 className="mt-3 font-display text-[clamp(2.8rem,6vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] lg:mt-4">
        {p.name}<span className="text-lime">.</span>
      </h3>
    </>
  );
}

function ProjectRow({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const desk = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const M = Mock[p.slug];
  const th = theme[p.slug];
  const flip = i % 2 === 1;

  return (
    <article ref={ref} className="grid items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-16 [&>*]:min-w-0">
      {/* Mobile title (above the preview) */}
      <Reveal className="lg:hidden">
        <Title p={p} i={i} />
      </Reveal>

      {/* Visual */}
      <Reveal className={flip ? "lg:order-2" : ""}>
        <div className={`group relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-surface p-3 pb-14 sm:rounded-[28px] sm:p-8 sm:pb-16 lg:p-10 lg:pb-20 ${th.bg}`}>
          <div className={`pointer-events-none absolute -bottom-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full ${th.glow} blur-[90px] opacity-70 transition-opacity duration-700 group-hover:opacity-100`} />
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 [background-size:32px_32px] mask-radial" />
          <div className="relative hidden items-center justify-between pb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 sm:flex">
            <span>{p.kind}</span>
            <span>0{i + 1} / 0{projects.length}</span>
          </div>
          <motion.div style={desk ? { y } : undefined} className="relative transition-transform duration-700 lg:group-hover:scale-[1.015]">
            <M />
          </motion.div>
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-ink/70 px-3 py-1.5 font-mono text-[10.5px] text-fg/85 backdrop-blur-md transition-colors hover:border-lime/50 hover:text-lime sm:bottom-4 sm:right-4"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_rgb(var(--lime))]" />
              Open live <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </Reveal>

      {/* Copy */}
      <div className={flip ? "lg:order-1" : ""}>
        <Reveal className="hidden lg:block">
          <Title p={p} i={i} />
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-lg text-[15px] leading-[1.8] text-muted lg:mt-5">{p.description}</p>
          <ul className="mt-5 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-[14px] text-fg/80">
                <span className="mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime/15 text-lime"><Check size={10} strokeWidth={3} /></span>
                {h}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-7 flex items-end gap-4 border-y border-white/[0.08] py-5">
            <span className="shrink-0 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.04em] text-lime sm:text-5xl">{p.result.value}</span>
            <span className="pb-1 font-mono text-[11px] uppercase leading-snug tracking-wider text-muted">{p.result.label}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {p.live && (
              <a href={p.live} target="_blank" rel="noreferrer" className="btn btn-primary !py-2.5">Live demo <ArrowUpRight size={15} /></a>
            )}
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2.5"><GithubIcon size={15} /> Source</a>
            ) : profile.links.github ? (
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2.5"><GithubIcon size={15} /> More on GitHub</a>
            ) : null}
            {!p.live && !p.repo && (
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`Walkthrough of ${p.name}`)}`}
                className="group inline-flex items-center gap-2 text-sm text-fg/80 transition-colors hover:text-lime"
              >
                <MessageSquare size={15} />
                <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-lime">Ask me for a walkthrough</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container-x">
        <SectionHeading index="03" label="Selected work" title="Things I've" accent="put into the world." aside="Products where engineering meets real-world utility. Each preview is a live, animated mockup of how it works." />
        <div className="space-y-20 sm:space-y-32">
          {projects.map((p, i) => <ProjectRow key={p.slug} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
