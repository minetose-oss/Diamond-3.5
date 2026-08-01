import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, DollarSign, RefreshCcw, Trophy } from "lucide-react";

// ─── HELPERS ────────────────────────────────────────────────────────────────

const FEE_RATE = 0.00966;
const toFee = (v: number) => v * FEE_RATE;

function fmt(v: number) {
  if (v >= 1e9) return `${(v/1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v/1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v/1e3).toFixed(0)}K`;
  return v > 0 ? v.toLocaleString() : "0";
}

// ─── MONTH META ───────────────────────────────────────────────────────────────

const MONTHS = [
  { key: "jun", label: "มิ.ย. 69", short: "มิ.ย.", period: "Jun 2026" },
  { key: "jul", label: "ก.ค. 69", short: "ก.ค.", period: "Jul 2026" },
];

// ─── PORTFOLIO & WISE INPUT ──────────────────────────────────────────────────

const META: Record<string, {
  portfolio: { totalAssets: number; usdt: number; trx: number; thb: number };
  wise: { sales: number; usdct: number; carats: number; period: string };
  deposit: { type: string; amount: number; status: "ยืนยันแล้ว" | "รอดำเนินการ" }[];
}> = {
  jun: {
    portfolio: { totalAssets: 38_842.79, usdt: 38_026.10, trx: 13_646.62, thb: 34_989.42 },
    wise: { sales: 500_000, usdct: 28.59, carats: 500, period: "Jun 2026" },
    deposit: [
      { type: "Deposit",  amount: 50_000, status: "ยืนยันแล้ว" },
      { type: "Withdraw", amount: 50_000, status: "รอดำเนินการ" },
    ],
  },
  jul: {
    portfolio: { totalAssets: 124_842.79, usdt: 124_026.10, trx: 13_646.62, thb: 137_489.42 },
    wise: { sales: 2_000_000, usdct: 28.59, carats: 2_000, period: "Jul 2026" },
    deposit: [
      { type: "Deposit",  amount: 52_000, status: "ยืนยันแล้ว" },
      { type: "Withdraw", amount: 52_000, status: "รอดำเนินการ" },
    ],
  },
};

// ─── VOLUME RAW DATA ─────────────────────────────────────────────────────────

const RAW: Record<string, Record<string, number>> = {
  jun: {
    "4_8649": 52_000_000, "5_8637": 38_000_000, "1_8576": 32_000_000,
    "1_8658": 28_000_000, "7_8616": 24_000_000, "2_8654": 20_000_000,
    "5_8644": 17_000_000, "6_8622": 15_000_000, "5_8639": 13_500_000,
    "5_8643": 11_500_000, "5_8640": 10_500_000, "2_8617": 9_800_000,
    "1_8647": 9_500_000,  "5_8629": 9_000_000,  "5_8628": 8_500_000,
    "5_8566": 8_000_000,  "5_8630": 7_200_000,  "5_8645": 7_000_000,
    "5_8634": 6_500_000,  "5_8633": 6_200_000,  "5_8638": 6_000_000,
    "5_8632": 5_700_000,  "5_8636": 5_300_000,  "5_8631": 4_900_000,
    "5_8610": 4_600_000,  "5_8590": 4_300_000,  "5_8567": 4_000_000,
    "5_8546": 3_800_000,  "5_8585": 3_600_000,  "4_8611": 3_400_000,
    "4_8648": 3_200_000,  "5_8562": 3_000_000,  "5_8515": 2_800_000,
    "5_8513": 2_600_000,  "4_8616": 2_400_000,  "4_8577": 2_200_000,
    "6_8620": 2_000_000,  "3_8653": 1_800_000,  "5_8538": 1_600_000,
    "5_A057": 1_400_000,  "8660": 1_200_000,
  },
  jul: {
    "4_8649": 180_000_000, "5_8637": 130_000_000, "1_8576": 115_000_000,
    "1_8658": 95_000_000,  "7_8616": 80_000_000,  "2_8654": 70_000_000,
    "5_8644": 58_000_000,  "6_8622": 50_000_000,  "5_8639": 45_000_000,
    "5_8643": 40_000_000,  "5_8640": 38_000_000,  "2_8617": 35_000_000,
    "1_8647": 32_000_000,  "5_8629": 30_000_000,  "5_8628": 28_000_000,
    "5_8566": 26_000_000,  "5_8630": 25_000_000,  "5_8645": 24_000_000,
    "5_8634": 22_000_000,  "5_8633": 20_000_000,  "5_8638": 19_000_000,
    "5_8632": 18_000_000,  "5_8636": 17_000_000,  "5_8631": 16_000_000,
    "5_8610": 15_000_000,  "5_8590": 14_000_000,  "5_8567": 13_000_000,
    "5_8546": 12_000_000,  "5_8585": 11_000_000,  "4_8611": 10_000_000,
    "4_8648": 9_500_000,   "5_8562": 9_000_000,   "5_8515": 8_500_000,
    "5_8513": 8_000_000,   "4_8616": 7_500_000,   "4_8577": 7_000_000,
    "6_8620": 6_500_000,   "3_8653": 6_000_000,   "5_8538": 5_500_000,
    "5_A057": 5_000_000,   "8660": 4_500_000,
  },
};

