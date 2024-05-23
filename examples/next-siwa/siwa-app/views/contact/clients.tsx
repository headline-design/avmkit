import React from "react";
import { cn } from "@/dashboard/lib/utils";

import { users } from "./users";
import { Logo } from "./Logo";

export function Clients({
  linked,
  staticWidth,
  companyList,
}: {
  linked?: boolean;
  staticWidth?: boolean;
  companyList?: string[];
}) {
  const showcaseDark = [];
  const showcaseLight = [];

  const LogoWrapper = ({ className, children }) => {
    if (!staticWidth) return children;
    return (
      <div
        className={cn(
          "w-48 lg:w-40 flex items-center justify-center",
          className,
        )}
      >
        {children}
      </div>
    );
  };

  users
    .filter((i) => (companyList ? companyList.includes(i.caption) : true))
    .forEach((user) => {
      if (user.pinned) {
        showcaseDark.push(
          <LogoWrapper
            key={`${user.caption}-dark`}
            className="flex dark:hidden"
          >
            <Logo user={user} theme={"dark"} isLink={linked} />
          </LogoWrapper>,
        );
        showcaseLight.push(
          <LogoWrapper
            key={`${user.caption}-light`}
            className="hidden dark:flex"
          >
            <Logo user={user} theme={"light"} isLink={linked} />
          </LogoWrapper>,
        );
      }
    });

  return (
    <>
      {showcaseDark}
      {showcaseLight}
    </>
  );
}

export function MarqueePartners({
  linked,
  staticWidth,
  companyList,
}: {
  linked?: boolean;
  staticWidth?: boolean;
  companyList?: string[];
}) {
  const showcaseDark = [];
  const showcaseLight = [];

  const LogoWrapper = ({ className, children }) => {
    if (!staticWidth) return children;
    return (
      <div
        className={cn(
          "w-40 lg:w-40 flex items-center justify-center mr-6",
          className,
        )}
      >
        {children}
      </div>
    );
  };

  users
    .filter((i) => (companyList ? companyList.includes(i.caption) : true))
    .forEach((user) => {
      if (user.pinned) {
        showcaseDark.push(
          <LogoWrapper
            key={`${user.caption}-dark`}
            className="flex dark:hidden"
          >
            <Logo user={user} theme={"dark"} isLink={linked} />
          </LogoWrapper>,
        );
        showcaseLight.push(
          <LogoWrapper
            key={`${user.caption}-light`}
            className="hidden dark:flex"
          >
            <Logo user={user} theme={"light"} isLink={linked} />
          </LogoWrapper>,
        );
      }
    });

  return (
    <>
      {showcaseDark}
      {showcaseLight}
    </>
  );
}
