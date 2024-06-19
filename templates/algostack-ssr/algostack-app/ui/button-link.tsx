import React, { FC, ReactNode } from "react";
import { LoadingDots, LoadingSpinner } from "@/dashboard/ui/icons";
import { cn } from "@/dashboard/lib/utils";
import Link from "next/link";
import { cva } from "class-variance-authority";

interface ButtonProps {
  text?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onClick?: () => void;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
  target?: string;
  rel?: string;
  actionLetter?: string;
  loadingDots?: boolean;
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-stone-300",
  {
    variants: {
      variant: {
        default:
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 ",
        destructive:
          "bg-red-500 text-stone-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-stone-50 dark:hover:bg-red-900/90",
        outline:
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground ",
        secondary:
          "bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-100/80 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-800/80",
        ghost:
          "hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50",
        link: "text-stone-900 underline-offset-4 hover:underline dark:text-stone-50",
      },
      size: {
        default: "h-12 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const ButtonLink: FC<ButtonProps> = ({
  text,
  variant = "default",
  onClick,
  loading,
  icon,
  children,
  className,
  size,
  href,
  target,
  rel,

  actionLetter,
  loadingDots,
}: ButtonProps) => {
  return (
    <Link
      target={target}
      type={onClick ? "button" : "submit"}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={onClick}
      href={href || "#"}
      rel={rel}
    >
      {loadingDots && loading ? (
        <LoadingDots />
      ) : loading ? (
        <LoadingSpinner />
      ) : icon ? (
        icon
      ) : (
        children
      )}
      {text && (
        <>
          <p>{text}</p>
          {actionLetter && (
            <kbd className="hidden rounded bg-accents-7 px-2 py-0.5 text-xs font-light text-white transition-all duration-75 group-hover:bg-accent group-hover:text-primary-foreground dark:text-secondary md:inline-block">
              {actionLetter}
            </kbd>
          )}
        </>
      )}
    </Link>
  );
};

export default ButtonLink;
