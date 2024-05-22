import { Link } from "react-router-dom";
import ThemeToggle from "./components/theme-toggle";
import { IconShield } from "./icons";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link className="mr-6 flex items-center space-x-2 text" to="/">
          <IconShield />
          <span className="sr-only">SIWA</span>
          <span className="font-bold sm:inline-block">SIWA</span>
        </Link>
        <nav className="hidden ml-auto sm:flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            to="/features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            to="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium text-foreground/60 hover:text-foreground "
            to="/contact"
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
