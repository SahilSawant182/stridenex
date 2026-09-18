// components/layout/ConditionalLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import PublicNavbar from "./PublicNavbar";
import PublicFooter from "./PublicFooter";

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
        pathname?.startsWith('/terms-of-use') ||
        pathname?.startsWith('/blogs') ||
        pathname?.startsWith('/bloggers');

    // Only show navbar and footer on public pages
    if (isPublicPage) {
        return (
            <>
                <PublicNavbar />
                <main className="pt-20 min-h-screen">
                    {children}
                </main>
                <PublicFooter />
            </>
        );
    }

    // For all other pages (login, signup, onboarding, dashboard), just render children
    return <main className="min-h-screen">{children}</main>;
}