"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { ventureIdeaService, type IdeaFields, type VentureIdeaRecord } from "@/services/ventureIdea.services";
import { FieldLabel, Modal, VLButton, inputClass } from "../shared/primitives";
import { useIndustrySectors } from "../shared/useIndustrySectors";

const MIN_LEN = { problem_statement: 20, target_audience: 10, proposed_solution: 20 } as const;

const fieldsOf = (i: VentureIdeaRecord | null, defaultDomain = ""): IdeaFields =>
  i
    ? {
        domain_tag: i.domain_tag ?? "",
        problem_statement: i.problem_statement ?? "",
        target_audience: i.target_audience ?? "",
        proposed_solution: i.proposed_solution ?? "",
      }
    : { domain_tag: defaultDomain, problem_statement: "", target_audience: "", proposed_solution: "" };

const PILLARS: { key: keyof Omit<IdeaFields, "domain_tag">; label: string; placeholder: string }[] = [
  { key: "problem_statement", label: "Problem statement", placeholder: "What painful problem are you solving?" },
  { key: "target_audience", label: "Target audience", placeholder: "Who has this problem, specifically?" },
  { key: "proposed_solution", label: "Proposed solution", placeholder: "How will you solve it?" },
];

/** Create (idea = null) or edit the venture's idea. */
export default function IdeaFormModal({
  open,
  onOpenChange,
  ventureId,
  idea,
  defaultDomain = "",
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  ventureId: string;
  idea: VentureIdeaRecord | null;
  /** Pre-selected domain when drafting (the venture's own sector). */
  defaultDomain?: string;
  onSaved: () => void;
}) {
  const { showToast } = useToast();
  const sectorsState = useIndustrySectors();
  const [form, setForm] = useState<IdeaFields>(() => fieldsOf(idea, defaultDomain));
  const [wasOpen, setWasOpen] = useState(open);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-seed the form each time the dialog opens.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setForm(fieldsOf(idea, defaultDomain));
      setError(null);
    }
  }

  const editing = idea !== null;
  const set = (k: keyof IdeaFields, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const trimmed: IdeaFields = {
    domain_tag: form.domain_tag,
    problem_statement: form.problem_statement.trim(),
    target_audience: form.target_audience.trim(),
    proposed_solution: form.proposed_solution.trim(),
  };
  const short = (k: keyof typeof MIN_LEN) => trimmed[k].length < MIN_LEN[k];
  const complete = !short("problem_statement") && !short("target_audience") && !short("proposed_solution");
  const unchanged = editing && JSON.stringify(trimmed) === JSON.stringify(fieldsOf(idea));
  // Keep the saved domain selectable even if the loaded list doesn't include it.
  const sectors = form.domain_tag && !sectorsState.sectors.includes(form.domain_tag) ? [form.domain_tag, ...sectorsState.sectors] : sectorsState.sectors;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete || saving) return;
    setSaving(true);
    setError(null);
    try {
      if (idea) await ventureIdeaService.updateIdea(idea.name, trimmed);
      else await ventureIdeaService.createIdea({ venture: ventureId, ...trimmed });
      showToast(editing ? "Idea updated" : "Idea saved", "success");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the idea.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !saving && onOpenChange(o)}
      size="lg"
      title={editing ? "Edit idea" : "Draft your idea"}
      description={editing ? "Changing the problem, audience or solution sends the idea for approval again." : "Three short answers capture the core of your venture."}
      footer={
        <>
          <VLButton variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </VLButton>
          <VLButton type="submit" form="vl-idea-form" variant="accent" disabled={!complete || unchanged || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
            {saving ? "Saving…" : editing ? "Save changes" : "Save idea"}
          </VLButton>
        </>
      }
    >
      <form id="vl-idea-form" onSubmit={submit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="vl-idea-domain">Domain / sector</FieldLabel>
          <select
            id="vl-idea-domain"
            value={form.domain_tag}
            onChange={(e) => set("domain_tag", e.target.value)}
            onFocus={sectorsState.ensureLoaded}
            onMouseDown={sectorsState.ensureLoaded}
            className={inputClass}
          >
            <option value="">{sectorsState.loading ? "Loading domains…" : "Select a domain"}</option>
            {sectors.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {sectorsState.error && (
            <p className="mt-1 text-xs text-red-600">
              {sectorsState.error}{" "}
              <button type="button" onClick={sectorsState.retry} className="font-semibold underline">
                Retry
              </button>
            </p>
          )}
        </div>
        {PILLARS.map((p, i) => (
          <div key={p.key}>
            <FieldLabel htmlFor={`vl-idea-${p.key}`}>{p.label}</FieldLabel>
            <textarea
              id={`vl-idea-${p.key}`}
              autoFocus={i === 0}
              required
              rows={3}
              value={form[p.key]}
              onChange={(e) => set(p.key, e.target.value)}
              className={`${inputClass} py-2.5`}
              placeholder={p.placeholder}
              minLength={MIN_LEN[p.key]}
              aria-describedby={`vl-idea-${p.key}-hint`}
            />
            <p id={`vl-idea-${p.key}-hint`} className={`mt-1 text-xs ${form[p.key].trim() && short(p.key) ? "text-red-600" : "text-slate-500"}`}>
              Minimum {MIN_LEN[p.key]} characters · {form[p.key].trim().length} so far
            </p>
          </div>
        ))}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
