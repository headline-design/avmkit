import { FadeIn } from "./FadeIn";
import React from "react";
import { LandingPageGlobalStyles } from "./GlobalStyles";
import { GradientSectionBorder } from "./GradientSectionBorder";
import styles from "./index.module.css";
import { CONTACT_LANDING_FEATURES } from "./features";
import { FeaturesLanding } from "./LandingFeatures";
import { constructMetadata } from "@/dashboard/lib/utils";
import { cn } from "@/dashboard/lib/utils";

export const metadata = constructMetadata({
  title: "Pricing – Xspace",
});

export default function ContactView() {
  return (
    <>
      <LandingPageGlobalStyles />
      <div>
        <FadeIn className="z-10 flex flex-col items-center justify-center w-full h-full">

            <FadeIn>
              <div className="z-50 flex flex-col items-center justify-center ">
                <h1
                  className={cn(
                    "w-full  md:!w-full font-bold text-5xl lg:text-6xl leading-tight xl:leading-snug text-center  bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]",
                    styles.h1Custom)}
                >
                  Contact Us
                </h1>
              </div>
            </FadeIn>
            <div className="flex w-full container items-center justify-center gap-6 sm:mx-0 md:mb-0 flex-col mlg:!flex-row z-10 lg:!translate-y-0">
              <FadeIn className="py-16 lg:py-18">
                <FeaturesLanding features={CONTACT_LANDING_FEATURES} />
              </FadeIn>
            </div>
        </FadeIn>
      </div>
    </>
  );
}
