"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function UserNav() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  if (!session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "text-muted-foreground hover:text-foreground"
          )}
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants(),
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block text-sm">
        <p className="font-medium text-foreground">{session.user.name}</p>
        <p className="text-xs text-muted-foreground">{session.user.email}</p>
      </div>
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="text-muted-foreground hover:text-foreground"
      >
        Sign Out
      </Button>
    </div>
  );
}
