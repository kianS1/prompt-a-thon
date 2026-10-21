// ─── Problem Input ────────────────────────────────────────────────────────────

export interface ProblemInput {
  description: string;
  location: string;
  imageBase64?: string; // optional uploaded image
}

// ─── Classification ───────────────────────────────────────────────────────────

export type IssueCategory = "GOVERNMENT" | "PRIVATE_SERVICE" | "REGULATORY";

export interface ClassificationResult {
  issue_type: string;
  category: IssueCategory;
  jurisdiction: string;
  location: string;
  urgency: "low" | "medium" | "high";
  likely_responsible_party: string;
  required_information: string[];
  recommended_action: string;
  confidence: number; // 0–1
  reasoning: string;
  keywords: string[];
}

// ─── Government Resource ──────────────────────────────────────────────────────

export interface GovernmentResource {
  id: string;
  name: string;
  category: string;
  jurisdiction: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  report_url: string | null;
  address: string;
  hours: string;
  supported_issue_types: string[];
  required_information: string[];
}

// ─── Private Service ──────────────────────────────────────────────────────────

export interface PrivateService {
  id: string;
  name: string;
  category: string;
  service_area: string[];
  description: string;
  phone: string;
  website: string;
  address: string;
  price_range: string;
  rating: number;
  review_count: number;
  services: string[];
  note: string;
}

// ─── Civic Rule ───────────────────────────────────────────────────────────────

export interface CivicRule {
  id: string;
  title: string;
  jurisdiction: string;
  category: string;
  plain_language_summary: string;
  requirements: string[];
  next_steps: string[];
  official_source: string;
  contact: {
    name: string;
    phone: string;
    email: string | null;
    website: string;
  };
  disclaimer: string;
}

// ─── Recommendation ───────────────────────────────────────────────────────────

export interface GovernmentRecommendation {
  type: "GOVERNMENT";
  resource: GovernmentResource;
  explanation: string;
  problem_summary: string;
}

export interface PrivateServiceRecommendation {
  type: "PRIVATE_SERVICE";
  resources: Array<{ service: PrivateService; match_reason: string; is_best_match: boolean }>;
  explanation: string;
  problem_summary: string;
}

export interface RegulatoryRecommendation {
  type: "REGULATORY";
  rule: CivicRule | null;
  explanation: string;
  problem_summary: string;
  general_guidance: string;
}

export type Recommendation =
  | GovernmentRecommendation
  | PrivateServiceRecommendation
  | RegulatoryRecommendation;

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface ClassifyRequest extends ProblemInput {}

export interface ClassifyResponse {
  classification: ClassificationResult;
  recommendation: Recommendation;
}

export interface DraftEmailRequest {
  problem: ProblemInput;
  resource: GovernmentResource;
  classification: ClassificationResult;
}

export interface DraftEmailResponse {
  to: string;
  subject: string;
  body: string;
}
