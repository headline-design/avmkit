import dynamic from "next/dynamic";

const MainView = dynamic(() => import("@/algostack-app/views/main-view"), {
  ssr: false,
});

export default function MainPage() {
  return <MainView />;
}
