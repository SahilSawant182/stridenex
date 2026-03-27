// components/layout/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";
import FloatingSignupButton from "./FloatingSignupButton";

export default function ConditionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Check if current path is public (home, about, etc.)
    const isPublicPage = pathname === '/' ||
        pathname?.startsWith('/about') ||
        pathname?.startsWith('/privacy-policy') ||
        pathname?.startsWith('/terms-of-use')

    // Only show navbar and footer on public pages
    if (isPublicPage) {
        return (
            <>
                <PublicNavbar />
                <main className="pt-[106px] min-h-screen">
                    {children}
                </main>
                <FloatingSignupButton />
                <PublicFooter />
            </>
        );
    }

    // For all other pages (login, signup, onboarding, dashboard), just render children
    return <main className="min-h-screen">{children}</main>;
}