import type { Session, User } from "better-auth/types";

declare module "better-auth/types" {
  interface User {
    role?: "owner" | "admin" | "member" | "customer";
    organizationId?: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      name: string;
      role?: "owner" | "admin" | "member" | "customer";
      organizationId?: string;
      activeOrganizationId?: string;
    };
  }
}
