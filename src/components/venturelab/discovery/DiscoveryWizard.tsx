"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Grid3x3, Info, Loader2, Sparkles, X } from "lucide-react";
import type { BmcBlockId, Venture } from "@/types/venturelab";
import { BMC_ACCENTS, BMC_BLOCKS, BMC_ICONS, BMC_STORY_ORDER, DISCOVERY_EXAMPLE } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import { IconButton, VLButton, inputClass } from "../shared/primitives";
import ChoiceChipSelector from "./ChoiceChipSelector";

export const LAST_STEP = 10;
export const MIN_RAW_CHARS = 10;
const RAW_STARTERS = ["People waste time on…", "It’s frustrating that…", "Small businesses struggle to…", "Students in my college can’t easily…"];

/** Step 0 = raw thought, 1–9 = BMC blocks in story order, 10 = full story. */
export const blockForStep = (step: number): BmcBlockId | null => (step >= 1 && step <= 9 ? BMC_STORY_ORDER[step - 1] : null);

export function stepTitle(step: number) {
  if (step === 0) return "Raw Thought";
  if (step === LAST_STEP) return "The Full Story";
  return BMC_BLOCKS[blockForStep(step)!].name;
}

export function isStepDone(v: Venture, s: number) {
  if (s === 0) return v.rawIdea.trim().length > MIN_RAW_CHARS;
  if (s === LAST_STEP) return BMC_STORY_ORDER.every((id) => v.canvas.blocks[id].length > 0);
  return v.canvas.blocks[blockForStep(s)!].length > 0;
}

/** Furthest step a founder may jump to: everything up to the first unanswered step. */
export function firstOpenStep(v: Venture) {
  return Array.from({ length: LAST_STEP }, (_, s) => s).find((s) => !isStepDone(v, s)) ?? LAST_STEP;
}

function joinList(v: Venture, id: BmcBlockId) {
  // The story reads best with the first two answers; the canvas holds the rest.
  const all = v.canvas.blocks[id];
  const items = all.slice(0, 2).map((i) => i.text);
  if (items.length === 0) return null;
  const base = items.length === 1 ? items[0] : `${items[0]} and ${items[1]}`;
  return all.length > 2 ? `${base} (+${all.length - 2} more)` : base;
}

