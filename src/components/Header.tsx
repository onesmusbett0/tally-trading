import { useEffect, useState } from "react";

export function TallyMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="7" className="fill-ink" />
      <path
        d="M9 9v14M13.5 9v14M18 9v14M22.5 9v14M7.2 22.4 24.8 9.6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="text-paper"
      />
    </svg>
  );
}

export function Header({ onOpenLogin }: { onOpenLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-paper/85 shadow-[0_10px_32px_-20px_rgba(29,35,28,0.35)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[76rem] px-5 pb-4 pt-5 sm:px-8 sm:pt-6">
        <div className="flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3">
            <TallyMark className="h-9 w-9" />
            <span className="font-display text-[1.55rem] font-semibold leading-none tracking-[-0.01em]">
              Tally
            </span>
            <span className="mt-1 hidden font-mono text-[11px] text-ink-soft sm:inline">
              over/under · deriv
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {[
              ["The loop", "#how"],
              ["The contract", "#contract"],
              ["Trust", "#trust"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[15px] font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={onOpenLogin}
            className="rounded-lg bg-signal px-4 py-2.5 text-[14px] font-semibold text-white transition-colors duration-150 hover:bg-signal-deep"
          >
            Sign in
          </button>
        </div>
      </div>
    </header>
  );
}
