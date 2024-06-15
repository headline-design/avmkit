import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/algostack-app/ui";
import { Avatar } from "../avatar/avatar";

// import radix-ui/icons icons here

import {
  ExitIcon,
  GearIcon,
  PersonIcon,
  QuestionMarkIcon,
  TokensIcon,
} from "@radix-ui/react-icons";
import IconSIWALogo from "@/algostack-app/assets/siwa-logo";

const UserDropdownMenu = ({ session }: { session: any }) => {
  const menuItems1 = [
    {
      name: "Explore",
      href: "/explore",
      icon: <TokensIcon />,
      divider: true,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <PersonIcon />,
      divider: false,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <GearIcon />,
      divider: false,
    },
    {
      name: "Help",
      href: "/help",
      icon: <QuestionMarkIcon />,
      divider: false,
    },
  ];

  const menuItems2 = [
    {
      name: "Logout",
      href: "/logout",
      icon: <ExitIcon />,
      divider: false,
    },
    {
      name: "SIWA",
      href: "/",
      icon: <IconSIWALogo />,
      divider: true,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 h-8 w-8 shrink-0 rounded-full border">
          <Avatar
            className="shrink-0 select-none rounded-full"
            label={session?.user?.name || "0xcc787asdlkasjdlkwqe-098"}
            address={session?.user?.name || "0xcc787asdlkasjdlkwqe-098"}
            size="32px"
            src={session?.user?.name || "0xcc787asdlkasjdlkwqe-098"}
            shape="circle"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-[150] min-w-[16rem] p-0 overflow-hidden rounded-xl bg-menu data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 max-h-[80vh] w-[360px] origin-top-right overflow-y-auto md:max-h-[calc(100vh-64px)]"
        align="end"
      >
        <div role="group" className="p-2">
          {menuItems1.map((item, i) => {
            return (
              <DropdownMenuItem
                key={i}
                className="relative flex select-none items-center rounded-md px-2 py-2.5 text-sm outline-none transition-colors focus:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 flex items-center gap-3"
              >
                {item.icon} <span>{item.name}</span>
              </DropdownMenuItem>
            );
          })}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="h-px bg-zinc-400"
        />
        <div role="group" className="p-2">
          {menuItems2.map((item, i) => {
            return (
              <DropdownMenuItem
                key={i}
                className="relative flex select-none items-center rounded-md px-2 py-2.5 text-sm outline-none transition-colors focus:bg-zinc-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 flex items-center gap-3"
              >
                {item.icon} <span>{item.name}</span>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
