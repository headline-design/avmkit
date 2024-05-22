"use client";

/***********************************/

/*  Tooltip Contents  */
import { ReactNode, useState } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Button from "./button";
import Script from "next/script";
import { HelpCircle } from "lucide-react";
import { Drawer } from "vaul";
import useMediaQuery from "@/dashboard/lib/hooks/use-media-query";
import ButtonLink from "./button-link";

export default function Tooltip({
  children,
  content,
  fullWidth,
}: {
  children: ReactNode;
  content: ReactNode | string;
  fullWidth?: boolean;
}) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer.Root>
        <Drawer.Trigger
          className={`${fullWidth ? "w-full" : "inline-flex"} md:hidden`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-backdrop-1" />
        <Drawer.Portal>
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t bg-background">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-background align-middle shadow-md">
              {typeof content === "string" ? (
                <span className="block text-center text-sm text-primary">
                  {content}
                </span>
              ) : (
                content
              )}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger className="inline-flex" asChild>
          {children}
        </TooltipPrimitive.Trigger>
        {/*
            We don't use TooltipPrimitive.Portal here because for some reason it
            prevents you from selecting the contents of a tooltip when used inside a modal
        */}
        <TooltipPrimitive.Content
          sideOffset={8}
          side="top"
          className="z-[99] hidden animate-slide-up-fade items-center overflow-hidden rounded-md bg-background shadow-sm md:block border"
        >
          {typeof content === "string" ? (
            <div className="block max-w-xs px-4 py-2 text-center text-sm text-primary">
              {content}
            </div>
          ) : (
            content
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export function TooltipContent({
  title,
  cta,
  href,
  target,
  onClick,
}: {
  title: string;
  cta?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-3 p-4 text-center md:max-w-xs shadow-md">
      <p className="text-sm text-primary">{title}</p>
      {cta &&
        (href ? (
          <ButtonLink
            variant="primary"
            href={href}
            {...(target ? { target } : {})}
          >
            {cta}
          </ButtonLink>
        ) : onClick ? (
          <Button  variant="primary" onClick={onClick}>
            {cta}
          </Button>
        ) : null)}
    </div>
  );
}

export function SimpleTooltipContent({
  title,
  cta,
  href,
}: {
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="max-w-xs px-4 py-2 text-center text-sm text-primary">
      {title}{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-secondary underline underline-offset-4 hover:text-primary"
      >
        {cta}
      </a>
    </div>
  );
}

export function InfoTooltip({
  content,
  className,
}: {
  content: ReactNode | string;
  className?: string;
}) {
  return (
    <Tooltip content={content}>
      <HelpCircle className={`${className} "h-4 text-secondary" w-4`} />
    </Tooltip>
  );
}

export function SSOWaitlist() {
  const [opening, setOpening] = useState(false);
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />

      <div className="flex max-w-sm flex-col items-center space-y-3 p-4 text-center">
        <h3 className="font-semibold text-primary">SAML/SSO</h3>
        <p className="text-sm text-secondary">
          SAML/SSO is coming soon. Interested in early access? Join the
          waitlist.
        </p>

        <Button
          text="Join waitlist"
          loading={opening}
          onClick={() => {
            setOpening(true);
            // @ts-ignore
            window.Tally?.openPopup("mZEYD0", {
              width: 540,
              onOpen: () => setOpening(false),
            });
          }}
        />
      </div>
    </>
  );
}

