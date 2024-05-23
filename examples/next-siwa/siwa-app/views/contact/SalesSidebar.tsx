import React from "react";
import styles from "./index.module.css";
import { cn } from "@/dashboard/lib/utils"
import { Marquee } from "./Marquee";
import { MarqueePartners } from "./clients";
import { InfuraLogo } from "./icons";

const variants = {
  hidden: { opacity: 0 },
  active: { opacity: 1 },
};

export function SalesSidebar({
  alt,
  icon: Icon,
  className,
  children,
}: {
  href?: string;
  icon?: React.ElementType;
  title?: "xballot" | "xspace";
  alt?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [hovering, setHovering] = React.useState(false);

  function Teams() {
    return (
      <MarqueePartners
        companyList={["Infura", "QuickNode", "Adobe", "Vercel", "MongoDB"]}
        staticWidth
      />
    );
  }

  return (
    <div
      className={cn(styles["sales-stack"], "w-[calc(100%_-_0px)] p-0 sm:p-4")}
    >
      <figure className={cn(styles["stack-block-top"], "pl-0 lg:pl-6 pb-6")}>
        <blockquote className={cn(styles["stack-block-quote"])}>
          <p className={cn(styles["text-wrapper"])}>
            "HEADLINE, the team behind @xballot_ are skilled professionals
            experienced in development tooling, smart contract engineering &
            dapp development."
          </p>
        </blockquote>
        <figcaption>
          <div>
            <div className={cn(styles["sales-qt-type"])}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://twitter.com/infura_io/status/1666471902318133255"
              >
                <InfuraLogo />
              </a>
            </div>
          </div>
        </figcaption>
      </figure>

      <div className={cn(styles["w-zl"])}>
        <p className="bg-contain mb-2 text-sm font-semibold tracking-wide text-center text-[#666666] dark:text-[#888888] uppercase">
          Infrastructure partners
          <br className="inline md:hidden" />
        </p>
        <Marquee>
          <Teams />
        </Marquee>
      </div>
    </div>
  );
}
