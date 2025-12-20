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

export function getDefaultDashboard(role: "owner" | "admin" | "member" | "customer") {
  switch (role) {
    case "owner":
    case "admin":
      return "/admin";
    case "member":
      return "/organiser";
    case "customer":
      return "/customer";
    default:
      return "/";
  }
}
    