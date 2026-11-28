"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Grid3x3, Lightbulb, Loader2, Plus, Save, X } from "lucide-react";
import type { StoryChapter } from "@/services/discoveryStory.services";
import { parseChips } from "@/services/discoveryStory.services";
import type { BmcBlockId } from "@/types/venturelab";
import { BMC_ACCENTS, BMC_ICONS, bmcBlockIdByName } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { IconButton, VLButton, inputClass } from "../shared/primitives";
import ChoiceChipSelector from "./ChoiceChipSelector";
import { errMsg, isAnswered, type DiscoveryStory } from "./useDiscoveryStory";

/** Steps 0…n-1 are chapters; step n is the story summary. */
export const summaryStep = (chapters: StoryChapter[]) => chapters.length;

/** Every chapter needs at least one item before the next one opens. */
export const missingChapters = (story: DiscoveryStory) => story.chapters.filter((ch) => !isAnswered(story.draftOf(ch)));

/** Furthest step a founder may open: up to the first chapter with no items. */
export function reachableStep(story: DiscoveryStory) {
  const i = story.chapters.findIndex((ch) => !isAnswered(story.draftOf(ch)));
  return i === -1 ? story.chapters.length : i;
}

/** Join items into readable prose: "a", "a and b", "a, b and c". */
function listOf(items: string[]) {
  return items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** Story phrasing per block; chapters on other blocks get a generic sentence. */
const STORY_LINE: Partial<Record<BmcBlockId, (items: React.ReactNode) => React.ReactNode>> = {
  cs: (x) => <>It is built for {x}.</>,
  vp: (x) => <>It gives them {x}.</>,
  ch: (x) => <>Customers discover, buy and receive it through {x}.</>,
  cr: (x) => <>It earns their trust and keeps them through {x}.</>,
  rs: (x) => <>The business makes money from {x}.</>,
  kr: (x) => <>To deliver, it relies on {x},</>,
  ka: (x) => <>spends its days on {x},</>,
  kp: (x) => <>and works alongside {x}.</>,
  co: (x) => <>Its biggest costs are {x}.</>,
};

function StorySummary({ story, ventureName, onJump }: { story: DiscoveryStory; ventureName: string; onJump: (step: number) => void }) {
  const missing = missingChapters(story);
  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-8 text-slate-700">
        <strong className="font-bold text-slate-900">{ventureName}</strong>{" "}
        {story.chapters.map((ch, i) => {
          const items = story.draftOf(ch).points;
          const id = bmcBlockIdByName(ch.mapped_bmc_block);
          const part = items.length ? (
            <strong className="rounded bg-blue-50 px-1 font-semibold text-[#0f0fbd]">{listOf(items)}</strong>
          ) : (
            <button type="button" onClick={() => onJump(i)} className="rounded bg-amber-100 px-1 text-amber-900 underline-offset-2 hover:underline">
              [{ch.mapped_bmc_block}?]
            </button>
          );
          const line = id && STORY_LINE[id] ? STORY_LINE[id]!(part) : <>{ch.mapped_bmc_block}: {part}.</>;
          return <span key={ch.name}>{line} </span>;
        })}
      </p>
      {missing.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Fill the gaps to complete your story:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missing.map((ch) => (
              <VLButton key={ch.name} size="sm" variant="outline" onClick={() => onJump(story.chapters.indexOf(ch))}>
                {ch.mapped_bmc_block}
              </VLButton>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Your story is complete. Every item becomes a sticky note on your canvas — an assumption until customers confirm it.
        </p>
      )}
    </div>
  );
}

/**
 * Focused, one-chapter-at-a-time flow shown over a dimmed page (like turning
 * the pages of a book). Answers are saved to the backend on every page turn.
 */
export default function DiscoveryWizard({
  story,
  ventureName,
  open,
  step,
  onStepChange,
  onClose,
  onGenerate,
  generating,
}: {
  story: DiscoveryStory;
  ventureName: string;
  open: boolean;
  step: number;
  onStepChange: (s: number) => void;
  onClose: () => void;
  onGenerate: () => void;
  generating: boolean;
}) {
  const { showToast } = useToast();
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [input, setInput] = useState("");

  const last = summaryStep(story.chapters);
  const reach = reachableStep(story);
  const chapter = step < last ? story.chapters[step] : null;
  const draft = chapter ? story.draftOf(chapter) : null;
  const chips = chapter ? parseChips(chapter.default_choice_chips) : [];
  const blockId = chapter ? bmcBlockIdByName(chapter.mapped_bmc_block) : null;
  const BlockIcon = blockId ? BMC_ICONS[blockId] : null;
  const canAdvance = !chapter || isAnswered(draft ?? undefined);
  const busy = story.saving || generating;

  /** Save pending edits, then turn the page. Stays put if the save fails. */
  const goTo = async (s: number) => {
    const next = Math.max(0, Math.min(last, s));
    try {
      await story.save();
    } catch (e) {
      showToast(`Couldn’t save your answer: ${errMsg(e)}`, "error");
      return;
    }
    setDir(next >= step ? "fwd" : "back");
    setInput("");
    onStepChange(next);
  };

  const saveNow = async () => {
    try {
      await story.save({ force: true });
      showToast("Progress saved", "success");
    } catch (e) {
      showToast(`Couldn’t save: ${errMsg(e)}`, "error");
    }
  };

  /** Closing also saves; edits stay in memory if the save fails, so nothing is lost. */
  const close = async () => {
    try {
      await story.save();
    } catch (e) {
      showToast(`Couldn’t save your answer: ${errMsg(e)}`, "error");
    }
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && !busy && void close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="vl-fade-in fixed inset-0 z-[80] bg-slate-900/65 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[81] flex flex-col items-center justify-center overflow-y-auto p-3 focus:outline-none sm:p-6"
        >
          <Dialog.Title className="sr-only">
            Idea Discovery — {chapter ? `chapter ${step + 1}: ${chapter.title}` : "your startup story"}
          </Dialog.Title>

          <IconButton
            label="Close discovery"
            onClick={() => void close()}
            disabled={busy}
            className="fixed right-3 top-3 z-10 bg-white/15 text-white hover:bg-white/30 hover:text-white sm:right-5 sm:top-5"
          >
            <X className="h-5 w-5" />
          </IconButton>

          <div className="w-full max-w-[720px]">
            {/* Page dots */}
            {/* Wraps onto more rows and narrows the dots, so any number of chapters fits a phone. */}
            <nav aria-label="Discovery chapters" className={cn("mb-1 flex flex-wrap justify-center", last > 12 ? "gap-x-1" : "gap-x-1.5")}>
              {Array.from({ length: last + 1 }, (_, s) => {
                const ch = story.chapters[s];
                const done = ch ? isAnswered(story.draftOf(ch)) : false;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void goTo(s)}
                    disabled={s > reach || busy}
                    aria-current={s === step ? "step" : undefined}
                    aria-label={`${ch ? `Chapter ${s + 1}: ${ch.title}` : "Your startup story"}${done ? " (done)" : s > reach ? " (locked)" : ""}`}
                    className="group flex h-11 items-center disabled:cursor-not-allowed"
                  >
                    <span
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        s === step ? (last > 12 ? "w-6 bg-[#ff6b00] sm:w-8" : "w-8 bg-[#ff6b00] sm:w-11") : last > 12 ? "w-2.5 sm:w-4" : "w-4 sm:w-6",
                        s !== step && (done ? "bg-emerald-400" : "bg-white/35 group-enabled:group-hover:bg-white/60"),
                      )}
                    />
                  </button>
                );
              })}
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
                  {chapter ? `Chapter ${step + 1} of ${story.chapters.length} · ${chapter.mapped_bmc_block}` : "The end · Your startup story"}
                </span>
                {BlockIcon && blockId && (
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-md", BMC_ACCENTS[blockId].icon)}>
                    <BlockIcon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{chapter ? chapter.title : `${ventureName}: the story so far`}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {chapter ? chapter.mentor_prompt : "Read it out loud. If a chapter feels weak, jump back and sharpen it."}
              </p>

              <div className="mt-5 space-y-5">
                {chapter && draft && (
                  <>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        story.addPoint(chapter, input);
                        setInput("");
                      }}
                      className="flex gap-2"
                    >
                      <label htmlFor="vl-dw-input" className="sr-only">
                        Add an answer to: {chapter.title}
                      </label>
                      <input
                        id="vl-dw-input"
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type an item and press Enter or Add…"
                        maxLength={200}
                        autoComplete="off"
                        className={inputClass}
                      />
                      <VLButton type="submit" disabled={!input.trim()}>
                        <Plus className="h-4 w-4" aria-hidden /> Add
                      </VLButton>
                    </form>

                    <div aria-live="polite">
                      {draft.points.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No items yet — add at least one to continue.
                        </p>
                      ) : (
                        <ul className="flex flex-wrap gap-2" aria-label="Your items">
                          {draft.points.map((point, i) => (
                            <li key={point} className="vl-fade-in inline-flex max-w-full items-center rounded-full bg-blue-50 py-0.5 pl-3.5 pr-0.5 text-sm font-medium text-[#0f0fbd]">
                              <span className="min-w-0 break-words">{point}</span>
                              <IconButton label={`Remove ${point}`} onClick={() => story.removePoint(chapter, i)} className="h-9 w-9 shrink-0 rounded-full text-[#0f0fbd]/70 hover:bg-white">
                                <X className="h-4 w-4" />
                              </IconButton>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {chips.length > 0 && (
                      <ChoiceChipSelector
                        label="Suggestions — tap to add"
                        options={chips}
                        selected={draft.points}
                        onPick={(chip) => story.addPoint(chapter, chip)}
                      />
                    )}

                    {chapter.guidance_tip && (
                      <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
                        <Lightbulb className="mt-px h-4 w-4 shrink-0" aria-hidden />
                        {chapter.guidance_tip}
                      </p>
                    )}
                  </>
                )}

                {!chapter && <StorySummary story={story} ventureName={ventureName} onJump={(s) => void goTo(s)} />}
              </div>

              {/* Footer */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <VLButton variant="outline" onClick={() => void goTo(step - 1)} disabled={step === 0 || busy}>
                  <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                </VLButton>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500" aria-live="polite">
                    {story.saving ? (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Saving…
                      </span>
                    ) : story.dirty ? (
                      "Unsaved changes"
                    ) : (
                      <span className="hidden sm:inline">
                        Page {step + 1} of {last + 1}
                      </span>
                    )}
                  </span>
                  {chapter && (
                    <VLButton variant="ghost" size="sm" onClick={() => void saveNow()} disabled={busy}>
                      <Save className="h-4 w-4" aria-hidden /> Save progress
                    </VLButton>
                  )}
                </div>

                {chapter ? (
                  <VLButton onClick={() => void goTo(step + 1)} disabled={!canAdvance || busy}>
                    {step === last - 1 ? "See my story" : "Next chapter"} <ArrowRight className="h-4 w-4" aria-hidden />
                  </VLButton>
                ) : (
                  <VLButton variant="accent" onClick={onGenerate} disabled={busy || missingChapters(story).length > 0}>
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Grid3x3 className="h-4 w-4" aria-hidden />}
                    {generating ? "Building…" : "Finish & Build Business Model Canvas"}
                    {!generating && <ArrowRight className="h-4 w-4" aria-hidden />}
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
