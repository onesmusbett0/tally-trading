import { ArrowUpRight } from "lucide-react";
import { TallyMark } from "./Header";

export function Close({ onOpenLogin }: { onOpenLogin: () => void }) {
  return (
    <>
      <section id="start" className="mx-auto w-full max-w-[76rem] px-5 py-20 sm:px-8 sm:py-24 lg:py-32">
        <div className="relative overflow-hidden rounded-[28px] bg-night px-7 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 top-0 hidden select-none items-center lg:flex"
          >
            <p className="rotate-[10deg] whitespace-pre font-mono text-[150px] font-medium leading-[0.92] text-paper/[0.05]">
              {"|||| ||||\n|||| ||||\n|||| |||."}
            </p>
          </div>

          <div className="relative max-w-2xl">
            <p className="font-display text-lg italic text-paper/60">
              the last entry
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.3rem,4.6vw,3.9rem)] font-semibold leading-[1.04] tracking-[-0.015em] text-paper">
              Set the rules. Then let Tally keep them.
            </h2>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-paper/70">
              Connect your Deriv account with a trade-scoped API token. Tally
              starts on a demo balance; real stakes only after you promote it,
              with your stake cap, loss limit, and cooldown already in place.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenLogin}
                className="focus-ring-paper inline-flex items-center gap-2 rounded-lg bg-paper px-6 py-3.5 text-[15px] font-semibold text-night transition-colors duration-150 hover:bg-white"
              >
                Sign in to get started
              </button>
              <a
                href="#how"
                className="focus-ring-paper inline-flex items-center gap-1.5 rounded-lg border border-paper/25 px-6 py-3.5 text-[15px] font-semibold text-paper transition-colors duration-150 hover:bg-paper/10"
              >
                Read the docs first
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-8 font-mono text-[11.5px] leading-relaxed text-paper/50">
              free while in beta · no card · revoke access anytime · synthetic
              indices only
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-[76rem] px-5 pb-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <TallyMark className="h-8 w-8" />
              <span className="font-display text-xl font-semibold">Tally</span>
            </div>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ink-soft">
              An Over/Under trading bot for Deriv: scan the digits, apply your
              rules, keep the receipts.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <ul className="space-y-2.5 font-mono text-[12.5px]">
              {[
                ["How it works", "#how"],
                ["The contract", "#contract"],
                ["Trust policy", "#trust"],
                ["Start in demo", "#start"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-ink-soft transition-colors duration-150 hover:text-ink"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="max-w-sm text-[12.5px] leading-relaxed text-ink-soft">
              Trading involves risk. An Over/Under contract can lose its full
              stake on any single trade, and synthetic indices are
              independently random from tick to tick. Tally is execution and
              record-keeping software; it is not financial advice and cannot
              predict prices. Deriv® is a trademark of its owner; Tally is an
              independent product.
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <p className="font-mono text-[11.5px] text-ink-soft">
            © 2026 Tally Systems
          </p>
          <p className="font-mono text-[11.5px] text-ink-soft">
            log schema v3.2 · open
          </p>
        </div>
      </footer>
    </>
  );
}
