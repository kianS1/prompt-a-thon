import type { PrivateServiceRecommendation } from "@/lib/types";
import ServiceCard from "./ServiceCard";

interface Props {
  recommendation: PrivateServiceRecommendation;
}

export default function PrivateServiceResult({ recommendation }: Props) {
  const { resources, explanation } = recommendation;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Why explanation */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">🛠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-700 mb-1">
              Why this is a private-service matter
            </p>
            <p className="text-sm text-amber-800">{explanation}</p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recommended Local Services</h2>
        {resources.map(({ service, match_reason, is_best_match }) => (
          <ServiceCard
            key={service.id}
            service={service}
            matchReason={match_reason}
            isBestMatch={is_best_match}
          />
        ))}
      </div>

      {resources.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-8 text-center">
          <p className="text-slate-500">
            No local providers found for your exact area in our prototype dataset.
            Try searching for this service type on Google or Yelp for your location.
          </p>
        </div>
      )}

      {/* General tip */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5">
        <h3 className="text-sm font-bold text-slate-900 mb-2">💡 Getting the best deal</h3>
        <ul className="space-y-1.5 text-sm text-slate-600">
          <li>• Get 2–3 quotes before committing</li>
          <li>• Ask if pricing includes hauling away debris</li>
          <li>• Confirm the service area covers your exact address</li>
          <li>• Check for same-week availability if it&apos;s urgent</li>
        </ul>
      </div>
    </div>
  );
}
