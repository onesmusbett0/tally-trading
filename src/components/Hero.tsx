import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";

/* A rolling window of 50 ticks. Digit counts open at 30% for {8,9} vs the
   20% you'd expect, which is exactly the skew the demo rule fires on. */
const OPENING_COUNTS = [4, 3, 5, 4, 4, 6, 5, 4, 8, 7];
const WINDOW = 50;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildOpeningDigits(): number[] {
  const flat: number[] = [];
  OPENING_COUNTS.forEach((count, digit) => {
    for (let i = 0; i < count; i++) flat.push(digit);
  });
  const rand = mulberry32(20260214);
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  const lastHot = flat.lastIndexOf(9);
  [flat[flat.length - 1], flat[lastHot]] = [flat[lastHot], flat[flat.length - 1]];
  return flat;
}

/* Quiet historical price path for the sparkline */
const SPARK = [
  1041.9, 1041.62, 1041.86, 1042.13, 1042.02, 1042.4, 1042.18, 1042.55,
  1042.31, 1042.6, 1042.44, 1042.83, 1042.58, 1042.9, 1043.12, 1042.87,
  1043.08, 1043.3, 1043.06, 1043.34, 1043.19, 1043.42, 1043.26, 1043.5,
  1043.31, 1043.55, 1043.4, 1043.69,
];

function sparkPath(values: number[], w: number, h: number, pad = 3): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - pad * 2);
      const y = h - pad - ((v - min) / span) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

type TallyEntry = { v: number; id: number };

