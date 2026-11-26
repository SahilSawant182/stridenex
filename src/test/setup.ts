import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/partner/billing",
}));

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => {
    return React.createElement("a", { href, ...props }, children);
  },
}));

// Mock Next.js Image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => {
    return React.createElement("img", { src, alt, ...props });
  },
}));
