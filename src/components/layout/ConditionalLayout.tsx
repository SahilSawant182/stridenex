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
        pathname?.startsWith('/about')

    // Only show navbar and footer on public pages
    if (isPublicPage) {
        return (
            <>
                <PublicNavbar />
                <main className="pt-[74px] min-h-screen">
                    {children}
                </main>
                <PublicFooter />
            </>
        );
    }

    // For all other pages (login, signup, onboarding, dashboard), just render children
    return <main className="min-h-screen">{children}</main>;
}