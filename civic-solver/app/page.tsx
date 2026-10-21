import ProblemForm from "@/components/ProblemForm";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-2">
          <span className="text-xl" aria-hidden="true">🏙️</span>
          <span className="font-bold text-slate-900 text-lg">Civic Solver</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight text-balance">
            What&apos;s the problem?
          </h1>
          <p className="mt-4 text-lg text-slate-500 text-balance">
            Tell us what&apos;s going on. We&apos;ll figure out who can help.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-8 sm:px-8">
          <ProblemForm />
        </div>

        {/* How it works */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: "📝",
              title: "Describe it",
              description: "Write what's wrong in plain language. No need to know who's responsible.",
            },
            {
              icon: "🔍",
              title: "We classify it",
              description: "Our system determines whether it's a city, private, or regulatory issue.",
            },
            {
              icon: "✅",
              title: "Take action",
              description: "Get the right contact, what to say, and a drafted report — instantly.",
            },
          ].map((step) => (
            <div key={step.title} className="text-center px-2">
              <div className="text-3xl mb-3" aria-hidden="true">{step.icon}</div>
              <h3 className="font-semibold text-slate-800 text-sm">{step.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-16 text-center text-xs text-slate-400">
          Prototype data for Milledgeville, GA. Contact details are illustrative.
          Always verify directly with the relevant agency.
        </p>
      </div>
    </main>
  );
}
