import type Image from "next/image";
import EcosystemIconDark from "@/public/_static/icons/ecosystem-dark.svg";
import EcosystemIconLight from "@/public/_static/icons/ecosystem-light.svg";
import SalesIconDark from "@/public/_static/icons/sales-dark.svg";
import SalesIconLight from "@/public/_static/icons/sales-light.svg";
import SupportIconDark from "@/public/_static/icons/support-dark.svg";
import SupportIconLight from "@/public/_static/icons/support-light.svg";

type NextImageSrc = Parameters<typeof Image>[0]["src"];

export type Feature = {
  name: string;
  href?: any;
  title?: string;
  description: string;
  iconDark: NextImageSrc;
  iconLight: NextImageSrc;
  service: "all" | "home" | "docs";
};

export type Features = Array<Feature>;


const XSPACE_FEATURES: Features = [
  {
    name: "Cross-Chain Compatibility",
    description: `With out-of-the-box support for blockchain L1s, L2s, and more, your web3 site is ready for the multi-chain future.`,
    iconDark: EcosystemIconDark,
    iconLight: EcosystemIconLight,
    service: "home",
  },
];

const CONTACT_FEATURES: Features = [
  {
    name: "Support",
    href: "/contact/support",
    title: `Get product support`,
    description: `Once Xspace builds a part of your website, it will be stored for future use, ensuring design consistency and reduced redundancy.`,
    iconDark: SupportIconDark,
    iconLight: SupportIconLight,
    service: "all",
  },
  {
    name: "Sales",
    href: "/contact/sales",
    title: `Contact our sales team`,
    description: `With out-of-the-box support for Algorand, your web3 site is ready for the multi-chain future.`,
    iconDark: SalesIconDark,
    iconLight: SalesIconLight,
    service: "home",
  },
];


export const PACK_HOME_FEATURES = XSPACE_FEATURES.filter(
  (f) => f.service === "home" || f.service === "all"
);

export const CONTACT_LANDING_FEATURES = CONTACT_FEATURES.filter(
  (f) => f.service === "home" || f.service === "all"
);
