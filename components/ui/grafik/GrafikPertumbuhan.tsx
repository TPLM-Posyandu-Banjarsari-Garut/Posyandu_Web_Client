"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useGetNutritionRecordsByChild } from "@/hooks/query/nutrition/useManageNutritionRecords";
import { useGetOrangTuaNutritionRecords } from "@/hooks/query/orangtua/useOrangTuaChildren";
import { NutritionRecord } from "@/interfaces/nutrition";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "bb" | "tb" | "lk";
type Role = "bidan" | "kader" | "orangtua";

interface GrafikPertumbuhanProps {
  childId: string;
  childName: string;
  gender: "male" | "female";
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

interface ChartDataPoint {
  age: number;
  value: number | null;
  label: string;
}

// ─── WHO Median Reference Data (simplified, 0–60 months) ─────────────────────
// Weight-for-age median (kg), Height-for-age median (cm), Head circumference median (cm)

const WHO_WEIGHT_MALE: Record<number, number> = {
  0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9,
  9: 8.9, 12: 9.6, 15: 10.3, 18: 10.9, 24: 12.2, 30: 13.3,
  36: 14.3, 42: 15.3, 48: 16.3, 54: 17.3, 60: 18.3,
};
const WHO_WEIGHT_FEMALE: Record<number, number> = {
  0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
  9: 8.2, 12: 8.9, 15: 9.6, 18: 10.2, 24: 11.5, 30: 12.6,
  36: 13.9, 42: 14.9, 48: 15.9, 54: 17.0, 60: 18.2,
};
const WHO_HEIGHT_MALE: Record<number, number> = {
  0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9, 6: 67.6,
  9: 72.0, 12: 75.7, 15: 79.1, 18: 82.3, 24: 87.8, 30: 92.7,
  36: 96.1, 42: 99.9, 48: 103.3, 54: 106.4, 60: 110.0,
};
const WHO_HEIGHT_FEMALE: Record<number, number> = {
  0: 49.1, 1: 53.7, 2: 57.1, 3: 59.8, 4: 62.1, 5: 64.0, 6: 65.7,
  9: 70.1, 12: 74.0, 15: 77.5, 18: 80.7, 24: 86.4, 30: 91.4,
  36: 95.1, 42: 99.0, 48: 102.7, 54: 106.2, 60: 110.2,
};
const WHO_HC_MALE: Record<number, number> = {
  0: 34.5, 1: 37.3, 2: 39.1, 3: 40.5, 4: 41.6, 5: 42.6, 6: 43.3,
  9: 45.0, 12: 46.4, 15: 47.5, 18: 48.4, 24: 49.6, 36: 50.9, 48: 51.8, 60: 52.4,
};
const WHO_HC_FEMALE: Record<number, number> = {
  0: 33.9, 1: 36.5, 2: 38.3, 3: 39.5, 4: 40.6, 5: 41.5, 6: 42.2,
  9: 43.8, 12: 45.0, 15: 46.2, 18: 47.0, 24: 48.3, 36: 49.6, 48: 50.6, 60: 51.5,
};

function getWhoReference(ageMonth: number, tab: TabKey, gender: "male" | "female"): number | null {
  const map =
    tab === "bb"
      ? gender === "male" ? WHO_WEIGHT_MALE : WHO_WEIGHT_FEMALE
      : tab === "tb"
      ? gender === "male" ? WHO_HEIGHT_MALE : WHO_HEIGHT_FEMALE
      : gender === "male" ? WHO_HC_MALE : WHO_HC_FEMALE;

  // Interpolasi linier antara dua titik terdekat
  const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
  if (ageMonth <= keys[0]) return map[keys[0]];
  if (ageMonth >= keys[keys.length - 1]) return map[keys[keys.length - 1]];

  const lower = keys.filter((k) => k <= ageMonth).at(-1)!;
  const upper = keys.filter((k) => k >= ageMonth)[0];
  if (lower === upper) return map[lower];
  const t = (ageMonth - lower) / (upper - lower);
  return +(map[lower] + t * (map[upper] - map[lower])).toFixed(2);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  normal: { label: "Normal", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  underweight: { label: "Kurang", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  severely_underweight: { label: "Sangat Kurang", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  stunted: { label: "Stunting", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  wasted: { label: "Gizi Buruk", color: "text-red-700", bg: "bg-red-50 border-red-200" },
  overweight: { label: "Lebih", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, tab }: any) => {
  if (!active || !payload?.length) return null;
  const unit = tab === "bb" ? " kg" : " cm";
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl p-3 shadow-xl min-w-[140px]">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
        Usia {label} bulan
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5 mb-1">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
          <span className="text-xs font-semibold text-slate-600">{entry.name}:</span>
          <span className="text-xs font-bold" style={{ color: entry.color }}>
            {entry.value !== null && entry.value !== undefined ? `${entry.value}${unit}` : "-"}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Data Fetcher Wrapper ─────────────────────────────────────────────────────
// Pisahkan fetching logic per role agar tidak ada conditional hook

function useBidanKaderNutritionRecords(childId: string) {
  return useGetNutritionRecordsByChild({ children_id: childId, limit: 60 });
}

function useOrangTuaRecords(childId: string) {
  return useGetOrangTuaNutritionRecords({ children_id: childId, limit: 60 });
}

// ─── Chart Inner ──────────────────────────────────────────────────────────────

interface ChartInnerProps {
  records: NutritionRecord[];
  isLoading: boolean;
  tab: TabKey;
  gender: "male" | "female";
}

function ChartInner({ records, isLoading, tab, gender }: ChartInnerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: 240 }}>
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-bold text-slate-400">Memuat data grafik...</span>
        </div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: 240 }}>
        <div className="flex flex-col items-center gap-3 text-center px-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-600">Belum Ada Data Pengukuran</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Data grafik pertumbuhan akan muncul setelah ada riwayat pengukuran yang tercatat.
          </p>
        </div>
      </div>
    );
  }

