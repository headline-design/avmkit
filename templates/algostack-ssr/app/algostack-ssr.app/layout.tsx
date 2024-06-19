
import "@/dashboard/styles/globals.css";
import dynamic from "next/dynamic";

// Dynamically import the Header component
const Header = dynamic(
    () => import("@/dashboard/layout/header"),
    {
      ssr: false,
    },
  );

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col min-h-[100dvh] bg-background">
        <Header />
        {children}
      </div>
    </>
  );
};

export default MainLayout;