export function Hero({ onOpenLogin }: { onOpenLogin: () => void }) {
  const initialDigits = useMemo(buildOpeningDigits, []);
  const [windowDigits, setWindowDigits] = useState<TallyEntry[]>(() =>
    initialDigits.map((v, i) => ({ v, id: i }))
  );
  const [price, setPrice] = useState(1043.69);
  const [ticks, setTicks] = useState(5214);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cents = Math.round(1043.69 * 100);
    let seq = initialDigits.length;
    const timer = window.setInterval(() => {
      const d = Math.floor(Math.random() * 10);
      let offset = (d - (cents % 10) + 30) % 10;
      if (offset === 0) offset = Math.random() < 0.5 ? 10 : -10;
      else if (Math.random() < 0.45) offset -= 10;
      cents += offset;
      const nextPrice = cents / 100;
      seq += 1;
      setPrice(nextPrice);
      setTicks((t) => t + 1);
      setWindowDigits((ws) => [...ws.slice(-(WINDOW - 1)), { v: d, id: seq }]);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [initialDigits]);

  const counts = useMemo(() => {
    const c = Array(10).fill(0);
    windowDigits.forEach(({ v }) => c[v]++);
    return c as number[];
  }, [windowDigits]);
  const maxCount = Math.max(...counts);
  const recent = windowDigits.slice(-13);
  const priceStr = price.toFixed(2);

  return (
    <section id="top" className="mx-auto w-full max-w-[76rem] px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:pt-20">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-x-10">
        {/* Headline block, deliberately low in the left column */}
        <div className="max-w-xl lg:col-span-5 lg:pb-12">
          <p className="font-display text-lg italic text-ink-soft">
            an over/under bot, run on your rules
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.85rem,7vw,4.9rem)] font-semibold leading-[1.02] tracking-[-0.015em]">
            Every tick read.
            <br />
            Every rule <em className="italic">kept</em>.
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
            Tally is a trading bot for Over/Under contracts on Deriv's
            synthetic indices. It reads the last digit of every tick, prices
            each contract against its real odds, and buys only when an entry
            rule you wrote fires. Then it logs why, every time, including for
            every trade it declined.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 rounded-lg bg-signal px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-signal-deep"
            >
              Sign in to start
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <a
              href="#how"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-signal"
            >
              Read the mechanism
              <ArrowDown className="h-4 w-4 text-ink-soft" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-8 font-mono text-[12px] leading-relaxed text-ink-soft">
            today · 5,214 ticks read · 3 rules fired · 41 declined
          </p>
        </div>

        {/* The instrument: a carbon-copy sheet, the tally card, the settled ticket */}
        <div className="relative md:ml-auto md:w-[94%] lg:col-span-7 lg:w-full">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-2.5 translate-y-2.5 rotate-[0.8deg] rounded-2xl border border-line/70 bg-paper-deepest"
          />

          <div className="relative rounded-2xl border border-line bg-card shadow-[0_28px_60px_-36px_rgba(29,35,28,0.45)]">
            {/* card header */}
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div>
                <p className="font-display text-[17px] font-semibold leading-tight">
                  Volatility 100 Index
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
                  synthetic · over/under · 10-tick contracts
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-ink-soft">
                <span className="live-dot h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
                <span>
                  feed live · tick #{ticks.toLocaleString("en-US")}
                </span>
              </div>
            </div>

            {/* chart zone with the scan sweep */}
            <div className="relative px-5 pb-4 pt-5 sm:px-6">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="scan-sweep absolute bottom-0 top-0 w-[2px] bg-signal">
                  <div className="absolute bottom-0 right-[2px] top-0 w-16 bg-[linear-gradient(to_left,rgba(30,67,216,0.10),transparent)]" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="flex items-end gap-1.5">
                    <span className="font-mono text-[26px] font-medium leading-none tracking-tight sm:text-[30px]">
                      {priceStr.slice(0, -1)}
                    </span>
                    <span className="inline-flex h-[26px] w-[22px] items-center justify-center rounded-[6px] border border-signal/40 bg-signal/10 font-mono text-[15px] font-semibold leading-none text-signal sm:h-[30px] sm:w-6 sm:text-base">
                      {priceStr.slice(-1)}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-ink-soft">
                    latest tick · last digit tallied
                  </p>
                </div>
                <svg
                  viewBox="0 0 300 56"
                  className="hidden w-[42%] max-w-[240px] sm:block"
                  role="img"
                  aria-label="Price path of the last four minutes"
                >
                  <path
                    d={sparkPath(SPARK, 300, 56)}
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="line-draw text-ink/70"
                  />
                  <circle
                    cx={297}
                    cy={sparkY(SPARK[SPARK.length - 1])}
                    r="3.5"
                    className="fill-signal"
                  />
                </svg>
              </div>

              {/* the digit tally */}
              <div className="mt-6 grid grid-cols-10 items-end gap-1.5 sm:gap-2.5">
                {counts.map((count, digit) => (
                  <div key={digit} className="flex h-24 items-end sm:h-28">
                    <div
                      className={`bar-grow w-full rounded-[5px] transition-[height] duration-700 ease-out ${
                        digit >= 8 ? "bg-signal" : "bg-ink/[0.18]"
                      }`}
                      style={{
                        height: `${Math.max(6, (count / maxCount) * 100)}%`,
                        animationDelay: `${420 + digit * 85}ms`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1.5 grid grid-cols-10 gap-1.5 sm:gap-2.5">
                {counts.map((_, digit) => (
                  <span
                    key={digit}
                    className={`text-center font-mono text-[11px] ${
                      digit >= 8 ? "font-semibold text-signal" : "text-ink-soft"
                    }`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink-soft">
                rolling tally, last 50 ticks · digits 8-9 running 30% against
                20% expected
              </p>
            </div>

            {/* card footer: the raw tape */}
            <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3.5 sm:px-6">
              <span className="hidden shrink-0 font-mono text-[11px] text-ink-soft sm:inline">
                recent last digits
              </span>
              <div className="mask-fade-l flex flex-1 overflow-hidden">
                <div className="ml-auto flex items-center gap-2.5 pl-8">
                  {recent.map((entry, i) => (
                    <span
                      key={entry.id}
                      className={`font-mono text-[12px] ${
                        i === recent.length - 1
                          ? "digit-in font-semibold text-ink"
                          : "text-ink-soft/80"
                      }`}
                    >
                      {entry.v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* the flagged, settled trade */}
          <div className="ticket-in relative z-20 -mt-10 ml-auto mr-3 w-[88%] max-w-[345px] rounded-xl border border-line bg-card p-4 shadow-[0_20px_44px_-24px_rgba(29,35,28,0.4)] sm:p-5 lg:absolute lg:bottom-10 lg:-left-10 lg:m-0 lg:w-[330px]">
            <div aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-signal" />
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] text-ink-soft">order #A4127</p>
              <p className="rounded-full bg-gain-soft px-2.5 py-1 font-mono text-[11px] font-semibold text-gain">
                settled · win
              </p>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <p className="font-display text-[26px] font-semibold leading-none tracking-[-0.01em]">
                Over 2
              </p>
              <p className="font-mono text-[11px] text-ink-soft">10 ticks</p>
            </div>
            <dl className="mt-4 space-y-1.5 border-t border-line/80 pt-3 font-mono text-[12px]">
              <div className="flex justify-between">
                <dt className="text-ink-soft">stake</dt>
                <dd>10.00 USD</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">payout · 1.36 ×</dt>
                <dd>13.60 USD</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">result · expiry digit 8</dt>
                <dd className="font-semibold text-gain">+3.60</dd>
              </div>
            </dl>
            <p className="mt-3 font-mono text-[11px] text-ink-soft">
              rule HR-2 · high-run 8.6pp over · 14:05:54
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function sparkY(v: number): number {
  const min = Math.min(...SPARK);
  const max = Math.max(...SPARK);
  const pad = 3;
  return 56 - pad - ((v - min) / (max - min)) * (56 - pad * 2);
}
