"use client";

import { about } from "@/lib/data";
import Terminal from "./terminal";
import { Reveal, SectionHeading } from "./ui";

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading index="01" label="About" title="Curiosity meets" accent="engineering discipline." aside="I like hard problems that end in simple interfaces." />

        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.02em]">
                {about.lead.split("backend systems")[0]}
                <span className="text-lime">backend systems</span>
                {about.lead.split("backend systems")[1]}
              </p>
            </Reveal>
            {about.body.map((p, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p className="mt-6 text-[15px] leading-[1.85] text-muted">{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.25}>
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07]">
                {about.facts.map((f) => (
                  <div key={f.k} className="bg-ink p-4 sm:p-5">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">{f.k}</dt>
                    <dd className="mt-1.5 text-[15px] font-medium">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <Terminal />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
