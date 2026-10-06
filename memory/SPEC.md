# AJET MVP Specification

## Product
AJET is a warm, agricultural circular-economy marketing site. It tells the story of organic waste becoming compost, biogas, soil enhancers, feed ingredients, gardening products and a composting/odor-control spray liquid (six product cards in `frontend/src/pages/Home.tsx` `products` array).

## Core flows
- Routes: `/` (one-page story) and `/predictor` (dedicated AI dashboard page). `ScrollManager` in `App.tsx` handles cross-page anchors (`/#story` etc.), scroll-to-top on route change and per-route title/meta description.
- Visitors navigate the story using the navbar (react-router `Link`s to `/#section`), mobile navigation, and the "AI predictor" link / "Audit your stream" CTA / hero CTA / teaser button / final CTA, which all open `/predictor`.
- The main page shows a compact `PredictorTeaser` (id `prediction-dashboard`, after Impact, before Partner) instead of the inline dashboard.
- The prediction dashboard (`PredictionDashboard standalone` on `/predictor`) accepts waste type, quantity, source, season, and moisture, then calls `POST /api/predictions` for a clearly labelled demo Random Forest response with KPI cards and charts.
- The partnership form validates the visitor's details, stores the inquiry in MongoDB, and sends a server-rendered notification through Emergent's managed email integration to the configured AJET inbox.

## Data model
- `PredictionRequest` / `PredictionResponse`: demo yield estimates, product breakdown, and four-week trajectory.
- `PartnerInquiryCreate` / `PartnerInquiryResponse`: public partnership inquiry, stored in `partner_inquiries` with a string UUID and UTC timestamp.

## Auth
No authentication or gated areas in this marketing MVP.

## Demo and integration notes
- The prediction engine is a real scikit-learn `RandomForestRegressor` (`backend/lib/yield_model.py`) trained at process start on 1,600 synthetic sample rows; it runs fully offline with no API keys (the user explicitly declined Claude / paid LLMs). Labelled as demo data in the UI.
- `GET /api/predictions/model` exposes model metadata (algorithm, training samples, R², feature importance). `POST /api/predictions` returns yields, a 10–90th percentile output range from per-tree predictions, feature importance and rule-based "AI recommendations" (`insights`).
- To swap in a production model, replace `YieldModel.predict_raw` with a call to the trained artefact/inference API and keep the same return shape.
- Email delivery is configured for the owner-controlled inbox in `backend/.env`; the form remains a public route with fixed server-side recipient and template.