"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "inverse";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary",
  secondary: "bg-teal text-white hover:bg-teal/90 focus-visible:outline-teal",
  outline: "border border-border-strong bg-surface text-ink hover:bg-surface-muted focus-visible:outline-primary",
  ghost: "text-ink hover:bg-surface-muted focus-visible:outline-primary",
  danger: "bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger",
  inverse: "bg-white text-primary-dark hover:bg-white/90 focus-visible:outline-white",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-[0.95rem] gap-2",
  lg: "h-12 px-7 text-base gap-2",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  children?: ReactNode;
  className?: string;
}

interface ButtonAsButton extends BaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    loading,
    icon,
    iconPosition = "start",
    children,
    className,
  } = props;

  const classes = cn(
    baseClasses,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? "w-full" : "",
    className
  );

  const content = (
    <>
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : icon && iconPosition === "start" ? (
        <span className="inline-flex shrink-0">{icon}</span>
      ) : null}
      {children}
      {!loading && icon && iconPosition === "end" ? <span className="inline-flex shrink-0">{icon}</span> : null}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      ref={ref}
      {...buttonProps}
      disabled={buttonProps.disabled || loading}
      className={classes}
    >
      {content}
    </button>
  );
});
