import React, { FC, ReactNode } from "react";
import { LoadingDots, LoadingSpinner } from "@/dashboard/ui/icons";
import Tooltip from "@/dashboard/ui/tooltip";
import { cn } from "@/dashboard/lib/utils";
import { Link } from "react-router-dom";

interface ButtonProps {
  text?: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "danger"
    | "link"
    | "transparent";
  onClick?: any;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  disabledTooltip?: string | ReactNode;
  children?: any;
  className?: any;
  href?: any;
  skinny?: any;
  slim?: any;
  fat?: any;
  target?: any;
  rel?: any;
  full?: any;
  rounded?: any;
  actionLetter?: any;
  loadingDots?: any;
  shadow?: any;
  square?: any;
}

const getButtonHeight = ({ square, skinny, slim, fat }: ButtonProps) => {
  if (square) return "h-6 w-6 p-1";
  if (skinny) return "h-8 px-3";
  if (slim) return "h-9";
  if (fat) return "h-12 rounded-lg";
  return "h-10";
};

function getVariantStyle(variant: ButtonProps["variant"]) {
  switch (variant) {
    case "primary":
      return "bg-primary text-primary-foreground hover:bg-primary/80 border-shadow";
    case "secondary":
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-shadow";
    case "outline":
      return "themed-border bg-background hover:text-accent-foreground border-shadow";
    case "ghost":
      return "themed-bg bg-background border-0 hover:text-accent-foreground shadow-none";
    case "success":
      return "border border-input border-success bg-success-foreground text-white hover:bg-success hover:text-white ";
    case "danger":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90 ";
    case "link":
      return "px-1 py-1 bg-transparent text-secondary hover:text-accent-foreground ";
    case "transparent":
      return "px-1 py-1 bg-transparent text-secondary hover:text-accent-foreground ";
    default:
      return "";
  }
}

export const ButtonLink: FC<ButtonProps> = ({
  text,
  variant = "primary",
  onClick,
  disabled,
  loading,
  icon,
  disabledTooltip,
  children,
  className,
  skinny,
  slim,
  shadow,
  href,
  fat,
  target,
  rel,
  full,
  rounded,
  square,
  actionLetter,
  loadingDots,
}: ButtonProps) => {
  if (disabledTooltip) {
    return (
      <Tooltip content={disabledTooltip} fullWidth>
        <div className="flex h-9 w-full cursor-not-allowed items-center justify-center rounded-md border bg-accent-muted text-sm text-secondary-accent transition-all ">
          <p>{text}</p>
        </div>
      </Tooltip>
    );
  }

  const buttonStyle = cn(
    "flex inline-flex items-center justify-center px-4 py-2 space-x-2 whitespace-nowrap rounded-md  text-sm font-medium transition-all",
    disabled || loading
      ? "cursor-not-allowed shadow-border  bg-accent-muted text-secondary-accent"
      : getVariantStyle(variant),
    getButtonHeight({ skinny, slim, fat, square }),
    full ? "w-full" : "",
    rounded ? "rounded-full" : square ? "rounded-sm" : "rounded",
    className,
  );

  return (
    <Link
      target={target}
      type={onClick ? "button" : "submit"}
      className={buttonStyle}
      onClick={onClick}
      to={href}
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
