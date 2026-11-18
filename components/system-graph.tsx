"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * A live, simulated visualization of the multi-provider AI routing layer
 * (failover, caching, least-load routing) built for CortexStak.
 */

type Kind = "client" | "router" | "cache" | "provider";
type GNode = { id: string; label: string; kind: Kind; fx: number; fy: number; x: number; y: number; down: boolean; knownDown: boolean; flash: number; load: number };
type Packet = { a: GNode; b: GNode; t: number; dur: number; color: string; done: () => void };
type Log = { id: number; time: string; text: string; tone: "ok" | "cache" | "fail" };

const C = {
  fg: "237,236,230",
  lime: "198,255,61",
  cyan: "92,225,255",
  coral: "255,107,87",
};

function makeNodes(): GNode[] {
  const base = { x: 0, y: 0, down: false, knownDown: false, flash: 0, load: 0 };
  const clientsY = [0.16, 0.39, 0.61, 0.84];
  const clients = ["web", "mobile", "sdk", "cli"].map((l, i) => ({ ...base, id: `c${i}`, label: l, kind: "client" as const, fx: 0.07, fy: clientsY[i] }));
  const providers = ["model·a", "model·b", "model·c", "model·d"].map((l, i) => ({ ...base, id: `p${i}`, label: l, kind: "provider" as const, fx: 0.87, fy: clientsY[i] }));
  return [
    ...clients,
    { ...base, id: "router", label: "router", kind: "router", fx: 0.47, fy: 0.55 },
    { ...base, id: "cache", label: "cache", kind: "cache", fx: 0.47, fy: 0.12 },
    ...providers,
  ];
}

/** S-curve between two nodes: horizontal flow on wide screens, vertical flow on phones. */
function bez(a: GNode, b: GNode, t: number, vertical: boolean) {
  const u = 1 - t;
  const k0 = u * u * u, k1 = 3 * u * u * t, k2 = 3 * u * t * t, k3 = t * t * t;
  if (vertical) {
    const my = a.y + (b.y - a.y) * 0.5;
    return { x: k0 * a.x + k1 * a.x + k2 * b.x + k3 * b.x, y: k0 * a.y + k1 * my + k2 * my + k3 * b.y };
  }
  const mx = a.x + (b.x - a.x) * 0.5;
  return { x: k0 * a.x + k1 * mx + k2 * mx + k3 * b.x, y: k0 * a.y + k1 * a.y + k2 * b.y + k3 * b.y };
}

