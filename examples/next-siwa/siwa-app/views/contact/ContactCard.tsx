import React from "react";
import styles from "./index.module.css";
import { cn } from "@/dashboard/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const variants = {
  hidden: { opacity: 0 },
  active: { opacity: 1 },
};

export function ContactCard({
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

  return (
    <div className="w-[calc(100%_-_0px)] sm:!max-w-[470px]">
      <div
        className={cn(styles["counter-border-lg"], "w-full")}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <motion.i
          initial="hidden"
          animate={hovering ? "active" : "hidden"}
          variants={variants}
          aria-hidden="true"
        ></motion.i>
        <div
          className={cn(
            styles.XSpaceCardBg,
            " z-10  relative w-full h-full max-w-full p-6  rounded-xl overflow-hidden flex flex-col items-center justify-center border border-[rgba(255,255,255,0.05)]",
            className,
          )}
        >
          <div className="flex flex-col items-center flex-1 w-full">
            {children}
          </div>
        </div>
      </div>
      <p className={cn(styles["privacyText"])}>
        By submitting this form, I confirm that I have read and understood the
        XStack
        <Link href="/privacy" className="nx-text-primary-600">
          {" "}
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
