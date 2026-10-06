import { useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, BrainCircuit, Check, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { apiGet, apiPost } from "@/lib/api";
import type { ModelInfo, PredictionRequest, PredictionResponse } from "@/lib/types";

const wasteTypes = ["Fruit & Vegetable Market Residue", "Spent Brewery Mash & Grains", "Hotel & Cafeteria Food Scraps", "Agricultural Crop Stover", "Dairy & Coffee Processing Slurry"];
const locations = ["Urban Hospitality Hub", "Regional Agro-Cooperative", "Food Processing Industrial Park", "Wholesale Produce Terminal"];
const seasons = ["Spring / Flush", "Summer / Peak High Sugar", "Autumn / Harvest High Fiber", "Winter / Dense Starchy"];

const defaultForm: PredictionRequest = {
  waste_type: wasteTypes[0],
  quantity_tons: 45,
  source_location: locations[0],
  season: seasons[1],
  moisture_level: 65,
};

const tooltipStyle = { background: "#143d2b", border: "1px solid #436a4e", borderRadius: 12, color: "#f3efe6" };

function SelectField({ label, value, options, onChange, testId }: { label: string; value: string; options: string[]; onChange: (value: string) => void; testId: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#24352b] dark:text-[#e4f0e4]" data-testid={`${testId}-field`}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-[#d8d4c8] bg-[#fffdfa] px-3 text-sm font-medium text-[#24352b] outline-none transition-colors focus:border-[#1e5e41] dark:border-white/10 dark:bg-[#17251d] dark:text-[#e4f0e4]" data-testid={testId}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default function PredictionDashboard() {
  const [form, setForm] = useState<PredictionRequest>(defaultForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const modelInfo = useQuery({ queryKey: ["prediction-model"], queryFn: () => apiGet<ModelInfo>("/predictions/model") });
  const initial = useQuery({ queryKey: ["prediction", "initial"], queryFn: () => apiPost<PredictionResponse>("/predictions", defaultForm) });
  const mutation = useMutation({
    mutationFn: (payload: PredictionRequest) => apiPost<PredictionResponse>("/predictions", payload),
    onSuccess: (data) => { setResult(data); toast.success("Scenario recalculated", { description: "Random Forest demo output is ready to review." }); },
    onError: () => { toast.error("Prediction unavailable", { description: "The model service did not respond. Please try again." }); },
  });
  const shown = result ?? initial.data ?? null;

  const update = <K extends keyof PredictionRequest>(key: K, value: PredictionRequest[K]) => setForm((current) => ({ ...current, [key]: value }));
  const calculate = (event?: FormEvent) => { event?.preventDefault(); mutation.mutate(form); };
  const applyPreset = (next: PredictionRequest) => { setForm(next); mutation.mutate(next); };

  return (
    <section id="prediction-dashboard" className="relative overflow-hidden bg-[#143d2b] px-4 py-24 text-[#f3efe6] sm:px-6 lg:px-8 lg:py-32" data-testid="prediction-dashboard-section">
      <div className="pointer-events-none absolute -right-40 top-20 size-96 rounded-full border border-[#c9e1ba]/20" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#d97706]/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3" data-testid="prediction-dashboard-kicker"><span className="eyebrow text-[#b7d5a9]">AJET intelligence lab</span><span className="rounded-full border border-[#b7d5a9]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c9e1ba]" data-testid="demo-model-badge">Demo / sample data</span></div>
            <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl" data-testid="prediction-dashboard-heading">Turn one waste stream into a clear yield scenario.</h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[#c9d8cc] lg:justify-self-end" data-testid="prediction-dashboard-description">A transparent prototype for operations teams. Adjust the feedstock, and the model translates its potential into products, value, time and avoided emissions.</p>
        </div>
        <div className="mb-8 grid gap-3 sm:grid-cols-3" data-testid="prediction-flow">
          {["Input waste data", "Random Forest model runs", "Review yield + impact"].map((step, index) => <div key={step} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3" data-testid={`prediction-flow-step-${index + 1}`}><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d97706] font-mono text-xs font-bold text-white">0{index + 1}</span><span className="text-sm font-semibold text-[#e4f0e4]">{step}</span>{index < 2 && <ArrowRight size={15} className="ml-auto hidden text-[#92b98c] sm:block" />}</div>)}
        </div>
        <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-[#f8f5ee] text-[#24352b] shadow-2xl lg:grid-cols-[0.83fr_1.17fr] dark:bg-[#12231a] dark:text-[#e4f0e4]">
          <form onSubmit={calculate} className="border-b border-[#e6dec7] p-6 sm:p-8 lg:border-b-0 lg:border-r dark:border-white/10" data-testid="prediction-form">
            <div className="mb-7 flex items-start justify-between gap-4"><div><p className="eyebrow text-[#1e5e41] dark:text-[#9dc592]">Scenario inputs</p><h3 className="mt-2 font-serif text-2xl font-semibold">Feed the model</h3></div><BrainCircuit className="text-[#d97706]" size={24} /></div>
            <div className="grid gap-5">
              <SelectField label="Waste type" value={form.waste_type} options={wasteTypes} onChange={(value) => update("waste_type", value)} testId="prediction-waste-type" />
              <label className="grid gap-2 text-sm font-semibold" data-testid="prediction-quantity-field"><span className="flex justify-between"><span>Quantity of waste</span><strong className="font-mono text-[#d97706]" data-testid="prediction-quantity-value">{form.quantity_tons} t</strong></span><input type="range" min="1" max="500" value={form.quantity_tons} onChange={(event) => update("quantity_tons", Number(event.target.value))} className="accent-[#d97706]" data-testid="prediction-quantity-slider" /></label>
              <SelectField label="Source / location" value={form.source_location} options={locations} onChange={(value) => update("source_location", value)} testId="prediction-source-location" />
              <SelectField label="Date / season" value={form.season} options={seasons} onChange={(value) => update("season", value)} testId="prediction-season" />
              <label className="grid gap-2 text-sm font-semibold" data-testid="prediction-moisture-field"><span className="flex justify-between"><span>Moisture / quality level</span><strong className="font-mono text-[#d97706]" data-testid="prediction-moisture-value">{form.moisture_level}%</strong></span><input type="range" min="20" max="85" value={form.moisture_level} onChange={(event) => update("moisture_level", Number(event.target.value))} className="accent-[#d97706]" data-testid="prediction-moisture-slider" /></label>
            </div>
            <div className="mt-7 border-t border-[#e6dec7] pt-6 dark:border-white/10"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#68766c] dark:text-[#a8bcab]">Quick scenarios</p><div className="flex flex-wrap gap-2">{[["50t brewery", { ...defaultForm, waste_type: wasteTypes[1], quantity_tons: 50 }], ["120t market", { ...defaultForm, quantity_tons: 120, source_location: locations[3] }], ["15t hotel", { ...defaultForm, waste_type: wasteTypes[2], quantity_tons: 15 }]].map(([label, value]) => <button key={label as string} type="button" onClick={() => applyPreset(value as PredictionRequest)} className="rounded-full border border-[#d8d4c8] px-3 py-1.5 text-xs font-semibold transition-colors hover:border-[#1e5e41] hover:bg-[#edf2e9] dark:border-white/15 dark:hover:bg-white/10" data-testid={`prediction-preset-${(label as string).replaceAll(" ", "-")}`}>{label as string}</button>)}</div></div>
            <button type="submit" disabled={mutation.isPending} className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d97706] px-5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60" data-testid="prediction-calculate-button">{mutation.isPending ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}{mutation.isPending ? "Running scenario" : "Calculate yield"}</button>
          </form>
          <div className="min-w-0 bg-[#143d2b] p-6 text-[#f3efe6] sm:p-8" data-testid="prediction-results">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow text-[#9dc592]">Predicted output</p><h3 className="mt-2 font-serif text-2xl font-semibold text-[#f3efe6]">Your circular yield map</h3></div><span className="inline-flex items-center gap-1.5 rounded-full bg-[#b7d5a9]/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c9e1ba]" data-testid="prediction-model-status"><Check size={13} /> {shown?.model_label ?? modelInfo.data?.label ?? "Loading model"}</span></div>
            {!shown ? (
              <div className="grid h-72 place-items-center rounded-2xl border border-white/10 bg-white/[0.06]" data-testid="prediction-results-loading">
                {initial.isError ? <p className="text-sm text-[#efb36b]">The model service is unavailable. Press “Calculate yield” to retry.</p> : <span className="inline-flex items-center gap-2 text-sm text-[#c9d8cc]"><Loader2 className="animate-spin" size={16} /> Training demo forest and running the first scenario…</span>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Waste forecast", `${shown.predicted_volume_tons} t`, "next input"], ["Products created", `${shown.processing_output_tons} t`, `range ${shown.output_range_low_tons}–${shown.output_range_high_tons} t`], ["Market value", `$${shown.estimated_market_value_usd.toLocaleString()}`, "estimated"], ["CO₂ avoided", `${shown.co2_reduction_tons} t`, "landfill equivalent"]].map(([label, value, sub]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4" data-testid={`prediction-kpi-${(label as string).toLowerCase().replaceAll(" ", "-")}`}><p className="text-[11px] font-semibold text-[#a8bcab]">{label}</p><p className="mt-2 font-serif text-2xl font-semibold text-[#f3efe6]">{value}</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#7f9f72]">{sub}</p></div>)}</div>
                <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]"><div className="rounded-2xl border border-white/10 bg-[#0c2a1b]/40 p-4" data-testid="prediction-trajectory-chart"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Four-week output trajectory</p><span className="font-mono text-[10px] text-[#9dc592]">TONNES</span></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><AreaChart data={shown.trajectory}><defs><linearGradient id="yieldFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9dc592" stopOpacity={0.7} /><stop offset="100%" stopColor="#9dc592" stopOpacity={0.03} /></linearGradient></defs><XAxis dataKey="week" stroke="#7f9f72" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} /><YAxis stroke="#7f9f72" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={30} /><Tooltip contentStyle={tooltipStyle} /><Area type="monotone" dataKey="output" stroke="#c9e1ba" fill="url(#yieldFill)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div><div className="rounded-2xl border border-white/10 bg-[#0c2a1b]/40 p-4" data-testid="prediction-breakdown-chart"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">Product mix</p><span className="font-mono text-[10px] text-[#9dc592]">OUTPUT</span></div><div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-2"><div className="h-44"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={shown.breakdown} dataKey="value" nameKey="name" innerRadius={43} outerRadius={66} paddingAngle={4}>{shown.breakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer></div><div className="grid gap-3">{shown.breakdown.map((entry) => <div key={entry.name} className="flex items-center gap-2 text-xs"><span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} /><span className="min-w-0 flex-1 text-[#c9d8cc]">{entry.name}</span><strong className="font-mono text-[#f3efe6]">{entry.value}{entry.unit}</strong></div>)}</div></div></div></div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-xl bg-[#b7d5a9]/10 px-4 py-3" data-testid="prediction-compost-output"><p className="text-[10px] uppercase tracking-[0.14em] text-[#9dc592]">Compost yield</p><p className="mt-1 font-mono text-lg font-semibold">{shown.compost_yield_tons} t</p></div><div className="rounded-xl bg-[#b7d5a9]/10 px-4 py-3" data-testid="prediction-biogas-output"><p className="text-[10px] uppercase tracking-[0.14em] text-[#9dc592]">Biogas potential</p><p className="mt-1 font-mono text-lg font-semibold">{shown.biogas_yield_m3.toLocaleString()} m³</p></div><div className="col-span-2 rounded-xl bg-[#d97706]/15 px-4 py-3 sm:col-span-1" data-testid="prediction-time-output"><p className="text-[10px] uppercase tracking-[0.14em] text-[#efb36b]">Processing window</p><p className="mt-1 font-mono text-lg font-semibold text-[#f3efe6]">{shown.processing_time_days} days</p></div></div>
                <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-2xl border border-white/10 bg-[#0c2a1b]/40 p-4" data-testid="prediction-feature-importance-chart">
                    <div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold">What drives the forecast</p><span className="font-mono text-[10px] text-[#9dc592]">FEATURE IMPORTANCE</span></div>
                    <div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={shown.feature_importance} layout="vertical" margin={{ left: 8, right: 16 }}><XAxis type="number" hide domain={[0, 1]} /><YAxis type="category" dataKey="feature" stroke="#7f9f72" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} width={92} /><Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${Math.round(value * 100)}%`} /><Bar dataKey="importance" radius={[0, 6, 6, 0]}>{shown.feature_importance.map((entry, index) => <Cell key={entry.feature} fill={index === 0 ? "#d97706" : "#7f9f72"} />)}</Bar></BarChart></ResponsiveContainer></div>
                    {modelInfo.data && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7f9f72]" data-testid="prediction-model-meta">{modelInfo.data.algorithm} · {modelInfo.data.training_samples.toLocaleString()} synthetic samples · R² {modelInfo.data.r2_score}</p>}
                  </div>
                  <div className="rounded-2xl border border-[#d97706]/30 bg-[#d97706]/10 p-4" data-testid="prediction-insights">
                    <div className="mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-[#efb36b]" /><p className="text-sm font-semibold">AI recommendations</p><span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-[#efb36b]">Demo</span></div>
                    <ul className="grid gap-2.5">{shown.insights.map((note, index) => <li key={note} className="flex gap-2.5 text-sm leading-6 text-[#e4ead9]" data-testid={`prediction-insight-${index + 1}`}><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#efb36b]" />{note}</li>)}</ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}