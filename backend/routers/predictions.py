from uuid import uuid4

from fastapi import APIRouter

from lib.yield_model import yield_model
from models.prediction import (
    FeatureImportance,
    ModelInfo,
    PredictionRequest,
    PredictionResponse,
    YieldBreakdown,
    YieldTrajectoryPoint,
)

router = APIRouter(prefix="/predictions", tags=["predictions"])


def _insights(input_data: PredictionRequest, compost: float, biogas: float, low: float, high: float) -> list[str]:
    """Rule-based recommendations derived from the model output (no external AI service)."""
    notes: list[str] = []
    if input_data.moisture_level > 75:
        notes.append("High moisture favours anaerobic digestion: route a larger share to the biogas line and add dry bulking agent for the compost windrows.")
    elif input_data.moisture_level < 40:
        notes.append("Low moisture slows composting: blend with wetter feedstock or add process water to reach the 55-65% sweet spot.")
    else:
        notes.append("Moisture is inside the optimal composting band, so both compost and biogas lines can run at design rate.")
    if "Brewery" in input_data.waste_type or "Dairy" in input_data.waste_type:
        notes.append("This feedstock is energy-dense: prioritise biogas capture and sell the digestate as liquid soil enhancer.")
    elif "Stover" in input_data.waste_type:
        notes.append("Fibrous crop residue is slow to digest: use it as carbon-rich bulking material for the compost line.")
    else:
        notes.append("Food-grade residue degrades quickly: schedule collection within 48 hours to preserve compost quality.")
    spread = (high - low) / max(high, 0.01)
    if spread > 0.25:
        notes.append("The model's confidence band is wide for this scenario; a real plant log would tighten the estimate.")
    else:
        notes.append(f"The forest's trees agree closely (±{round(spread * 50)}%), indicating a well-covered scenario.")
    if compost > biogas / 1000:
        notes.append("Compost dominates the product mix: line up agro-cooperative buyers before the batch finishes curing.")
    return notes


def _predict(input_data: PredictionRequest) -> PredictionResponse:
    raw = yield_model.predict_raw(
        input_data.waste_type,
        input_data.quantity_tons,
        input_data.source_location,
        input_data.season,
        input_data.moisture_level,
    )
    compost, biogas, enhancer, co2 = raw.compost_tons, raw.biogas_m3, raw.enhancer_liters, raw.co2_tons
    seasonal_factor = 1.06 if "Summer" in input_data.season else 0.96 if "Winter" in input_data.season else 1.0
    volume = input_data.quantity_tons * (0.96 + input_data.moisture_level / 600) * seasonal_factor
    value = compost * 128 + (biogas / 10) * 0.68 + enhancer * 0.11
    processing_days = round(18 + (85 - input_data.moisture_level) / 10 + (0 if "Fruit" in input_data.waste_type else 2))
    total_output = compost + biogas / 1000 + enhancer / 1000
    breakdown = [
        YieldBreakdown(name="Compost", value=round(compost, 1), unit="t", color="#1f6b48"),
        YieldBreakdown(name="Biogas", value=round(biogas / 100, 1), unit="×100 m³", color="#d97706"),
        YieldBreakdown(name="Soil enhancer", value=round(enhancer / 100, 1), unit="×100 L", color="#7f9f72"),
    ]
    ramp = [0.22, 0.48, 0.78, 1.0]
    trajectory = [YieldTrajectoryPoint(week=f"W{index + 1}", output=round(total_output * share, 1)) for index, share in enumerate(ramp)]
    return PredictionResponse(
        id=str(uuid4()),
        is_demo=True,
        model_label=yield_model.label,
        predicted_volume_tons=round(volume, 1),
        processing_output_tons=round(total_output, 1),
        output_range_low_tons=round(raw.output_low_tons, 1),
        output_range_high_tons=round(raw.output_high_tons, 1),
        compost_yield_tons=round(compost, 1),
        biogas_yield_m3=round(biogas, 0),
        liquid_enhancer_liters=round(enhancer, 0),
        estimated_market_value_usd=round(value, 0),
        co2_reduction_tons=round(co2, 1),
        processing_time_days=processing_days,
        breakdown=breakdown,
        trajectory=trajectory,
        feature_importance=[FeatureImportance(feature=name, importance=score) for name, score in yield_model.feature_importance()],
        insights=_insights(input_data, compost, biogas, raw.output_low_tons, raw.output_high_tons),
    )


@router.get("/model", response_model=ModelInfo)
async def model_info() -> ModelInfo:
    return ModelInfo(
        label=yield_model.label,
        algorithm="RandomForestRegressor",
        is_demo=True,
        training_samples=yield_model.training_samples,
        r2_score=round(yield_model.r2_score, 3),
        feature_importance=[FeatureImportance(feature=name, importance=score) for name, score in yield_model.feature_importance()],
    )


@router.post("", response_model=PredictionResponse)
async def create_prediction(input_data: PredictionRequest) -> PredictionResponse:
    return _predict(input_data)
