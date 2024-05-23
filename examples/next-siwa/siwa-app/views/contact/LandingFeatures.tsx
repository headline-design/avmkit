import { Link } from "react-router-dom";
import type { Feature, Features } from "./features";
import { FadeIn } from "./FadeIn";
import { cn } from "@/dashboard/lib/utils"
import styles from "./index.module.css"

import Image from "next/image";
import type { ReactNode } from "react";

export function FeatureLandingBox({
  name,
  title,
  description,
  iconDark,
  iconLight,
  href,
  children,
}: {
  iconDark: Parameters<typeof Image>[0]["src"];
  iconLight: Parameters<typeof Image>[0]["src"];
  name: string;
  description: ReactNode;
  children: ReactNode;
  href: string;
  title?: any;
}) {
  function LandingLink({ href, isActive, children }) {
    const classes =
      "transition-colors duration-300 cursor-pointer hover:text-black dark:hover:text-white";

    const conditionalClasses = {
      "text-black dark:text-white": !!isActive,
    };

    return (
      <Link to={href} className={cn(classes, conditionalClasses)}>
        {children}
      </Link>
    );
  }

  return (
    <LandingLink href={href} isActive={undefined}>
      <div className={`${styles.XSpaceCardBg} z-10 box-border relative flex flex-col gap-5 p-8 overflow-hidden text-black no-underline border dark:text-white rounded-xl dark:border-neutral-800 order-skin-border transition-all hover:border-skin-text`}>
        <div className="w-100 align-middle justify-center flex">
          <Image
            src={iconDark}
            height={100}
            aria-hidden="true"
            alt=""
            className="hidden dark:block"
          />
          <Image
            src={iconLight}
            height={100}
            aria-hidden="true"
            alt=""
            className="block dark:hidden"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="m-0 font-bold leading-5 text-secondary font-space-grotesk dark:text-white">
            {title}
          </h3>

          <p className="m-0 leading-6 opacity-70">{description}</p>
        </div>
      </div>
    </LandingLink>
  );
}

export function FeaturesLanding({ features }: { features: Features }) {
  return (
    <section className="relative flex flex-col items-center px-6 pb-16 font-sans md:pb-24 lg:pb-32 gap-9 lg:gap-14">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-6 max-w-[1200px]">
        {features.map((feature) => (
          <FadeIn
            className="flex"
            key={feature.name.replace(/\s+/g, "-").toLowerCase()}
          >
            <FeatureLandingBox
            title={feature.title}
              href={feature.href}
              name={feature.name}
              description={feature.description}
              iconDark={feature.iconDark}
              iconLight={feature.iconLight}
              children={""}
            />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
