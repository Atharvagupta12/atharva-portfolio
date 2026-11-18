"use client";

import { Boxes, Cloud, Code2, Database, Layout, Server } from "lucide-react";
import type { ReactNode } from "react";
import { skillGroups } from "@/lib/data";
import { Reveal, SectionHeading, SpotlightCard } from "./ui";

const icons: Record<string, ReactNode> = {
  languages: <Code2 size={18} />,
  backend: <Server size={18} />,
  devops: <Cloud size={18} />,
  frontend: <Layout size={18} />,
  data: <Database size={18} />,
  core: <Boxes size={18} />,
};

const blurbs: Record<string, string> = {
  languages: "Typed, fast and fluent — from C++ for algorithms to TypeScript in production.",
  backend: "APIs and services that stay fast, secure and boring under load.",
  devops: "Containerize it, automate it, ship it with zero downtime.",
  frontend: "Interfaces that feel quick and look considered.",
  data: "Schemas and queries tuned for real traffic.",
  core: "The fundamentals that make everything else hold up.",
};

// Bento layout spans on large screens
const spans: Record<string, string> = {
  languages: "lg:col-span-2",
  backend: "lg:col-span-2 lg:row-span-2",
  devops: "lg:col-span-2",
  frontend: "lg:col-span-2",
  data: "lg:col-span-2",
  core: "sm:col-span-2 lg:col-span-6",
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading index="04" label="Toolkit" title="Built on a strong" accent="technical foundation." aside="Tools are only as useful as the thinking behind them." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {skillGroups.map((g, i) => (
            <Reveal key={g.key} delay={i * 0.06} className={spans[g.key]}>
              <SpotlightCard className="h-full p-6 sm:p-7">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-lime">{icons[g.key]}</span>
                    <span className="font-mono text-[10px] text-dim">{String(g.skills.length).padStart(2, "0")} skills</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">{g.label}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{blurbs[g.key]}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {g.skills.map((s) => (
                      <span key={s} className={`rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[13px] text-fg/85 transition-colors hover:border-lime/40 hover:text-lime ${g.key === "backend" ? "lg:px-3.5 lg:py-2 lg:text-[14px]" : ""}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                  {g.key === "backend" && (
                    <div className="mt-6 hidden rounded-xl border border-white/[0.07] bg-ink/60 p-4 font-mono text-[11px] leading-[1.8] text-muted lg:mt-auto lg:block">
                      <span className="text-dim">{"// my default request path"}</span><br />
                      <span className="text-cyan">client</span> → <span className="text-lime">auth</span> → <span className="text-lime">rate-limit</span> → <span className="text-lime">cache</span> → <span className="text-cyan">service</span> → <span className="text-cyan">postgres</span>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
