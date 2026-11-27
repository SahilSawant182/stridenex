"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { Loader2, Rocket } from "lucide-react";
import { VentureLabProvider, useVentureLab } from "./VentureLabProvider";
import VentureSidebar from "./navigation/VentureSidebar";
import VentureHeader from "./navigation/VentureHeader";
import { EmptyState, TooltipProvider, VLButton } from "./shared/primitives";
import { CreateVentureModal } from "./shared/VentureFormModals";
import { useLocalFlag } from "./shared/useLocalFlag";

const COLLAPSE_KEY = "stridenex:venturelab:sidebar-collapsed";

function ShellContent({ children }: { children: React.ReactNode }) {
  const { ready, loading, loadError, refresh, activeVenture } = useVentureLab();
  const pathname = usePathname();
  // My Ventures manages its own empty/loading/error states (and must stay reachable with zero ventures).
  const selfManaged = pathname.startsWith("/venturelab/ventures");
  const [collapsed, setCollapsed] = useLocalFlag(COLLAPSE_KEY);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  return (
    <div className="venturelab-root flex min-h-screen w-full">
      <a
        href="#vl-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>
      <VentureSidebar
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <VentureHeader onOpenMobileNav={() => setMobileOpen(true)} />
        <main id="vl-main" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {!ready || (loading && !activeVenture && !selfManaged) ? (
            <div className="flex h-[60vh] items-center justify-center text-slate-500" role="status">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden /> Loading your ventures…
            </div>
          ) : selfManaged ? (
            children
          ) : !activeVenture && loadError ? (
            <EmptyState
              icon={<Rocket className="h-7 w-7" />}
              title="Couldn’t load your ventures"
              body={loadError}
              action={
                <VLButton variant="accent" onClick={() => void refresh()}>
                  Try again
                </VLButton>
              }
            />
          ) : !activeVenture ? (
            <EmptyState
              icon={<Rocket className="h-7 w-7" />}
              title="Start your first venture"
              body="VentureLab turns a raw idea into a business model, an execution roadmap, and a team. It all starts with a name."
              action={
                <VLButton variant="accent" onClick={() => setCreateOpen(true)}>
                  Create New Venture
                </VLButton>
              }
            />
          ) : (
            children
          )}
        </main>
      </div>
      <CreateVentureModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}

/** Students only: once auth has loaded, anyone with a different role is sent back to the home page. */
function StudentOnly({ children }: { children: React.ReactNode }) {
  const { role, isInitialized } = useAuth();
  const router = useRouter();
  const blocked = isInitialized && !!role && role.toLowerCase() !== "student";

  useEffect(() => {
    if (blocked) router.replace("/");
  }, [blocked, router]);

  if (blocked || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f6f8] text-slate-500" role="status">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden /> Loading…
      </div>
    );
  }
  return <>{children}</>;
}

export default function VentureLabShell({ children }: { children: React.ReactNode }) {
  return (
    <StudentOnly>
      <ShellInner>{children}</ShellInner>
    </StudentOnly>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider position="top-right">
      <VentureLabProvider>
        <TooltipProvider delayDuration={150}>
          <ShellContent>{children}</ShellContent>
        </TooltipProvider>
      </VentureLabProvider>
    </ToastProvider>
  );
}
