"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function PublicNavbar() {
  const pathname = usePathname();

  // Define routes where the public navbar should NOT be shown
  const hiddenRoutes = [
    "/student",
    "/mentor",
    "/college",
    "/industry",
    "/onboarding",
    "/login",
    "/signup"
  ];

  // Check if the current path starts with any of the hidden routes
  const shouldHide = hiddenRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  return <Navbar />;
}
