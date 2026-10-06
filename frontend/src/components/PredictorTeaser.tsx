import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit } from "lucide-react";

const steps = ["Input waste data", "Random Forest model", "Yield + impact"];

export default function PredictorTeaser() {
  return (
    <section id="prediction-dashboard" className="relative overflow-hidden bg-[#143d2b] px-4 py-20 text-[#f3efe6] sm:px-6 lg:px-8 lg:py-24" data-testid="predictor-teaser-section">
      <div className="pointer-events-none absolute -right-32 -top-24 size-80 rounded-full border border-[#c9e1ba]/20" />
      <div className="pointer-events-none absolute -bottom-24 left-10 size-64 rounded-full bg-[#d97706]/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3"><span className="eyebrow text-[#b7d5a9]" data-testid="predictor-teaser-kicker">AJET intelligence lab</span><span className="rounded-full border border-[#b7d5a9]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c9e1ba]" data-testid="predictor-teaser-demo-badge">Demo / sample data</span></div>
          <h2 className="max-w-2xl font-serif text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl" data-testid="predictor-teaser-heading">Predict what a waste stream can become before it arrives.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#c9d8cc]" data-testid="predictor-teaser-description">Our AI predictor turns feedstock, quantity, season and moisture into expected compost, biogas, product value and CO₂ avoided — in one focused workspace.</p>
          <Link to="/predictor" className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-[#d97706] px-6 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-1" data-testid="predictor-teaser-open-button">Open AI Predictor <ArrowRight size={17} /></Link>
        </div>
        <div className="grid gap-3" data-testid="predictor-teaser-flow">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4" data-testid={`predictor-teaser-step-${index + 1}`}>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#d97706] font-mono text-xs font-bold text-white">0{index + 1}</span>
              <span className="flex-1 font-serif text-xl font-semibold text-[#e4f0e4]">{step}</span>
              {index === 1 ? <BrainCircuit size={18} className="text-[#9dc592]" /> : <ArrowRight size={16} className="text-[#7f9f72]" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
