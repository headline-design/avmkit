import { ChildProviders } from "./providers";

export default function ServerWrapper({
  children,
}: {
  children: React.ReactNode | any;
}) {
  return <ChildProviders>{children}</ChildProviders>;
}
