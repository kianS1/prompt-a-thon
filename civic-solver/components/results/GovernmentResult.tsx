"use client";

import { useState } from "react";
import type { GovernmentRecommendation, ProblemInput, ClassificationResult } from "@/lib/types";
import EmailDraftModal from "./EmailDraftModal";

interface Props {
  recommendation: GovernmentRecommendation;
  problem: ProblemInput;
  classification: ClassificationResult;
}

export default function GovernmentResult({ recommendation, problem, classification }: Props) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { resource, explanation } = recommendation;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-start gap-3">
            <span className="text-3xl" aria-hidden="true">🏛️</span>
            <div>
              <h2 className="text-xl font-bold text-white">{resource.name}</h2>
              <p className="text-blue-100 text-sm mt-0.5">{resource.category}</p>
            </div>
          </div>
        </div>

        {/* Why explanation */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <p className="text-sm font-semibold text-blue-700 mb-1">Why this is the right place</p>
          <p className="text-sm text-blue-800">{explanation}</p>
        </div>

        {/* Contact information */}
        <div className="px-6 py-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Contact
          </h3>

          <div className="grid gap-3">
            {resource.phone && (
              <a
                href={`tel:${resource.phone}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition group"
              >
                <span className="text-lg" aria-hidden="true">📞</span>
                <span className="font-medium text-sm">{resource.phone}</span>
                <span className="ml-auto text-xs text-slate-400 group-hover:text-blue-600 transition">
                  Call →
                </span>
              </a>
            )}

            {resource.email && (
              <a
                href={`mailto:${resource.email}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition group"
              >
                <span className="text-lg" aria-hidden="true">📧</span>
                <span className="font-medium text-sm truncate">{resource.email}</span>
                <span className="ml-auto text-xs text-slate-400 group-hover:text-blue-600 transition">
                  Email →
                </span>
              </a>
            )}

            {resource.report_url && (
              <a
                href={resource.report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition group"
              >
                <span className="text-lg" aria-hidden="true">🌐</span>
                <span className="font-medium text-sm">Online report form</span>
                <span className="ml-auto text-xs text-slate-400 group-hover:text-blue-600 transition">
                  Open →
                </span>
              </a>
            )}

            {resource.website && !resource.report_url && (
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition group"
              >
                <span className="text-lg" aria-hidden="true">🌐</span>
                <span className="font-medium text-sm">Department website</span>
                <span className="ml-auto text-xs text-slate-400 group-hover:text-blue-600 transition">
                  Visit →
                </span>
              </a>
            )}
          </div>

          {/* Hours & address */}
          <div className="pt-2 space-y-2 border-t border-slate-100">
            {resource.hours && (
              <p className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">Hours: </span>
                {resource.hours}
              </p>
            )}
            {resource.address && (
              <p className="text-sm text-slate-500">
                <span className="font-medium text-slate-700">Address: </span>
                {resource.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* What to include */}
      {resource.required_information.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
          <h3 className="text-base font-bold text-slate-900 mb-3">
            What to include in your report
          </h3>
          <ul className="space-y-2">
            {resource.required_information.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Draft report CTA */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-base">Ready to report this?</h3>
            <p className="text-slate-400 text-sm mt-0.5">
              We&apos;ll draft a professional email for you to review and send.
            </p>
          </div>
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-5 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm rounded-xl transition shadow-sm whitespace-nowrap"
          >
            Draft a Report →
          </button>
        </div>
      </div>

      {/* Email modal */}
      {showEmailModal && (
        <EmailDraftModal
          problem={problem}
          resource={resource}
          classification={classification}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}
