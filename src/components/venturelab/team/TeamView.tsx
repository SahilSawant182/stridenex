"use client";

import { useState } from "react";
import { Eye, MailPlus, PenLine, Plus, UserCheck, Users } from "lucide-react";
import type { TeamMember } from "@/types/venturelab";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import { Card, Modal, PageHeader, VLButton } from "../shared/primitives";
import MetricKpiCard from "../overview/MetricKpiCard";
import TeamMemberTable from "./TeamMemberTable";
import InviteMemberModal from "./InviteMemberModal";

export default function TeamView() {
  const { activeVenture, inviteMember, setPermission, setMemberCategory, removeMember } = useVentureLab();
  const { showToast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removing, setRemoving] = useState<TeamMember | null>(null);

  if (!activeVenture) return null;
  const team = activeVenture.team;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team & Collaboration"
        subtitle={`Add collaborators to ${activeVenture.name} and choose whether each person can read or also write.`}
        actions={
          <VLButton onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden /> Invite Collaborator
          </VLButton>
        }
      />

      <section aria-label="Team metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricKpiCard label="Total Members" value={team.length} hint="You are Admin" icon={Users} tone="blue" />
        <MetricKpiCard label="Active Members" value={team.filter((m) => m.status === "Active").length} icon={UserCheck} tone="green" />
        <MetricKpiCard label="Pending Invites" value={team.filter((m) => m.status === "Invited").length} icon={MailPlus} tone="orange" />
        <MetricKpiCard label="Write Access" value={team.filter((m) => m.canWrite).length} hint="Read & write" icon={PenLine} tone="violet" />
      </section>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">Members &amp; collaborators</h2>
          <p className="text-xs text-slate-500">Only the admin can change access</p>
        </div>
        <TeamMemberTable
          members={team}
          onPermission={(m, perm, value) => {
            setPermission(m.id, perm, value);
            const label = perm === "write" ? "Write" : "Read";
            showToast(`${label} access ${value ? "given to" : "removed for"} ${m.name}`, value ? "success" : "info");
          }}
          onCategory={(m, c) => {
            setMemberCategory(m.id, c);
            showToast(`${m.name} is now ${c}`, "success");
          }}
          onRemove={setRemoving}
        />
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-base font-bold text-slate-900">Access levels</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0f0fbd]">
              <Eye className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">Read:</strong> can view everything in the venture but cannot change it.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <PenLine className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-sm text-slate-700">
              <strong className="text-slate-900">Write:</strong> can add and edit content. Includes read access.
            </p>
          </div>
        </div>
      </Card>

      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        existingEmails={team.map((m) => m.email.toLowerCase())}
        onInvite={(input) => {
          inviteMember(input);
          setInviteOpen(false);
          showToast(`Invitation sent to ${input.email}`, "success");
        }}
      />

      <Modal
        open={removing !== null}
        onOpenChange={(o) => !o && setRemoving(null)}
        size="sm"
        title="Remove collaborator?"
        description={removing ? `${removing.name} will lose access to ${activeVenture.name}. Their tasks become unassigned.` : undefined}
        footer={
          <>
            <VLButton variant="outline" onClick={() => setRemoving(null)}>
              Cancel
            </VLButton>
            <VLButton
              variant="danger"
              onClick={() => {
                if (removing) {
                  removeMember(removing.id);
                  showToast(`${removing.name} removed from the venture`, "info");
                }
                setRemoving(null);
              }}
            >
              Remove
            </VLButton>
          </>
        }
      >
        <p className="text-sm text-slate-600">You can invite them again later.</p>
      </Modal>
    </div>
  );
}
