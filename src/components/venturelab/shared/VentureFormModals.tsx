"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket } from "lucide-react";
import type { Venture } from "@/types/venturelab";
import { useIndustrySectors } from "./useIndustrySectors";
import { useVentureLab } from "../VentureLabProvider";
import { FieldLabel, Modal, VLButton, inputClass } from "./primitives";
import { useToast } from "@/context/ToastContext";


export function CreateVentureModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { createVenture } = useVentureLab();
  const { showToast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const sectorsState = useIndustrySectors();
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setName("");
    setSector("");
    setDescription("");
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await createVenture({ name: name.trim(), sector, description: description.trim() });
      showToast(`${name.trim()} created. Let’s discover the idea.`, "success");
      reset();
      onOpenChange(false);
      router.push("/venturelab/discovery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the venture.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title="Create a new venture"
      description="Give it a working name — you can change everything later."
      footer={
        <>
          <VLButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </VLButton>
          <VLButton type="submit" form="vl-create-venture" variant="accent" disabled={!name.trim() || saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Rocket className="h-4 w-4" aria-hidden />} {saving ? "Creating…" : "Create venture"}
          </VLButton>
        </>
      }
    >
      <form id="vl-create-venture" onSubmit={submit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="vl-venture-name">Venture name</FieldLabel>
          <input
            id="vl-venture-name"
            autoFocus
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="e.g. DairyConnect"
          />
        </div>
        <div>
          <FieldLabel htmlFor="vl-venture-sector">Industry sector</FieldLabel>
          <select id="vl-venture-sector" value={sector} onChange={(e) => setSector(e.target.value)} onFocus={sectorsState.ensureLoaded} onMouseDown={sectorsState.ensureLoaded} className={inputClass}>
            <option value="">{sectorsState.loading ? "Loading sectors…" : "Select a sector"}</option>
            {sectorsState.sectors.map((s) => (
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
        <div>
          <FieldLabel htmlFor="vl-venture-desc">Tagline (optional)</FieldLabel>
          <textarea
            id="vl-venture-desc"
            rows={3}
            maxLength={180}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} py-2.5`}
            placeholder="What does it do, and for whom?"
          />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

export function EditVentureModal({
  venture,
  onOpenChange,
}: {
  venture: Venture | null;
  onOpenChange: (o: boolean) => void;
}) {
  const { editVenture } = useVentureLab();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const sectorsState = useIndustrySectors();
  const [description, setDescription] = useState("");
  const [prevId, setPrevId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load the venture's current values whenever a different one is opened.
  if ((venture?.id ?? null) !== prevId) {
    setPrevId(venture?.id ?? null);
    if (venture) {
      setName(venture.name);
      setSector(venture.sector);
      setDescription(venture.description);
      setError(null);
    }
  }

  // Keep a venture's current sector selectable even if it isn't in the loaded list.
  const sectors = venture?.sector && !sectorsState.sectors.includes(venture.sector) ? [venture.sector, ...sectorsState.sectors] : sectorsState.sectors;
  const unchanged = !!venture && name.trim() === venture.name && sector === venture.sector && description.trim() === venture.description;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venture || !name.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      await editVenture(venture.id, { name: name.trim(), sector, description: description.trim() });
      showToast("Venture updated", "success");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the venture.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={venture !== null}
      onOpenChange={onOpenChange}
      title="Edit venture"
      footer={
        <>
          <VLButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </VLButton>
          <VLButton type="submit" form="vl-edit-venture" disabled={!name.trim() || unchanged || saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} {saving ? "Saving…" : "Save changes"}
          </VLButton>
        </>
      }
    >
      <form id="vl-edit-venture" onSubmit={submit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="vl-edit-name">Venture name</FieldLabel>
          <input id="vl-edit-name" autoFocus maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <FieldLabel htmlFor="vl-edit-sector">Industry sector</FieldLabel>
          <select id="vl-edit-sector" value={sector} onChange={(e) => setSector(e.target.value)} onFocus={sectorsState.ensureLoaded} onMouseDown={sectorsState.ensureLoaded} className={inputClass}>
            <option value="">{sectorsState.loading ? "Loading sectors…" : "Select a sector"}</option>
            {sectors.map((x) => (
              <option key={x}>{x}</option>
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
        <div>
          <FieldLabel htmlFor="vl-edit-desc">Tagline</FieldLabel>
          <textarea id="vl-edit-desc" rows={3} maxLength={180} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} py-2.5`} />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
