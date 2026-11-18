"use client";

import { motion, useInView } from "framer-motion";
import { Check, Loader2, Pause, Play, Users, Wifi } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

function useTick(ms: number, active: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms, active]);
  return t;
}

function Chrome({ url, children, dark = true }: { url: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl border shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${dark ? "border-white/10 bg-[#0b0d10]" : "border-black/10 bg-[#f4f6f1]"}`}>
      <div className={`flex items-center gap-3 border-b px-3 py-2 ${dark ? "border-white/[0.07]" : "border-black/[0.07] bg-white/70"}`}>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => <span key={i} className={`h-2 w-2 rounded-full ${dark ? "bg-white/15" : "bg-black/15"}`} />)}
        </div>
        <div className={`flex-1 truncate rounded-md px-2 py-0.5 text-center font-mono text-[9.5px] ${dark ? "bg-white/[0.04] text-white/40" : "bg-black/[0.04] text-black/45"}`}>{url}</div>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────── Attendify ─────────────────────────── */
const roster = [
  { mac: "a4:3f:••:12", roll: "EC22-041", dup: false },
  { mac: "7c:d1:••:9e", roll: "EC22-017", dup: false },
  { mac: "a4:3f:••:12", roll: "EC22-041", dup: true },
  { mac: "f0:18:••:3b", roll: "EC22-052", dup: false },
  { mac: "3c:22:••:a1", roll: "EC22-008", dup: false },
  { mac: "b8:9a:••:6d", roll: "EC22-033", dup: false },
  { mac: "7c:d1:••:9e", roll: "EC22-017", dup: true },
  { mac: "60:f2:••:c4", roll: "EC22-026", dup: false },
];

export function AttendifyMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const t = useTick(1300, inView);
  const feed = Array.from({ length: 4 }, (_, i) => ({ ...roster[(t + i) % roster.length], key: t + i })).reverse();
  const present = 48 + (t % 11);
  const deduped = 3 + Math.floor(t / 3) % 7;
  const bars = [62, 78, 71, 88, 84, 93, 90, 96, 92, 98];

  return (
    <div ref={ref} className="w-full">
      <Chrome url="attendify.app / faculty / live-session" dark={false}>
        <div className="flex text-[#18221d]">
          <div className="hidden w-12 flex-col items-center gap-4 bg-[#1d2b25] py-4 text-[#cfe3d6] sm:flex">
            <span className="font-display text-sm font-bold">A<span className="text-lime">.</span></span>
            {[Users, Wifi, Check].map((I, i) => <I key={i} size={14} className={i === 1 ? "text-lime" : "opacity-50"} />)}
          </div>
          <div className="flex-1 p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[8.5px] uppercase tracking-widest text-black/45">Lecture Hall B · 10:00</div>
                <div className="text-[13px] font-semibold">Live attendance</div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[#1d2b25] px-2 py-0.5 font-mono text-[8.5px] text-lime">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> scanning router logs
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { k: "present", v: `${present}/60` },
                { k: "accuracy", v: "98%" },
                { k: "dupes merged", v: String(deduped) },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-black/[0.07] bg-white px-2.5 py-2">
                  <div className="font-mono text-[8px] uppercase tracking-wider text-black/45">{s.k}</div>
                  <div className="mt-0.5 text-[15px] font-semibold tabular-nums">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1.1fr]">
              <div className="rounded-lg border border-black/[0.07] bg-white p-2.5">
                <div className="font-mono text-[8px] uppercase tracking-wider text-black/45">weekly attendance</div>
                <div className="mt-2 flex h-[70px] items-end gap-1">
                  {bars.map((b, i) => (
                    <motion.div
                      key={i}
                      className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-[#2f6b4f]" : "bg-[#9cc3ae]"}`}
                      initial={{ height: 0 }}
                      animate={inView ? { height: `${b}%` } : {}}
                      transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-black/[0.07] bg-white p-2.5">
                <div className="font-mono text-[8px] uppercase tracking-wider text-black/45">device feed</div>
                <div className="mt-1.5 h-[76px] space-y-1 overflow-hidden">
                  {feed.map((f, idx) => (
                    <motion.div
                      key={f.key}
                      layout="position"
                      initial={idx === 0 ? { opacity: 0, y: -8 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="grid grid-cols-[1fr_auto_62px] items-center gap-2 whitespace-nowrap font-mono text-[9px]"
                    >
                      <span className="truncate text-black/45">{f.mac}</span>
                      <span>{f.roll}</span>
                      {f.dup
                        ? <span className="justify-self-end rounded bg-amber-100 px-1 text-[8px] text-amber-700">dup→merged</span>
                        : <span className="justify-self-end rounded bg-emerald-100 px-1 text-[8px] text-emerald-700">present</span>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ─────────────────────────── GROEI ─────────────────────────── */
const voices = ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"];
const prompts = [
  "A 10-minute episode on how black holes bend time — curious, warm tone",
  "Two hosts debate whether remote work is here to stay",
  "The untold story of the first video game, told like a thriller",
];

export function GroeiMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const t = useTick(90, inView);
  const cycle = 120; // ticks per prompt
  const pIdx = Math.floor(t / cycle) % prompts.length;
  const local = t % cycle;
  const typed = prompts[pIdx].slice(0, Math.min(prompts[pIdx].length, local * 1.4));
  const generating = local > 60 && local < 80;
  const playing = local >= 80;
  const voice = (pIdx * 2 + (local > 50 ? 1 : 0)) % voices.length;
  const progress = playing ? ((local - 80) / 40) * 100 : 0;

  return (
    <div ref={ref} className="w-full">
      <Chrome url="groei.app / studio / new-episode">
        <div className="relative overflow-hidden p-4">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#ff8a4c]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-[#ff4c8a]/15 blur-3xl" />

          <div className="relative">
            <div className="font-mono text-[8.5px] uppercase tracking-widest text-white/40">prompt</div>
            <div className="mt-1.5 min-h-[44px] rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] leading-snug text-white/85">
              {typed}<span className="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 animate-blink bg-[#ffb07c]" />
            </div>

            <div className="mt-3 font-mono text-[8.5px] uppercase tracking-widest text-white/40">voice · 6 available</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {voices.map((v, i) => (
                <span key={v} className={`rounded-full border px-2 py-0.5 text-[9.5px] transition-all duration-500 sm:px-2.5 sm:py-1 sm:text-[10px] ${i === voice ? "border-[#ffb07c] bg-[#ffb07c]/15 text-[#ffd2b0]" : "border-white/10 text-white/50"}`}>
                  {v}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-[#2a1c18] to-[#16100f] p-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[radial-gradient(circle_at_35%_30%,#ffd2a8,#c9653d_40%,#3a2522_80%)]">
                {generating && <Loader2 size={16} className="absolute inset-0 m-auto animate-spin text-white" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium text-white/90">{generating ? "Generating episode…" : `Ep. ${12 + pIdx} · ${prompts[pIdx].split(" ").slice(1, 5).join(" ")}…`}</div>
                <div className="mt-1.5 flex h-6 items-center gap-[2px]">
                  {Array.from({ length: 42 }).map((_, i) => {
                    const h = 20 + Math.abs(Math.sin(i * 1.7 + (playing ? t * 0.5 : 0)) * Math.cos(i * 0.6)) * 80;
                    const passed = (i / 42) * 100 < progress;
                    return <span key={i} className={`w-[3px] rounded-full transition-all duration-100 ${passed ? "bg-[#ffb07c]" : "bg-white/20"}`} style={{ height: `${playing || generating ? h : 18}%` }} />;
                  })}
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#ffb07c] text-[#1a0f0c]">
                {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="ml-0.5" />}
              </span>
            </div>
            <div className="mt-2 flex justify-between font-mono text-[8.5px] text-white/35">
              <span>edge cached · vercel</span><span>ttfb &lt;200ms</span>
            </div>
          </div>
        </div>
      </Chrome>
    </div>
  );
}

/* ─────────────────────────── Dispatch ─────────────────────────── */
const steps = [
  { label: "Embed query", meta: "vector · 1536-d" },
  { label: "Semantic search", meta: "top-k = 5" },
  { label: "Rank chunks", meta: "3 relevant" },
  { label: "Generate grounded answer", meta: "cited" },
];
const answer = "Semantic chunking splits documents at meaning boundaries instead of fixed sizes, so each chunk holds one complete idea. Embeddings become more precise and retrieval returns fewer, more relevant passages [1][2].";

export function DispatchMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const t = useTick(70, inView);
  const local = t % 200;
  const stepDone = Math.min(4, Math.floor(local / 12));
  const ansChars = local > 50 ? Math.min(answer.length, (local - 50) * 2.2) : 0;

  return (
    <div ref={ref} className="w-full">
      <Chrome url="dispatch / chat">
        <div className="space-y-3 p-4 font-mono text-[10.5px]">
          <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-cyan/15 px-3 py-2 font-sans text-[12px] text-cyan">
            How does semantic chunking improve retrieval?
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5">
            {steps.map((s, i) => {
              const done = i < stepDone;
              const running = i === stepDone && stepDone < 4;
              return (
                <div key={s.label} className={`flex items-center gap-2 py-[3px] transition-opacity ${done || running ? "opacity-100" : "opacity-30"}`}>
                  <span className={`grid h-3.5 w-3.5 place-items-center rounded-full ${done ? "bg-lime text-ink" : "border border-white/25"}`}>
                    {done ? <Check size={9} strokeWidth={3} /> : running ? <Loader2 size={9} className="animate-spin text-lime" /> : null}
                  </span>
                  <span className="text-white/80">{s.label}</span>
                  <span className="ml-auto text-white/35">{s.meta}</span>
                </div>
              );
            })}
          </div>

          <div className="min-h-[86px] max-w-[95%] rounded-xl rounded-bl-sm border border-white/[0.08] bg-white/[0.03] px-3 py-2 font-sans text-[12px] leading-relaxed text-white/80">
            {ansChars > 0 ? (
              <>
                {answer.slice(0, ansChars).split(/(\[\d\])/g).map((p, i) => /\[\d\]/.test(p) ? <sup key={i} className="text-lime">{p}</sup> : p)}
                {ansChars < answer.length && <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 animate-blink bg-lime" />}
              </>
            ) : <span className="text-white/30">retrieving context…</span>}
          </div>

          <div className="flex items-center justify-between gap-2 whitespace-nowrap border-t border-white/[0.07] pt-2.5 text-[9px] text-white/40">
            <span className="flex items-center gap-1.5">
              {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" style={{ animationDelay: `${i * 200}ms` }} />)}
              <span className="ml-1">3/3 pods</span>
            </span>
            <span>HPA autoscaling<span className="hidden sm:inline"> · AWS</span></span>
          </div>
        </div>
      </Chrome>
    </div>
  );
}