  // Build chart data — sort by age_months ascending
  const sorted = [...records]
    .filter((r) => r.age_months != null)
    .sort((a, b) => (a.age_months ?? 0) - (b.age_months ?? 0));

  const chartData = sorted.map((r) => {
    const age = r.age_months!;
    const rawValue =
      tab === "bb" ? r.weight_kg : tab === "tb" ? r.height_cm : r.head_circumference_cm;
    const value = rawValue ? parseFloat(rawValue.toString()) : null;
    const who = getWhoReference(age, tab, gender);
    return {
      age,
      value,
      who,
      status: r.nutrition_status,
    };
  });

  const unit = tab === "bb" ? "kg" : "cm";
  const tabLabel = tab === "bb" ? "Berat Badan" : tab === "tb" ? "Tinggi Badan" : "Lingkar Kepala";

  return (
    <div className="flex flex-col gap-3" style={{ height: "100%" }}>
      {/* Latest Status Badge Row */}
      {sorted.length > 0 && (() => {
        const latest = sorted[sorted.length - 1];
        const statusCfg = STATUS_CONFIG[latest.nutrition_status] ?? STATUS_CONFIG.normal;
        const latestValue =
          tab === "bb" ? latest.weight_kg : tab === "tb" ? latest.height_cm : latest.head_circumference_cm;
        return (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Terakhir:</span>
            <span className="text-xs font-bold text-slate-700">
              {latestValue ? `${parseFloat(latestValue.toString()).toFixed(1)} ${unit}` : "-"}
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <span className="text-[10px] text-slate-400 ml-auto">
              {latest.age_months != null ? `Usia ${latest.age_months} bulan` : ""}
            </span>
          </div>
        );
      })()}

      {/* Chart — use fixed pixel height so ResponsiveContainer can measure */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 12, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              label={{ value: "Bulan", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 10, fontWeight: 600, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              unit={unit === "kg" ? " kg" : " cm"}
              width={42}
            />
            <Tooltip content={<CustomTooltip tab={tab} />} />
            <Legend
              wrapperStyle={{ fontSize: "10px", fontWeight: 600, paddingTop: "8px" }}
              formatter={(value) =>
                value === "value" ? tabLabel : `Median WHO (${gender === "male" ? "Laki-laki" : "Perempuan"})`
              }
            />
            {/* WHO Median Reference Line */}
            <Line
              type="monotone"
              dataKey="who"
              name="who"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              activeDot={false}
            />
            {/* Actual child data */}
            <Line
              type="monotone"
              dataKey="value"
              name="value"
              stroke={gender === "male" ? "#3b82f6" : "#ec4899"}
              strokeWidth={2.5}
              dot={{ r: 4, fill: gender === "male" ? "#3b82f6" : "#ec4899", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Role-specific wrapper components ────────────────────────────────────────

function BidanKaderChart({ childId, tab, gender }: { childId: string; tab: TabKey; gender: "male" | "female" }) {
  const { data, isLoading } = useBidanKaderNutritionRecords(childId);
  // data is FetchNutritionRecordsPaginated: { data: NutritionRecord[], meta }
  const rawRecords = data?.data;
  const records: NutritionRecord[] = Array.isArray(rawRecords) ? rawRecords : [];
  return <ChartInner records={records} isLoading={isLoading} tab={tab} gender={gender} />;
}

function OrangTuaChart({ childId, tab, gender }: { childId: string; tab: TabKey; gender: "male" | "female" }) {
  const { data, isLoading } = useOrangTuaRecords(childId);
  // data is FetchOrangTuaNutritionRecordsResponse: { data: NutritionRecord[], meta }
  const rawRecords = data?.data;
  const records: NutritionRecord[] = Array.isArray(rawRecords) ? rawRecords : [];
  return <ChartInner records={records} isLoading={isLoading} tab={tab} gender={gender} />;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GrafikPertumbuhan({
  childId,
  childName,
  gender,
  isOpen,
  onClose,
  role,
}: GrafikPertumbuhanProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("bb");

  // Reset tab on open
  useEffect(() => {
    if (isOpen) setActiveTab("bb");
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "bb", label: "Berat Badan", icon: "⚖️" },
    { key: "tb", label: "Tinggi Badan", icon: "📏" },
    { key: "lk", label: "Lingkar Kepala", icon: "🧠" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center animate-slide-up"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1) both" }}
      >
        <div
          className="w-full max-w-md bg-white rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          style={{ maxHeight: "90vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          {/* Header */}
          <div className="px-6 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Grafik Pertumbuhan</h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5 truncate max-w-[220px]">{childName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0 mt-0.5"
              aria-label="Tutup grafik"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="px-6 pb-4">
            <div className="bg-slate-100 rounded-[1rem] p-1 flex gap-1">
              {tabs.map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-[0.75rem] text-[10px] font-extrabold transition-all duration-200 ${
                    activeTab === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span>{icon}</span>
                  <span className="hidden xs:block">{label}</span>
                  <span className="xs:hidden">{key.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* WHO Legend Info */}
          <div className="px-6 pb-3">
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg width="18" height="6">
                  <line x1="0" y1="3" x2="18" y2="3" stroke={gender === "male" ? "#3b82f6" : "#ec4899"} strokeWidth="2.5" />
                </svg>
                <span>Data Bayi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="18" height="6">
                  <line x1="0" y1="3" x2="18" y2="3" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
                </svg>
                <span>Median WHO</span>
              </div>
            </div>
          </div>

          {/* Chart Area — fixed height so ResponsiveContainer can measure */}
          <div className="px-3 pb-20" style={{ height: "300px", minHeight: "300px", flexShrink: 0 }}>
            {role === "orangtua" ? (
              <OrangTuaChart childId={childId} tab={activeTab} gender={gender} />
            ) : (
              <BidanKaderChart childId={childId} tab={activeTab} gender={gender} />
            )}
          </div>
        </div>
      </div>

      {/* Inline animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
