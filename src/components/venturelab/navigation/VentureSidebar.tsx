"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VENTURE_NAV } from "@/lib/venturelab/constants";
import { useVentureLab } from "../VentureLabProvider";
import { Avatar, IconButton, Tip } from "../shared/primitives";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (o: boolean) => void;
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link href="/venturelab/overview" className="flex min-h-11 items-center gap-2" aria-label="VentureLab home">
      {collapsed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/favicon.png" alt="StrideNex" className="h-8 w-8 rounded-lg object-contain" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/Logo.png" alt="StrideNex" className="h-8 w-auto max-w-[120px] object-contain" />
        </>
      )}
    </Link>
  );
}

function SidebarBody({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { activeVenture } = useVentureLab();
  const owner = activeVenture?.team.find((m) => m.isOwner);

  return (
    <>
      <nav aria-label="VentureLab" className={cn("flex-1 space-y-1 overflow-y-auto py-2", collapsed ? "px-2" : "px-3")}>
        {!collapsed && <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Foundation</p>}
        {VENTURE_NAV.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Tip key={item.key} content={item.label} disabled={!collapsed}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex min-h-11 items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "px-3",
                  active ? "bg-[#0f0fbd]/[0.07] font-semibold text-[#0f0fbd]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#ff6b00]" aria-hidden />}
                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            </Tip>
          );
        })}
      </nav>

      {/* Founder profile */}
      {owner && (
        <div className={cn("border-t border-slate-100 p-3", collapsed && "flex justify-center")}>
          <Tip content={`${owner.name} · Founder`} disabled={!collapsed}>
            <div className={cn("flex items-center gap-3 rounded-xl", !collapsed && "bg-slate-50 p-2.5")}>
              <Avatar name={owner.name} />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{owner.name}</p>
                  <p className="truncate text-xs text-slate-600">Founder · {activeVenture?.name}</p>
                </div>
              )}
            </div>
          </Tip>
        </div>
      )}
    </>
  );
}

export default function VentureSidebar({ collapsed, onToggleCollapsed, mobileOpen, onMobileOpenChange }: SidebarProps) {
  return (
    <>
      {/* Desktop / tablet-landscape rail */}
      <aside
        className={cn(
          "sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center border-b border-slate-100", collapsed ? "justify-center px-2" : "justify-between px-4")}>
          {!collapsed && <Brand collapsed={false} />}
          <IconButton label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggleCollapsed} aria-expanded={!collapsed}>
            {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </IconButton>
        </div>
        <SidebarBody collapsed={collapsed} />
      </aside>

      {/* Mobile / tablet drawer */}
      <Dialog.Root open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="vl-fade-in fixed inset-0 z-[80] bg-slate-900/40 lg:hidden" />
          <Dialog.Content className="vl-slide-in-left fixed inset-y-0 left-0 z-[81] flex w-[288px] max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden">
            <Dialog.Title className="sr-only">VentureLab navigation</Dialog.Title>
            <Dialog.Description className="sr-only">Switch between VentureLab modules or return to StrideNex.</Dialog.Description>
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
              <Brand collapsed={false} />
              <Dialog.Close asChild>
                <IconButton label="Close menu">
                  <X className="h-5 w-5" />
                </IconButton>
              </Dialog.Close>
            </div>
            <SidebarBody collapsed={false} onNavigate={() => onMobileOpenChange(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
