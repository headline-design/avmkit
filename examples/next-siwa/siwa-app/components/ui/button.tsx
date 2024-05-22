import React, { ReactNode, FC } from "react";
import { LoadingDots, LoadingSpinner } from "@/dashboard/components/ui/icons";
import { cn } from "@/dashboard/lib/utils";
import Tooltip from "./tooltip";

interface ButtonProps {
  text?: string | any;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "success"
    | "danger"
    | "transparent";
  onClick?: any;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  disabledTooltip?: string | ReactNode;
  children?: any;
  className?: string;
  skinny?: boolean;
  square?: boolean;
  slim?: boolean;
  fat?: boolean;
  full?: boolean;
  actionLetter?: string;
  suffix?: any;
  rounded?: boolean;
  loadingDots?: boolean;
  width?: string;
  minWidth?: string;
  height?: string;
  minHeight?: string;
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
      return "themed-bg bg-transparent text-secondary border-0 hover:text-accent-foreground shadow-none";
    case "success":
      return "border border-input border-success bg-success-foreground text-white hover:bg-success hover:text-white ";
    case "danger":
      return "bg-destructive text-destructive-foreground hover:bg-destructive-hover ";
    case "transparent":
      return "px-1 py-1 bg-transparent text-secondary hover:text-accent-foreground ";
    default:
      return "";
  }
}

export const Button: FC<ButtonProps> = ({
  text,
  variant = "primary",
  onClick,
  disabled,
  loading,
  icon,
  disabledTooltip,
  children,
  className,
  square,
  skinny,
  slim,
  fat,
  full,
  actionLetter,
  suffix,
  rounded,
  loadingDots,
  width,
  minWidth,
  height,
  minHeight,
  ...props
}) => {
  if (disabledTooltip) {
    const disabledButtonStyle = cn(
      "flex h-9 cursor-not-allowed items-center justify-center rounded-md border bg-accent-muted text-sm font-medium text-secondary-accent transition-all ",
      square
        ? "h-6 w-6"
        : skinny
        ? "h-8 px-2"
        : slim
        ? "h-9"
        : fat
        ? "h-12 border-lg"
        : "h-10",
      full ? "w-full" : "",
      rounded ? "rounded-md" : square ? "rounded-sm" : "rounded-lg",
    );

    return (
      <Tooltip content={disabledTooltip} fullWidth>
        <div className={disabledButtonStyle}>
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
    <button
      style={{
        width: width,
        minWidth: minWidth,
        height: height,
        minHeight: minHeight,
      }}
      {...props}
      type={onClick ? "button" : "submit"}
      className={buttonStyle}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loadingDots && loading === true ? (
        <LoadingDots />
      ) : !loadingDots && loading === true ? (
        <>
          {" "}
          <LoadingSpinner className={cn(fat ? "h-5 w-5" : "h-4 w-4")} />
          {children}
        </>
      ) : icon ? (
        icon
      ) : (
        children
      )}
      {text && loading === false && loadingDots === true && (
        <>
          <p>{text}</p>
          {suffix && (
            <span className="ml-2 flex min-w-[20px] flex-shrink-0 items-center justify-center">
              {suffix}
            </span>
          )}
          {actionLetter && (
            <kbd className="hidden rounded bg-accents-7 px-2 py-0.5 text-xs font-light text-white transition-all duration-75 group-hover:bg-accent group-hover:text-primary-foreground dark:text-secondary-accent md:inline-block">
              {actionLetter}
            </kbd>
          )}
        </>
      )}
      {text && loading === true && loadingDots === false && (
        <>
          <p>{text}</p>
          {suffix && (
            <span className="ml-2 flex min-w-[20px] flex-shrink-0 items-center justify-center">
              {suffix}
            </span>
          )}
          {actionLetter && (
            <kbd className="hidden rounded bg-accents-7 px-2 py-0.5 text-xs font-light text-secondary-accent transition-all duration-75 group-hover:bg-accent group-hover:text-primary-foreground md:inline-block">
              {actionLetter}
            </kbd>
          )}
        </>
      )}
      {text && loadingDots === undefined && (
        <>
          <p>{text}</p>
          {suffix && (
            <span className="ml-2 flex min-w-[20px] flex-shrink-0 items-center justify-center">
              {suffix}
            </span>
          )}
          {actionLetter && (
            <kbd className="hidden rounded bg-accents-7 px-2 py-0.5 text-xs font-light text-secondary-accent transition-all duration-75 group-hover:bg-accent group-hover:text-primary-foreground md:inline-block">
              {actionLetter}
            </kbd>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
