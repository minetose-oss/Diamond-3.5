import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Trophy, TrendingUp, Users, Target, Crown, Star } from "lucide-react";
import { RAW, MONTHS, TEAM5_INFO, type Member } from "./data";

// ─── HELPERS ────────────────────────────────────────────────────────────────

const FEE_RATE = 0.00966;
const toFee = (v: number) => v * FEE_RATE;

function fmt(v: number) {
  if (v >= 1e9) return `${(v/1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v/1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v/1e3).toFixed(0)}K`;
  return v > 0 ? v.toLocaleString() : "0";
}

function fmtFull(v: number) {
  return v.toLocaleString();
}

function getTeam(code: string) {
  const m = code.match(/^(\d)_/);
  return m ? m[1] : "0";
}

const TEAM_COLORS: Record<string, string> = {
  "1":"#6366f1","2":"#8b5cf6","3":"#a78bfa",
  "4":"#06b6d4","5":"#10b981","6":"#f59e0b","7":"#f43f5e","0":"#94a3b8",
};

const REGION_COLORS: Record<string, string> = {
  "เหนือ":"#6366f1","อีสาน":"#f59e0b","กลาง":"#10b981","ใต้":"#f43f5e","ตะวันออก":"#8b5cf6",
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [yearFilter, setYearFilter] = useState<"all" | 2568 | 2569>("all");
  const [showMembers, setShowMembers] = useState<number>(20);

  // Filter months by year
  const visibleMonths = useMemo(() => {
    if (yearFilter === "all") return MONTHS;
    return MONTHS.filter(m => m.year === yearFilter);
  }, [yearFilter]);

  // Monthly totals (sum of all ICs in each month)
  const monthlyData = useMemo(() => {
    return visibleMonths.map(m => {
      const raw = RAW[m.key] || {};
      const total = Object.values(raw).reduce((s, v) => s + v, 0);
      const fee = toFee(total);
      const t5 = TEAM5_INFO.reduce((s, mem) => s + (raw[mem.code] || 0), 0);
      return { ...m, total, fee, t5 };
    });
  }, [visibleMonths]);

  // All-time totals
  const grandTotal = monthlyData.reduce((s, m) => s + m.total, 0);
  const grandFee = toFee(grandTotal);
  const grandT5 = monthlyData.reduce((s, m) => s + m.t5, 0);

  // Top sale (per IC, summed across visible months)
  const topSellers = useMemo(() => {
    const acc: Record<string, number> = {};
    visibleMonths.forEach(m => {
      const raw = RAW[m.key] || {};
      Object.entries(raw).forEach(([code, vol]) => {
        acc[code] = (acc[code] || 0) + vol;
      });
    });
    return Object.entries(acc)
      .map(([code, vol]) => {
        const team = getTeam(code);
        const t5info = TEAM5_INFO.find(m => m.code === code);
        return {
          code,
          vol,
          fee: toFee(vol),
          team,
          isTeam5: !!t5info,
          name: t5info?.name || code,
          ic: t5info?.ic || code.split("_")[1],
          region: t5info?.region,
        };
      })
      .sort((a, b) => b.vol - a.vol);
  }, [visibleMonths]);

  const top1 = topSellers[0];
  const top5 = topSellers.slice(0, showMembers);
  const top5T5 = top5.filter(t => t.isTeam5);

  // Team 5 ranking (sorted by vol)
  const team5Ranking = useMemo(() => {
    return TEAM5_INFO.map(m => {
      const vol = topSellers.find(t => t.code === m.code)?.vol || 0;
      const fee = toFee(vol);
      const pct = m.target > 0 ? (vol / m.target * 100) : 0;
      return { ...m, vol, fee, pct };
    }).sort((a, b) => b.vol - a.vol);
  }, [topSellers]);

  // Team totals for pie chart
  const teamTotals = useMemo(() => {
    const acc: Record<string, number> = {};
    topSellers.forEach(t => {
      acc[t.team] = (acc[t.team] || 0) + t.vol;
    });
    return Object.entries(acc)
      .map(([team, value]) => ({ team: `Team ${team}`, value, color: TEAM_COLORS[team] || "#94a3b8" }))
      .sort((a, b) => b.value - a.value);
  }, [topSellers]);

  // Region totals (Team 5 only)
  const regionTotals = useMemo(() => {
    const acc: Record<string, number> = {};
    team5Ranking.forEach(m => {
      if (m.region && m.vol > 0) acc[m.region] = (acc[m.region] || 0) + m.vol;
    });
    return Object.entries(acc)
      .map(([region, value]) => ({ region, value, color: REGION_COLORS[region] || "#94a3b8" }))
      .sort((a, b) => b.value - a.value);
  }, [team5Ranking]);

  const t5Vol = grandT5;
  const t5Share = grandTotal > 0 ? (t5Vol / grandTotal * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/30">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-200 font-medium mb-0.5">💎 Diamond 3.5 · Sales Dashboard</div>
            <h1 className="text-2xl font-bold">📊 ยอดขายทีม 5 — SUB/SWI Overview</h1>
            <p className="text-emerald-100 text-sm mt-1">ติดตามยอดขายรายเดือน · Top Sale · ทีม 5 (ทีมคุณ)</p>
          </div>
          <div className="flex gap-2">
            {[
              { v: "all", l: "รวม 2 ปี" },
              { v: 2568, l: "ปี 2568" },
              { v: 2569, l: "ปี 2569" },
            ].map((y) => (
              <button key={y.v} onClick={() => setYearFilter(y.v as any)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  yearFilter === y.v ? "bg-white text-emerald-700 shadow-lg" : "text-white/80 hover:text-white bg-white/10"
                }`}>
                {y.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* ── KPI CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "ยอดขายรวม", value: `฿${fmt(grandTotal)}`, sub: `${visibleMonths.length} เดือน`, color: "from-indigo-500 to-violet-500", icon: TrendingUp },
            { label: "Fee รวม (0.966%)", value: `฿${grandFee.toLocaleString()}`, sub: "ค่าธรรมเนียม", color: "from-emerald-500 to-teal-500", icon: Target },
            { label: "ทีม 5 ยอดขาย", value: `฿${fmt(t5Vol)}`, sub: `${t5Share.toFixed(1)}% ของยอดรวม`, color: "from-green-500 to-emerald-500", icon: Users },
            { label: "Top Sale", value: top1?.name || "—", sub: top1 ? `฿${fmt(top1.vol)}` : "—", color: "from-amber-500 to-orange-500", icon: Crown },
          ].map((k, i) => (
            <div key={i} className={`bg-gradient-to-br ${k.color} text-white rounded-2xl p-5 shadow-md`}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium opacity-90">{k.label}</div>
                <k.icon size={18} className="opacity-80"/>
              </div>
              <div className="text-2xl font-bold">{k.value}</div>
              <div className="text-xs opacity-80 mt-1">{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── MONTHLY SALES CHART ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">📈 ยอดขายรายเดือน</h2>
              <p className="text-xs text-gray-400">เปรียบเทียบยอดรวม vs ทีม 5</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500 inline-block"/>รวม</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"/>ทีม 5</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} margin={{left:10,right:20,top:5,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="short" tick={{fontSize:11}}/>
              <YAxis tick={{fontSize:10}} tickFormatter={fmt}/>
              <Tooltip
                formatter={(v: number, name: string) => [`฿${v.toLocaleString()}`, name === "total" ? "รวม" : "ทีม 5"]}
                labelFormatter={(label) => MONTHS.find(m => m.short === label)?.label || label}
              />
              <Bar dataKey="total" fill="#6366f1" radius={[4,4,0,0]}/>
              <Bar dataKey="t5" fill="#10b981" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── TEAM 5 PERFORMANCE + TOP SALE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top Sale Crown Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 shadow-sm border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-3">
              <Crown size={20} className="text-amber-500"/>
              <h2 className="text-sm font-bold text-amber-700">🏆 #1 Top Sale</h2>
            </div>
            {top1 && (
              <div>
                <div className="text-2xl font-bold text-amber-700 mb-1">{top1.name}</div>
                <div className="text-xs text-gray-500 mb-3">IC: {top1.ic} · Team {top1.team} {top1.isTeam5 && "💚 (ทีม 5)"}</div>
                <div className="bg-white rounded-xl p-3 mb-2">
                  <div className="text-xs text-gray-400">ยอดขาย</div>
                  <div className="text-xl font-bold text-amber-700">฿{fmtFull(top1.vol)}</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-xs text-gray-400">Fee (0.966%)</div>
                  <div className="text-base font-bold text-emerald-600">฿{top1.fee.toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>

          {/* Team 5 Ranking */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-emerald-600"/>
              <h2 className="text-sm font-semibold text-gray-700">💚 ทีม 5 Ranking — ยอดขายรายบุคคล</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-emerald-100">
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">#</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">ชื่อ</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">จังหวัด</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">ยอดขาย</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">Fee</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">vs Target</th>
                  </tr>
                </thead>
                <tbody>
                  {team5Ranking.map((m, i) => (
                    <tr key={m.code} className="border-b border-emerald-50 hover:bg-emerald-50/50">
                      <td className="py-2 px-2">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                          i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-gray-400 text-white" : i === 2 ? "bg-orange-600 text-white" : "text-gray-400"
                        }`}>{i + 1}</span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="font-semibold text-gray-800">{m.name}</div>
                        <div className="text-gray-400 font-mono text-xs">{m.ic}</div>
                      </td>
                      <td className="py-2 px-2 text-gray-500">{m.province}</td>
                      <td className="py-2 px-2 text-right font-semibold text-emerald-700">฿{fmt(m.vol)}</td>
                      <td className="py-2 px-2 text-right text-emerald-600">฿{m.fee.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right">
                        {m.target > 0 ? (
                          <span className={m.pct >= 100 ? "text-emerald-600 font-bold" : m.pct >= 50 ? "text-amber-600" : "text-gray-400"}>
                            {m.pct.toFixed(0)}%
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── TOP IC RANKING + TEAMS CHART ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top ICs */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-amber-500"/>
                <h2 className="text-sm font-semibold text-gray-700">🏆 Top {showMembers} ICs — {yearFilter === "all" ? "รวม 2 ปี" : `ปี ${yearFilter}`}</h2>
              </div>
              <select value={showMembers} onChange={e => setShowMembers(+e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1">
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
              </select>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-2 px-2 text-gray-400 font-medium w-8">#</th>
                    <th className="text-left py-2 px-2 text-gray-400 font-medium">IC</th>
                    <th className="text-center py-2 px-2 text-gray-400 font-medium w-16">Team</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">Volume</th>
                    <th className="text-right py-2 px-2 text-gray-400 font-medium">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {top5.map((row, i) => (
                    <tr key={row.code} className={`border-b ${
                      row.isTeam5 ? "bg-emerald-50/40 border-emerald-100" : "border-gray-50"
                    } hover:bg-gray-50`}>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          i === 0 ? "text-white" : i < 3 ? "text-white" : "text-gray-400"
                        }`} style={i < 3 ? { backgroundColor: ["#f59e0b", "#94a3b8", "#cd7c2f"][i] } : {}}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="font-semibold text-gray-800">
                          {row.name}
                          {row.isTeam5 && <span className="ml-1 text-emerald-500 text-xs">💚</span>}
                        </div>
                        <div className="text-gray-400 font-mono text-xs">{row.code}</div>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{backgroundColor: TEAM_COLORS[row.team] || "#94a3b8"}}>
                          T{row.team}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-gray-700">฿{fmt(row.vol)}</td>
                      <td className="py-2 px-2 text-right font-bold text-indigo-600">฿{row.fee.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
              <span>💚 = ทีม 5 (ทีมคุณ)</span>
              <span>·</span>
              <span>รวมทีม 5 อยู่ใน Top: <strong className="text-emerald-600">{top5T5.length} คน</strong></span>
            </div>
          </div>

          {/* Top Teams Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">📊 ยอดขายรายทีม</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={teamTotals} layout="vertical" margin={{left:5,right:15}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <XAxis type="number" tick={{fontSize:9}} tickFormatter={fmt}/>
                <YAxis type="category" dataKey="team" tick={{fontSize:10}} width={55}/>
                <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, "Volume"]}/>
                <Bar dataKey="value" radius={[0,4,4,0]}>
                  {teamTotals.map((t, i) => (
                    <Cell key={i} fill={t.color}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-600 mb-2">ทีม 5 ตามภาค</div>
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie data={regionTotals} dataKey="value" nameKey="region" cx="50%" cy="50%" innerRadius={25} outerRadius={45}
                    label={(p: any) => p.region}>
                    {regionTotals.map((t, i) => <Cell key={i} fill={t.color}/>)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `฿${fmt(v)}`}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-400 pb-4">
          💎 Diamond 3.5 · Sales Dashboard · Team 5 Focus · {yearFilter === "all" ? "เม.ย. 2568 - ก.พ. 2569" : `ปี ${yearFilter}`}
        </div>
      </div>
    </div>
  );
}
