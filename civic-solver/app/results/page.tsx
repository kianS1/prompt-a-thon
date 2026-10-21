"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ClassifyResponse, ProblemInput } from "@/lib/types";
import ClassificationBadge from "@/components/results/ClassificationBadge";
import GovernmentResult from "@/components/results/GovernmentResult";
import PrivateServiceResult from "@/components/results/PrivateServiceResult";
import RegulatoryResult from "@/components/results/RegulatoryResult";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ClassifyResponse | null>(null);
  const [problem, setProblem] = useState<ProblemInput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("civicResult");
    const rawProblem = sessionStorage.getItem("civicProblem");
    const img = sessionStorage.getItem("civicImagePreview");

    if (!raw || !rawProblem) {
      router.replace("/");
      return;
    }

    try {
      setData(JSON.parse(raw));
      setProblem(JSON.parse(rawProblem));
      if (img) setImagePreview(img);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!data || !problem) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500 block"
              style={{
                animation: "pulseDot 1.5s ease-in-out infinite",
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const { classification, recommendation } = data;

  const urgencyColor = {
    high: "text-red-600 bg-red-50 border-red-200",
    medium: "text-amber-600 bg-amber-50 border-amber-200",
    low: "text-green-600 bg-green-50 border-green-200",
  }[classification.urgency];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition text-sm"
            aria-label="Start over"
          >
            ← Back
          </button>
          <span className="text-slate-200">|</span>
          <span className="font-bold text-slate-900 text-lg">🏙️ Civic Solver</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-2">
            We found your next step
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Here&apos;s what to do.
          </h1>
        </div>

        {/* Classification + problem summary card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 space-y-4 animate-slide-up">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <ClassificationBadge
              category={classification.category}
              issueType={classification.issue_type}
            />
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${urgencyColor}`}
            >
              {classification.urgency === "high"
                ? "🔴 High urgency"
                : classification.urgency === "medium"
                ? "🟡 Medium urgency"
                : "🟢 Low urgency"}
            </span>
          </div>

          {/* Problem summary */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Problem summary
            </p>
            <p className="text-sm text-slate-800 capitalize">
              {recommendation.problem_summary}
            </p>
          </div>

          {/* User input + location */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-400 mb-0.5">You described</p>
              <p className="text-sm text-slate-700 italic line-clamp-2">
                &ldquo;{problem.description}&rdquo;
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-slate-400 mb-0.5">Location</p>
              <p className="text-sm text-slate-700">📍 {problem.location}</p>
            </div>
          </div>

          {/* Image preview if present */}
          {imagePreview && (
            <div className="pt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Problem photo"
                className="w-full max-h-48 object-cover rounded-xl border border-slate-200"
              />
            </div>
          )}

          {/* Recommended action */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Recommended action
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {classification.recommended_action}
            </p>
          </div>
        </div>

        {/* Main recommendation */}
        {recommendation.type === "GOVERNMENT" && (
          <GovernmentResult
            recommendation={recommendation}
            problem={problem}
            classification={classification}
          />
        )}
        {recommendation.type === "PRIVATE_SERVICE" && (
          <PrivateServiceResult recommendation={recommendation} />
        )}
        {recommendation.type === "REGULATORY" && (
          <RegulatoryResult recommendation={recommendation} />
        )}

        {/* Confidence / transparency */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            How confident are we?
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.round(classification.confidence * 100)}%` }}
                role="progressbar"
                aria-valuenow={Math.round(classification.confidence * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {Math.round(classification.confidence * 100)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {classification.reasoning}
          </p>
        </div>

        {/* Start over */}
        <div className="text-center pb-8">
          <button
            onClick={() => {
              sessionStorage.clear();
              router.push("/");
            }}
            className="text-sm text-slate-500 hover:text-slate-800 transition underline underline-offset-2"
          >
            Start over with a different problem
          </button>
        </div>
      </div>
    </main>
  );
}
