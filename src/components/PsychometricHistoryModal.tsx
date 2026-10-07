"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { psychometricApi, PsychometricHistoryItem } from "@/services/psychometricApi";

interface PsychometricHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentEmail?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Muted, cohesive palette — all at ~50-60% saturation, no harsh primaries
// ─────────────────────────────────────────────────────────────────────────────
const TRACK = {
    job:       { fill: "#6366F1", light: "#EEF2FF", text: "#4338CA", label: "Job"      , emoji: "💼" },
    startup:   { fill: "#F59E0B", light: "#FFFBEB", text: "#B45309", label: "Startup"  , emoji: "🚀" },
    higher_ed: { fill: "#14B8A6", light: "#F0FDFA", text: "#0F766E", label: "Higher Ed", emoji: "🎓" },
};
type TrackKey = keyof typeof TRACK;

function parseTags(pt?: string | null): TrackKey[] {
    const s = (pt || "").toLowerCase();
    const out: TrackKey[] = [];
    if (s.includes("job"))                             out.push("job");
    if (s.includes("entrepreneur"))                    out.push("startup");
    if (s.includes("higher") || s.includes("edu"))    out.push("higher_ed");
    return out;
}

function dominantKey(item: PsychometricHistoryItem): TrackKey | null {
    const scores: [TrackKey, number][] = [
        ["job",       item.job_score ?? 0],
        ["startup",   item.entrepreneurship_score ?? 0],
        ["higher_ed", item.higher_education_score ?? 0],
    ];
    const best = scores.reduce((a, b) => (b[1] > a[1] ? b : a));
    return best[1] > 0 ? best[0] : null;
}

function fmtDate(iso: string) {
    const d = new Date(iso.replace(" ", "T"));
    const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
    const rel = days === 0 ? "Today" : days === 1 ? "Yesterday"
        : days < 7 ? `${days}d ago` : days < 30 ? `${Math.floor(days / 7)}w ago` : `${Math.floor(days / 30)}mo ago`;
    return {
        date: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        rel,
    };
}

