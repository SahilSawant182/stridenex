"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function PublicFooter() {
  const pathname = usePathname();

  // Define routes where the public footer should NOT be shown
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

  return <Footer appName="StrideNex" />;
}
