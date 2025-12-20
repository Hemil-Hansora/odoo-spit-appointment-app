import { admin, member, owner } from "./permissions";


export function getRolePermissions(role: string) {
  switch (role) {
    case "owner":
      return owner;
    case "admin":
      return admin;
    case "member":
      return member;
    default:
      return null;
  }
}
    