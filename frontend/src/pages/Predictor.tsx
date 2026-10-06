import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PredictionDashboard from "@/components/PredictionDashboard";

export default function Predictor() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#143d2b] text-[#f3efe6]" data-testid="ajet-predictor-page">
      <Navbar />
      <main className="animate-[rise-in_0.6s_ease-out_both]">
        <section className="px-4 pb-10 pt-32 sm:px-6 lg:px-8 lg:pt-36" data-testid="predictor-header">
          <div className="mx-auto max-w-[1400px]">
            <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#b7d5a9] transition-colors hover:text-white" data-testid="predictor-back-link"><ArrowLeft size={14} /> Back to home</Link>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3"><span className="eyebrow text-[#b7d5a9]" data-testid="predictor-kicker">AJET intelligence lab</span><span className="rounded-full border border-[#b7d5a9]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c9e1ba]" data-testid="demo-model-badge">Demo / sample data</span></div>
                <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl" data-testid="predictor-heading">AI Waste Prediction & Product Yield Dashboard</h1>
              </div>
              <p className="max-w-md text-base leading-7 text-[#c9d8cc] lg:justify-self-end" data-testid="predictor-description">A transparent prototype for operations teams. Adjust the feedstock, and the demo Random Forest translates its potential into products, value, time and avoided emissions.</p>
            </div>
          </div>
        </section>
        <PredictionDashboard standalone />
      </main>
      <Footer />
    </div>
  );
}
