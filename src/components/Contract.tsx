function DigitTrack({
  barrier,
  winsBelow,
}: {
  barrier: number;
  winsBelow: boolean;
}) {
  return (
    <div className="grid grid-cols-10 gap-1 sm:gap-2">
      {Array.from({ length: 10 }, (_, digit) => {
        const wins = winsBelow ? digit < barrier : digit > barrier;
        const isBarrier = digit === barrier;
        return (
          <div key={digit} className="relative pb-7">
            <div
              className={`flex aspect-square items-center justify-center rounded-md border font-display text-lg font-medium sm:text-[1.35rem] ${
                wins
                  ? "border-gain/35 bg-gain-soft font-semibold text-gain"
                  : "border-line bg-card text-ink/40"
              }`}
            >
              {digit}
            </div>
            {isBarrier && (
              <>
                <svg
                  viewBox="0 0 10 6"
                  aria-hidden="true"
                  className="absolute bottom-[16px] left-1/2 h-[6px] w-[10px] -translate-x-1/2 fill-signal"
                >
                  <path d="M5 0 10 6H0Z" />
                </svg>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold text-signal">
                  barrier
                </span>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Example({
  name,
  barrier,
  winsBelow,
  winCount,
  fair,
  quoted,
  cost,
}: {
  name: string;
  barrier: number;
  winsBelow: boolean;
  winCount: string;
  fair: string;
  quoted: string;
  cost: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-display text-[1.35rem] font-semibold tracking-[-0.01em]">
          {name}
        </p>
        <p className="rounded-md bg-paper-deep px-2.5 py-1 font-mono text-[11px] text-ink-soft">
          wins {winCount} of 10 outcomes
        </p>
      </div>
      <div className="mt-4">
        <DigitTrack barrier={barrier} winsBelow={winsBelow} />
      </div>
      <p className="font-mono text-[12px] leading-relaxed text-ink-soft">
        fair odds {fair} · deriv quote {quoted} · cost of playing ≈{" "}
        <span className="text-ink">{cost}</span>
      </p>
    </div>
  );
}

export function Contract() {
  return (
    <section id="contract" className="mx-auto w-full max-w-[76rem] px-5 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-5">
          <p className="font-display text-lg italic text-ink-soft">
            the contract, honestly
          </p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,3.6vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.015em]">
            Over/Under, in one picture.
          </h2>
          <div className="mt-6 max-w-md space-y-4 text-[16.5px] leading-relaxed text-ink-soft">
            <p>
              An Over/Under contract settles on one thing: the last decimal
              digit of the final tick. You pick a barrier from 0 to 9 and a
              side. <span className="text-ink">Over 3</span> wins if the
              expiry digit is 4 or above. <span className="text-ink">Under 2</span>{" "}
              wins on 0 or 1. That is the entire contract.
            </p>
            <p>
              The payout is the probability, turned upside down. Six winning
              digits pay about 1.67 × at fair odds; two pay 5 ×. The quote you
              actually get is fair minus the house's cut. That gap is the cost
              of playing, and no bot, Tally included, erases it.
            </p>
          </div>
          <blockquote className="mt-8 max-w-md rounded-r-xl border-l-4 border-signal bg-card py-5 pl-5 pr-6">
            <p className="font-display text-[1.15rem] italic leading-snug text-ink">
              If the odds are fixed, why automate anything? Enforcement. The
              bot can't beat fixed odds; it can stop you trading worse than
              them. No doubling after a loss, no stake creep at 3 a.m., no
              “one more” past the cap.
            </p>
          </blockquote>
        </div>

        <div className="space-y-14 lg:col-span-7 lg:pt-16 xl:pt-6">
          <Example
            name="Over 3"
            barrier={3}
            winsBelow={false}
            winCount="6"
            fair="1.67 ×"
            quoted="1.55 ×"
            cost="4.8%"
          />
          <Example
            name="Under 2"
            barrier={2}
            winsBelow={true}
            winCount="2"
            fair="5.00 ×"
            quoted="4.75 ×"
            cost="5.0%"
          />
          <p className="max-w-lg font-mono text-[12px] leading-relaxed text-ink-soft">
            winning digits in green · quotes are illustrative, Deriv prices
            each contract live at the moment of purchase
          </p>
        </div>
      </div>
    </section>
  );
}
