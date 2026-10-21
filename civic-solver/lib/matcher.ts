import type {
  ClassificationResult,
  GovernmentResource,
  PrivateService,
  CivicRule,
  Recommendation,
} from "./types";

import governmentData from "@/data/government.json";
import privateServicesData from "@/data/private-services.json";
import civicRulesData from "@/data/civic-rules.json";

const govResources = governmentData as GovernmentResource[];
const privateServices = privateServicesData as PrivateService[];
const civicRules = civicRulesData as CivicRule[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function scoreGovernmentResource(
  resource: GovernmentResource,
  classification: ClassificationResult
): number {
  let score = 0;
  const keywords = classification.keywords.map(normalizeText);
  const issueType = normalizeText(classification.issue_type);
  const responsibleParty = normalizeText(classification.likely_responsible_party);
  const resourceName = normalizeText(resource.name);
  const resourceCategory = normalizeText(resource.category);

  // Keyword match against supported issue types
  for (const issueKeyword of resource.supported_issue_types) {
    const normalized = normalizeText(issueKeyword);
    if (keywords.some((k) => k.includes(normalized) || normalized.includes(k))) {
      score += 30;
    }
    if (issueType.includes(normalized) || normalized.includes(issueType)) {
      score += 20;
    }
  }

  // Category match
  if (
    responsibleParty.includes(resourceCategory) ||
    resourceCategory.includes(responsibleParty)
  ) {
    score += 25;
  }

  // Name match against responsible party
  if (
    resourceName.includes(responsibleParty) ||
    responsibleParty.includes(resourceName)
  ) {
    score += 15;
  }

  return score;
}

function scorePrivateService(
  service: PrivateService,
  classification: ClassificationResult,
  userLocation: string
): number {
  let score = 0;
  const keywords = classification.keywords.map(normalizeText);
  const issueType = normalizeText(classification.issue_type);
  const serviceCategory = normalizeText(service.category);
  const serviceDescription = normalizeText(service.description);
  const serviceServices = service.services.map(normalizeText);

  // Location match
  const locationNormalized = normalizeText(userLocation);
  if (
    service.service_area.some(
      (area) =>
        normalizeText(area).includes(locationNormalized) ||
        locationNormalized.includes(normalizeText(area))
    )
  ) {
    score += 40;
  }

  // Category match
  if (
    keywords.some(
      (k) => serviceCategory.includes(k) || k.includes(serviceCategory)
    )
  ) {
    score += 30;
  }
  if (issueType.includes(serviceCategory) || serviceCategory.includes(issueType)) {
    score += 20;
  }

  // Service-level keyword match
  for (const svc of serviceServices) {
    if (keywords.some((k) => svc.includes(k) || k.includes(svc))) {
      score += 15;
    }
  }

  // Description keyword match
  if (keywords.some((k) => serviceDescription.includes(k))) {
    score += 10;
  }

  // Boost for higher-rated services
  score += service.rating * 2;

  return score;
}

function scoreCivicRule(
  rule: CivicRule,
  classification: ClassificationResult
): number {
  let score = 0;
  const keywords = classification.keywords.map(normalizeText);
  const issueType = normalizeText(classification.issue_type);
  const ruleTitle = normalizeText(rule.title);
  const ruleCategory = normalizeText(rule.category);
  const ruleSummary = normalizeText(rule.plain_language_summary);

  if (keywords.some((k) => ruleTitle.includes(k) || k.includes(ruleTitle))) {
    score += 40;
  }
  if (issueType.includes(ruleCategory) || ruleCategory.includes(issueType)) {
    score += 20;
  }
  if (keywords.some((k) => ruleSummary.includes(k))) {
    score += 10;
  }

  return score;
}

// ─── Main matcher ─────────────────────────────────────────────────────────────

export function matchResources(
  classification: ClassificationResult
): Recommendation {
  const { category, location, issue_type, reasoning, keywords } = classification;

  if (category === "GOVERNMENT") {
    // Filter to matching jurisdiction and score
    const candidates = govResources
      .filter((r) => {
        const jur = normalizeText(r.jurisdiction);
        const loc = normalizeText(location);
        return (
          jur.includes("milledgeville") ||
          loc.includes("milledgeville") ||
          jur.includes(loc) ||
          loc.includes(jur) ||
          loc.includes("31061") ||
          loc.includes("31062")
        );
      })
      .map((r) => ({ resource: r, score: scoreGovernmentResource(r, classification) }))
      .sort((a, b) => b.score - a.score);

    const top = candidates[0];
    const resource = top?.resource ?? govResources[0]; // fallback

    return {
      type: "GOVERNMENT",
      resource,
      problem_summary: issue_type,
      explanation: generateGovernmentExplanation(issue_type, resource),
    };
  }

  if (category === "PRIVATE_SERVICE") {
    const scored = privateServices
      .map((s) => ({
        service: s,
        score: scorePrivateService(s, classification, location),
      }))
      .sort((a, b) => b.score - a.score);

    // Take top 3 most relevant
    const top3 = scored.slice(0, 3);

    const results = top3.map((entry, i) => ({
      service: entry.service,
      is_best_match: i === 0,
      match_reason: generateServiceMatchReason(entry.service, classification),
    }));

    return {
      type: "PRIVATE_SERVICE",
      resources: results,
      problem_summary: issue_type,
      explanation: generatePrivateExplanation(issue_type, top3[0]?.service),
    };
  }

  // REGULATORY
  const scored = civicRules
    .map((r) => ({ rule: r, score: scoreCivicRule(r, classification) }))
    .sort((a, b) => b.score - a.score);

  const topRule = scored[0]?.score > 5 ? scored[0].rule : null;

  return {
    type: "REGULATORY",
    rule: topRule,
    problem_summary: issue_type,
    explanation: reasoning,
    general_guidance:
      "This appears to be a regulatory or informational question. The guidance below is general — verify the specifics with your local agency.",
  };
}

// ─── Explanation generators ───────────────────────────────────────────────────

function generateGovernmentExplanation(
  issueType: string,
  resource: GovernmentResource
): string {
  return `${issueType.charAt(0).toUpperCase() + issueType.slice(1)} on public property is the responsibility of ${resource.name}. They handle this type of issue and can dispatch the appropriate crew or team.`;
}

function generatePrivateExplanation(
  issueType: string,
  service?: PrivateService
): string {
  if (!service) return "These private service providers can assist with your issue.";
  return `You described an issue on private property (${issueType}). This type of work is handled by private contractors — these local providers serve your area and specialize in exactly this kind of job.`;
}

function generateServiceMatchReason(
  service: PrivateService,
  classification: ClassificationResult
): string {
  const matchedServices = service.services.filter((svc) =>
    classification.keywords.some(
      (k) =>
        normalizeText(svc).includes(normalizeText(k)) ||
        normalizeText(k).includes(normalizeText(svc))
    )
  );

  if (matchedServices.length > 0) {
    return `Offers ${matchedServices.slice(0, 2).join(" and ").toLowerCase()} and serves your area.`;
  }
  return `Serves ${service.service_area[0]} and handles ${service.category.toLowerCase()}.`;
}
