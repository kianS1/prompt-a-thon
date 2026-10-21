import type { RegulatoryRecommendation } from "@/lib/types";

interface Props {
  recommendation: RegulatoryRecommendation;
}

export default function RegulatoryResult({ recommendation }: Props) {
  const { rule, general_guidance, explanation } = recommendation;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Why explanation */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl px-6 py-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">📋</span>
          <div>
            <p className="text-sm font-semibold text-violet-700 mb-1">
              What we found
            </p>
            <p className="text-sm text-violet-800">
              {explanation || general_guidance}
            </p>
          </div>
        </div>
      </div>

      {rule ? (
        <>
          {/* Rule card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-violet-600 to-violet-700">
              <h2 className="text-lg font-bold text-white">{rule.title}</h2>
              <p className="text-violet-200 text-sm mt-0.5">{rule.category} · {rule.jurisdiction}</p>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-2">
                  Plain-language summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {rule.plain_language_summary}
                </p>
              </div>

              {/* Requirements */}
              {rule.requirements.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">
                    Key requirements
                  </h3>
                  <ul className="space-y-2">
                    {rule.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-violet-400 mt-0.5" aria-hidden="true">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next steps */}
              {rule.next_steps.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">
                    What to do next
                  </h3>
                  <ol className="space-y-2">
                    {rule.next_steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Official source */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  <span className="font-medium">Source:</span>{" "}
                  {rule.official_source}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          {rule.contact && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Contact for verification</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">{rule.contact.name}</p>
                {rule.contact.phone && (
                  <a
                    href={`tel:${rule.contact.phone}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    <span aria-hidden="true">📞</span> {rule.contact.phone}
                  </a>
                )}
                {rule.contact.email && (
                  <a
                    href={`mailto:${rule.contact.email}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    <span aria-hidden="true">📧</span> {rule.contact.email}
                  </a>
                )}
                {rule.contact.website && (
                  <a
                    href={rule.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    <span aria-hidden="true">🌐</span> Department website
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 px-4 py-3 bg-slate-100 rounded-xl text-xs text-slate-500">
            <span aria-hidden="true">⚠️</span>
            <span>{rule.disclaimer}</span>
          </div>
        </>
      ) : (
        /* No matching rule found */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">General Guidance</h2>
          <p className="text-sm text-slate-600">
            We don&apos;t have a specific rule in our database for this exact question,
            but here&apos;s the safest next step:
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span aria-hidden="true">1.</span>
              Contact your local city or county planning/zoning department directly.
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">2.</span>
              Describe your situation and ask what permits or approvals are required.
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">3.</span>
              Ask for written confirmation when possible.
            </li>
          </ul>
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700">
              Milledgeville Planning & Zoning
            </p>
            <a
              href="tel:(478) 414-4025"
              className="text-sm text-blue-600 hover:text-blue-800 transition"
            >
              📞 (478) 414-4025
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
