import localFont from "next/font/local";
import { Inter, Lora, Work_Sans } from "next/font/google";

export const satoshi = localFont({
  src: "./Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
  style: "normal",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
export const cal = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-cal",
  weight: "600",
  display: "swap",
});

export const calTitle = localFont({
  src: "./CalSans-SemiBold.otf",
  variable: "--font-title",
  weight: "600",
  display: "swap",
});
export const lora = Lora({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
export const work = Work_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const fontMapper = {
  "font-cal": calTitle.variable,
  "font-lora": lora.variable,
  "font-work": work.variable,
} as Record<string, string>;

export const unbounded = localFont({
  src: [
    {
      path: "../../public/fonts/Unbounded-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Unbounded-Medium.woff2",
      weight: "500",
      style: "medium",
    },
    // using Bold for semi-bold because there is no semi-bold font
    {
      path: "../../public/fonts/Unbounded-Bold.woff2",
      weight: "700",
      style: "semi-bold",
    },
    {
      path: "../../public/fonts/Unbounded-Black.woff2",
      weight: "800",
      style: "bold",
    },
  ],
  display: "swap",
  variable: "--font-unbounded",
})
