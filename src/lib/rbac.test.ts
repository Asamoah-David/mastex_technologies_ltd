import { describe, it, expect } from "vitest";
import { can, permissionsForRole, canAccessAdmin, ALL_PERMISSIONS } from "./rbac";

describe("rbac", () => {
  it("super admin can do everything", () => {
    for (const p of ALL_PERMISSIONS) {
      expect(can("SUPER_ADMIN", p)).toBe(true);
    }
  });

  it("viewer is read-only", () => {
    expect(can("VIEWER", "products:read")).toBe(true);
    expect(can("VIEWER", "products:write")).toBe(false);
    expect(can("VIEWER", "settings:write")).toBe(false);
  });

  it("editor can write content but not settings or users", () => {
    expect(can("EDITOR", "blog:write")).toBe(true);
    expect(can("EDITOR", "docs:write")).toBe(true);
    expect(can("EDITOR", "settings:write")).toBe(false);
    expect(can("EDITOR", "users:write")).toBe(false);
  });

  it("support can manage leads but not products", () => {
    expect(can("SUPPORT", "leads:write")).toBe(true);
    expect(can("SUPPORT", "products:write")).toBe(false);
  });

  it("admin can manage settings but only super admin manages users", () => {
    expect(can("ADMIN", "settings:write")).toBe(true);
    expect(can("ADMIN", "users:write")).toBe(false);
    expect(can("SUPER_ADMIN", "users:write")).toBe(true);
  });

  it("explicit grants extend a role", () => {
    expect(can("VIEWER", "products:write")).toBe(false);
    expect(can("VIEWER", "products:write", ["products:write"])).toBe(true);
  });

  it("only viewers are blocked from admin", () => {
    expect(canAccessAdmin("VIEWER")).toBe(false);
    expect(canAccessAdmin("SUPPORT")).toBe(true);
    expect(canAccessAdmin("ADMIN")).toBe(true);
  });

  it("permissionsForRole returns a non-empty list for each role", () => {
    for (const role of ["VIEWER", "SUPPORT", "EDITOR", "ADMIN", "SUPER_ADMIN"] as const) {
      expect(permissionsForRole(role).length).toBeGreaterThan(0);
    }
  });
});
