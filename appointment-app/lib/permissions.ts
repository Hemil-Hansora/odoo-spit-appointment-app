import { createAccessControl } from "better-auth/plugins/access";

const statement = {
  service: ["create", "update", "publish", "delete"],
  slot: ["create", "update", "delete"],
  booking: ["read", "update", "cancel"],
} as const;

export const ac = createAccessControl(statement);

// Provider / Staff
export const member = ac.newRole({
  booking: ["read", "update"], // mark completed
});

// Organiser
export const admin = ac.newRole({
  service: ["create", "update", "publish"],
  slot: ["create", "update"],
  booking: ["read", "update", "cancel"],
});

// Org Owner
export const owner = ac.newRole({
  service: ["create", "update", "publish", "delete"],
  slot: ["create", "update", "delete"],
  booking: ["read", "update", "cancel"],
});
