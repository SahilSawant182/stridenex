"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Lightbulb, Loader2, Pencil, Plus, Target, Trash2, Users } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { ventureIdeaService } from "@/services/ventureIdea.services";
import { Badge, Card, Modal, VLButton } from "../shared/primitives";
import IdeaFormModal from "./IdeaFormModal";
import { errMsg, useVentureIdea } from "./useVentureIdea";

function Wrapper({ bare, children }: { bare: boolean; children: React.ReactNode }) {
  return bare ? <div>{children}</div> : <Card className="p-5">{children}</Card>;
}

/** The venture's idea (one per venture). Mount with `key={ventureId}` so it reloads when the venture changes. */
export default function IdeaPanel({ ventureId, bare = false }: { ventureId: string; bare?: boolean }) {
  const { showToast } = useToast();
  const state = useVentureIdea(ventureId);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [busy, setBusy] = useState(false);
  const reload = () => void state.reload();

  const confirmDelete = async () => {
    if (!state.idea) return;
    setBusy(true);
    try {
      await ventureIdeaService.deleteIdea(state.idea.name);
      state.clear();
      showToast("Idea deleted", "info");
      setDeleting(false);
    } catch (e) {
      showToast(errMsg(e), "error");
    } finally {
      setBusy(false);
    }
  };

  const { idea } = state;
  const approved = !!idea?.is_approved;

  return (
    <Wrapper bare={bare}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900">Your idea</h2>
        {idea && (
          <Badge className={approved ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200"}>
            {approved ? <CheckCircle2 className="h-3 w-3" aria-hidden /> : <Clock className="h-3 w-3" aria-hidden />}
            {approved ? "Approved" : "Awaiting approval"}
          </Badge>
        )}
      </div>

      {state.loading ? (
        <p className="mt-4 flex items-center text-sm text-slate-500" role="status">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> Loading idea…
        </p>
      ) : state.error ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">{state.error}</span>
          <VLButton size="sm" variant="outline" onClick={reload}>
            Try again
          </VLButton>
        </div>
      ) : !idea ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Lightbulb className="h-4 w-4 text-slate-400" aria-hidden /> No idea drafted for this venture yet.
          </p>
          <VLButton variant="accent" onClick={() => setFormOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden /> Draft Idea
          </VLButton>
        </div>
      ) : (
        <div className="mt-3 space-y-4">
          {idea.domain_tag && <Badge className="bg-slate-100 text-slate-700 ring-slate-200">{idea.domain_tag}</Badge>}
          <dl className="space-y-3">
            {[
              { icon: AlertTriangle, label: "Problem", text: idea.problem_statement },
              { icon: Users, label: "Target audience", text: idea.target_audience },
              { icon: Target, label: "Solution", text: idea.proposed_solution },
            ].map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0f0fbd]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                  <dd className="mt-0.5 whitespace-pre-line text-sm text-slate-800">{text || "—"}</dd>
                </div>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-2 pt-1">
            <VLButton variant="outline" onClick={() => setFormOpen(true)}>
              <Pencil className="h-4 w-4" aria-hidden /> Edit
            </VLButton>
            <VLButton variant="ghost" onClick={() => setDeleting(true)} className="text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </VLButton>
          </div>
        </div>
      )}

      <IdeaFormModal open={formOpen} onOpenChange={setFormOpen} ventureId={ventureId} idea={idea} onSaved={reload} />

      <Modal
        open={deleting}
        onOpenChange={(o) => !o && !busy && setDeleting(false)}
        size="sm"
        title="Delete idea?"
        description="This idea will be permanently deleted. You can draft a new one afterwards."
        footer={
          <>
            <VLButton variant="outline" onClick={() => setDeleting(false)} disabled={busy}>
              Cancel
            </VLButton>
            <VLButton variant="danger" onClick={() => void confirmDelete()} disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {busy ? "Deleting…" : "Delete"}
            </VLButton>
          </>
        }
      >
        <p className="text-sm text-slate-600">This can’t be undone.</p>
      </Modal>
    </Wrapper>
  );
}
