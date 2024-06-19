"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

const appearances = [
  {
    theme: "Dark",
    icon: <Moon strokeWidth="1.5" width="16px" height="16px" />,
  },
  {
    theme: "Light",
    icon: <Sun strokeWidth="1.5" width="16px" height="16px" />,
  },
  {
    theme: "System",
    icon: <Monitor strokeWidth="1.5" width="16px" height="16px" />,
  },
];

export default function ThemeSwitcher() {
  const { theme: currentTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const item = window.localStorage.getItem("theme");
      if (item) {
        item === "dark" ? setTheme("dark") : setTheme("light");
      }
    }
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div className="relative mt-8 inline-flex">
      <div className="rust-theme-switcher">
        {appearances.map(({ theme, icon }) => (
          <button
            key={theme}
            className={`${
              currentTheme === theme.toLowerCase() ? "theme-active " : ""
            } switch-button text-sm text-secondary-accent hover:text-foreground`}
            onClick={() => {
              setTheme(theme.toLowerCase());
            }}
          >
            <span className="flex items-center justify-center">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
