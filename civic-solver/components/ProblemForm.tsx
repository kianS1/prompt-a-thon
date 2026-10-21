"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ClassifyResponse } from "@/lib/types";

const EXAMPLE_PROMPTS = [
  "There's a pothole on Oak Street outside my apartment",
  "My neighbor's tree fell on my fence",
  "There's an abandoned car that's been parked for weeks",
  "I have old furniture and junk piled up in my backyard",
  "A streetlight near my house has been out for days",
  "Do I need a permit to build a fence?",
];

export default function ProblemForm() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const handleExampleClick = (example: string) => {
    setDescription(example);
    if (!location) setLocation("Milledgeville, GA");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("Please describe the problem.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }

    setIsLoading(true);

    try {
      let imageBase64: string | undefined;
      if (image) {
        imageBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            // Strip the data URL prefix
            resolve(result.split(",")[1]);
          };
          reader.readAsDataURL(image);
        });
      }

      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, location, imageBase64 }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Something went wrong.");
      }

      const data: ClassifyResponse = await res.json();

      // Store result in sessionStorage to pass to results page
      sessionStorage.setItem("civicResult", JSON.stringify(data));
      sessionStorage.setItem("civicProblem", JSON.stringify({ description, location }));
      if (imagePreview) {
        sessionStorage.setItem("civicImagePreview", imagePreview);
      }

      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-8">
        <div className="flex gap-2.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500 block"
              style={{
                animation: `pulseDot 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>
        <LoadingMessage />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Problem Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700"
        >
          What&apos;s the problem?
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us what's going on. You don't need to know who is responsible."
          rows={4}
          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm transition"
          aria-label="Problem description"
        />
      </div>

      {/* Example prompts */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => handleExampleClick(example)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 transition cursor-pointer"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="block text-sm font-semibold text-slate-700"
        >
          📍 Where is this happening?
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, State or ZIP code — e.g., Milledgeville, GA"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition"
          aria-label="Location"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">
          📷 Add a photo{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </p>

        {imagePreview ? (
          <div className="relative w-full max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Problem photo preview"
              className="w-full h-40 object-cover rounded-xl border border-slate-200"
            />
            <button
              type="button"
              onClick={() => {
                setImage(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/60 text-white text-xs flex items-center justify-center hover:bg-slate-900 transition"
              aria-label="Remove photo"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-blue-400 hover:text-blue-600 transition w-full sm:w-auto text-sm"
          >
            <span className="text-xl">🖼</span>
            <span>Upload photo</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="sr-only"
          aria-label="Upload problem photo"
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!description.trim() || !location.trim()}
        className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl transition shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Find the right solution →
      </button>
    </form>
  );
}

// Inline loading message component to avoid circular import
function LoadingMessage() {
  const messages = [
    "Understanding your problem…",
    "Checking what type of issue this is…",
    "Finding the right local resource…",
    "Preparing your next step…",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-lg font-medium text-slate-600">
      {messages[index]}
    </div>
  );
}
