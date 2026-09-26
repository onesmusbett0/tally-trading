import { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { TallyMark } from "./Header";

type Mode = "signin" | "signup";
type Status = "idle" | "loading" | "success";
type Errors = { email?: string; password?: string; confirm?: string };

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DISMISS_DRAG = 110;

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [dragY, setDragY] = useState(0);
  const timerRef = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMode("signin");
    setStatus("idle");
    setEmail("");
    setPassword("");
    setConfirm("");
    setShowPassword(false);
    setErrors({});
    setDragY(0);
  }, [open]);

  useEffect(() => {
    if (status !== "success") return;
    timerRef.current = window.setTimeout(onClose, 1600);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, onClose]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    []
  );

  const onDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const onDragMove = (e: React.TouchEvent) => {
    if (dragStartY.current === null) return;
    const delta = e.touches[0].clientY - dragStartY.current;
    setDragY(Math.max(0, delta));
  };

  const onDragEnd = () => {
    if (dragY > DISMISS_DRAG) {
      onClose();
    } else {
      setDragY(0);
    }
    dragStartY.current = null;
  };

  if (!open) return null;

  const switchMode = (next: Mode) => {
    if (status !== "idle") return;
    setMode(next);
    setErrors({});
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    const next: Errors = {};
    if (!EMAIL_RE.test(email)) {
      next.email = email ? "enter a valid email address" : "email is required";
    }
    if (password.length < 8) {
      next.password = password ? "minimum 8 characters" : "password is required";
    }
    if (mode === "signup" && confirm !== password) {
      next.confirm = "passwords do not match";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setStatus("loading");
    timerRef.current = window.setTimeout(() => setStatus("success"), 900);
  };

  const inputBase =
    "w-full rounded-lg border bg-paper-deep/50 px-3.5 py-2.5 text-[15px] text-ink transition-colors duration-150 placeholder:text-ink-soft/55 sm:px-4 sm:py-3";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="modal-overlay absolute inset-0 bg-night/65 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signin" ? "Sign in to Tally" : "Create your Tally account"}
        className="modal-card relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-line bg-card shadow-[0_-8px_44px_-12px_rgba(29,35,28,0.45)] transition-transform duration-200 ease-out sm:max-h-[calc(100dvh_-_2rem)] sm:max-w-[27rem] sm:rounded-[24px] sm:shadow-[0_32px_64px_-24px_rgba(29,35,28,0.55)]"
        style={dragY > 0 ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
          <div
            className="sticky top-0 z-10 -mx-5 flex touch-none items-start justify-end bg-card px-5 pt-3 sm:-mx-8 sm:px-8 sm:pt-6"
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
            onTouchCancel={onDragEnd}
          >
            <span
              className="absolute left-1/2 top-[13px] h-1.5 w-10 -translate-x-1/2 rounded-full bg-line sm:hidden"
              aria-hidden="true"
            />
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center pb-8 pt-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gain-soft">
                <Check className="h-7 w-7 text-gain" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-[1.55rem] font-semibold leading-tight tracking-[-0.01em]">
                {mode === "signin" ? "Signed in" : "Account created"}
              </h2>
              <p className="mt-2 font-mono text-[12px] leading-relaxed text-ink-soft">
                {email} · demo session ready
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <TallyMark className="h-8 w-8" />
                <span className="font-display text-xl font-semibold">Tally</span>
              </div>

              <h2 className="mt-5 font-display text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.01em] sm:mt-6 sm:text-[1.65rem]">
                {mode === "signin" ? "Sign in to Tally" : "Create your account"}
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft sm:mt-2.5 sm:text-[15px]">
                {mode === "signin"
                  ? "Set your rules and start trading Over/Under contracts."
                  : "Start in demo mode, define your rules, keep the receipts."}
              </p>

              <button
                type="button"
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink shadow-[0_2px_8px_-2px_rgba(29,35,28,0.08)] transition-all duration-150 hover:border-ink/20 hover:shadow-[0_4px_14px_-2px_rgba(29,35,28,0.12)] sm:mt-7 sm:py-3.5"
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </button>

              <div className="mt-5 flex items-center gap-3 sm:mt-6" aria-hidden="true">
                <span className="h-px flex-1 bg-line" />
                <span className="font-mono text-[11px] text-ink-soft">
                  or with email
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <form onSubmit={submit} noValidate className="mt-4 sm:mt-5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block font-mono text-[11px] text-ink-soft"
                  >
                    email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputBase} ${
                      errors.email ? "border-loss" : "border-line"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 font-mono text-[11px] text-loss">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="mt-3.5 sm:mt-4">
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block font-mono text-[11px] text-ink-soft"
                  >
                    password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        mode === "signin" ? "current-password" : "new-password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="at least 8 characters"
                      className={`${inputBase} pr-12 ${
                        errors.password ? "border-loss" : "border-line"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-soft transition-colors hover:text-ink"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 font-mono text-[11px] text-loss">
                      {errors.password}
                    </p>
                  )}
                </div>

                {mode === "signup" && (
                  <div className="mt-3.5 sm:mt-4">
                    <label
                      htmlFor="login-confirm"
                      className="mb-1.5 block font-mono text-[11px] text-ink-soft"
                    >
                      confirm password
                    </label>
                    <input
                      id="login-confirm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="retype your password"
                      className={`${inputBase} ${
                        errors.confirm ? "border-loss" : "border-line"
                      }`}
                    />
                    {errors.confirm && (
                      <p className="mt-1.5 font-mono text-[11px] text-loss">
                        {errors.confirm}
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-signal px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-150 hover:bg-signal-deep disabled:cursor-not-allowed disabled:opacity-80 sm:mt-7 sm:py-3.5"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      {mode === "signin" ? "Signing in…" : "Creating account…"}
                    </>
                  ) : mode === "signin" ? (
                    "Sign in"
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-[13px] text-ink-soft sm:mt-5 sm:text-[13.5px]">
                {mode === "signin" ? "New to Tally? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  className="font-semibold text-signal underline decoration-signal/40 decoration-2 underline-offset-[5px] transition-colors hover:decoration-signal"
                >
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </>
          )}

          <div className="mt-5 rounded-lg border border-line/70 bg-paper-deep px-4 py-3 sm:mt-6">
            <p className="font-mono text-[11px] leading-relaxed text-ink-soft">
              demo mode first · no card required · revoke access anytime
            </p>
          </div>

          <p className="mt-3 text-center font-mono text-[10.5px] leading-relaxed text-ink-soft/70 sm:mt-4">
            Tally is execution and record-keeping software. It is not financial
            advice and cannot predict prices.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
