# How to create a new bonus

Every bonus is one folder in `src/bonuses/<slug>/` plus one line in `src/bonuses/index.ts`. The page, share links, SEO tags, sitemap entry, Open Graph image and FAQ schema are generated automatically.

## Steps
1. Pick a URL-friendly slug (e.g. `ghosting-risk-score`).
2. Create `src/bonuses/<slug>/meta.ts` (copy `cost-per-hire-calculator/meta.ts`). Fill in:
   - `title`, `h1`, `description` (under 160 chars, include the main search phrase)
   - `audience`, `format`, `keywords`, `datePublished`
   - `intro`: one crawlable paragraph (what it is, who it is for, why it helps)
   - `faq`: 3 to 5 real questions with plain answers
3. Create `src/bonuses/<slug>/<Component>.tsx` (add `"use client"` if it uses state). Reuse classes from `globals.css`.
4. Register it in `src/bonuses/index.ts` (import meta + component, add one line to `bonuses`; remove it from `planned`).
5. Create `src/bonuses/<slug>/posts.md` with the Instagram carousel + caption + hashtags and the LinkedIn post. Use `{{LINK}}` for the page URL.
6. Update `CHECKLIST.md`.
7. Run `npm run build`. Fix any errors.

## Rules
- Use only numbers the visitor enters. Do not invent statistics or benchmarks.
- Anything about law or country rules must say "confirm with local counsel".
- Lead capture: reuse the form pattern from `cost-per-hire-calculator/Calculator.tsx`. POST to `/api/lead` with `{ email, bonus: "<slug>", website: "", consentProcessing: true, consentMarketing: <bool>, path }`. Consent text comes from `src/lib/consent.ts`; the required box must be ticked or nothing is stored. `website` is the spam honeypot.
- Keep one H1 per page, descriptive link text, and labels on every input.
- Share link for a bonus: `${NEXT_PUBLIC_SITE_URL}/bonuses/<slug>`.
