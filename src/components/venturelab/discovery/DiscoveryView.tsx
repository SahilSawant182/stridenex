"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { BMC_STORY_ORDER, REVEAL_FLAG_KEY } from "@/lib/venturelab/constants";
import { cn } from "@/lib/utils";
import { useVentureLab } from "../VentureLabProvider";
import { Card, PageHeader, VLButton } from "../shared/primitives";
import LiveCanvasPreview from "./LiveCanvasPreview";
import DiscoveryWizard, { LAST_STEP, blockForStep, firstOpenStep, isStepDone, stepTitle } from "./DiscoveryWizard";

// The book state (raw thought + canvas answers) lives in the VentureLab store,
// which persists to localStorage, until the story-persistence API exists.
export default function DiscoveryView() {
  const router = useRouter();
  const { activeVenture } = useVentureLab();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState(false);

  if (!activeVenture) return null;
  const v = activeVenture;
  const filled = BMC_STORY_ORDER.filter((id) => v.canvas.blocks[id].length > 0).length;
  const clarity = Math.round(((v.rawIdea.trim().length > 10 ? 1 : 0) + filled) * 10);
  const reach = firstOpenStep(v);
  const started = clarity > 0;

  const openAt = (s: number) => {
    setStep(Math.min(s, reach));
    setOpen(true);
  };

  const build = () => {
    setBuilding(true);
    try {
      window.sessionStorage.setItem(REVEAL_FLAG_KEY, "1");
    } catch {
      /* reveal is a nicety */
    }
    setTimeout(() => router.push("/venturelab/canvas"), 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Your Startup Idea"
        subtitle="Turn a raw thought into a Business Model Canvas — one focused question at a time."
        actions={
          <VLButton variant="accent" onClick={() => openAt(started ? reach : 0)}>
            {started ? "Continue discovery" : "Start guided discovery"} <ArrowRight className="h-4 w-4" aria-hidden />
          </VLButton>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your guided path</h2>
            <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-[#c2410c] ring-1 ring-inset ring-orange-200">{clarity}% clarity</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">Eleven short pages take you from a raw thought to a complete canvas.</p>
          <ol className="mt-3">
            {Array.from({ length: LAST_STEP + 1 }, (_, s) => {
              const done = isStepDone(v, s);
              const locked = s > reach;
              return (
                <li key={s}>
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
                      {done ? <Check className="h-4 w-4" aria-hidden /> : s}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-900">
                      <strong>{s === 0 ? "Start" : s === LAST_STEP ? "Finish" : `Step ${s}`}</strong> · {stepTitle(s)}
                    </span>
                    {blockForStep(s) && <span className="text-xs tabular-nums text-slate-500">{v.canvas.blocks[blockForStep(s)!].length}</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </Card>

        <LiveCanvasPreview blocks={v.canvas.blocks} clarity={clarity} focusBlock={open ? blockForStep(step) : null} onSelectBlock={(id) => openAt(BMC_STORY_ORDER.indexOf(id) + 1)} />
      </div>

      <DiscoveryWizard open={open} step={step} onStepChange={setStep} onClose={() => setOpen(false)} onBuild={build} building={building} />
    </div>
  );
}
