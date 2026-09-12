import { useState, useEffect, useCallback, useRef } from "react";
import { getHabitCompletionHeatmap } from "@/services/student.services";

export interface HeatmapDay {
    date: string | null;
    count: number;
    intensity: 0 | 1 | 2 | 3 | 4;
    day_of_week: number | null;
}

interface HeatmapWeek {
    week_number: number;
    days: HeatmapDay[];
}

interface HeatmapMonth {
    name: string;
    week_index: number;
}

interface HeatmapData {
    year: number;
    total_done: number;
    max_count: number;
    weeks: HeatmapWeek[];
    months: HeatmapMonth[];
}

// ─── HabitHeatmap Component ───────────────────────────────────────────────────
// Light-theme intensity colours (matches app palette)
const INTENSITY_COLORS: Record<number, string> = {
    0: '#eef0f3',   // empty day – very light slate
    1: '#bbf7d0',   // level 1 – light green
    2: '#4ade80',   // level 2
    3: '#22c55e',   // level 3
    4: '#16a34a',   // level 4 – rich green
};

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NUM_WEEKS = 53;
const DOW_COL_W = 30;   // px – fixed label column
const MONTH_ROW_H = 20; // px
const GAP = 3;           // px between cells

export default function HabitHeatmap({ studentEmail }: { studentEmail: string }) {
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear - 2, currentYear - 1, currentYear];

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
    const [heatmapLoading, setHeatmapLoading] = useState(true);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; count: number } | null>(null);
    const [animKey, setAnimKey] = useState(0);
    const [containerW, setContainerW] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Measure container width so cells fill 100% of available space
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(entries => {
            const w = entries[0]?.contentRect.width ?? 0;
            setContainerW(w);
        });
        ro.observe(el);
        setContainerW(el.clientWidth);
        return () => ro.disconnect();
    }, []);

    const fetchHeatmap = useCallback(async (year: number) => {
        if (!studentEmail) return;
        setHeatmapLoading(true);
        try {
            const data = await getHabitCompletionHeatmap(studentEmail, year);
            setHeatmapData(data);
            setAnimKey(k => k + 1);
        } catch (err) {
            console.error('Heatmap fetch error:', err);
        } finally {
            setHeatmapLoading(false);
        }
    }, [studentEmail]);

    useEffect(() => {
        fetchHeatmap(selectedYear);
    }, [selectedYear, fetchHeatmap]);

    // ── Derived values (computed after all hooks) ──────────────────────────────
    const numWeeks = heatmapData ? heatmapData.weeks.length : NUM_WEEKS;
    const CELL = containerW > 0
        ? Math.max(8, Math.floor((containerW - DOW_COL_W - 8 - numWeeks * GAP) / numWeeks))
        : 13;



    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, day: HeatmapDay, cellKey: string) => {
        if (!day.date) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const dateObj = new Date(day.date + 'T00:00:00');
        const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const text = day.count === 0
            ? `No habits on ${formatted}`
            : `${day.count} habit${day.count > 1 ? 's' : ''} on ${formatted}`;
        setHoveredCell(cellKey);
        setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 10, text, count: day.count });
    };

    const handleMouseLeave = () => {
        setHoveredCell(null);
        setTooltip(null);
    };

    const activeDays = heatmapData
        ? heatmapData.weeks.flatMap(w => w.days).filter(d => d.date !== null && d.intensity > 0).length
        : 0;
    const totalDays = heatmapData
        ? heatmapData.weeks.flatMap(w => w.days).filter(d => d.date !== null).length
        : 0;
    const completionPct = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

    const gridW = numWeeks * (CELL + GAP) - GAP;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm" style={{ padding: '18px 20px 14px' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <span style={{
                            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                            boxShadow: '0 0 6px rgba(34,197,94,0.5)',
                        }} />
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.01em' }}>
                            Habit Activity
                        </span>
                    </div>

                    {/* Stat pills */}
                    {!heatmapLoading && heatmapData && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            <span style={{
                                background: '#dcfce7', color: '#15803d',
                                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                                border: '1px solid #bbf7d0',
                            }}>
                                {heatmapData.total_done.toLocaleString()} habits done
                            </span>
                            <span style={{
                                background: '#f8fafc', color: '#64748b',
                                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                                border: '1px solid #e2e8f0',
                            }}>
                                {activeDays} active days · {completionPct}% consistency
                            </span>
                        </div>
                    )}
                </div>

                {/* Year picker */}
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    style={{
                        background: '#f8fafc', border: '1px solid #e2e8f0',
                        color: '#475569', fontSize: 11, fontWeight: 700,
                        padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                        outline: 'none', flexShrink: 0,
                    }}
                >
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            {/* ── Grid area (always 100% wide) ── */}
            <div ref={containerRef} style={{ width: '100%' }}>
                {containerW === 0 ? null : heatmapLoading ? (
                    /* Skeleton */
                    <div style={{ display: 'flex', gap: GAP, width: '100%' }}>
                        <div style={{ width: DOW_COL_W, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: GAP, paddingTop: MONTH_ROW_H }}>
                            {DOW_LABELS.map(d => (
                                <div key={d} style={{ height: CELL, width: 24, borderRadius: 3, background: '#e2e8f0', animation: 'hmPulse 1.4s ease-in-out infinite' }} />
                            ))}
                        </div>
                        <div style={{ flex: 1, display: 'flex', gap: GAP }}>
                            {Array.from({ length: numWeeks }).map((_, wi) => (
                                <div key={wi} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: GAP, paddingTop: MONTH_ROW_H }}>
                                    {Array.from({ length: 7 }).map((_, di) => (
                                        <div key={di} style={{
                                            height: CELL, borderRadius: 3,
                                            background: '#eef0f3',
                                            animation: `hmPulse 1.4s ease-in-out ${wi * 15}ms infinite`,
                                        }} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : heatmapData ? (
                    <>
                        <div style={{ display: 'flex', gap: 0, width: '100%' }}>
                            {/* DOW label column */}
                            <div style={{
                                width: DOW_COL_W, flexShrink: 0,
                                display: 'flex', flexDirection: 'column',
                                gap: GAP, paddingTop: MONTH_ROW_H, paddingRight: 6,
                            }}>
                                {DOW_LABELS.map((label, i) => (
                                    <div key={label} style={{
                                        height: CELL, lineHeight: `${CELL}px`,
                                        fontSize: 9, fontWeight: 700,
                                        // show Sun / Tue / Thu / Sat only for breathing room
                                        color: i % 2 === 0 ? '#94a3b8' : 'transparent',
                                        textAlign: 'right', userSelect: 'none',
                                    }}>
                                        {label}
                                    </div>
                                ))}
                            </div>

                            {/* Grid + month labels — fills remaining width */}
                            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                                {/* Month labels */}
                                <div style={{ height: MONTH_ROW_H, position: 'relative' }}>
                                    {heatmapData.months.map(month => (
                                        <span key={month.name} style={{
                                            position: 'absolute',
                                            left: month.week_index * (CELL + GAP),
                                            top: 4,
                                            fontSize: 9, fontWeight: 700,
                                            color: '#94a3b8',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            whiteSpace: 'nowrap', userSelect: 'none',
                                        }}>
                                            {month.name}
                                        </span>
                                    ))}
                                </div>

                                {/* Week columns – exact computed width, no scrollbar */}
                                <div key={animKey} style={{ display: 'flex', gap: GAP, width: gridW }}>
                                    {heatmapData.weeks.map((week, wi) => (
                                        <div key={week.week_number} style={{
                                            display: 'flex', flexDirection: 'column', gap: GAP,
                                            opacity: 0,
                                            animation: 'hmFadeIn 0.35s ease forwards',
                                            animationDelay: `${wi * 6}ms`,
                                        }}>
                                            {week.days.map((day, di) => {
                                                const isEmpty = day.date === null;
                                                const cellKey = `${wi}-${di}`;
                                                const isHovered = hoveredCell === cellKey;
                                                const bg = isEmpty ? 'transparent' : (INTENSITY_COLORS[day.intensity] ?? INTENSITY_COLORS[0]);
                                                const isZero = !isEmpty && day.intensity === 0;
                                                return (
                                                    <div
                                                        key={di}
                                                        style={{
                                                            width: CELL, height: CELL,
                                                            borderRadius: Math.max(2, Math.floor(CELL / 4)),
                                                            background: bg,
                                                            border: isZero ? '1px solid #e2e8f0' : 'none',
                                                            cursor: isEmpty ? 'default' : 'pointer',
                                                            flexShrink: 0,
                                                            transform: isHovered && !isEmpty ? 'scale(1.4)' : 'scale(1)',
                                                            boxShadow: isHovered && !isEmpty && day.intensity > 0
                                                                ? `0 0 0 2px #fff, 0 0 0 3px ${INTENSITY_COLORS[day.intensity]}`
                                                                : 'none',
                                                            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
                                                            position: 'relative', zIndex: isHovered ? 2 : 1,
                                                        }}
                                                        onMouseEnter={isEmpty ? undefined : e => handleMouseEnter(e, day, cellKey)}
                                                        onMouseLeave={isEmpty ? undefined : handleMouseLeave}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5, marginTop: 10 }}>
                            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Less</span>
                            {[0, 1, 2, 3, 4].map(level => (
                                <div key={level} style={{
                                    width: 11, height: 11, borderRadius: 3,
                                    background: INTENSITY_COLORS[level],
                                    border: level === 0 ? '1px solid #e2e8f0' : 'none',
                                }} />
                            ))}
                            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>More</span>
                        </div>
                    </>
                ) : (
                    <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No activity data available.</p>
                )}
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div style={{
                    position: 'fixed',
                    left: tooltip.x, top: tooltip.y,
                    transform: 'translate(-50%, -100%)',
                    zIndex: 9999,
                    background: '#1e293b', color: '#f8fafc',
                    fontSize: 11.5, fontWeight: 600,
                    padding: '5px 11px 6px', borderRadius: 7,
                    pointerEvents: 'none', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    lineHeight: 1.4,
                }}>
                    {tooltip.count > 0 && <span style={{ color: '#22c55e', marginRight: 4 }}>●</span>}
                    {tooltip.text}
                    <div style={{
                        position: 'absolute', bottom: -4, left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0, height: 0,
                        borderLeft: '4px solid transparent',
                        borderRight: '4px solid transparent',
                        borderTop: '4px solid #1e293b',
                    }} />
                </div>
            )}

            <style>{`
                @keyframes hmFadeIn {
                    from { opacity: 0; transform: translateY(3px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes hmPulse {
                    0%, 100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
