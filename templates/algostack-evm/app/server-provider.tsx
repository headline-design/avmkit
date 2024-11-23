import { ChildProvider } from "./providers";

export default function ServerWrapper({
  children,
}: {
  children: React.ReactNode | any;
}) {
  return <ChildProvider>{children}</ChildProvider>;
}
