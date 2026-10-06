"""Demo AI model for AJET yield prediction.

A scikit-learn RandomForestRegressor trained at import time on a synthetic,
clearly-labelled sample dataset. It runs fully offline (no API keys, no cost).
To swap in a real trained model later, replace `YieldModel.predict_raw` with a
call into your trained artefact / inference API and keep the same return shape.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

import numpy as np
from sklearn.ensemble import RandomForestRegressor

WASTE_TYPES = [
    "Fruit & Vegetable Market Residue",
    "Spent Brewery Mash & Grains",
    "Hotel & Cafeteria Food Scraps",
    "Agricultural Crop Stover",
    "Dairy & Coffee Processing Slurry",
]
LOCATIONS = [
    "Urban Hospitality Hub",
    "Regional Agro-Cooperative",
    "Food Processing Industrial Park",
    "Wholesale Produce Terminal",
]
SEASONS = ["Spring / Flush", "Summer / Peak High Sugar", "Autumn / Harvest High Fiber", "Winter / Dense Starchy"]

FEATURE_NAMES = ["Waste type", "Quantity", "Source location", "Season", "Moisture"]
TARGETS = ["compost_tons", "biogas_m3", "enhancer_liters", "co2_tons"]

# Per-waste-type process coefficients: (compost fraction, biogas m3/t x10, CO2 t/t)
_TYPE_FACTORS: Dict[str, tuple[float, float, float]] = {
    WASTE_TYPES[0]: (0.53, 10.0, 0.74),
    WASTE_TYPES[1]: (0.38, 15.0, 0.91),
    WASTE_TYPES[2]: (0.47, 12.5, 0.82),
    WASTE_TYPES[3]: (0.33, 6.5, 0.55),
    WASTE_TYPES[4]: (0.41, 8.0, 0.69),
}
_LOCATION_FACTORS = {LOCATIONS[0]: 0.97, LOCATIONS[1]: 1.04, LOCATIONS[2]: 1.0, LOCATIONS[3]: 1.02}
_SEASON_FACTORS = {SEASONS[0]: 1.0, SEASONS[1]: 1.06, SEASONS[2]: 1.02, SEASONS[3]: 0.96}


def _encode(waste_type: str, quantity: float, location: str, season: str, moisture: float) -> List[float]:
    return [
        float(WASTE_TYPES.index(waste_type) if waste_type in WASTE_TYPES else len(WASTE_TYPES)),
        float(quantity),
        float(LOCATIONS.index(location) if location in LOCATIONS else len(LOCATIONS)),
        float(SEASONS.index(season) if season in SEASONS else len(SEASONS)),
        float(moisture),
    ]


def _ground_truth(rng: np.random.Generator, waste_type: str, quantity: float, location: str, season: str, moisture: float) -> List[float]:
    """Synthetic 'plant data' generator: physical rules of thumb plus measurement noise."""
    compost_frac, biogas_rate, co2_rate = _TYPE_FACTORS.get(waste_type, (0.44, 9.0, 0.72))
    moisture_adj = 1 - abs(moisture - 65) / 180
    season_f = _SEASON_FACTORS.get(season, 1.0)
    loc_f = _LOCATION_FACTORS.get(location, 1.0)
    noise = lambda sd: float(rng.normal(1.0, sd))  # noqa: E731
    compost = quantity * compost_frac * moisture_adj * loc_f * noise(0.05)
    biogas = quantity * biogas_rate * 10 * (0.94 + moisture / 700) * season_f * noise(0.07)
    enhancer = quantity * 185 * moisture_adj * noise(0.06)
    co2 = quantity * co2_rate * (0.85 + moisture / 450) * loc_f * noise(0.04)
    return [compost, biogas, enhancer, co2]


@dataclass
class RawPrediction:
    compost_tons: float
    biogas_m3: float
    enhancer_liters: float
    co2_tons: float
    output_low_tons: float
    output_high_tons: float


class YieldModel:
    label = "Demo Random Forest (scikit-learn, synthetic sample data)"

    def __init__(self, samples: int = 1600, seed: int = 42) -> None:
        rng = np.random.default_rng(seed)
        X: List[List[float]] = []
        y: List[List[float]] = []
        for _ in range(samples):
            wt = WASTE_TYPES[int(rng.integers(len(WASTE_TYPES)))]
            loc = LOCATIONS[int(rng.integers(len(LOCATIONS)))]
            season = SEASONS[int(rng.integers(len(SEASONS)))]
            qty = float(rng.uniform(1, 500))
            moisture = float(rng.uniform(20, 85))
            X.append(_encode(wt, qty, loc, season, moisture))
            y.append(_ground_truth(rng, wt, qty, loc, season, moisture))
        self.training_samples = samples
        self._X = np.array(X)
        self._y = np.array(y)
        self.model = RandomForestRegressor(n_estimators=120, min_samples_leaf=2, random_state=seed, n_jobs=1)
        self.model.fit(self._X, self._y)
        self.r2_score = float(self.model.score(self._X, self._y))

    @staticmethod
    def _total_output(row: np.ndarray) -> float:
        # compost t + biogas (m3 -> t-equivalent /1000) + enhancer (L -> t /1000)
        return float(row[0] + row[1] / 1000 + row[2] / 1000)

    def predict_raw(self, waste_type: str, quantity: float, location: str, season: str, moisture: float) -> RawPrediction:
        x = np.array([_encode(waste_type, quantity, location, season, moisture)])
        mean = self.model.predict(x)[0]
        per_tree = np.array([tree.predict(x)[0] for tree in self.model.estimators_])
        totals = np.array([self._total_output(row) for row in per_tree])
        low, high = np.percentile(totals, [10, 90])
        return RawPrediction(
            compost_tons=max(0.0, float(mean[0])),
            biogas_m3=max(0.0, float(mean[1])),
            enhancer_liters=max(0.0, float(mean[2])),
            co2_tons=max(0.0, float(mean[3])),
            output_low_tons=max(0.0, float(low)),
            output_high_tons=max(0.0, float(high)),
        )

    def feature_importance(self) -> List[tuple[str, float]]:
        return [(name, round(float(score), 3)) for name, score in zip(FEATURE_NAMES, self.model.feature_importances_)]


# Singleton trained once per process (sub-second on this dataset size).
yield_model = YieldModel()