// ─── IC INFO ─────────────────────────────────────────────────────────────────

const IC_INFO: Record<string, { name: string; team: string; teamName: string }> = {
  // Team 4
  "4_8649": { name: "เป้ (T4)",  team: "4", teamName: "Team 4" },
  "4_8611": { name: "T4-8611",   team: "4", teamName: "Team 4" },
  "4_8648": { name: "T4-8648",   team: "4", teamName: "Team 4" },
  "4_8616": { name: "T4-8616",   team: "4", teamName: "Team 4" },
  "4_8577": { name: "T4-8577",   team: "4", teamName: "Team 4" },
  // Team 5
  "5_8632": { name: "แนน",       team: "5", teamName: "Team 5" },
  "5_8635": { name: "ปุ๋ย",      team: "5", teamName: "Team 5" },
  "5_8629": { name: "มิว",       team: "5", teamName: "Team 5" },
  "5_8634": { name: "พี่จีบ",    team: "5", teamName: "Team 5" },
  "5_8638": { name: "ผึ้ง",      team: "5", teamName: "Team 5" },
  "5_8636": { name: "ก้อย",      team: "5", teamName: "Team 5" },
  "5_8633": { name: "น้องเมย์",  team: "5", teamName: "Team 5" },
  "5_8639": { name: "ติว",        team: "5", teamName: "Team 5" },
  "5_8637": { name: "เปิ้ล",     team: "5", teamName: "Team 5" },
  "5_8631": { name: "ลัก",        team: "5", teamName: "Team 5" },
  "5_8644": { name: "ฝ้าย",      team: "5", teamName: "Team 5" },
  "5_8640": { name: "หนุ่ม",     team: "5", teamName: "Team 5" },
  "5_8630": { name: "ยุ้ย",       team: "5", teamName: "Team 5" },
  "5_8643": { name: "จุ้ย",       team: "5", teamName: "Team 5" },
  "5_8645": { name: "กิฟ",        team: "5", teamName: "Team 5" },
  "5_8628": { name: "ตา",         team: "5", teamName: "Team 5" },
  "5_8610": { name: "พี่โฟน",    team: "5", teamName: "Team 5" },
  "5_8590": { name: "น้ำอบ",     team: "5", teamName: "Team 5" },
  "5_8567": { name: "ไหม",        team: "5", teamName: "Team 5" },
  "5_8566": { name: "พี่กาญ",    team: "5", teamName: "Team 5" },
  "5_8562": { name: "นิดหน่อย",  team: "5", teamName: "Team 5" },
  "5_8585": { name: "จ๋า",        team: "5", teamName: "Team 5" },
  "5_8546": { name: "พี่ปุ้ย",   team: "5", teamName: "Team 5" },
  "5_8515": { name: "พี่หนู",   team: "5", teamName: "Team 5" },
  "5_8513": { name: "พี่ตั้ม",   team: "5", teamName: "Team 5" },
  "5_8538": { name: "นิด",        team: "5", teamName: "Team 5" },
  "5_A057": { name: "พี่อ้อ",    team: "5", teamName: "Team 5" },
};

const TEAM_COLORS: Record<string, string> = {
  "1": "#6366f1", "2": "#8b5cf6", "3": "#a78bfa",
  "4": "#06b6d4", "5": "#10b981", "6": "#f59e0b", "7": "#f43f5e",
  "0": "#94a3b8",
};

