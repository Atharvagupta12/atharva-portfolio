"use client";

import { animate, AnimatePresence, motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

/* ── Reveal on scroll ─────────────────────────────────────── */
export function Reveal({ children, delay = 0, y = 28, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={`min-w-0 ${className}`}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ── Section heading ──────────────────────────────────────── */
export function SectionHeading({ index, label, title, accent, aside }: { index: string; label: string; title: string; accent: string; aside?: string }) {
  return (
    <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
      <div>
        <Reveal>
          <div className="eyebrow mb-5 flex items-center gap-3">
            <span className="text-lime">{index}</span>
            <span className="h-px w-10 bg-white/20" />
            <span>{label}</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display text-[clamp(2.4rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.04em]">
            {title} <span className="font-serif font-normal italic tracking-[-0.02em] text-fg/70">{accent}</span>
          </h2>
        </Reveal>
      </div>
      {aside && (
        <Reveal delay={0.16}>
          <p className="max-w-xs text-sm leading-relaxed text-muted md:text-right">{aside}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ── Spotlight card (mouse-follow glow + border) ─────────── */
export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`card spotlight ${className}`}>
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}

/* ── Animated counter ─────────────────────────────────────── */
export function Counter({ to, duration = 1.8, className = "" }: { to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = Math.round(v).toLocaleString("en-IN"); },
    });
    return () => controls.stop();
  }, [inView, to, duration]);
  return <span ref={ref} className={className}>0</span>;
}

/* ── Magnetic wrapper ─────────────────────────────────────── */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ── Toast (global, event-based) ──────────────────────────── */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("ag:toast", { detail: message }));
}

export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2400);
    };
    window.addEventListener("ag:toast", on);
    return () => { window.removeEventListener("ag:toast", on); clearTimeout(t); };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-raised/95 px-4 py-2.5 text-sm shadow-2xl backdrop-blur-xl"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-lime text-ink"><Check size={12} strokeWidth={3} /></span>
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function useCopy() {
  return useCallback(async (text: string, label = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(text);
      toast(label);
    } catch {
      window.prompt("Copy:", text);
    }
  }, []);
}

/* ── Live local clock ─────────────────────────────────────── */
export function useLocalTime(timeZone: string) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone, hour: "2-digit", minute: "2-digit", hour12: true });
    const tick = () => setNow(fmt.format(new Date()).toUpperCase());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [timeZone]);
  return now;
}

/* ── Brand icons (lucide's are deprecated, so inline) ────── */
export function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}
export function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}
export function LeetcodeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.21l-2.89 3.1a5.07 5.07 0 0 0-1.2 2.1 5.55 5.55 0 0 0-.13 1.12c0 .43.04.86.14 1.27.06.27.15.53.26.78a5.26 5.26 0 0 0 1.07 1.6l4.35 4.38c1.7 1.71 4.5 1.73 6.22.04l2.62-2.57a1.37 1.37 0 1 0-1.92-1.96l-2.62 2.57c-.65.64-1.73.63-2.36-.02L6.6 14.14a2.1 2.1 0 0 1-.48-.78 2.6 2.6 0 0 1 0-1.6c.1-.29.26-.56.48-.78l2.88-3.1 5.38-5.77A1.37 1.37 0 0 0 13.48 0Zm-2.87 13.2a1.37 1.37 0 1 0 0 2.74h9.95a1.37 1.37 0 1 0 0-2.74h-9.95Z" />
    </svg>
  );
}
