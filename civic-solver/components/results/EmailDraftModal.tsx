"use client";

import { useState, useEffect } from "react";
import type { GovernmentResource, ClassificationResult, ProblemInput, DraftEmailResponse } from "@/lib/types";

interface Props {
  problem: ProblemInput;
  resource: GovernmentResource;
  classification: ClassificationResult;
  onClose: () => void;
}

export default function EmailDraftModal({ problem, resource, classification, onClose }: Props) {
  const [draft, setDraft] = useState<DraftEmailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    async function generate() {
      try {
        const res = await fetch("/api/draft-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem, resource, classification }),
        });
        if (!res.ok) throw new Error("Failed to generate email.");
        const data: DraftEmailResponse = await res.json();
        setDraft(data);
        setEditBody(data.body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate email.");
      } finally {
        setIsLoading(false);
      }
    }
    generate();
  }, [problem, resource, classification]);

  const handleCopy = async () => {
    const text = `To: ${draft?.to}\nSubject: ${draft?.subject}\n\n${editMode ? editBody : draft?.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailClient = () => {
    if (!draft) return;
    const body = encodeURIComponent(editMode ? editBody : draft.body);
    const subject = encodeURIComponent(draft.subject);
    const to = encodeURIComponent(draft.to);
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Draft email modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Draft Report</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Review, edit, then send it yourself.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-blue-500 block"
                    style={{
                      animation: "pulseDot 1.5s ease-in-out infinite",
                      animationDelay: `${i * 0.25}s`,
                    }}
                  />
                ))}
              </div>
              <p className="text-slate-500 text-sm">Drafting your report…</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {draft && !isLoading && (
            <>
              {/* To */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  To
                </label>
                <div className="px-3 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200">
                  {draft.to}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Subject
                </label>
                <div className="px-3 py-2.5 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200">
                  {draft.subject}
                </div>
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Message
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditMode(!editMode)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                  >
                    {editMode ? "Done editing" : "Edit"}
                  </button>
                </div>
                {editMode ? (
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2.5 bg-white rounded-lg text-sm text-slate-700 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    aria-label="Edit email body"
                  />
                ) : (
                  <div className="px-3 py-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200 whitespace-pre-wrap leading-relaxed">
                    {editBody}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <span>ℹ️</span>
                <span>
                  This email will <strong>not</strong> be sent automatically. Copy it or
                  open in your mail app, then send it yourself.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {draft && !isLoading && (
          <div className="flex flex-col sm:flex-row gap-3 px-6 py-5 border-t border-slate-100">
            <button
              onClick={handleCopy}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition"
            >
              {copied ? "✓ Copied!" : "Copy email"}
            </button>
            <button
              onClick={handleOpenMailClient}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm"
            >
              Open in mail app →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
