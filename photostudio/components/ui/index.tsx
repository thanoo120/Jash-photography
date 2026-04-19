import { cn } from "@/lib/utils";
import {
  type ButtonHTMLAttributes,
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

// ── Button ──────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium tracking-wide rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover-lift",
          {
            "btn-gold text-obsidian-950 font-semibold shadow-[0_10px_28px_rgba(37,150,190,0.28)]": variant === "primary",
            "bg-obsidian-900 text-obsidian-50 hover:bg-obsidian-800 dark:bg-obsidian-100 dark:text-obsidian-900 dark:hover:bg-obsidian-200 shadow-sm": variant === "secondary",
            "border border-obsidian-300 dark:border-obsidian-600 text-obsidian-700 dark:text-obsidian-200 hover:border-gold-500 hover:text-gold-600 bg-white/80 dark:bg-obsidian-900/70": variant === "outline",
            "text-obsidian-600 dark:text-obsidian-300 hover:text-obsidian-900 dark:hover:text-white hover:bg-obsidian-100/70 dark:hover:bg-obsidian-800/55": variant === "ghost",
          },
          {
            "text-xs px-3 py-1.5 min-h-8": size === "sm",
            "text-sm px-5 py-2.5 min-h-10": size === "md",
            "text-base px-7 py-3.5 min-h-12": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// ── Badge ───────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: "available" | "unavailable" | "featured" | "default";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full",
        {
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": variant === "available",
          "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400": variant === "unavailable",
          "bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400": variant === "featured",
          "bg-obsidian-100 text-obsidian-600 dark:bg-obsidian-800 dark:text-obsidian-300": variant === "default",
        },
        className
      )}
    >
      {(variant === "available" || variant === "unavailable") && (
        <span className={cn("w-1.5 h-1.5 rounded-full", variant === "available" ? "bg-emerald-500" : "bg-red-500")} />
      )}
      {children}
    </span>
  );
}

// ── Star Rating ─────────────────────────────────────────────────────────
export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={cn("w-4 h-4", i < Math.floor(rating) ? "text-gold-500" : "text-obsidian-300 dark:text-obsidian-600")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Skeleton ────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
}
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton rounded-sm animate-pulse", className)} />
  );
}

// ── Section Header ───────────────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, centered = true, className }: SectionHeaderProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-mono font-medium tracking-[0.2em] uppercase text-gold-600 dark:text-gold-400 mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-obsidian-900 dark:text-obsidian-50 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-obsidian-500 dark:text-obsidian-400 max-w-2xl leading-relaxed text-sm sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium tracking-wide text-obsidian-600 dark:text-obsidian-400 uppercase">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-sm text-sm bg-white/90 dark:bg-obsidian-900/85 border border-obsidian-200 dark:border-obsidian-700 text-obsidian-900 dark:text-obsidian-100 placeholder-obsidian-400 dark:placeholder-obsidian-500 focus:outline-none focus:ring-2 focus:ring-gold-400/70 focus:border-transparent shadow-sm hover:border-obsidian-300 dark:hover:border-obsidian-600",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Textarea ─────────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium tracking-wide text-obsidian-600 dark:text-obsidian-400 uppercase">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-sm text-sm bg-white/90 dark:bg-obsidian-900/85 border border-obsidian-200 dark:border-obsidian-700 text-obsidian-900 dark:text-obsidian-100 placeholder-obsidian-400 dark:placeholder-obsidian-500 focus:outline-none focus:ring-2 focus:ring-gold-400/70 focus:border-transparent shadow-sm hover:border-obsidian-300 dark:hover:border-obsidian-600 resize-none",
          error && "border-red-400 focus:ring-red-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-medium tracking-wide text-obsidian-600 dark:text-obsidian-400 uppercase">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          "w-full px-4 py-3 rounded-sm text-sm bg-white/90 dark:bg-obsidian-900/85 border border-obsidian-200 dark:border-obsidian-700 text-obsidian-900 dark:text-obsidian-100 focus:outline-none focus:ring-2 focus:ring-gold-400/70 focus:border-transparent shadow-sm hover:border-obsidian-300 dark:hover:border-obsidian-600",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
