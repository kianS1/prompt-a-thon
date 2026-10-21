# Civic Solver

> **You don't need to know how government or local services work. Just tell us what's wrong. We'll help you figure out what to do next.**

A polished civic problem-solving web app built with Next.js 14, Tailwind CSS, and the OpenAI API.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your OpenAI API key

```bash
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Scenarios

The app ships with seeded data for **Milledgeville, GA** covering both core scenarios:

### Scenario A — Pothole (Government)
> "There is a huge pothole on Oak Street outside my apartment."  
> Location: Milledgeville, GA  
> → Classified as **Government / Public Works** → Contact info + email draft

### Scenario B — Backyard Junk (Private Service)
> "I have an old couch, broken furniture, and construction debris piled up in my backyard."  
> Location: Milledgeville, GA  
> → Classified as **Private Service / Junk Removal** → Local providers with ratings + pricing

---

## Architecture

```
app/
  page.tsx                  — Homepage (problem input)
  results/page.tsx          — Results display
  api/
    classify/route.ts       — LLM classification + local resource matching
    draft-email/route.ts    — AI email drafting

components/
  ProblemForm.tsx           — Main input form with image upload
  LoadingStates.tsx         — Progressive loading messages
  results/
    ClassificationBadge.tsx
    GovernmentResult.tsx    — Department contact + email draft CTA
    PrivateServiceResult.tsx
    ServiceCard.tsx         — Provider card with rating/pricing
    RegulatoryResult.tsx    — Permit/rule guidance
    EmailDraftModal.tsx     — Editable email draft

data/
  government.json           — Seeded gov agencies (Milledgeville, GA)
  private-services.json     — Seeded local providers
  civic-rules.json          — Regulatory guidance

lib/
  types.ts                  — Shared TypeScript types
  matcher.ts                — Resource matching logic (no LLM invention)
```

### Classification flow

1. User submits problem description + location (+ optional image)
2. `POST /api/classify` → GPT-4o-mini classifies into **GOVERNMENT / PRIVATE_SERVICE / REGULATORY**
3. `lib/matcher.ts` scores local seed data against the structured classification result
4. Results page renders the appropriate component (GovernmentResult, PrivateServiceResult, or RegulatoryResult)
5. "Draft a Report" → `POST /api/draft-email` generates a professional report email
6. User copies/edits/sends from their own mail app — nothing is auto-sent

---

## Expanding the Data

To add a new city, add entries to `data/government.json` and `data/private-services.json` with the appropriate `jurisdiction` field. The matcher uses location string matching — no code changes needed.

---

## Notes

- **Prototype data**: Contact information is illustrative. Verify directly with agencies before use in production.
- The LLM classifies and reasons, but **never invents contact information**. All contacts come from the structured data layer.
- No user accounts, no data persistence, no auto-send.
