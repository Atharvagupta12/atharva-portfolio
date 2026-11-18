"use client";

import { marquee, metrics } from "@/lib/data";
import { Counter, Reveal } from "./ui";

export default function Impact() {
  const row = [...marquee, ...marquee];
  return (
    <section id="impact" className="relative pb-4 pt-16 sm:pt-20">
      <div className="container-x">
        <Reveal>
          <div className="mb-6 flex items-center justify-between">
            <span className="eyebrow">Impact, measured</span>
            <span className="hidden font-mono text-[11px] text-dim sm:block">from production work &amp; practice</span>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3 lg:grid-cols-6">
          {metrics.map((m, i) => (
            <div key={m.label} className="group relative bg-ink p-5 transition-colors duration-500 hover:bg-surface sm:p-6">
              <Reveal delay={i * 0.06} y={16}>
                <div className="font-display text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">
                  <Counter to={m.value} />
                  <span className="text-lime">{m.suffix}</span>
                </div>
                <div className="mt-3 text-[13px] leading-snug text-fg/85">{m.label}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-dim">{m.note}</div>
              </Reveal>
              <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lime transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Tech marquee */}
      <div className="mask-x mt-16 space-y-3 overflow-hidden sm:mt-20" aria-hidden>
        <div className="flex w-max animate-marquee gap-3">
          {row.map((t, i) => (
            <span key={`a${i}`} className="flex items-center gap-3 whitespace-nowrap font-display text-[clamp(1.6rem,3.5vw,2.6rem)] font-medium tracking-tight text-fg/[0.14]">
              {t} <span className="text-lime/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
