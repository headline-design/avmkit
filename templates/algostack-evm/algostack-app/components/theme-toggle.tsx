

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { IconMoon, IconSun } from "../icons";
import { Button } from "../ui";

export default function ThemeToggle() {
  const { theme: resolvedTheme, setTheme } = useTheme();
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
    <Button
    size="sm"
    className="ml-4"
    variant={"ghost"}
    onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
  >
    {resolvedTheme === "light" ? <IconMoon /> : <IconSun />}
  </Button>
  );
}
