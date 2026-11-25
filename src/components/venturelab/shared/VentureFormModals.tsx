"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { useVentureLab } from "../VentureLabProvider";
import { FieldLabel, Modal, VLButton, inputClass } from "./primitives";
import { useToast } from "@/context/ToastContext";

const SECTORS = ["AgriTech", "EdTech", "HealthTech", "FinTech", "CleanTech", "E-commerce", "Social Impact", "SaaS", "Other"];

export function CreateVentureModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { createVenture } = useVentureLab();
  const { showToast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [sector, setSector] = useState(SECTORS[0]);
  const [description, setDescription] = useState("");

  const reset = () => {
    setName("");
    setSector(SECTORS[0]);
    setDescription("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createVenture({ name: name.trim(), sector, description: description.trim() || "A new venture — start with Idea Discovery." });
    showToast(`${name.trim()} created. Let’s discover the idea.`, "success");
    reset();
    onOpenChange(false);
    router.push("/venturelab/discovery");
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
          <VLButton type="submit" form="vl-create-venture" variant="accent" disabled={!name.trim()}>
            <Rocket className="h-4 w-4" aria-hidden /> Create venture
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
          <FieldLabel htmlFor="vl-venture-sector">Sector</FieldLabel>
          <select id="vl-venture-sector" value={sector} onChange={(e) => setSector(e.target.value)} className={inputClass}>
            {SECTORS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="vl-venture-desc">One-line pitch (optional)</FieldLabel>
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
      </form>
    </Modal>
  );
}

export function RenameVentureModal({
  ventureId,
  currentName,
  onOpenChange,
}: {
  ventureId: string | null;
  currentName: string;
  onOpenChange: (o: boolean) => void;
}) {
  const { renameVenture } = useVentureLab();
  const { showToast } = useToast();
  const [name, setName] = useState(currentName);
  const [prevId, setPrevId] = useState(ventureId);

  // Reset the field whenever a different venture is opened.
  if (ventureId !== prevId) {
    setPrevId(ventureId);
    setName(currentName);
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventureId || !name.trim()) return;
    renameVenture(ventureId, name.trim());
    showToast("Venture renamed", "success");
    onOpenChange(false);
  };

  return (
    <Modal
      open={ventureId !== null}
      onOpenChange={onOpenChange}
      title="Rename venture"
      size="sm"
      footer={
        <>
          <VLButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </VLButton>
          <VLButton type="submit" form="vl-rename-venture" disabled={!name.trim() || name.trim() === currentName}>
            Save name
          </VLButton>
        </>
      }
    >
      <form id="vl-rename-venture" onSubmit={submit}>
        <FieldLabel htmlFor="vl-rename-input">Venture name</FieldLabel>
        <input id="vl-rename-input" autoFocus maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </form>
    </Modal>
  );
}
