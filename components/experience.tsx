"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { experience } from "@/lib/data";
import { Reveal, SectionHeading, SpotlightCard } from "./ui";

/** Highlight numbers like 55%, 40%, 1M+ inside bullet text. */
function emphasize(text: string): ReactNode[] {
  return text.split(/(\d+%|~\d+%|\d+M\+)/g).map((part, i) =>
    /\d/.test(part) && /%|M\+/.test(part) ? <span key={i} className="font-medium text-lime">{part}</span> : part
  );
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading index="02" label="Experience" title="Where I've" accent="shipped." aside="Turning technical challenges into measurable outcomes." />

        <div ref={ref} className="relative">
          {/* timeline rail */}
          <div className="absolute bottom-0 left-[11px] top-2 w-px bg-white/[0.08] md:left-[calc(25%+11px)]" />
          <motion.div style={{ scaleY }} className="absolute bottom-0 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-lime via-lime to-cyan md:left-[calc(25%+11px)]" />

          <div className="space-y-10 md:space-y-14">
            {experience.map((job, i) => (
              <div key={job.company} className="relative grid gap-4 pl-10 md:grid-cols-[25%_1fr] md:gap-0 md:pl-0">
                {/* dot */}
                <div className="absolute left-0 top-1.5 md:left-[25%]">
                  <span className="relative grid h-[23px] w-[23px] place-items-center rounded-full border border-lime/40 bg-ink">
                    <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_14px_rgb(var(--lime))]" />
                  </span>
                </div>

                {/* date column */}
                <Reveal className="md:pr-10">
                  <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-lime">{job.period}</div>
                  <div className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-dim"><MapPin size={11} /> {job.location}</div>
                  {i === 0 && <div className="mt-3 inline-flex rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">Most recent</div>}
                </Reveal>

                {/* card */}
                <Reveal delay={0.1} className="md:pl-12">
                  <SpotlightCard className="p-5 sm:p-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">{job.role}</h3>
                        <div className="mt-1.5 flex items-center gap-2 text-[15px]">
                          <Briefcase size={14} className="text-muted" />
                          <span className="font-serif text-lg italic text-fg/80">{job.company}</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg/80">{emphasize(job.summary)}</p>

                    <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {job.impact.map((m) => (
                        <div key={m.k} className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                          <div className="font-display text-xl font-semibold tracking-tight text-lime sm:text-2xl">{m.v}</div>
                          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">{m.k}</div>
                        </div>
                      ))}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[14px] leading-relaxed text-muted">
                          <span className="mt-[9px] h-1 w-3 shrink-0 rounded-full bg-white/20" />
                          <span>{emphasize(b)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {job.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                    </div>
                  </SpotlightCard>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
