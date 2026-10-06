import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#143d2b] px-4 py-10 text-[#f3efe6] sm:px-6 lg:px-8" data-testid="site-footer">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-[#d97706] text-white"><Leaf size={15} /></span><span className="font-serif text-2xl font-bold" data-testid="footer-brand-name">AJET</span></div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#b7d5a9]" data-testid="footer-description">Nothing is waste. It’s just a resource in the wrong place.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#c9d8cc]">
          <Link to="/#story" data-testid="footer-link-story">Story</Link>
          <Link to="/#products" data-testid="footer-link-products">Products</Link>
          <Link to="/predictor" data-testid="footer-link-prediction">AI predictor</Link>
          <Link to="/#partner" data-testid="footer-link-partner">Partner</Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7f9f72]" data-testid="footer-copyright">Prototype company data · AJET circular systems · 2026</div>
    </footer>
  );
}
