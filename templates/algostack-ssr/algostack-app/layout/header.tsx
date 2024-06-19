import Link from "next/link";
import ThemeToggle from "../components/theme-toggle";
import { IconAlgoStackTypelogo } from "../assets/algostack-typelogo";
import { Badge } from "../components/badge";

export default function Header(){
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link className="mr-6 flex items-center space-x-2 text" href="/">
          <span className="sr-only">AlgoStack</span>
          <IconAlgoStackTypelogo className="font-bold sm:inline-block" />
          <Badge variant="outline">SSR</Badge>
        </Link>
        <nav className="hidden ml-auto sm:flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            href="/features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            href="/contact"
          >
            Contact
          </Link>
        </nav>
        <div className="w-full flex-1 md:w-auto md:flex-none"></div>
        <ThemeToggle />
      </div>
    </header>
  );
};
