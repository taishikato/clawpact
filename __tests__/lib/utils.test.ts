import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("should resolve tailwind conflicts in favor of the last class", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("should handle undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("should handle empty arguments", () => {
    expect(cn()).toBe("");
  });

  it("should handle clsx array syntax", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle clsx object syntax", () => {
    expect(cn({ hidden: true, visible: false })).toBe("hidden");
  });
});
