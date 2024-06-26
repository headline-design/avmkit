import { Button } from "@/algostack-app/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/algostack-app/ui/card";
import { IconSignOut } from "@/algostack-app/icons";
import { shorten, truncateMicroString } from "@/algostack-app/lib/utils";
import IconSIWALogo from "../assets/siwa-logo";

const SIWADetails = ({ user, signOut }) => {
  return (
    <>
      {user?.wallets ? (
        <div className="flex flex-col w-full sm:w-[350px] justify-center">
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    SIWA -{" "}
                    {truncateMicroString(user?.wallets[0]?.address, 3) || "N/A"}
                    <Button
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        navigator.clipboard.writeText(user?.wallets[0]?.address)
                      }
                    >
                      <CopyIcon className="h-3 w-3" />
                      <span className="sr-only">Copy Address</span>
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-left">
                    Date: {new Date().toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1 text-amber">
                  <IconSIWALogo color="currentColor" />
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Authentication Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Wallet Address
                      </span>
                      <span>{shorten(user?.wallets[0]?.address)}</span>
                    </li>
                    {user?.nfd && (
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">NFD</span>
                        <span>{user?.nfd}</span>
                      </li>
                    )}
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Database</span>
                      <span className="text-ellipsis overflow-hidden">
                        Postgres
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">DB Provider</span>
                      <span className="text-ellipsis overflow-hidden">
                        Supabase
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">ORM</span>
                      <span className="text-ellipsis overflow-hidden">
                        Prisma
                      </span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">
                        Connection Status
                      </span>
                      <span>{user ? "Connected" : "Disconnected"}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Session Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="flex items-center gap-1 text-muted-foreground">
                        <CreditCardIcon className="h-4 w-4" />
                        Session ID
                      </dt>
                      <dd>{shorten(user?.id) || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Status: {user ? "Active" : "Inactive"}
                  <time dateTime={new Date().toISOString()}>
                    {new Date().toLocaleTimeString()}
                  </time>
                </div>
              </CardFooter>
            </Card>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="mt-4 flex items-center justify-center"
          >
            <IconSignOut className="mr-2" /> Logout
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">No SIWA Wallet Found</h1>
            <p className="text-muted-foreground">
              Please connect your SIWA wallet to view details.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

function Separator(props) {
  return <hr className="border-t border-muted-foreground" {...props} />;
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CreditCardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

export default SIWADetails;
