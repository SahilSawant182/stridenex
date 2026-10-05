"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowRight,
  Wand2,
  CheckCircle2,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";
import { searchCareerKnowledge, requestCustomCareer } from "@/services/student.services";
import { useToast } from "@/context/ToastContext";

interface CareerSuggestion {
  name: string;
  career_name?: string;
  path_name?: string;
  title?: string;
}

interface CustomCareerSearchProps {
  onSelectSuggestion?: (careerName: string) => void;
  onGenerationQueued?: (roleName: string) => void;
}

function useLoadingMessages(roleName: string) {
  const messages = [
    `🤖 Analyzing industry requirements for ${roleName}...`,
    `📊 Mapping skill hierarchies for ${roleName}...`,
    `🎯 Defining milestone roadmap for ${roleName}...`,
    `🔍 Cross-referencing market data for ${roleName}...`,
    `✨ Crafting your personalized path for ${roleName}...`,
    `⚙️ Finalizing AI-generated roadmap for ${roleName}...`,
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % messages.length), 2500);
    return () => clearInterval(t);
  }, [messages.length]);

  return messages[idx];
}

function GenerationLoadingScreen({ roleName }: { roleName: string }) {
  const message = useLoadingMessages(roleName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-center shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl" />
      </div>

      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-400 border-r-violet-400" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-blue-400"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
        <Sparkles className="h-7 w-7 animate-pulse text-indigo-300" />
      </div>

      <h3 className="mb-1 text-lg font-bold text-white">
        Generating <span className="text-indigo-300">{roleName}</span>
      </h3>
      <p className="mb-6 text-xs font-medium text-slate-400">
        Our AI is crafting a complete career roadmap — this takes 1–2 minutes.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="mx-auto max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-indigo-200 backdrop-blur-sm"
        >
          {message}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex animate-pulse items-center gap-3 rounded-lg bg-white/5 px-4 py-2.5"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div className="h-3 w-3 rounded-full bg-indigo-500/40" />
            <div className="h-2.5 flex-1 rounded bg-white/10" />
            <div
              className="h-2.5 rounded bg-white/10"
              style={{ width: `${40 + i * 10}px` }}
            />
          </div>
        ))}
      </div>

      <p className="mt-5 text-[11px] font-medium text-slate-500">
        You can safely navigate away — your path will be ready when you return.
      </p>
    </motion.div>
  );
}

export default function CustomCareerSearch({
  onSelectSuggestion,
  onGenerationQueued,
}: CustomCareerSearchProps) {
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CareerSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const [queuedRoleName, setQueuedRoleName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [noMatchFound, setNoMatchFound] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setNoMatchFound(false);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      setIsSearching(true);
      setInlineError("");
      try {
        const res = await searchCareerKnowledge(debouncedQuery);
        if (cancelled) return;
        const list: CareerSuggestion[] =
          res?.message?.careers ??
          res?.message ??
          (Array.isArray(res) ? res : []);
        setSuggestions(list);
        setNoMatchFound(list.length === 0);
        setShowDropdown(list.length > 0);
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setNoMatchFound(true);
          setShowDropdown(false);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectSuggestion = useCallback(
    (career: CareerSuggestion) => {
      const name = career.career_name ?? career.path_name ?? career.title ?? career.name;
      setShowDropdown(false);
      setQuery(name);
      onSelectSuggestion?.(name);
    },
    [onSelectSuggestion]
  );

  const handleGenerateCustom = useCallback(async () => {
    const role = query.trim();
    if (!role) {
      showToast("Please enter a career name to generate.", "warning");
      return;
    }
    setIsGenerating(true);
    setInlineError("");
    try {
      const res = await requestCustomCareer(role);
      const status = res?.message?.status ?? res?.status;
      if (status === "queued") {
        setIsQueued(true);
        setQueuedRoleName(role);
        onGenerationQueued?.(role);
      } else {
        showToast(res?.message?.message ?? "Unexpected response from server.", "warning");
      }
    } catch (err: any) {
      const msg: string =
        err?.message ??
        err?.response?.data?.message ??
        "Failed to generate career path.";
      setInlineError(msg);
      showToast(msg, "error");
    } finally {
      setIsGenerating(false);
    }
  }, [query, showToast, onGenerationQueued]);

  if (isQueued) {
    return <GenerationLoadingScreen roleName={queuedRoleName} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/80 p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm">
          <Wand2 className="h-4 w-4 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">
            Don&apos;t see your dream job?
          </h4>
          <p className="text-[11px] text-slate-400 font-medium">
            Search for it or let our AI generate a custom career path just for you.
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-400" />
            ) : (
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setInlineError("");
                setNoMatchFound(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerateCustom()}
              placeholder="Search your dream job... e.g. Robotics Engineer"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-700 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setNoMatchFound(false);
                  setInlineError("");
                  setShowDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={handleGenerateCustom}
            disabled={isGenerating || !query.trim()}
            className="group flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:from-violet-700 hover:to-indigo-700 hover:shadow-indigo-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
            )}
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>

        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-xl backdrop-blur-md"
            >
              <div className="px-3 pb-1 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Did you mean...
                </p>
              </div>
              <ul className="max-h-52 overflow-y-auto pb-2">
                {suggestions.map((career, idx) => {
                  const label = career.career_name ?? career.path_name ?? career.title ?? career.name;
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => handleSelectSuggestion(career)}
                        className="group flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-indigo-50/80"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400 transition-transform group-hover:scale-110" />
                        <span className="flex-1 text-sm font-semibold text-slate-700">
                          {label}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-slate-100 px-3 py-2">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleGenerateCustom();
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-violet-50"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-500" />
                  <span className="text-xs font-bold text-violet-600">
                    Generate exact match for &ldquo;{query}&rdquo;
                  </span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-violet-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {noMatchFound && debouncedQuery.length >= 2 && !showDropdown && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-700">
                  No existing paths matched &ldquo;{debouncedQuery}&rdquo;.
                </p>
                <p className="mt-0.5 text-[11px] text-amber-600 font-medium">
                  Click &ldquo;Generate&rdquo; to have our AI build a custom career path from scratch.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {inlineError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="flex-1 text-xs font-semibold text-red-700 leading-relaxed">
                {inlineError}
              </p>
              <button
                onClick={() => setInlineError("")}
                className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-[11px] text-slate-400 font-medium">
        <span className="font-bold text-slate-500">Tip:</span> Type at least 2 characters for fuzzy suggestions,
        or hit &ldquo;Generate&rdquo; to create an entirely new AI-crafted roadmap.
      </p>
    </motion.div>
  );
}
