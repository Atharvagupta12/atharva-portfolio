"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Copy, FileText, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import SystemGraph from "./system-graph";
import { GithubIcon, LeetcodeIcon, LinkedinIcon, Magnetic, ease, useCopy, useLocalTime } from "./ui";

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % profile.rotating.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease }}
          className="text-gradient col-start-1 row-start-1 whitespace-nowrap font-serif italic"
        >
          {profile.rotating[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: 0, transition: { duration: 1.1, ease, delay: 0.25 + i * 0.12 } }),
};

export default function Hero() {
  const copy = useCopy();
  const time = useLocalTime(profile.timezone);

  // Subtle parallax glow following the cursor
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.3);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const left = useTransform(sx, (v) => `${v * 100}%`);
  const top = useTransform(sy, (v) => `${v * 100}%`);

  const socials = [
    { href: profile.links.github, label: "GitHub", icon: <GithubIcon size={17} /> },
    { href: profile.links.linkedin, label: "LinkedIn", icon: <LinkedinIcon size={17} /> },
    { href: profile.links.leetcode, label: "LeetCode", icon: <LeetcodeIcon size={17} /> },
  ].filter((s) => s.href);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pb-16 pt-28 sm:pt-32 lg:min-h-[100svh] lg:pb-10"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
    >
      {/* Background */}
      <div className="grid-bg mask-radial absolute inset-0 -z-10" />
      <motion.div style={{ left, top }} className="pointer-events-none absolute -z-10 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-10 -z-10 h-[500px] w-[500px] rounded-full bg-cyan/[0.06] blur-[130px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-ink" />

      <div className="container-x">
        {/* Top meta row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
          className="mb-10 flex flex-wrap items-center justify-between gap-3 lg:mb-14"
        >
          {profile.available ? (
            <div className="inline-flex items-center gap-2.5 rounded-full border border-lime/25 bg-lime/[0.06] py-1.5 pl-2.5 pr-3.5 text-[13px] text-fg/90">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping2 rounded-full bg-lime" /><span className="relative h-2 w-2 rounded-full bg-lime" /></span>
              {profile.availability}
            </div>
          ) : <span />}
          <div className="hidden items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:flex">
            <span className="flex items-center gap-1.5"><MapPin size={12} /> {profile.location}</span>
            <span className="h-3 w-px bg-white/15" />
            <span suppressHydrationWarning>{time ? `${time} IST` : "IST"}</span>
          </div>
        </motion.div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          {/* Left — copy */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="eyebrow mb-6 flex items-center gap-3"
            >
              <span className="h-px w-8 shrink-0 bg-lime" /> {profile.role} <span className="hidden sm:inline">— Backend · Distributed · AI Infra</span>
            </motion.p>

            <h1 className="font-display text-[clamp(3.6rem,11vw,8.4rem)] font-semibold leading-[0.86] tracking-[-0.055em]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" variants={line} initial="hidden" animate="show" custom={0}>{profile.firstName}</motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" variants={line} initial="hidden" animate="show" custom={1}>
                  {profile.lastName}<span className="text-lime">.</span>
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.6 }}
            >
              <p className="mt-8 text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.25] tracking-[-0.02em] text-fg/90">
                I engineer <RotatingWord />
              </p>
              <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-muted">{profile.intro}</p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a href="#work" className="btn btn-primary group">
                    See my work
                    <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
                  </a>
                </Magnetic>
                {profile.links.resume ? (
                  <a href={profile.links.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
                    <FileText size={16} /> Résumé
                  </a>
                ) : null}
                <button onClick={() => copy(profile.email, "Email copied — talk soon!")} className="btn btn-ghost group">
                  <Copy size={15} className="text-muted transition-colors group-hover:text-lime" />
                  <span className="sm:hidden">Copy email</span>
                  <span className="hidden font-mono text-[13px] sm:inline">{profile.email}</span>
                </button>
              </div>

              {socials.length > 0 && (
                <div className="mt-8 flex items-center gap-2">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-fg/70 transition-all hover:-translate-y-0.5 hover:border-lime/40 hover:text-lime">
                      {s.icon}
                    </a>
                  ))}
                  <span className="ml-2 inline-flex items-center gap-1 font-mono text-[11px] text-dim">find me online <ArrowUpRight size={12} /></span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right — live system */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.5 }}
            className="relative"
          >
            <div className="pointer-events-none absolute -inset-px -z-10 rounded-[30px] bg-gradient-to-br from-lime/30 via-transparent to-cyan/20 blur-2xl" />
            <SystemGraph />
            <p className="mt-3 text-center font-mono text-[10.5px] tracking-wide text-dim">
              ↑ a live simulation of the routing layer I built — least-load routing, caching &amp; automatic failover
            </p>
          </motion.div>
        </div>

        <motion.a
          href="#impact"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-14 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-dim transition-colors hover:text-fg lg:inline-flex"
        >
          <span className="relative grid h-9 w-6 place-items-start justify-center rounded-full border border-white/20 pt-1.5">
            <motion.span animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="h-1.5 w-1 rounded-full bg-lime" />
          </span>
          Scroll to explore
        </motion.a>
      </div>
    </section>
  );
}
