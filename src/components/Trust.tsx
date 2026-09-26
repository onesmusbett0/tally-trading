import { Check, KeyRound, ShieldCheck, Timer, X } from "lucide-react";

const does = [
  {
    title: "Runs on a demo account first",
    body: "Paper trading is the default. Real stakes only after you promote the bot, with your limits already in place.",
  },
  {
    title: "Buys only inside your limits",
    body: "Max stake, daily loss cap, consecutive-loss cooldown. Hard stops enforced before every single order.",
  },
  {
    title: "Uses your token, your account",
    body: "Trades are signed with a trade-scoped Deriv API token. You can revoke it in your account settings at any time.",
  },
  {
    title: "Exports every decision",
    body: "The full log of scans, skips, quotes, fills, and results downloads as CSV whenever you want it.",
  },
];

const neverDoes = [
  {
    title: "No martingale, ever",
    body: "No stake multipliers, no loss-chasing, no recovery sequences. Stake sizing is flat, or it is off.",
  },
  {
    title: "No promised returns",
    body: "Synthetic ticks are independently random. A bot manages behavior and record-keeping; it cannot predict a price.",
  },
  {
    title: "No custody of your balance",
    body: "Tally never holds funds. Your balance never leaves your Deriv account.",
  },
  {
    title: "No hidden losses",
    body: "Losing trades stay in the log with the same detail as winners. There is no 'clear history' button.",
  },
];

const sessions: { day: string; date: string; ticks: string; took: number; declined: number; result: number }[] = [
  { day: "Mon", date: "09", ticks: "5,102", took: 3, declined: 41, result: 11.45 },
  { day: "Tue", date: "10", ticks: "5,388", took: 2, declined: 38, result: -4.25 },
  { day: "Wed", date: "11", ticks: "4,977", took: 4, declined: 44, result: 23.6 },
  { day: "Thu", date: "12", ticks: "5,240", took: 1, declined: 33, result: -10.0 },
  { day: "Fri", date: "13", ticks: "5,139", took: 3, declined: 40, result: 8.9 },
];

function money(v: number): string {
  const abs = Math.abs(v).toFixed(2);
  return v < 0 ? `−${abs}` : `+${abs}`;
}

export function Trust() {
  const total = sessions.reduce((s, r) => s + r.result, 0);
  const totalTook = sessions.reduce((s, r) => s + r.took, 0);
  const totalDeclined = sessions.reduce((s, r) => s + r.declined, 0);

  return (
    <section id="trust" className="bg-paper-deep py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[76rem] px-5 sm:px-8">
        <p className="font-display text-lg italic text-ink-soft">
          trust, stated as policy
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.1rem,3.6vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.015em]">
          An honest ledger works both ways.
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
          You'll believe a trading product when it tells you what it won't do.
          So here is the policy, both directions, and the recent record with
          the losing days left in.
        </p>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-7">
            <div>
              <h3 className="font-display text-[1.25rem] font-semibold">
                What it does
              </h3>
              <ul className="mt-5 space-y-6">
                {does.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gain-soft">
                      <Check className="h-4 w-4 text-gain" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold leading-snug">{item.title}</p>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sm:pt-12 lg:pt-12">
              <h3 className="font-display text-[1.25rem] font-semibold">
                What it never does
              </h3>
              <ul className="mt-5 space-y-6">
                {neverDoes.map((item) => (
                  <li key={item.title} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-loss-soft">
                      <X className="h-4 w-4 text-loss" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold leading-snug">{item.title}</p>
                      <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-line bg-card shadow-[0_28px_60px_-40px_rgba(29,35,28,0.4)]">
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                <p className="font-display text-[16px] font-semibold">
                  Five recent sessions
                </p>
                <p className="font-mono text-[11px] text-ink-soft">
                  demo account · stake 10 flat
                </p>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left font-mono text-[11px] text-ink-soft">
                    <th scope="col" className="px-5 py-2.5 font-normal">session</th>
                    <th scope="col" className="py-2.5 pr-2 text-right font-normal">ticks read</th>
                    <th scope="col" className="py-2.5 pr-2 text-right font-normal">took</th>
                    <th scope="col" className="py-2.5 pr-2 text-right font-normal">declined</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-normal">result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70 font-mono text-[12.5px]">
                  {sessions.map((row) => (
                    <tr key={row.day}>
                      <th scope="row" className="px-5 py-2.5 text-left font-medium">
                        {row.day} <span className="text-ink-soft">{row.date}</span>
                      </th>
                      <td className="py-2.5 pr-2 text-right tabular-nums text-ink-soft">
                        {row.ticks}
                      </td>
                      <td className="py-2.5 pr-2 text-right tabular-nums">{row.took}</td>
                      <td className="py-2.5 pr-2 text-right tabular-nums text-ink-soft">
                        {row.declined}
                      </td>
                      <td
                        className={`px-5 py-2.5 text-right font-semibold tabular-nums ${
                          row.result < 0 ? "text-loss" : "text-gain"
                        }`}
                      >
                        {money(row.result)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-line font-semibold">
                    <th scope="row" className="px-5 py-3 text-left font-display text-[14px]">
                      week
                    </th>
                    <td className="py-3 pr-2 text-right tabular-nums text-ink-soft">25,846</td>
                    <td className="py-3 pr-2 text-right tabular-nums">{totalTook}</td>
                    <td className="py-3 pr-2 text-right tabular-nums text-ink-soft">
                      {totalDeclined}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-gain">
                      {money(total)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="border-t border-line px-5 py-4 text-[13px] leading-relaxed text-ink-soft">
                A decent week, shown deliberately. It is not typical and it is
                not a promise: results on synthetic indices run both ways, and
                a bot changes your discipline, not your odds. The loss cap,
                not optimism, is what keeps a bad week small.
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: ShieldCheck, label: "demo first, always" },
                { icon: Timer, label: "default cooldown · 5 min" },
                { icon: KeyRound, label: "token scope · trading only" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-2 font-mono text-[11.5px] text-ink"
                >
                  <Icon className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