const MEDAL_COLORS = ["#f59e0b", "#94a3b8", "#cd7c2f", "#6366f1", "#6366f1"];

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [month, setMonth] = useState("jul");

  const meta = META[month];
  const raw = RAW[month] || {};

  // All IC rows sorted by volume
  const allIC = useMemo(() => {
    return Object.entries(raw)
      .map(([code, vol]) => {
        const info = IC_INFO[code];
        const team = code.match(/^(\d)_/)?.[1] || "0";
        return {
          code,
          name: info?.name || code,
          team: info?.teamName || `Team ${team}`,
          teamKey: team,
          vol,
          fee: toFee(vol),
        };
      })
      .sort((a, b) => b.vol - a.vol)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }, [raw]);

  // Team 4/5 focused list (highlighted)
  const team45 = allIC.filter(r => r.teamKey === "4" || r.teamKey === "5");
  const others = allIC.filter(r => r.teamKey !== "4" && r.teamKey !== "5");

  // Team totals for pie
  const teamTotals = useMemo(() => {
    const acc: Record<string, number> = {};
    Object.entries(raw).forEach(([code, vol]) => {
      const t = code.match(/^(\d)_/)?.[1] || "0";
      acc[t] = (acc[t] || 0) + vol;
    });
    return Object.entries(acc)
      .map(([t, vol]) => ({ team: `Team ${t}`, value: vol, color: TEAM_COLORS[t] || "#94a3b8" }))
      .sort((a, b) => b.value - a.value);
  }, [raw]);

  const totalVol = Object.values(raw).reduce((s, v) => s + v, 0);
  const totalFee = toFee(totalVol);
  const team45Vol = team45.reduce((s, r) => s + r.vol, 0);
  const team45Fee = toFee(team45Vol);
  const t45pct = totalVol > 0 ? (team45Vol / totalVol * 100) : 0;

  // Chart data: Jun vs Jul
  const trendData = [
    { month: "มิ.ย. 69", sales: META.jun.wise.sales, vol: Object.values(RAW.jun).reduce((s,v)=>s+v,0) },
    { month: "ก.ค. 69", sales: META.jul.wise.sales, vol: Object.values(RAW.jul).reduce((s,v)=>s+v,0) },
  ];

  const rowBg = (teamKey: string) =>
    teamKey === "5" ? "bg-emerald-50 hover:bg-emerald-100" :
    teamKey === "4" ? "bg-cyan-50 hover:bg-cyan-100" :
    "bg-white hover:bg-gray-50";

  const rowBorder = (teamKey: string) =>
    teamKey === "5" ? "border-emerald-200" :
    teamKey === "4" ? "border-cyan-200" :
    "border-gray-100";

  const teamBadge = (teamKey: string) => {
    const colors: Record<string, string> = {
      "5": "bg-emerald-500 text-white", "4": "bg-cyan-500 text-white",
      "1": "bg-indigo-500 text-white",   "2": "bg-violet-500 text-white",
      "3": "bg-purple-500 text-white",  "6": "bg-amber-500 text-white",
      "7": "bg-rose-500 text-white",
    };
    return colors[teamKey] || "bg-gray-400 text-white";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-indigo-300 font-medium mb-0.5">💎 Diamond 3.5 · Sales Dashboard</div>
            <h1 className="text-xl font-bold">SUB/SWI Sales Overview</h1>
          </div>
          <div className="flex gap-2">
            {MONTHS.map(m => (
              <button key={m.key} onClick={() => setMonth(m.key)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  month === m.key ? "bg-white text-indigo-700 shadow-lg" : "text-white/70 hover:text-white bg-white/10"
                }`}>
                {m.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* ── 1. PORTFOLIO ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={16} className="text-indigo-500"/>
            <span className="text-sm font-semibold text-gray-500">Portfolio</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Assets", value: `$${meta.portfolio.totalAssets.toLocaleString()}`, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "USDT",         value: `$${meta.portfolio.usdt.toLocaleString()}`,        color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Asset (TRX)",  value: `${fmt(meta.portfolio.trx)} TRX`,                   color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Total (THB)",  value: `฿${fmt(meta.portfolio.thb)}`,                    color: "text-violet-600", bg: "bg-violet-50" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-xl p-4`}>
                <div className="text-xs text-gray-500 mb-1">{k.label}</div>
                <div className={`text-lg font-bold ${k.color}`}>{k.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. WISE INPUT + DEPOSIT/WITHDRAW ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Wise Input */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-indigo-500"/>
              <span className="text-sm font-semibold text-gray-500">Wise Input</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Total Sales",   value: `฿${meta.wise.sales.toLocaleString()}`,     color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "USD/CT",        value: `$${meta.wise.usdct}`,                       color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Total Carats",  value: `${meta.wise.carats.toLocaleString()} ct`,  color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Period",        value: meta.wise.period,                            color: "text-gray-600", bg: "bg-gray-50" },
              ].map(k => (
                <div key={k.label} className={`${k.bg} rounded-xl p-3`}>
                  <div className="text-xs text-gray-500 mb-1">{k.label}</div>
                  <div className={`text-base font-bold ${k.color}`}>{k.value}</div>
                </div>
              ))}
            </div>
            {/* Mini chart */}
            <div className="border-t border-gray-100 pt-3">
              <div className="text-xs text-gray-400 mb-2">ยอดขายรายเดือน</div>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={trendData} margin={{left:0,right:10,top:5,bottom:5}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis dataKey="month" tick={{fontSize:10}}/>
                  <YAxis tick={{fontSize:9}} tickFormatter={v => `฿${fmt(v)}`}/>
                  <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, "Total Sales"]}/>
                  <Bar dataKey="sales" radius={[4,4,0,0]}>
                    {trendData.map((_, i) => <Cell key={i} fill={i === 0 ? "#a78bfa" : "#6366f1"}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Deposit / Withdraw */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <RefreshCcw size={16} className="text-indigo-500"/>
              <span className="text-sm font-semibold text-gray-500">Deposit / Withdraw</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Type</th>
                    <th className="text-left py-2 px-3 text-gray-400 font-medium text-xs">Network</th>
                    <th className="text-right py-2 px-3 text-gray-400 font-medium text-xs">Amount</th>
                    <th className="text-center py-2 px-3 text-gray-400 font-medium text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {meta.deposit.map((d, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-700 text-sm">{d.type}</td>
                      <td className="py-3 px-3 text-gray-500 text-sm">TRC20</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-800 text-sm">
                        {d.amount.toLocaleString()} USDT
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          d.status === "ยืนยันแล้ว" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {d.status === "ยืนยันแล้ว" ? "✅" : "⏳"} {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Team 4/5 summary */}
            <div className="mt-4 bg-emerald-50 rounded-xl p-3 border border-emerald-100">
              <div className="text-xs text-emerald-600 font-semibold mb-2">Team 4/5 Summary</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-emerald-700">฿{fmt(team45Vol)}</div>
                  <div className="text-xs text-gray-500">Vol</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-700">฿{team45Fee.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Fee</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-700">{t45pct.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Share</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. VOLUME & FEE SUMMARY (IC Table + Top Teams Chart) ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-amber-500"/>
              <span className="text-sm font-semibold text-gray-700">Volume & Fee Summary — {MONTHS.find(m => m.key === month)?.label}</span>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"/>Team 5</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-cyan-500 inline-block"/>Team 4</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300 inline-block"/>Others</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* IC Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-center py-2 px-2 text-gray-400 font-medium w-8">#</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">IC</th>
                    <th className="text-center py-2 px-2 text-gray-400 font-medium w-16">Team</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">Volume</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">Fee (0.966%)</th>
                  </tr>
                </thead>
                <tbody>
                  {allIC.map((row) => (
                    <tr key={row.code} className={`border-b ${rowBorder(row.teamKey)} ${rowBg(row.teamKey)} transition-colors`}>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          row.rank <= 3 ? `text-white` : "text-gray-400"
                        }`} style={row.rank <= 3 ? { backgroundColor: MEDAL_COLORS[row.rank - 1] } : {}}>
                          {row.rank}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="font-semibold text-gray-800">{row.name}</div>
                        <div className="text-gray-400 font-mono text-xs">{row.code}</div>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${teamBadge(row.teamKey)}`}>
                          {row.teamKey === "5" ? "T5" : row.teamKey === "4" ? "T4" : `T${row.teamKey}`}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-gray-700">
                        ฿{fmt(row.vol)}
                      </td>
                      <td className="py-2 px-2 text-right font-bold text-indigo-600">
                        ฿{row.fee.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="border-t-2 border-indigo-200 bg-indigo-50 font-bold">
                    <td colSpan={3} className="py-3 px-2 text-indigo-700 text-sm">💎 รวมทั้งหมด</td>
                    <td className="py-3 px-2 text-right text-indigo-700 text-sm">฿{fmt(totalVol)}</td>
                    <td className="py-3 px-2 text-right text-indigo-700 text-sm">฿{totalFee.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Top 10 Teams Chart */}
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3">Top 10 Teams by Volume</div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={teamTotals.slice(0, 10)} layout="vertical" margin={{left:5,right:15}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                  <XAxis type="number" tick={{fontSize:9}} tickFormatter={fmt}/>
                  <YAxis type="category" dataKey="team" tick={{fontSize:10}} width={48}/>
                  <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, "Volume"]}/>
                  <Bar dataKey="value" radius={[0,4,4,0]}>
                    {teamTotals.slice(0, 10).map((t, i) => (
                      <Cell key={i} fill={i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7c2f" : t.color}/>
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Team pie */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">สัดส่วนตามทีม</div>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={teamTotals} dataKey="value" nameKey="team" cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                      labelLine={false}
                      label={({team, percent}: any) => percent > 0.05 ? `${team}` : ""}>
                      {teamTotals.map((t, i) => <Cell key={i} fill={t.color}/>)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, "Volume"]}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-400 pb-4">
          💎 Diamond 3.5 · Sales Dashboard · {MONTHS.find(m => m.key === month)?.label}
        </div>
      </div>
    </div>
  );
}
