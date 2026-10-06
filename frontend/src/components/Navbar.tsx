import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, Menu, Moon, Sun, X } from "lucide-react";

const links = [
  ["Story", "/#story", "story"],
  ["Process", "/#process", "process"],
  ["Products", "/#products", "products"],
  ["Second life", "/#second-life", "second-life"],
  ["Impact", "/#impact", "impact"],
  ["AI predictor", "/predictor", "predictor"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const { pathname } = useLocation();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(document.documentElement.classList.contains("dark"));
  };

  const closeMenu = () => setOpen(false);
  const isActive = (to: string) => to === pathname;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8" data-testid="site-navbar">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/50 bg-[#fbfaf6]/90 px-4 shadow-[0_12px_40px_rgba(20,61,43,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[#111d17]/90 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2" data-testid="brand-logo-link">
            <span className="grid size-9 place-items-center rounded-full bg-[#143d2b] text-[#f3efe6]" data-testid="brand-logo-mark"><Leaf size={18} /></span>
            <span className="font-serif text-xl font-bold tracking-tight text-[#143d2b] dark:text-[#e4f0e4]" data-testid="brand-name">AJET</span>
          </Link>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
            {links.map(([label, to, id]) => (
              <Link key={id} to={to} aria-current={isActive(to) ? "page" : undefined} className={`text-[11px] font-semibold uppercase tracking-[0.13em] transition-colors duration-200 hover:text-[#143d2b] dark:hover:text-white ${isActive(to) ? "text-[#d97706] underline decoration-2 underline-offset-8" : "text-[#526058] dark:text-[#b8c9bd]"}`} data-testid={`nav-link-${id}`}>{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleTheme} className="grid size-9 place-items-center rounded-full text-[#526058] transition-colors duration-200 hover:bg-[#e8e4d8] hover:text-[#143d2b] dark:text-[#b8c9bd] dark:hover:bg-white/10 dark:hover:text-white" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-testid="theme-toggle-button">
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link to="/predictor" className="hidden rounded-full bg-[#d97706] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-transform duration-200 hover:-translate-y-0.5 sm:inline-flex" data-testid="navbar-audit-cta">Audit your stream</Link>
            <button type="button" onClick={() => setOpen((value) => !value)} className="grid size-9 place-items-center rounded-full border border-[#e6dec7] text-[#143d2b] lg:hidden dark:border-white/10 dark:text-white" aria-label={open ? "Close navigation" : "Open navigation"} data-testid="mobile-menu-toggle">
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-[#e6dec7] py-4 lg:hidden dark:border-white/10" aria-label="Mobile navigation" data-testid="mobile-navigation">
            {links.map(([label, to, id]) => (
              <Link key={id} to={to} onClick={closeMenu} aria-current={isActive(to) ? "page" : undefined} className={`block rounded-xl px-3 py-3 text-sm font-semibold hover:bg-[#f3efe6] dark:hover:bg-white/5 ${isActive(to) ? "text-[#d97706]" : "text-[#143d2b] dark:text-[#e4f0e4]"}`} data-testid={`mobile-nav-link-${id}`}>{label}</Link>
            ))}
            <Link to="/predictor" onClick={closeMenu} className="mt-2 block rounded-xl bg-[#d97706] px-3 py-3 text-center text-sm font-bold text-white" data-testid="mobile-audit-cta">Audit your stream</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
