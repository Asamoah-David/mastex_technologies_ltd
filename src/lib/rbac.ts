import type { Role } from "@prisma/client";

/**
 * Role-based access control. Roles are hierarchical; each role inherits the
 * permissions of every role below it. Explicit per-user grants (PermissionOnUser)
 * are layered on top of these defaults by `can()`.
 */

export type Permission =
  | "products:read" | "products:write"
  | "blog:read" | "blog:write"
  | "docs:read" | "docs:write"
  | "media:read" | "media:write"
  | "leads:read" | "leads:write"
  | "settings:read" | "settings:write"
  | "users:read" | "users:write"
  | "analytics:read";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  VIEWER: ["products:read", "blog:read", "docs:read", "media:read", "leads:read", "analytics:read"],
  SUPPORT: [
    "products:read", "blog:read", "docs:read", "media:read",
    "leads:read", "leads:write", "analytics:read",
  ],
  EDITOR: [
    "products:read", "products:write",
    "blog:read", "blog:write",
    "docs:read", "docs:write",
    "media:read", "media:write",
    "leads:read", "analytics:read",
  ],
  ADMIN: [
    "products:read", "products:write",
    "blog:read", "blog:write",
    "docs:read", "docs:write",
    "media:read", "media:write",
    "leads:read", "leads:write",
    "settings:read", "settings:write",
    "users:read",
    "analytics:read",
  ],
  SUPER_ADMIN: [
    "products:read", "products:write",
    "blog:read", "blog:write",
    "docs:read", "docs:write",
    "media:read", "media:write",
    "leads:read", "leads:write",
    "settings:read", "settings:write",
    "users:read", "users:write",
    "analytics:read",
  ],
};

export const ALL_PERMISSIONS: Permission[] = [
  "products:read", "products:write",
  "blog:read", "blog:write",
  "docs:read", "docs:write",
  "media:read", "media:write",
  "leads:read", "leads:write",
  "settings:read", "settings:write",
  "users:read", "users:write",
  "analytics:read",
];

export function permissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

export function can(
  role: Role,
  permission: Permission,
  extraGrants: string[] = [],
): boolean {
  if (role === "SUPER_ADMIN") return true;
  return permissionsForRole(role).includes(permission) || extraGrants.includes(permission);
}

export const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"];

export function canAccessAdmin(role: Role): boolean {
  return role !== "VIEWER";
}