// Portrait layout used on narrow screens
const VERTICAL_POS: Record<string, [number, number]> = {
  c0: [0.13, 0.1], c1: [0.38, 0.1], c2: [0.62, 0.1], c3: [0.87, 0.1],
  router: [0.5, 0.5], cache: [0.86, 0.5],
  p0: [0.13, 0.88], p1: [0.38, 0.88], p2: [0.62, 0.88], p3: [0.87, 0.88],
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export default function SystemGraph() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState({ rps: 0, hit: 0, p50: 0, failovers: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mono = (getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "ui-monospace") + ", monospace";

    const nodes = makeNodes();
    const byId = (id: string) => nodes.find((n) => n.id === id)!;
    const router = byId("router");
    const cache = byId("cache");
    const clients = nodes.filter((n) => n.kind === "client");
    const providers = nodes.filter((n) => n.kind === "provider");

    let packets: Packet[] = [];
    let timers: { at: number; fn: () => void }[] = [];
    let clock = 0;
    let reqId = 4810;
    let logId = 0;
    const s = { done: 0, hits: 0, lat: [] as number[], failovers: 0, windowStart: 0 };

    let w = 0, h = 0, dpr = 1, visible = true, raf = 0, last = performance.now(), vertical = false;

    const layout = () => {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      vertical = w < 480;
      for (const n of nodes) {
        const [fx, fy] = vertical ? VERTICAL_POS[n.id] : [n.fx, n.fy];
        n.x = fx * w; n.y = fy * h;
      }
    };

    const after = (ms: number, fn: () => void) => timers.push({ at: clock + ms, fn });

    const hop = (path: GNode[], color: string, per: number, done: () => void) => {
      if (path.length < 2) return done();
      const [a, b, ...rest] = path;
      packets.push({ a, b, t: 0, dur: per, color, done: () => { b.flash = 1; hop([b, ...rest], color, per, done); } });
    };

    const now = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };
    const log = (text: string, tone: Log["tone"]) =>
      setLogs((prev) => [{ id: logId++, time: now(), text, tone }, ...prev].slice(0, 4));

    const finish = (ms: number, hit: boolean) => {
      s.done++; if (hit) s.hits++;
      s.lat.push(ms); if (s.lat.length > 60) s.lat.shift();
    };

    const routeToProvider = (id: number, client: GNode, failedFrom?: GNode) => {
      const healthy = providers.filter((p) => !p.knownDown && p !== failedFrom);
      const pool = healthy.length ? healthy : providers.filter((p) => p !== failedFrom);
      const minLoad = Math.min(...pool.map((p) => p.load));
      const target = pick(pool.filter((p) => p.load === minLoad));
      target.load++;
      hop([router, target], C.cyan, 520, () => {
        target.load = Math.max(0, target.load - 1);
        if (target.down) {
          s.failovers++;
          log(`req#${id} ${target.label} timeout → failover`, "fail");
          hop([target, router], C.coral, 420, () => routeToProvider(id, client, target));
          return;
        }
        const ms = Math.round(rand(140, failedFrom ? 520 : 380));
        hop([target, router, client], C.cyan, 460, () => {
          finish(ms, false);
          log(`req#${id} 200 ${target.label}${failedFrom ? " (rerouted)" : ""} · ${ms}ms`, "ok");
        });
      });
    };

    const spawn = () => {
      const client = pick(clients);
      const id = ++reqId;
      hop([client, router], C.fg, 560, () => {
        if (Math.random() < 0.4) {
          hop([router, cache, router, client], C.lime, 300, () => {
            const ms = Math.round(rand(6, 28));
            finish(ms, true);
            log(`req#${id} cache HIT · ${ms}ms`, "cache");
          });
        } else {
          routeToProvider(id, client);
        }
      });
      after(reduced ? 1400 : rand(260, 520), spawn);
    };

    const outage = () => {
      const p = pick(providers.filter((x) => !x.down));
      if (p) {
        p.down = true;
        after(650, () => { p.knownDown = true; });
        after(rand(2600, 3600), () => { p.down = false; p.knownDown = false; log(`${p.label} healthy · back in pool`, "ok"); });
      }
      after(rand(5200, 8200), outage);
    };

    after(200, spawn);
    after(2600, outage);

    const statTimer = setInterval(() => {
      const sorted = [...s.lat].sort((a, b) => a - b);
      const p50 = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
      const elapsed = Math.max(1, (clock - s.windowStart) / 1000);
      setStats({ rps: +(s.done / elapsed).toFixed(1), hit: s.done ? Math.round((s.hits / s.done) * 100) : 0, p50, failovers: s.failovers });
    }, 1000);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Edges
      ctx.lineWidth = 1;
      const edge = (a: GNode, b: GNode, alpha = 0.09, dashed = false) => {
        ctx.setLineDash(dashed ? [3, 5] : []);
        ctx.strokeStyle = `rgba(${C.fg},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        if (vertical) {
          const my = a.y + (b.y - a.y) * 0.5;
          ctx.bezierCurveTo(a.x, my, b.x, my, b.x, b.y);
        } else {
          const mx = a.x + (b.x - a.x) * 0.5;
          ctx.bezierCurveTo(mx, a.y, mx, b.y, b.x, b.y);
        }
        ctx.stroke();
      };
      clients.forEach((c) => edge(c, router));
      providers.forEach((p) => edge(router, p, p.down ? 0.05 : 0.11, p.down));
      edge(router, cache, 0.1, true);
      ctx.setLineDash([]);

      // Packets with trails
      for (const p of packets) {
        for (let i = 6; i >= 0; i--) {
          const tt = Math.max(0, p.t - i * 0.025);
          const pt = bez(p.a, p.b, tt, vertical);
          ctx.fillStyle = `rgba(${p.color},${i === 0 ? 1 : 0.35 - i * 0.045})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, i === 0 ? 2.6 : 2.2 - i * 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        const head = bez(p.a, p.b, p.t, vertical);
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 12);
        g.addColorStop(0, `rgba(${p.color},0.35)`);
        g.addColorStop(1, `rgba(${p.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(head.x, head.y, 12, 0, Math.PI * 2); ctx.fill();
      }

      // Nodes
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const compact = w < 420;
      for (const n of nodes) {
        const f = n.flash;
        if (n.kind === "client") {
          ctx.fillStyle = `rgba(19,22,26,1)`;
          ctx.strokeStyle = `rgba(${C.fg},${0.3 + f * 0.6})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = `rgba(${C.fg},0.45)`;
          ctx.font = `10px ${mono}`;
          ctx.fillText(n.label, n.x, vertical ? n.y - 16 : n.y + 17);
        } else {
          const isR = n.kind === "router";
          const bw = isR ? (compact ? 76 : 84) : n.kind === "cache" ? (vertical ? 54 : 60) : vertical ? Math.min(70, w * 0.22) : compact ? 56 : 70;
          const bh = isR ? 40 : vertical ? 28 : 26;
          const col = n.kind === "provider" ? (n.down ? C.coral : C.cyan) : C.lime;
          if (f > 0.05 || isR) {
            ctx.shadowColor = `rgba(${col},${isR ? 0.35 + f * 0.4 : f * 0.6})`;
            ctx.shadowBlur = isR ? 22 : 16 * f;
          }
          roundRect(ctx, n.x - bw / 2, n.y - bh / 2, bw, bh, 8);
          ctx.fillStyle = n.down ? `rgba(${C.coral},0.1)` : `rgba(12,14,17,0.95)`;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = n.down ? `rgba(${C.coral},${0.55 + Math.sin(clock / 120) * 0.3})` : `rgba(${col},${(isR ? 0.55 : 0.28) + f * 0.6})`;
          ctx.lineWidth = isR ? 1.4 : 1;
          ctx.stroke();
          ctx.lineWidth = 1;
          ctx.font = `${isR ? 600 : 500} ${isR ? 11 : 10}px ${mono}`;
          ctx.fillStyle = n.down ? `rgba(${C.coral},1)` : isR || n.kind === "cache" ? `rgba(${C.lime},${0.85 + f * 0.15})` : `rgba(${C.fg},${0.7 + f * 0.3})`;
          ctx.fillText(n.down ? "✕ down" : n.label, n.x, n.y + (isR ? -1 : 0.5));
          if (isR && !vertical) {
            ctx.font = `8px ${mono}`;
            ctx.fillStyle = `rgba(${C.fg},0.35)`;
            ctx.fillText("least-load · failover", n.x, n.y + 31);
          }
        }
      }
    };

    const step = (t: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min(50, t - last);
      last = t;
      if (!visible || document.hidden) return;
      clock += dt;

      const due = timers.filter((x) => x.at <= clock);
      timers = timers.filter((x) => x.at > clock);
      due.forEach((x) => x.fn());

      const arrived: Packet[] = [];
      for (const p of packets) {
        p.t += dt / p.dur;
        if (p.t >= 1) arrived.push(p);
      }
      packets = packets.filter((p) => p.t < 1);
      arrived.forEach((p) => p.done());
      for (const n of nodes) n.flash = Math.max(0, n.flash - dt / 380);

      draw();
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(wrap);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(statTimer);
      ro.disconnect();
      io.disconnect();
      packets = []; timers = [];
    };
  }, []);

  const toneClass = { ok: "text-cyan", cache: "text-lime", fail: "text-coral" } as const;

  return (
    <div className="card relative overflow-hidden rounded-[28px] border-white/10 bg-surface/70 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="font-mono text-[11px] text-muted">cortexstak / routing-layer</div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-lime">
          <span className="relative flex h-1.5 w-1.5"><span className="absolute inset-0 animate-ping2 rounded-full bg-lime" /><span className="relative h-1.5 w-1.5 rounded-full bg-lime" /></span>
          live
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 border-b border-white/[0.07] font-mono">
        {[
          { k: "req/s", v: stats.rps.toFixed(1) },
          { k: "cache hit", v: `${stats.hit}%` },
          { k: "p50", v: `${stats.p50}ms` },
          { k: "failovers", v: String(stats.failovers) },
        ].map((x, i) => (
          <div key={x.k} className={`px-2.5 py-2.5 sm:px-4 ${i ? "border-l border-white/[0.07]" : ""}`}>
            <div className="truncate text-[8.5px] uppercase tracking-wider text-dim sm:text-[9px] sm:tracking-widest">{x.k}</div>
            <div className="mt-0.5 text-[13px] tabular-nums text-fg sm:text-base">{x.v}</div>
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="relative h-[340px] w-full sm:h-[300px]">
        <div className="grid-bg absolute inset-0 opacity-60 [background-size:28px_28px] mask-radial" />
        <canvas ref={canvasRef} className="absolute inset-0" aria-label="Animated diagram of requests routed through a cache and multiple AI providers with automatic failover" role="img" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-white/[0.07] px-3 py-2 font-mono text-[9.5px] text-dim">
        {[
          { c: "bg-fg", l: "request" },
          { c: "bg-lime", l: "cache hit" },
          { c: "bg-cyan", l: "provider" },
          { c: "bg-coral", l: "failover" },
        ].map((x) => (
          <span key={x.l} className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${x.c} shadow-[0_0_6px_currentColor]`} />{x.l}</span>
        ))}
      </div>

      {/* Logs */}
      <div className="h-[104px] overflow-hidden border-t border-white/[0.07] bg-ink/60 px-4 py-2.5 font-mono text-[10.5px] leading-[1.9] sm:h-[118px] sm:py-3 sm:text-[11px]">
        {logs.map((l, i) => (
          <motion.div
            key={l.id}
            initial={i === 0 ? { opacity: 0, x: -8 } : false}
            animate={{ opacity: 1 - i * 0.18, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3 whitespace-nowrap"
          >
            <span className="hidden text-dim sm:inline">{l.time}</span>
            <span className={`w-9 shrink-0 ${toneClass[l.tone]}`}>{l.tone === "fail" ? "WARN" : l.tone === "cache" ? "HIT" : "INFO"}</span>
            <span className="truncate text-fg/70">{l.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
