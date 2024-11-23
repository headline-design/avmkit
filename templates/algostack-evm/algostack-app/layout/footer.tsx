import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-white shadow">
      <div className="container px-6 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-muted-foreground">
              SIWA
            </Link>
          </div>
          <nav className="flex items-center">
            <Link href="/about" className="mr-4 text-muted-foreground">
              About
            </Link>
            <Link
              href="/getting-started"
              className="px-4 py-2 text-white bg-blue-500 rounded-md"
            >
              Getting started
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
