from typing import List

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    waste_type: str = Field(min_length=2, max_length=120)
    quantity_tons: float = Field(gt=0, le=500)
    source_location: str = Field(min_length=2, max_length=120)
    season: str = Field(min_length=2, max_length=80)
    moisture_level: int = Field(ge=20, le=85)


class YieldBreakdown(BaseModel):
    name: str
    value: float
    unit: str
    color: str


class YieldTrajectoryPoint(BaseModel):
    week: str
    output: float


class FeatureImportance(BaseModel):
    feature: str
    importance: float


class ModelInfo(BaseModel):
    label: str
    algorithm: str
    is_demo: bool
    training_samples: int
    r2_score: float
    feature_importance: List[FeatureImportance]


class PredictionResponse(BaseModel):
    id: str
    is_demo: bool
    model_label: str
    predicted_volume_tons: float
    processing_output_tons: float
    output_range_low_tons: float
    output_range_high_tons: float
    compost_yield_tons: float
    biogas_yield_m3: float
    liquid_enhancer_liters: float
    estimated_market_value_usd: float
    co2_reduction_tons: float
    processing_time_days: int
    breakdown: List[YieldBreakdown]
    trajectory: List[YieldTrajectoryPoint]
    feature_importance: List[FeatureImportance]
    insights: List[str]