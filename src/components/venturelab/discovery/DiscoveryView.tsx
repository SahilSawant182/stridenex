"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, BookOpen, Check, Loader2 } from "lucide-react";
import type { BmcBlockId } from "@/types/venturelab";
import { discoveryStoryService, type CanvasItemPayload } from "@/services/discoveryStory.services";
import { REVEAL_FLAG_KEY, bmcBlockIdByName } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useVentureLab } from "../VentureLabProvider";
import { Card, EmptyState, PageHeader, VLButton } from "../shared/primitives";
import LiveCanvasPreview from "./LiveCanvasPreview";
import DiscoveryWizard, { reachableStep, summaryStep } from "./DiscoveryWizard";
import { errMsg, isAnswered, useDiscoveryStory } from "./useDiscoveryStory";

export default function DiscoveryView() {
  const { activeVenture } = useVentureLab();
  if (!activeVenture) return null;
  // Keyed so switching ventures loads that venture's own story.
  return <DiscoveryBody key={activeVenture.id} ventureId={activeVenture.id} ventureName={activeVenture.name} />;
}

function DiscoveryBody({ ventureId, ventureName }: { ventureId: string; ventureName: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const story = useDiscoveryStory(ventureId);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const header = (actions?: React.ReactNode) => (
    <PageHeader
      title="Discover Your Startup Idea"
      subtitle="Turn a raw thought into a Business Model Canvas — one chapter of your story at a time."
      actions={actions}
    />
  );

  if (story.loading) {
    return (
      <div className="space-y-6">
        {header()}
        <div className="flex h-64 items-center justify-center text-slate-500" role="status">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden /> Loading your story…
        </div>
      </div>
    );
  }

  if (story.error) {
    return (
      <div className="space-y-6">
        {header()}
        <EmptyState
          icon={<AlertTriangle className="h-7 w-7" />}
          title="Couldn’t load Idea Discovery"
          body={story.error}
          action={
            <VLButton variant="accent" onClick={story.retry}>
              Try again
            </VLButton>
          }
        />
      </div>
    );
  }

  if (story.chapters.length === 0) {
    return (
      <div className="space-y-6">
        {header()}
        <EmptyState icon={<BookOpen className="h-7 w-7" />} title="No story chapters yet" body="Discovery chapters haven’t been set up. Please check back soon." />
      </div>
    );
  }

  const last = summaryStep(story.chapters);
  const reach = reachableStep(story);
  const started = story.answeredCount > 0;

  const chapterForBlock = (id: BmcBlockId) => story.chapters.findIndex((ch) => bmcBlockIdByName(ch.mapped_bmc_block) === id);
  const itemCounts: Partial<Record<BmcBlockId, number>> = {};
  const coveredBlocks = new Set<BmcBlockId>();
  for (const ch of story.chapters) {
    const id = bmcBlockIdByName(ch.mapped_bmc_block);
    if (!id) continue;
    coveredBlocks.add(id);
    itemCounts[id] = (itemCounts[id] ?? 0) + story.draftOf(ch).points.length;
  }
  const focusBlock = open && step < last ? bmcBlockIdByName(story.chapters[step].mapped_bmc_block) : null;

  const openAt = (s: number) => {
    setStep(Math.min(s, reach));
    setOpen(true);
  };

  const generate = async () => {
    setGenerating(true);
    try {
      // Every answer point becomes its own canvas item.
      const items: CanvasItemPayload[] = story.chapters.flatMap((ch) =>
        story.draftOf(ch).points.map((point) => ({
          block_name: ch.mapped_bmc_block,
          bmc_block: ch.mapped_bmc_block,
          item_text: point,
          description: "Generated from Idea Discovery",
          is_assumption: 1, // untested until customers confirm it
        })),
      );
      await discoveryStoryService.createCanvas(ventureId, items);

      // Store the latest answers (always marked synced_to_canvas = 1). The canvas
      // already exists, so a failure here is reported but not fatal.
      try {
        await story.save();
      } catch (e) {
        showToast(`Canvas created, but your answers weren’t saved: ${errMsg(e)}`, "error");
      }

      try {
        window.sessionStorage.setItem(REVEAL_FLAG_KEY, "1");
      } catch {
        /* the reveal animation is a nicety */
      }
      showToast("Business Model Canvas generated successfully!", "success");
      setOpen(false);
      router.push("/venturelab/canvas");
    } catch (e) {
      showToast(`Couldn’t generate the canvas: ${errMsg(e)}`, "error");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {header(
        <VLButton variant="accent" onClick={() => openAt(started ? reach : 0)}>
          {started ? "Continue discovery" : "Start guided discovery"} <ArrowRight className="h-4 w-4" aria-hidden />
        </VLButton>,
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your guided path</h2>
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-[#c2410c] ring-1 ring-inset ring-orange-200">{story.clarity}% clarity</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {story.chapters.length} short chapters take you from a raw thought to a complete story.
          </p>
          <ol className="mt-3">
            {Array.from({ length: last + 1 }, (_, s) => {
              const ch = story.chapters[s];
              const done = ch ? isAnswered(story.draftOf(ch)) : false;
              const locked = s > reach;
              return (
                <li key={ch?.name ?? "summary"}>
                  <button
                    onClick={() => openAt(s)}
                    disabled={locked}
                    className="flex min-h-11 w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent"
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        done ? "bg-emerald-600 text-white" : s === reach ? "bg-[#ff6b00] text-white" : "bg-slate-200 text-slate-700",
                      )}
                    >
                      {done ? <Check className="h-4 w-4" aria-hidden /> : ch ? s + 1 : "★"}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-900">
                      {ch ? (
                        <>
                          <strong>Chapter {s + 1}</strong> · {ch.title}
                        </>
                      ) : (
                        <>
                          <strong>Finish</strong> · Your startup story
                        </>
                      )}
                    </span>
                    {ch && story.draftOf(ch).points.length > 0 && <span className="text-xs tabular-nums text-slate-500">{story.draftOf(ch).points.length}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>

        <LiveCanvasPreview
          itemCounts={itemCounts}
          coveredBlocks={coveredBlocks}
          clarity={story.clarity}
          answeredCount={story.answeredCount}
          totalCount={story.chapters.length}
          focusBlock={focusBlock}
          onSelectBlock={(id) => {
            const i = chapterForBlock(id);
            if (i >= 0) openAt(i);
          }}
        />
      </div>

      <DiscoveryWizard
        story={story}
        ventureName={ventureName}
        open={open}
        step={step}
        onStepChange={setStep}
        onClose={() => setOpen(false)}
        onGenerate={() => void generate()}
        generating={generating}
      />
    </div>
  );
}
