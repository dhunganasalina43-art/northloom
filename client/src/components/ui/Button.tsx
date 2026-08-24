import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

/** Shared button used across the storefront and admin dashboard for visual consistency. */
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-indigo-600 text-linen-50 hover:bg-indigo-700",
    secondary: "border border-ink-900/20 text-ink-900 hover:bg-linen-100",
    ghost: "text-ink-900 hover:bg-linen-100",
    danger: "bg-weft-500 text-linen-50 hover:bg-weft-600",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
