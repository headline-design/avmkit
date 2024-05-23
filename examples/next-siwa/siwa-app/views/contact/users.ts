import { CSSProperties } from "react";

export type XStackUser = {
  caption: string;
  image: string;
  infoLink: string;
  pinned?: boolean;
  style?: CSSProperties;
};

export const users: Array<XStackUser> = [
  {
    caption: "Infura",
    image: "/_static/logos/infura.svg",
    infoLink: "https://www.infura.io",
    pinned: true,
    style: {
      width: 150,
    },
  },
  {
    caption: "AWS",
    image: "/_static/logos/aws.svg",
    infoLink: "https://aws.amazon.com/",
    pinned: true,
    style: {
      width: 75,
    },
  },
  {
    caption: "QuickNode",
    image: "/_static/logos/quicknode.svg",
    infoLink: "https://www.quicknode.com/",
    pinned: true,
    style: {
      width: 125,
    },
  },
  {
    caption: "MongoDB",
    image: "/_static/logos/mongodb.svg",
    infoLink: "https://mongodb.com/",
    pinned: true,
    style: {
      width: 125,
    },
  },
  {
    caption: "Vercel",
    image: "/_static/logos/vercel.svg",
    infoLink: "https://www.vercel.com/",
    pinned: true,
    style: {
      width: 125,
    },
  },
  {
    caption: "Github",
    image: "/_static/logos/github.svg",
    infoLink: "https://www.github.com/",
    pinned: true,
    style: {
      width: 110,
    },
  },
];
