# AJET — Move the AI Predictor to Its Own Page

The AI Waste Prediction & Product Yield Dashboard leaves the one-page site and gets a dedicated page at `/predictor`.
The main page keeps the story flowing and points visitors to the predictor through a short teaser, a navbar link and the header CTA.

## Who it's for
- Visitors reading the AJET story who want a cleaner, faster main page.
- Operations teams, partners and admins who want a focused, full-width workspace for running yield scenarios.

## Core features and experience
- **New page `/predictor`**: the complete existing dashboard (inputs, Random Forest demo output, KPI cards, trajectory and product-mix charts, feature importance, AI recommendations, quick-scenario presets), given room to breathe at full width.
- **Page header**: page title, demo-data badge, one-line description and a "Back to home" link; the site navbar and footer stay so the page feels part of AJET.
- **Main page teaser** replacing the dashboard section: headline, the three-step flow (Input waste data → Random Forest model → Yield + impact), one sentence on what the tool does, and an "Open AI Predictor" button.
- **Links to the predictor**: the "AI Predictor" item in the desktop and mobile navbar, the header "Audit your stream" CTA, the teaser button and the final-CTA section all go to `/predictor`.
- **Navigation that still works from the new page**: section links (Story, Process, Products…) clicked on `/predictor` return to the main page and scroll to the right section; the predictor page opens at the top.
- SEO title/description specific to the predictor page; unchanged behaviour of the partnership form on the main page.

## User flow
1. Visitor lands on the main page, scrolls the story, reaches the "AI Predictor" teaser.
2. Clicks "Open AI Predictor" (or the navbar link / header CTA) → lands at the top of `/predictor`.
3. Adjusts waste type, quantity, source, season and moisture, or taps a quick scenario → results update in place with charts, KPIs and recommendations.
4. Clicks "Back to home" or any section link → returns to the main page at the chosen section; the "Partner with AJET" form remains the conversion point.
5. Direct visits and refreshes of `/predictor` load the page correctly.

## UI/UX feel
- Same earthy forest-green / clay / off-white system, typography and motion as the rest of the site; the predictor page reads as a "lab" chapter of AJET rather than a different product.
- Teaser on the main page is compact and dark-surfaced so it stands out as a doorway, not a second dashboard.
- Dashboard panels on the new page widen to use the full viewport on desktop; tablet and mobile stack vertically as today.
- Subtle page-enter animation on the predictor; active navbar state shows "AI Predictor" when on that page.

## Implementation phases
**Phase 1 — MVP (built now)**
- `/predictor` route and page with the full existing dashboard, header, back link, SEO metadata.
- Main-page teaser section replacing the inline dashboard; all predictor links (nav, header CTA, teaser, final CTA) repointed.
- Cross-page section navigation (links from `/predictor` back to main-page anchors) and scroll-to-top on route change.
- Mobile menu link to the predictor.

**Phase 2 — later**
- Shareable scenario links (inputs encoded in the URL) and a "copy link" button.
- Side-by-side comparison of two scenarios.

**Phase 3 — later**
- Saved scenario history for returning users.
- CSV upload for batch forecasts and a downloadable report.

## Assumptions
- URL is `/predictor`; the old `#prediction-dashboard` anchor on the main page is replaced by the teaser section (same place in the story order: after Impact, before Partner).
- The predictor page keeps the shared site navbar and footer (not a standalone full-screen app).
- The teaser is a short block (headline, 3-step flow, button) rather than removing the section entirely or showing live sample numbers.
- The header "Audit your stream" CTA now opens the predictor page (it previously scrolled to the inline dashboard).
- No login or admin gate is added; the predictor stays public, as today.
- The prediction engine, inputs and outputs are unchanged — this is a layout/navigation change only.
