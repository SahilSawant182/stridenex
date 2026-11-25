"use client";

import { useState } from "react";
import { Copy, Download, FileText, Printer } from "lucide-react";
import type { BmcBlockId, CanvasBlocks } from "@/types/venturelab";
import { BMC_BLOCKS, BMC_STORY_ORDER } from "@/lib/venturelab/constants";
import { canvasToText } from "@/lib/venturelab/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { Modal, VLButton } from "../shared/primitives";

type Format = "text" | "pdf";

const BLOCK_NAMES = Object.fromEntries(BMC_STORY_ORDER.map((id) => [id, BMC_BLOCKS[id].name])) as Record<BmcBlockId, string>;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Printable A4-landscape canvas. The browser's print dialog handles "Save as PDF". */
function printableHtml(name: string, version: string, blocks: CanvasBlocks) {
  const cell = (id: BmcBlockId) => `
    <section style="grid-area:${id}">
      <h3><span>${BMC_BLOCKS[id].number}</span>${escapeHtml(BMC_BLOCKS[id].name)}</h3>
      <ul>${blocks[id].map((i) => `<li>${escapeHtml(i.text)}${i.isAssumption ? ' <em>(assumption)</em>' : ""}</li>`).join("")}</ul>
    </section>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(name)} — Business Model Canvas</title>
  <style>
    @page { size: A4 landscape; margin: 10mm; }
    * { box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; color: #0f172a; margin: 0; }
    header { display:flex; justify-content:space-between; align-items:baseline; border-bottom: 3px solid #0f0fbd; padding-bottom: 6px; margin-bottom: 8px; }
    header h1 { font-size: 18px; margin: 0; } header p { margin: 0; font-size: 11px; color: #475569; }
    .grid { display:grid; gap:6px; grid-template-columns: repeat(10, 1fr); grid-template-rows: 1fr 1fr 0.7fr; height: 170mm;
      grid-template-areas: "kp kp ka ka vp vp cr cr cs cs" "kp kp kr kr vp vp ch ch cs cs" "co co co co co rs rs rs rs rs"; }
    section { border: 1px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; overflow: hidden; }
    h3 { font-size: 11px; margin: 0 0 4px; display:flex; gap:6px; align-items:center; }
    h3 span { background:#0f0fbd; color:#fff; border-radius: 4px; padding: 0 5px; font-size: 10px; }
    ul { margin: 0; padding-left: 14px; font-size: 10px; line-height: 1.35; } em { color: #b45309; }
    footer { margin-top: 6px; font-size: 9px; color:#64748b; text-align:right; }
  </style></head><body>
  <header><h1>${escapeHtml(name)} — Business Model Canvas</h1><p>${escapeHtml(version)} · ${new Date().toLocaleDateString()}</p></header>
  <div class="grid">${BMC_STORY_ORDER.map(cell).join("")}</div>
  <footer>Generated with StrideNex VentureLab</footer>
  <script>window.onload = () => { window.focus(); window.print(); };</script>
  </body></html>`;
}

export default function ExportCanvasModal({
  open,
  onOpenChange,
  ventureName,
  versionLabel,
  blocks,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  ventureName: string;
  versionLabel: string;
  blocks: CanvasBlocks;
}) {
  const { showToast } = useToast();
  const [format, setFormat] = useState<Format>("text");
  const text = canvasToText(`${ventureName} (${versionLabel})`, blocks, BLOCK_NAMES);
  const fileBase = `${ventureName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-bmc-${versionLabel}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Canvas copied to clipboard", "success");
    } catch {
      showToast("Couldn’t access the clipboard — use Download instead", "error");
    }
  };

  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Downloaded as text", "success");
  };

  const printPdf = () => {
    const w = window.open("", "_blank", "width=1100,height=800");
    if (!w) {
      showToast("Pop-up blocked — allow pop-ups to export as PDF", "warning");
      return;
    }
    w.document.write(printableHtml(ventureName, versionLabel, blocks));
    w.document.close();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Export canvas"
      description={`${ventureName} · ${versionLabel}`}
      size="lg"
      footer={
        format === "text" ? (
          <>
            <VLButton variant="outline" onClick={copy}>
              <Copy className="h-4 w-4" aria-hidden /> Copy text
            </VLButton>
            <VLButton onClick={download}>
              <Download className="h-4 w-4" aria-hidden /> Download .txt
            </VLButton>
          </>
        ) : (
          <VLButton onClick={printPdf}>
            <Printer className="h-4 w-4" aria-hidden /> Open print view
          </VLButton>
        )
      }
    >
      <div role="radiogroup" aria-label="Export format" className="mb-4 grid grid-cols-2 gap-3">
        {(
          [
            ["text", "Plain text", "Paste into docs, email or WhatsApp.", FileText],
            ["pdf", "PDF", "Print-ready A4 canvas — choose “Save as PDF”.", Printer],
          ] as const
        ).map(([key, label, hint, FIcon]) => (
          <button
            key={key}
            role="radio"
            aria-checked={format === key}
            onClick={() => setFormat(key)}
            className={cn(
              "flex min-h-11 items-start gap-3 rounded-xl border p-3 text-left transition-colors",
              format === key ? "border-[#0f0fbd] bg-blue-50/60 ring-1 ring-[#0f0fbd]" : "border-slate-200 hover:border-slate-300",
            )}
          >
            <FIcon className={cn("mt-0.5 h-5 w-5 shrink-0", format === key ? "text-[#0f0fbd]" : "text-slate-500")} aria-hidden />
            <span>
              <span className="block text-sm font-bold text-slate-900">{label}</span>
              <span className="block text-xs text-slate-600">{hint}</span>
            </span>
          </button>
        ))}
      </div>

      {format === "text" ? (
        <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-800">
          {text}
        </pre>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          A print-ready landscape canvas opens in a new window. In the print dialog, pick <strong>Save as PDF</strong> as the destination.
          Assumptions are marked so reviewers know what still needs testing.
        </div>
      )}
    </Modal>
  );
}