function FullStory({ venture, onJump }: { venture: Venture; onJump: (step: number) => void }) {
  const part = (id: BmcBlockId) => {
    const text = joinList(venture, id);
    return text ? (
      <strong className="rounded bg-blue-50 px-1.5 font-semibold text-[#0f0fbd]">{text}</strong>
    ) : (
      <mark className="rounded bg-amber-100 px-1 text-amber-900">[{BMC_BLOCKS[id].shortName}?]</mark>
    );
  };
  const missing = BMC_STORY_ORDER.filter((id) => venture.canvas.blocks[id].length === 0);

  return (
    <div className="space-y-4">
      <div className="space-y-3 text-[15px] leading-8 text-slate-700">
        <p>
          <strong className="font-bold text-slate-900">{venture.name}</strong> started with{" "}
          {venture.rawIdea.trim() ? <em>“{venture.rawIdea.trim()}”</em> : <mark className="rounded bg-amber-100 px-1">[a raw thought?]</mark>}
        </p>
        <p>
          It serves {part("cs")} by offering {part("vp")}. Customers find it through {part("ch")} and stay through {part("cr")}.
        </p>
        <p>
          It earns via {part("rs")}. To deliver, the team relies on {part("kr")}, spends its time on {part("ka")}, and partners with{" "}
          {part("kp")}. The biggest costs: {part("co")}.
        </p>
      </div>
      {missing.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Fill the gaps to complete your story:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missing.map((id) => (
              <VLButton key={id} size="sm" variant="outline" onClick={() => onJump(BMC_STORY_ORDER.indexOf(id) + 1)}>
                {BMC_BLOCKS[id].name}
              </VLButton>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Every block has a first answer. Each one is still an assumption until customers confirm it — the canvas will flag what to test first.
        </p>
      )}
    </div>
  );
}

/**
 * Focused, one-question-at-a-time flow shown over a dimmed page (like turning pages of a book).
 */
export default function DiscoveryWizard({
  open,
  step,
  onStepChange,
  onClose,
  onBuild,
  building,
}: {
  open: boolean;
  step: number;
  onStepChange: (s: number) => void;
  onClose: () => void;
  onBuild: () => void;
  building: boolean;
}) {
  const { activeVenture, updateVenture, renameVenture, addCanvasItem, removeCanvasItem } = useVentureLab();
  const { showToast } = useToast();
  const [draft, setDraft] = useState("");
  const [dir, setDir] = useState<"fwd" | "back">("fwd");

  if (!activeVenture) return null;
  const v = activeVenture;
  const block = blockForStep(step);
  const meta = block ? BMC_BLOCKS[block] : null;
  const items = block ? v.canvas.blocks[block] : [];
  const reach = firstOpenStep(v);
  const canAdvance = isStepDone(v, step);
  const BlockIcon = block ? BMC_ICONS[block] : null;

  const goTo = (s: number) => {
    const next = Math.max(0, Math.min(LAST_STEP, s));
    setDir(next >= step ? "fwd" : "back");
    setDraft("");
    onStepChange(next);
  };

  const add = (text = draft) => {
    if (!block || !text.trim()) return;
    addCanvasItem(block, text);
    setDraft("");
  };

  const loadExample = () => {
    updateVenture(v.id, { rawIdea: DISCOVERY_EXAMPLE.rawIdea });
    BMC_STORY_ORDER.forEach((id) => DISCOVERY_EXAMPLE.blocks[id].forEach((t) => addCanvasItem(id, t)));
    showToast("Example loaded — turn the page to review each block", "success");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="vl-fade-in fixed inset-0 z-[80] bg-slate-900/65 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[81] flex flex-col items-center justify-center overflow-y-auto p-3 focus:outline-none sm:p-6"
        >
          <Dialog.Title className="sr-only">Idea Discovery — step {step} of {LAST_STEP}: {stepTitle(step)}</Dialog.Title>

          <Dialog.Close asChild>
            <IconButton label="Close discovery" className="fixed right-3 top-3 z-10 bg-white/15 text-white hover:bg-white/30 hover:text-white sm:right-5 sm:top-5">
              <X className="h-5 w-5" />
            </IconButton>
          </Dialog.Close>

          <div className="w-full max-w-[720px]">
            {/* Step dots */}
            <nav aria-label="Discovery steps" className="mb-1 flex justify-center gap-1.5">
              {Array.from({ length: LAST_STEP + 1 }, (_, s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => goTo(s)}
                  disabled={s > reach}
                  aria-current={s === step ? "step" : undefined}
                  aria-label={`Step ${s}: ${stepTitle(s)}${isStepDone(v, s) ? " (done)" : s > reach ? " (locked)" : ""}`}
                  className="group flex h-11 items-center disabled:cursor-not-allowed"
                >
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      s === step ? "w-8 bg-[#ff6b00] sm:w-11" : "w-4 sm:w-6",
                      s !== step && (isStepDone(v, s) ? "bg-emerald-400" : "bg-white/35 group-enabled:group-hover:bg-white/60"),
                    )}
                  />
                </button>
              ))}
            </nav>

            {/* The page */}
            <div
              key={step}
              className={cn(
                "max-h-[calc(100dvh-110px)] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8",
                dir === "fwd" ? "vl-page-fwd" : "vl-page-back",
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-[#c2410c] ring-1 ring-inset ring-orange-200">
                  {step === 0 ? "Step 0 · Raw thought" : step === LAST_STEP ? "Step 10 · Your story" : `Step ${step} of 9 · ${meta!.name}`}
                </span>
                {BlockIcon && block && (
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", BMC_ACCENTS[block].icon)}>
                    <BlockIcon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                {step === 0
                  ? "What’s the thought that won’t leave you alone?"
                  : step === LAST_STEP
                    ? `${v.name}: the story so far`
                    : meta!.wizardQuestion}
              </h2>
              <p className="mt-1.5 text-sm text-slate-600">
                {step === 0
                  ? "Describe a problem you noticed, or an opportunity you want to explore. Write it the way you’d tell a friend."
                  : step === LAST_STEP
                    ? "Read it out loud. If a sentence feels weak, jump back and sharpen that block."
                    : meta!.wizardHint}
              </p>

              {meta && (
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {meta.guidingQuestions.slice(0, 2).map((q) => (
                    <li key={q} className="flex gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-[#0f0fbd]" aria-hidden>
                        ?
                      </span>
                      {q}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 space-y-5">
                {step === 0 && (
                  <>
                    <div>
                      <label htmlFor="vl-dw-name" className="mb-1 block text-xs font-semibold text-slate-600">
                        Working title
                      </label>
                      <input
                        id="vl-dw-name"
                        value={v.name}
                        maxLength={60}
                        onChange={(e) => renameVenture(v.id, e.target.value)}
                        placeholder="e.g. DairyConnect"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="vl-dw-raw" className="mb-1 block text-xs font-semibold text-slate-600">
                        Your raw thought
                      </label>
                      <textarea
                        id="vl-dw-raw"
                        rows={5}
                        autoFocus
                        value={v.rawIdea}
                        onChange={(e) => updateVenture(v.id, { rawIdea: e.target.value })}
                        placeholder="Describe your idea, a problem you have noticed, or an opportunity you want to explore…"
                        className={cn(inputClass, "py-3 leading-relaxed")}
                      />
                    </div>
                    {!v.rawIdea.trim() && (
                      <ChoiceChipSelector label="Sentence starters" options={RAW_STARTERS} selected={[]} onPick={(s) => updateVenture(v.id, { rawIdea: s.replace("…", " ") })} />
                    )}
                    <VLButton variant="outline" size="sm" onClick={loadExample}>
                      <Sparkles className="h-4 w-4 text-[#ff6b00]" aria-hidden /> Load DairyConnect example
                    </VLButton>
                  </>
                )}

                {block && meta && (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        add();
                      }}
                      className="flex gap-2"
                    >
                      <label htmlFor="vl-dw-input" className="sr-only">
                        {meta.wizardQuestion}
                      </label>
                      <input
                        id="vl-dw-input"
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type an answer…"
                        maxLength={120}
                        autoComplete="off"
                        className={inputClass}
                      />
                      <VLButton type="submit" disabled={!draft.trim()}>
                        + Add
                      </VLButton>
                    </form>

                    <div aria-live="polite">
                      {items.length === 0 ? (
                        <p className="text-sm text-slate-500">No answers yet — add at least one to continue.</p>
                      ) : (
                        <ul className="flex flex-wrap gap-2" aria-label={`${meta.name} answers`}>
                          {items.map((it) => (
                            <li key={it.id} className="vl-fade-in inline-flex items-center rounded-full bg-blue-50 py-0.5 pl-3.5 pr-0.5 text-sm font-medium text-[#0f0fbd]">
                              {it.text}
                              <IconButton label={`Remove ${it.text}`} onClick={() => removeCanvasItem(block, it.id)} className="h-9 w-9 rounded-full text-[#0f0fbd]/70 hover:bg-white">
                                <X className="h-4 w-4" />
                              </IconButton>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <ChoiceChipSelector label="Suggestions — tap to add" options={meta.suggestions} selected={items.map((i) => i.text)} onPick={(s) => add(s)} />
                    <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
                      <Info className="mt-px h-4 w-4 shrink-0" aria-hidden />
                      Suggestions are starting points. Replace them with what you actually know, then validate with real customers.
                    </p>
                  </>
                )}

                {step === LAST_STEP && <FullStory venture={v} onJump={goTo} />}
              </div>

              {/* Footer */}
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <VLButton variant="outline" onClick={() => goTo(step - 1)} disabled={step === 0}>
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                </VLButton>
                <span className="hidden text-xs text-slate-500 sm:inline">
                  Page {step + 1} of {LAST_STEP + 1}
                </span>
                {step < LAST_STEP ? (
                  <VLButton onClick={() => goTo(step + 1)} disabled={!canAdvance}>
                    {step === 9 ? "See my story" : "Next"} <ArrowRight className="h-4 w-4" aria-hidden />
                  </VLButton>
                ) : (
                  <VLButton variant="accent" onClick={onBuild} disabled={building}>
                    {building ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Grid3x3 className="h-4 w-4" aria-hidden />}
                    {building ? "Assembling…" : "Build canvas"}
                  </VLButton>
                )}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
