"use client";

import { Check, ChevronDown, Trash2 } from "lucide-react";
import { MEMBER_CATEGORIES, type MemberCategory, type TeamMember } from "@/types/venturelab";
import { CATEGORY_BADGE } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Dropdown, DropdownContent, DropdownItem, DropdownLabel, DropdownTrigger, IconButton } from "../shared/primitives";

export interface TeamTableHandlers {
  onPermission: (m: TeamMember, perm: "read" | "write", value: boolean) => void;
  onCategory: (m: TeamMember, c: MemberCategory) => void;
  onRemove: (m: TeamMember) => void;
}

/** 44×44 hit area around a 24px custom checkbox. Owners are locked to full access. */
function PermissionToggle({
  member,
  perm,
  checked,
  onChange,
}: {
  member: TeamMember;
  perm: "read" | "write";
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const label = `${perm === "read" ? "Read" : "Write"} access for ${member.name}`;
  return (
    <label
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-lg",
        member.isOwner ? "cursor-not-allowed" : "cursor-pointer hover:bg-slate-100",
      )}
      title={member.isOwner ? "Admin always has full access" : label}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={member.isOwner}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <span
        aria-hidden
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-[#0f0fbd] peer-focus-visible:ring-offset-2",
          checked ? "border-[#2e2ed9] bg-[#2e2ed9] text-white" : "border-slate-300 bg-white",
          member.isOwner && "opacity-50",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
    </label>
  );
}

function CategoryCell({ member, onCategory }: { member: TeamMember; onCategory: TeamTableHandlers["onCategory"] }) {
  if (member.isOwner) return <Badge className={CATEGORY_BADGE.Founder}>Owner</Badge>;
  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <button
          aria-label={`Role category for ${member.name}: ${member.category}. Change category`}
          className="group inline-flex min-h-11 items-center gap-1 rounded-lg px-1 hover:bg-slate-50"
        >
          <Badge className={CATEGORY_BADGE[member.category]}>{member.category}</Badge>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
        </button>
      </DropdownTrigger>
      <DropdownContent align="start">
        <DropdownLabel>Role category</DropdownLabel>
        {MEMBER_CATEGORIES.filter((c) => c !== "Founder").map((c) => (
          <DropdownItem key={c} onSelect={() => onCategory(member, c)}>
            <span className="flex-1">{c}</span>
            {c === member.category && <Check className="h-4 w-4 text-[#0f0fbd]" aria-label="Current" />}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

function StatusBadge({ status }: { status: TeamMember["status"] }) {
  return status === "Active" ? (
    <Badge className="bg-emerald-50 text-emerald-800 ring-emerald-200">Active</Badge>
  ) : (
    <Badge className="bg-amber-50 text-amber-800 ring-amber-200">Invited</Badge>
  );
}

function Identity({ m }: { m: TeamMember }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={m.name} />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-slate-900">
          <span className="truncate">{m.name}</span>
          {m.isOwner && <Badge className="bg-orange-50 text-orange-800 ring-orange-200">Admin</Badge>}
        </p>
        <p className="truncate text-xs text-slate-500">{m.email}</p>
      </div>
    </div>
  );
}

export default function TeamMemberTable({ members, ...h }: { members: TeamMember[] } & TeamTableHandlers) {
  return (
    <>
      {/* Tablet & desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <caption className="sr-only">Venture collaborators and their access</caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600">
              <th scope="col" className="px-5 py-3">Collaborator</th>
              <th scope="col" className="px-3 py-3">Category</th>
              <th scope="col" className="px-3 py-3">Status</th>
              <th scope="col" className="px-3 py-3 text-center">
                Read
                <span className="block text-[10px] font-medium normal-case tracking-normal text-slate-500">View content</span>
              </th>
              <th scope="col" className="px-3 py-3 text-center">
                Write
                <span className="block text-[10px] font-medium normal-case tracking-normal text-slate-500">Add &amp; edit</span>
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/60">
                <td className="max-w-[320px] px-5 py-3">
                  <Identity m={m} />
                </td>
                <td className="px-3 py-3">
                  <CategoryCell member={m} onCategory={h.onCategory} />
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-3 py-2 text-center">
                  <PermissionToggle member={m} perm="read" checked={m.canRead} onChange={(v) => h.onPermission(m, "read", v)} />
                </td>
                <td className="px-3 py-2 text-center">
                  <PermissionToggle member={m} perm="write" checked={m.canWrite} onChange={(v) => h.onPermission(m, "write", v)} />
                </td>
                <td className="px-3 py-2 text-right">
                  {!m.isOwner && (
                    <IconButton label={`Remove ${m.name}`} tone="danger" onClick={() => h.onRemove(m)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {members.map((m) => (
          <li key={m.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <Identity m={m} />
              {!m.isOwner && (
                <IconButton label={`Remove ${m.name}`} tone="danger" onClick={() => h.onRemove(m)} className="-mr-2 -mt-2">
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryCell member={m} onCategory={h.onCategory} />
              <StatusBadge status={m.status} />
            </div>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
              <span className="flex items-center">
                <PermissionToggle member={m} perm="read" checked={m.canRead} onChange={(v) => h.onPermission(m, "read", v)} />
                Read
              </span>
              <span className="flex items-center">
                <PermissionToggle member={m} perm="write" checked={m.canWrite} onChange={(v) => h.onPermission(m, "write", v)} />
                Write
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