// ─── Animated bar ─────────────────────────────────────────────────────────────
function Bar({ val, fill, delay }: { val: number; fill: string; delay: number }) {
    const [w, setW] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setW(Math.min(100, Math.max(0, val))), 200 + delay);
        return () => clearTimeout(t);
    }, [val, delay]);
    return (
        <div style={{ background: "#F1F5F9" }} className="flex-1 rounded-full overflow-hidden" aria-hidden>
            <div
                style={{ width: `${w}%`, background: fill, height: 6, borderRadius: 99, transition: "width 0.65s cubic-bezier(.22,1,.36,1)" }}
            />
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function HistoryCard({ item, idx }: { item: PsychometricHistoryItem; idx: number }) {
    const dom      = dominantKey(item);
    const domTrack = dom ? TRACK[dom] : null;
    const tags     = parseTags(item.profile_type);
    const { date, time, rel } = fmtDate(item.creation);
    const pct      = Math.round(item.percentage ?? item.score ?? 0);
    const j        = item.job_score ?? 0;
    const e        = item.entrepreneurship_score ?? 0;
    const h        = item.higher_education_score ?? 0;
    const hasScores = j + e + h > 0;
    const base     = idx * 40;

    // Score circle colour — simple 3-tier
    const ringColor = pct >= 70 ? "#22C55E" : pct >= 45 ? "#F59E0B" : "#F87171";
    const ringBg    = pct >= 70 ? "#F0FDF4"  : pct >= 45 ? "#FFFBEB" : "#FEF2F2";

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
        >
            {/* Left-color strip + content */}
            <div className="flex">
                {/* Vertical left accent */}
                <div style={{ width: 4, background: domTrack ? domTrack.fill : "#CBD5E1", flexShrink: 0, borderRadius: "0 0 0 0" }} />

                <div className="flex-1 px-4 pt-4 pb-4">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                        {/* Left: index badge + profile + date */}
                        <div className="flex items-start gap-2.5 min-w-0">
                            {/* Index badge */}
                            <div
                                className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center mt-0.5 text-[11px] font-black"
                                style={{ background: domTrack ? domTrack.light : "#F1F5F9", color: domTrack ? domTrack.text : "#64748B" }}
                            >
                                {idx + 1}
                            </div>

                            <div className="min-w-0">
                                {/* Profile tags */}
                                {tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                                        {tags.map(key => {
                                            const t = TRACK[key];
                                            return (
                                                <span
                                                    key={key}
                                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold"
                                                    style={{ background: t.light, color: t.text }}
                                                >
                                                    {t.emoji} {t.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                ) : item.profile_type ? (
                                    <span className="inline-block px-2 py-0.5 mb-1.5 rounded-md text-[11px] font-semibold" style={{ background: "#F8FAFC", color: "#64748B" }}>
                                        {item.profile_type}
                                    </span>
                                ) : (
                                    <span className="inline-block px-2 py-0.5 mb-1.5 rounded-md text-[11px]" style={{ background: "#F8FAFC", color: "#94A3B8" }}>
                                        No profile assigned
                                    </span>
                                )}

                                {/* Date */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[11px] text-slate-400">{date} · {time}</span>
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "#F1F5F9", color: "#94A3B8" }}>{rel}</span>
                                </div>
                            </div>
                        </div>

                        {/* Score circle */}
                        <div
                            className="shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center"
                            style={{ border: `2.5px solid ${ringColor}`, background: ringBg }}
                        >
                            <span className="text-[14px] font-black" style={{ color: ringColor }}>{pct}%</span>
                        </div>
                    </div>

                    {/* Score bars */}
                    {hasScores && (
                        <div className="mt-3 pt-3 space-y-2.5" style={{ borderTop: "1px solid #F1F5F9" }}>
                            {([
                                ["job",       "💼 Job",     j, base        ],
                                ["startup",   "🚀 Startup", e, base + 80   ],
                                ["higher_ed", "🎓 Higher",  h, base + 160  ],
                            ] as [TrackKey, string, number, number][]).map(([key, shortLabel, val, delay]) => {
                                const t = TRACK[key];
                                return (
                                    <div key={key} className="flex items-center gap-2">
                                        <span
                                            className="text-[11px] font-medium shrink-0 whitespace-nowrap"
                                            style={{ width: 72, color: "#94A3B8" }}
                                        >
                                            {shortLabel}
                                        </span>
                                        <Bar val={val} fill={t.fill} delay={delay} />
                                        <span
                                            className="text-[11px] font-semibold shrink-0 text-right tabular-nums"
                                            style={{ width: 46, color: "#475569" }}
                                        >
                                            {val.toFixed(1)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {!hasScores && (
                        <p className="mt-3 pt-3 text-[11px] italic" style={{ borderTop: "1px solid #F1F5F9", color: "#CBD5E1" }}>
                            Score breakdown not available for this attempt.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden animate-pulse flex" style={{ border: "1px solid #E2E8F0" }}>
            <div style={{ width: 4, background: "#E2E8F0", flexShrink: 0 }} />
            <div className="flex-1 px-4 pt-4 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg shrink-0" style={{ background: "#F1F5F9" }} />
                        <div className="space-y-2 pt-0.5">
                            <div className="h-4 w-36 rounded-md" style={{ background: "#F1F5F9" }} />
                            <div className="h-3 w-24 rounded" style={{ background: "#F8FAFC" }} />
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full shrink-0" style={{ background: "#F1F5F9" }} />
                </div>
                <div className="space-y-2.5 pt-3" style={{ borderTop: "1px solid #F8FAFC" }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} className="flex items-center gap-2.5">
                            <div className="h-3 shrink-0 rounded" style={{ width: 66, background: "#F8FAFC" }} />
                            <div className="flex-1 rounded-full" style={{ height: 6, background: "#F1F5F9" }} />
                            <div className="h-3 rounded shrink-0" style={{ width: 44, background: "#F8FAFC" }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PsychometricHistoryModal({ isOpen, onClose, studentEmail }: PsychometricHistoryModalProps) {
    const [results, setResults] = useState<PsychometricHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); return () => setMounted(false); }, []);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        setError(null);
        psychometricApi.getStudentPsychometricResults(studentEmail)
            .then(res => setResults(res.data || []))
            .catch(() => setError("Couldn't load your history. Please try again."))
            .finally(() => setLoading(false));
    }, [isOpen, studentEmail]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const real   = results.filter(r => (r.job_score ?? 0) + (r.entrepreneurship_score ?? 0) + (r.higher_education_score ?? 0) > 0);
    const latest = real[0];
    const best   = real.length ? Math.round(Math.max(...real.map(r => r.percentage ?? r.score ?? 0))) : 0;
    const avg    = real.length ? Math.round(real.reduce((s, r) => s + (r.percentage ?? r.score ?? 0), 0) / real.length) : 0;

    const modal = (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[6px]" onClick={onClose} />

            {/* Modal panel */}
            <div
                className="relative z-10 w-full sm:max-w-lg flex flex-col max-h-[90vh] overflow-hidden"
                style={{ background: "#fff", borderRadius: 24, boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
            >
                {/* ── HEADER ── */}
                <div style={{ background: "#1E293B", borderRadius: "24px 24px 0 0", padding: "24px 24px 20px" }} className="shrink-0 relative overflow-hidden">
                    {/* Subtle texture */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{
                        backgroundImage: "radial-gradient(circle at 80% 20%, #6366F1 0%, transparent 50%), radial-gradient(circle at 20% 80%, #14B8A6 0%, transparent 50%)"
                    }} />

                    <div className="relative z-10">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "#64748B" }}>
                                    Assessment History
                                </p>
                                <h2 className="text-xl font-black text-white leading-none">Your Progress</h2>
                                {!loading && (
                                    <p className="text-[12px] mt-1" style={{ color: "#64748B" }}>
                                        {results.length} attempt{results.length !== 1 ? "s" : ""}{real.length ? ` · ${real.length} scored` : ""}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                                aria-label="Close"
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Stat pills */}
                        {!loading && real.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "Attempts",  value: String(real.length), color: "#6366F1" },
                                    { label: "Best",      value: `${best}%`,          color: "#22C55E" },
                                    { label: "Average",   value: `${avg}%`,           color: "#F59E0B" },
                                ].map(s => (
                                    <div
                                        key={s.label}
                                        className="rounded-xl py-2.5 flex flex-col items-center justify-center"
                                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                                    >
                                        <span className="text-lg font-bold leading-none mb-1" style={{ color: s.color }}>{s.value}</span>
                                        <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Latest profile */}
                        {!loading && latest?.profile_type && (
                            <div
                                className="flex items-center gap-2.5 mt-3 px-3 py-2 rounded-xl"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                            >
                                <span className="text-base leading-none">✨</span>
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#94A3B8" }}>Latest profile</p>
                                    <p className="text-[13px] font-medium leading-snug" style={{ color: "#E2E8F0" }}>{latest.profile_type}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── BODY ── */}
                <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4" style={{ background: "#F8FAFC" }}>
                    {loading && <><Skeleton /><Skeleton /><Skeleton /></>}

                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>⚠️</div>
                            <p className="text-sm font-medium" style={{ color: "#64748B" }}>{error}</p>
                        </div>
                    )}

                    {!loading && !error && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4" style={{ background: "#F1F5F9", border: "1px solid #E2E8F0" }}>🧪</div>
                            <h3 className="text-base font-bold mb-1.5" style={{ color: "#1E293B" }}>No assessments yet</h3>
                            <p className="text-sm max-w-[240px] leading-relaxed" style={{ color: "#94A3B8" }}>
                                Take your first assessment to start tracking your personality profile.
                            </p>
                        </div>
                    )}

                    {!loading && !error && results.map((item, idx) => (
                        <HistoryCard key={item.name || idx} item={item} idx={idx} />
                    ))}
                </div>

                {/* ── FOOTER ── */}
                <div className="px-5 py-3 shrink-0" style={{ background: "#fff", borderTop: "1px solid #F1F5F9" }}>
                    <p className="text-[11px] text-center" style={{ color: "#CBD5E1" }}>
                        Scores reflect your responses at the time of each attempt
                    </p>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
