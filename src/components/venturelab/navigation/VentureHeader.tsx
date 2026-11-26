"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  Grid3x3,
  ListChecks,
  LogOut,
  Menu,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BMC_BLOCKS, stageBadge, STRIDENEX_HOME, VENTURE_NAV } from "@/lib/venturelab/constants";
import { allTasks, activeRoadmap, initials } from "@/lib/venturelab/utils";
import type { BmcBlockId } from "@/types/venturelab";
import { useVentureLab } from "../VentureLabProvider";
import {
  Badge,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  IconButton,
} from "../shared/primitives";
import { CreateVentureModal } from "../shared/VentureFormModals";

interface SearchResult {
  key: string;
  label: string;
  sub: string;
  href: string;
  kind: "page" | "venture" | "canvas" | "task";
  ventureId?: string;
}

const KIND_ICON = { page: ChevronRight, venture: Folder, canvas: Grid3x3, task: ListChecks } as const;

function GlobalSearch({ className, autoFocus, onDone }: { className?: string; autoFocus?: boolean; onDone?: () => void }) {
  const { ventures, activeVenture, setActiveVenture } = useVentureLab();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo<SearchResult[]>(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const out: SearchResult[] = [];
    VENTURE_NAV.filter((n) => n.label.toLowerCase().includes(term)).forEach((n) =>
      out.push({ key: `p-${n.key}`, label: n.label, sub: "Go to module", href: n.href, kind: "page" }),
    );
    ventures
      .filter((v) => !v.archived && (v.name.toLowerCase().includes(term) || v.sector.toLowerCase().includes(term)))
      .forEach((v) => out.push({ key: `v-${v.id}`, label: v.name, sub: [v.sector, v.stage].filter(Boolean).join(" · "), href: "/venturelab/overview", kind: "venture", ventureId: v.id }));
    if (activeVenture) {
      (Object.keys(activeVenture.canvas.blocks) as BmcBlockId[]).forEach((b) =>
        activeVenture.canvas.blocks[b]
          .filter((i) => i.text.toLowerCase().includes(term))
          .forEach((i) => out.push({ key: `c-${i.id}`, label: i.text, sub: `Canvas · ${BMC_BLOCKS[b].name}`, href: "/venturelab/canvas", kind: "canvas" })),
      );
      allTasks(activeRoadmap(activeVenture))
        .filter((t) => t.title.toLowerCase().includes(term))
        .forEach((t) => out.push({ key: `t-${t.id}`, label: t.title, sub: `Task · ${t.status}`, href: "/venturelab/execution", kind: "task" }));
    }
    return out.slice(0, 8);
  }, [q, ventures, activeVenture]);

  const go = (r: SearchResult) => {
    if (r.ventureId) setActiveVenture(r.ventureId);
    router.push(r.href);
    setQ("");
    setOpen(false);
    onDone?.();
  };

  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
      <input
        type="search"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls="vl-search-results"
        aria-label="Search ventures, canvas items and tasks"
        autoFocus={autoFocus}
        value={q}
        placeholder="Search ventures, canvas, tasks…"
        onChange={(e) => {
          setQ(e.target.value);
          setHighlight(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => (blurTimer.current = setTimeout(() => setOpen(false), 150))}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(h + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(h - 1, 0));
          } else if (e.key === "Enter" && results[highlight]) {
            go(results[highlight]);
          } else if (e.key === "Escape") {
            setOpen(false);
            onDone?.();
          }
        }}
        className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0f0fbd] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0f0fbd]/20"
      />
      {open && q.trim().length >= 2 && (
        <div
          id="vl-search-results"
          role="listbox"
          className="vl-fade-in absolute right-0 top-full z-[70] mt-2 w-full min-w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">No matches for “{q.trim()}”</p>
          ) : (
            results.map((r, i) => {
              const Icon = KIND_ICON[r.kind];
              return (
                <button
                  key={r.key}
                  role="option"
                  aria-selected={i === highlight}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => go(r)}
                  className={cn("flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left", i === highlight && "bg-slate-50")}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">{r.label}</span>
                    <span className="block truncate text-xs text-slate-500">{r.sub}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function VentureSwitcher({ onCreate }: { onCreate: () => void }) {
  const { ready, ventures, activeVenture, setActiveVenture } = useVentureLab();
  const live = ventures.filter((v) => !v.archived);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          className="group flex min-h-11 w-full min-w-0 max-w-[220px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-left shadow-sm transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd] sm:max-w-[300px]"
          aria-label={`Active venture: ${activeVenture?.name ?? "none"}. Switch venture`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0f0fbd] to-[#2e2ed9] text-[11px] font-bold text-white">
            {activeVenture ? initials(activeVenture.name) : ready ? "?" : "…"}
          </span>
          <span className="min-w-0 truncate text-sm font-bold text-slate-900">{activeVenture?.name ?? (ready ? "No venture" : "Loading…")}</span>
          {activeVenture && <Badge className={cn("hidden lg:inline-flex", stageBadge(activeVenture.stage))}>{activeVenture.stage}</Badge>}
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
        </button>
      </DropdownTrigger>
      <DropdownContent align="center" className="w-[300px]">
        <DropdownLabel>Your ventures</DropdownLabel>
        {live.map((v) => (
          <DropdownItem key={v.id} onSelect={() => setActiveVenture(v.id)}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700">
              {initials(v.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-slate-900">{v.name}</span>
              <span className="block truncate text-xs text-slate-500">
                {[v.sector, v.stage].filter(Boolean).join(" · ")}
              </span>
            </span>
            {v.id === activeVenture?.id && <Check className="h-4 w-4 text-[#0f0fbd]" aria-label="Active" />}
          </DropdownItem>
        ))}
        <DropdownSeparator />
        <DropdownItem onSelect={onCreate} className="text-[#0f0fbd]">
          <Plus className="h-4 w-4" aria-hidden /> Create New Venture
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useVentureLab();
  const router = useRouter();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <IconButton label={unread ? `Notifications, ${unread} unread` : "Notifications"} className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff6b00] px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {unread}
            </span>
          )}
        </IconButton>
      </DropdownTrigger>
      <DropdownContent className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-bold text-slate-900">Notifications</p>
          {unread > 0 && (
            <button onClick={markAllNotificationsRead} className="min-h-11 text-xs font-semibold text-[#0f0fbd] hover:underline">
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-[360px] overflow-y-auto p-1.5">
          {notifications.length === 0 && <p className="px-4 py-8 text-center text-sm text-slate-500">You’re all caught up.</p>}
          {notifications.map((n) => (
            <DropdownItem
              key={n.id}
              onSelect={() => {
                markNotificationRead(n.id);
                if (n.href) router.push(n.href);
              }}
              className="items-start py-2.5"
            >
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-[#ff6b00]")} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm", n.read ? "text-slate-700" : "font-semibold text-slate-900")}>{n.title}</span>
                <span className="block text-xs text-slate-500">{n.body}</span>
                <span className="mt-0.5 block text-[11px] text-slate-400">{formatDistanceToNow(parseISO(n.createdAt), { addSuffix: true })}</span>
              </span>
            </DropdownItem>
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

function UserMenu() {
  const { activeVenture, refresh } = useVentureLab();
  const router = useRouter();
  const owner = activeVenture?.team.find((m) => m.isOwner);
  const name = owner?.name ?? "Founder";

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          aria-label={`Account menu for ${name}`}
          className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f0fbd]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b00] text-xs font-bold text-white ring-2 ring-orange-100">
            {initials(name)}
          </span>
        </button>
      </DropdownTrigger>
      <DropdownContent className="w-[240px]">
        <div className="px-3 py-2">
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="truncate text-xs text-slate-500">{owner?.email}</p>
        </div>
        <DropdownSeparator />
        <DropdownItem onSelect={() => void refresh()}>
          <RotateCcw className="h-4 w-4" aria-hidden /> Refresh ventures
        </DropdownItem>
        <DropdownItem onSelect={() => router.push(STRIDENEX_HOME)}>
          <LogOut className="h-4 w-4" aria-hidden /> Exit VentureLab
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
}

export default function VentureHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const [createOpen, setCreateOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const current = VENTURE_NAV.find((n) => pathname?.startsWith(n.href));

  return (
    <header className="vl-no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="flex h-16 items-center gap-2 px-3 sm:px-4 lg:px-6">
        {/* Left */}
        <div className="flex shrink-0 items-center gap-2 lg:min-w-0 lg:flex-1">
          <IconButton label="Open menu" className="lg:hidden" onClick={onOpenMobileNav}>
            <Menu className="h-5 w-5" />
          </IconButton>
          <Link
            href={STRIDENEX_HOME}
            aria-label="Back to StrideNex"
            className="group inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition-all hover:border-[#0f0fbd]/40 hover:text-[#0f0fbd] hover:shadow-[0_0_0_4px_rgba(15,15,189,0.08)]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span className="hidden md:inline">Back to StrideNex</span>
          </Link>
          <nav aria-label="Breadcrumb" className="hidden min-w-0 xl:block">
            <ol className="flex items-center gap-1.5 text-sm text-slate-500">
              <li>
                <Link href={STRIDENEX_HOME} className="hover:text-slate-900">
                  StrideNex
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/venturelab/overview" className="hover:text-slate-900">
                  VentureLab
                </Link>
              </li>
              {current && (
                <>
                  <li aria-hidden>/</li>
                  <li aria-current="page" className="truncate font-semibold text-slate-900">
                    {current.label}
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>

        {/* Center */}
        <div className="flex min-w-0 flex-1 justify-center lg:flex-none">
          <VentureSwitcher onCreate={() => setCreateOpen(true)} />
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center justify-end gap-1 lg:flex-1">
          <GlobalSearch className="hidden w-full max-w-[280px] lg:block" />
          <IconButton label="Search" className="lg:hidden" onClick={() => setMobileSearch((s) => !s)} aria-expanded={mobileSearch}>
            {mobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </IconButton>
          <Notifications />
          <div className="hidden sm:block">
            <UserMenu />
          </div>
        </div>
      </div>

      {mobileSearch && (
        <div className="border-t border-slate-100 px-3 py-2 lg:hidden">
          <GlobalSearch autoFocus onDone={() => setMobileSearch(false)} />
        </div>
      )}

      <CreateVentureModal open={createOpen} onOpenChange={setCreateOpen} />
    </header>
  );
}
