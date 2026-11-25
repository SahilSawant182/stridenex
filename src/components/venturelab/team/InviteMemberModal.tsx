"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { MEMBER_CATEGORIES, type MemberCategory } from "@/types/venturelab";
import { CATEGORY_HINT } from "@/lib/venturelab/constants";
import { FieldLabel, Modal, VLButton, inputClass } from "../shared/primitives";

const INVITABLE = MEMBER_CATEGORIES.filter((c) => c !== "Founder");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface InviteInput {
  name: string;
  email: string;
  category: MemberCategory;
  canRead: boolean;
  canWrite: boolean;
}

export default function InviteMemberModal({
  open,
  onOpenChange,
  existingEmails,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  existingEmails: string[];
  onInvite: (input: InviteInput) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<MemberCategory>("Co-founder");
  const [canRead, setCanRead] = useState(true);
  const [canWrite, setCanWrite] = useState(true);
  const [touched, setTouched] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setCategory("Co-founder");
    setCanRead(true);
    setCanWrite(true);
    setTouched(false);
  };

  const emailTaken = existingEmails.includes(email.trim().toLowerCase());
  const emailError = !email.trim() ? "Email is required" : !EMAIL_RE.test(email.trim()) ? "Enter a valid email" : emailTaken ? "This person is already on the team" : null;
  const nameError = !name.trim() ? "Full name is required" : null;

  // Advisors default to read-only (prototype behaviour); everyone else gets write.
  const pickCategory = (c: MemberCategory) => {
    setCategory(c);
    setCanRead(true);
    setCanWrite(c !== "Advisor / Mentor");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (nameError || emailError) return;
    onInvite({ name: name.trim(), email: email.trim(), category, canRead: canRead || canWrite, canWrite });
    reset();
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title="Invite a collaborator"
      description="They’ll get access to this venture based on the permissions you choose."
      footer={
        <>
          <VLButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </VLButton>
          <VLButton type="submit" form="vl-invite-form">
            <Send className="h-4 w-4" aria-hidden /> Send invitation
          </VLButton>
        </>
      }
    >
      <form id="vl-invite-form" onSubmit={submit} noValidate className="space-y-4">
        <div>
          <FieldLabel htmlFor="vl-inv-name">Full name</FieldLabel>
          <input
            id="vl-inv-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. Priya Deshmukh"
            aria-invalid={touched && !!nameError}
            aria-describedby={touched && nameError ? "vl-inv-name-err" : undefined}
          />
          {touched && nameError && (
            <p id="vl-inv-name-err" className="mt-1 text-sm text-red-600">
              {nameError}
            </p>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="vl-inv-email">Email</FieldLabel>
          <input
            id="vl-inv-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="name@college.edu"
            aria-invalid={touched && !!emailError}
            aria-describedby={touched && emailError ? "vl-inv-email-err" : undefined}
          />
          {touched && emailError && (
            <p id="vl-inv-email-err" className="mt-1 text-sm text-red-600">
              {emailError}
            </p>
          )}
        </div>
        <div>
          <FieldLabel htmlFor="vl-inv-cat">Role category</FieldLabel>
          <select id="vl-inv-cat" value={category} onChange={(e) => pickCategory(e.target.value as MemberCategory)} className={inputClass}>
            {INVITABLE.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-600">{CATEGORY_HINT[category]}</p>
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-semibold text-slate-800">Access</legend>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={canRead}
              onChange={(e) => {
                setCanRead(e.target.checked);
                if (!e.target.checked) setCanWrite(false);
              }}
              className="h-5 w-5 rounded border-slate-300 accent-[#2e2ed9]"
            />
            <span>
              <strong>Read</strong> <span className="text-slate-600">— can view everything but cannot change it</span>
            </span>
          </label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={canWrite}
              onChange={(e) => {
                setCanWrite(e.target.checked);
                if (e.target.checked) setCanRead(true);
              }}
              className="h-5 w-5 rounded border-slate-300 accent-[#2e2ed9]"
            />
            <span>
              <strong>Write</strong> <span className="text-slate-600">— can add and edit content (includes read)</span>
            </span>
          </label>
        </fieldset>
      </form>
    </Modal>
  );
}
