import type { PrivateService } from "@/lib/types";

interface Props {
  service: PrivateService;
  matchReason: string;
  isBestMatch: boolean;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-sm ${
            i < full
              ? "text-amber-400"
              : i === full && half
              ? "text-amber-300"
              : "text-slate-200"
          }`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function ServiceCard({ service, matchReason, isBestMatch }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md ${
        isBestMatch ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200"
      }`}
    >
      {/* Best match badge */}
      {isBestMatch && (
        <div className="px-6 py-2.5 bg-blue-600 flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wide">
            ⭐ Best match
          </span>
        </div>
      )}

      <div className="px-6 py-5 space-y-4">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{service.category}</p>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <StarRating rating={service.rating} />
            <span className="text-xs text-slate-500">{service.review_count} reviews</span>
          </div>
        </div>

        {/* Key info pills */}
        <div className="flex flex-wrap gap-2">
          {service.price_range && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-medium text-green-700">
              💰 {service.price_range}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600">
            📍 {service.service_area[0]}
          </span>
        </div>

        {/* Services */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Services
          </p>
          <div className="flex flex-wrap gap-1.5">
            {service.services.slice(0, 5).map((svc) => (
              <span
                key={svc}
                className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600"
              >
                {svc}
              </span>
            ))}
          </div>
        </div>

        {/* Why this matches */}
        <div className="px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs font-semibold text-amber-700 mb-0.5">Why this matches</p>
          <p className="text-xs text-amber-800">{matchReason}</p>
        </div>

        {/* Prototype disclaimer */}
        <p className="text-xs text-slate-400 italic">{service.note}</p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href={`tel:${service.phone}`}
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 text-center transition"
          >
            📞 Call
          </a>
          <a
            href={service.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 text-center transition"
          >
            🌐 Website
          </a>
          <a
            href={`tel:${service.phone}`}
            className="flex-1 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold text-center transition"
          >
            Get Quote
          </a>
        </div>
      </div>
    </div>
  );
}
