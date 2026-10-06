import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titles: Record<string, [string, string]> = {
  "/": ["AJET — Nothing is Waste", "AJET turns organic waste into regenerative products, measurable impact, and better yield decisions."],
  "/predictor": ["AI Waste & Yield Predictor — AJET", "Run a demo Random Forest scenario: enter a waste stream and see predicted compost, biogas, value and CO₂ impact."],
};

function applySeo(pathname: string) {
  const [title, description] = titles[pathname] ?? titles["/"];
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
}

function scrollToHash(hash: string) {
  document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Scrolls to the hash target (cross-page anchors like /#story) or to the top on route change, and sets per-route SEO metadata. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => applySeo(pathname), [pathname]);

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return undefined;
    }
    const frame = requestAnimationFrame(() => scrollToHash(hash));
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
