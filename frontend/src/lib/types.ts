export interface RootResponse {
  message: string;
}

export interface PredictionRequest {
  waste_type: string;
  quantity_tons: number;
  source_location: string;
  season: string;
  moisture_level: number;
}

export interface YieldBreakdown {
  name: string;
  value: number;
  unit: string;
  color: string;
}

export interface YieldTrajectoryPoint {
  week: string;
  output: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ModelInfo {
  label: string;
  algorithm: string;
  is_demo: boolean;
  training_samples: number;
  r2_score: number;
  feature_importance: FeatureImportance[];
}

export interface PredictionResponse {
  id: string;
  is_demo: boolean;
  model_label: string;
  predicted_volume_tons: number;
  processing_output_tons: number;
  output_range_low_tons: number;
  output_range_high_tons: number;
  compost_yield_tons: number;
  biogas_yield_m3: number;
  liquid_enhancer_liters: number;
  estimated_market_value_usd: number;
  co2_reduction_tons: number;
  processing_time_days: number;
  breakdown: YieldBreakdown[];
  trajectory: YieldTrajectoryPoint[];
  feature_importance: FeatureImportance[];
  insights: string[];
}

export interface PartnerInquiry {
  full_name: string;
  organization: string;
  organization_type: string;
  monthly_waste_tons: number;
  email: string;
  message: string;
}

export interface PartnerInquiryResponse {
  id: string;
  status: string;
  message: string;
  created_at: string;
}