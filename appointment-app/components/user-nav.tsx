"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (isPending) {
    return <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />;
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <Link href="/sign-in">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20"
        >
          {session.user.name?.charAt(0).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-foreground">
              {session.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="text-xs text-muted-foreground cursor-default hover:bg-transparent">
          Role: <span className="font-semibold text-foreground ml-1">{session.user.role}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground">
          <Link href="/settings/profile" className="w-full">
            Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-foreground hover:bg-accent hover:text-accent-foreground">
          <Link href="/settings/account" className="w-full">
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
