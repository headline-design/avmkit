import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
//console.log(pathname)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}