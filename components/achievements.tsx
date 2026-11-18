"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Award, Cloud, GitPullRequest, GraduationCap, Rocket, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { achievements, education, profile } from "@/lib/data";
import { Counter, Reveal, SectionHeading, SpotlightCard } from "./ui";

const icon: Record<string, ReactNode> = {
  leetcode: <Trophy size={18} />,
  codecult: <Rocket size={18} />,
  aws: <Cloud size={18} />,
  oss: <GitPullRequest size={18} />,
};

function GpaRing({ value, max = 10 }: { value: number; max?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="6" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke="url(#gpa)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - value / max) }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="gpa" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(198 255 61)" />
            <stop offset="100%" stopColor="rgb(92 225 255)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-4xl font-semibold tracking-tight">{value}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-dim">/ {max} gpa</div>
        </div>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [lc, ...rest] = achievements;
  return (
    <section id="achievements" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading index="05" label="Beyond the build" title="Proof of" accent="practice." aside="Consistency in learning, contribution and building beyond the job description." />

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Feature: LeetCode */}
          <Reveal className="lg:row-span-2">
            <SpotlightCard className="h-full p-7 sm:p-8">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-lime/30 bg-lime/10 text-lime">{icon.leetcode}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-dim">{lc.org}</span>
                </div>
                <div className="mt-10 font-display text-[clamp(4rem,9vw,6.5rem)] font-semibold leading-[0.85] tracking-[-0.05em]">
                  <Counter to={1650} /><span className="text-lime">+</span>
                </div>
                <div className="mt-3 text-lg font-medium">Contest rating</div>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{lc.detail}</p>

                <div className="mt-8 grid grid-cols-10 gap-1.5" aria-hidden>
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.012, duration: 0.3 }}
                      className="aspect-square rounded-[3px] bg-lime"
                      style={{ opacity: undefined, filter: `brightness(${0.25 + ((i * 37) % 11) / 14})` }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-dim"><span>500+ problems solved</span><span>dsa · graphs · dp</span></div>

                {profile.links.leetcode && (
                  <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm text-fg/80 hover:text-lime">
                    View profile <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </SpotlightCard>
          </Reveal>

          {rest.map((a, i) => (
            <Reveal key={a.key} delay={0.06 * (i + 1)} className={a.key === "oss" ? "lg:col-span-2" : ""}>
              <SpotlightCard className="h-full p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-lime">{icon[a.key]}</span>
                  <span className="font-mono text-[11px] text-dim">{a.year}</span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold leading-tight tracking-tight">{a.title}</h3>
                <div className="mt-1 font-serif text-[17px] italic text-fg/60">{a.org}</div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{a.detail}</p>
              </SpotlightCard>
            </Reveal>
          ))}

          {/* Education */}
          <Reveal delay={0.24} className="lg:col-span-3">
            <SpotlightCard className="h-full p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-lime">
                    <GraduationCap size={15} /> Education
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]">{education.school}</h3>
                  <p className="mt-2 text-[14px] text-muted">{education.degree}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="chip">{education.period}</span>
                    <span className="chip">{education.location}</span>
                    <span className="chip"><Award size={12} /> Graduated 2026</span>
                  </div>
                </div>
                <GpaRing value={education.gpa} />
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
