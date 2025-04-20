import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <NavbarClient session={session} />
        </div>
      </div>
    </header>
  );
}
