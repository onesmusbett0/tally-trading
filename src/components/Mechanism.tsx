import type { ReactNode } from "react";
import { Check } from "lucide-react";

const steps = [
  {
    n: "1",
    title: "Scan the tape",
    body: "Every tick of your chosen index is read into a rolling window. Tally tracks the last-digit distribution: how often 0 through 9 actually appear, against the 10% each you'd expect over time.",
    artifact: (
      <div className="rounded-lg border border-line bg-card px-4 py-3 font-mono text-[12px] leading-relaxed">
        <p>
          <span className="text-ink-soft">window</span> 50 ticks · volatility
          100
        </p>
        <p>
          <span className="text-ink-soft">digits {"{8,9}"}</span> 15 × ·{" "}
          <span className="font-semibold text-signal">30.0%</span>
          <span className="text-ink-soft"> · expected</span> 10 × · 20.0%
        </p>
      </div>
    ),
  },
  {
    n: "2",
    title: "Decide by your rules",
    body: "Your entry rules state what counts as a signal: minimum window, deviation threshold, side, barrier, stake. If no rule matches, nothing happens. No rule, no trade, and the reason gets written down.",
    artifact: (
      <ul className="space-y-2 rounded-lg border border-line bg-card px-4 py-3 font-mono text-[12px] leading-relaxed">
        {[
          "rule HR-2 enabled · threshold ≥ +8.0pp",
          "side over · barrier 2 · stake 10.00 flat",
          "no match → no trade · reason logged",
        ].map((line) => (
          <li key={line} className="flex items-start gap-2.5">
            <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-gain" aria-hidden="true" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    n: "3",
    title: "Execute, or stand down",
    body: "When a rule fires, Tally prices the contract through the Deriv API, checks the quote against your session limits, and buys. If any check fails, it stands down and says why. It never improvises.",
    artifact: (
      <div className="rounded-lg border border-line bg-card px-4 py-3 font-mono text-[12px] leading-relaxed">
        <p>
          quote 1.36 × → payout 13.60{" "}
          <span className="font-semibold text-gain">ok</span>
        </p>
        <p>
          stake 10 ≤ cap 25 · loss 0 ≤ cap 150{" "}
          <span className="font-semibold text-gain">ok</span>
        </p>
        <p>
          buy #A4127 · filled in 243 ms
        </p>
      </div>
    ),
  },
];

const logRows: { t: string; tag: string; tone?: string; msg: ReactNode }[] = [
  {
    t: "14:02:11",
    tag: "scan",
    msg: (
      <>
        high-run +4.1pp, needs ≥ +8.0pp · <span className="text-ink-soft">skip</span>
      </>
    ),
  },
  {
    t: "14:05:54",
    tag: "rule",
    tone: "text-signal",
    msg: <>HR-2 fired · high-run +8.6pp ≥ +8.0pp</>,
  },
  {
    t: "14:05:54",
    tag: "quote",
    msg: <>over 2 · 10 ticks · 1.36 × → 13.60</>,
  },
  {
    t: "14:05:54",
    tag: "limits",
    msg: <>stake 10 ≤ 25 · session loss 0 ≤ 150 · ok</>,
  },
  {
    t: "14:05:54",
    tag: "buy",
    msg: <>#A4127 placed · 243 ms</>,
  },
  {
    t: "14:06:22",
    tag: "settle",
    msg: (
      <>
        expiry digit 8 {'>'} 2 · <span className="font-semibold text-gain">win +3.60</span>
      </>
    ),
  },
  {
    t: "14:09:03",
    tag: "cooldown",
    msg: <>next entry ≥ 14:12:54 · standing down</>,
  },
];

export function Mechanism() {
  return (
    <section id="how" className="mt-10 bg-paper-deep py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
        <p className="font-display text-lg italic text-ink-soft">
          the loop, plainly
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.1rem,3.6vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.015em]">
          Three steps, on a loop. Nothing else happens.
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          Tally does exactly three things, in order, forever. If a step fails
          its checks, the loop stops there and records why. You can read the
          whole session back afterwards.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-x-12">
          <ol className="space-y-12 lg:col-span-7">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-5 sm:gap-8">
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 font-display text-[2.6rem] font-semibold leading-none text-ink/25 sm:text-[3.1rem]"
                >
                  {step.n}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.45rem] font-semibold tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-lg leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                  <div className="mt-4 max-w-lg">{step.artifact}</div>
                </div>
              </li>
            ))}
          </ol>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <div className="rounded-2xl border border-line bg-card shadow-[0_28px_60px_-40px_rgba(29,35,28,0.4)]">
                <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <p className="font-display text-[16px] font-semibold">
                    The decision log
                  </p>
                  <p className="font-mono text-[11px] text-ink-soft">
                    session 0412 · excerpt
                  </p>
                </div>
                <ol className="divide-y divide-line/70">
                  {logRows.map((row, i) => (
                    <li
                      key={i}
                      className="flex items-baseline gap-3 px-5 py-2.5 font-mono text-[12px] leading-relaxed"
                    >
                      <span className="shrink-0 tabular-nums text-ink-soft">
                        {row.t}
                      </span>
                      <span
                        className={`w-[4.6rem] shrink-0 font-semibold ${
                          row.tone ?? "text-ink"
                        }`}
                      >
                        {row.tag}
                      </span>
                      <span className="min-w-0">{row.msg}</span>
                    </li>
                  ))}
                </ol>
                <p className="border-t border-line px-5 py-3.5 font-mono text-[11px] leading-relaxed text-ink-soft">
                  every session exports to csv · entry tick, rule id, quote,
                  limits, result
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
