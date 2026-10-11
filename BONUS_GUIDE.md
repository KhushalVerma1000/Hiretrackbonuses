# How to create a new bonus

Every bonus is one folder in `src/bonuses/<slug>/` plus one line in `src/bonuses/index.ts`. The page, share links, SEO tags, sitemap entry, Open Graph image and FAQ schema are generated automatically.

## Before you build: design the lead magnet (Hormozi $100M Leads)
A lead magnet is a complete solution to one narrow problem that reveals the next problem HireTrack solves. Answer these in `meta.ts` before writing any component:
- **Problem:** the ONE narrow problem, and who has it (`problem`).
- **Type:** `reveals-problem` (shows them a problem they didn't know about), `sample` (solves a recurring problem once) or `one-step` (one step of a bigger process).
- **Delivery:** prefer a tool (calculator, score, fillable sheet) over plain information. Tools are valued higher than information.
- **Worth paying for:** if you could charge for it, it is good enough. Free but thin loses trust.
- **Bridge:** write `bridge` (heading, body, cta): the next problem this reveals and how HireTrack solves it. It appears on the page automatically.
- **Formats:** offer at least two (e.g. web tool plus CSV download or print/PDF) and list them in `formats`.
- **Headlines:** write 3 or more H1 variants in `headlines`. `h1` is the live one. Test headline first, then image, then subheadline.
- **CTAs:** top (jump to the tool, automatic), middle (the email unlock inside the tool), end (HireTrack buttons, automatic). Bridge and footer buttons carry UTM tags through `productLink()` so each bonus can be measured.
- **Unlock rule:** whatever sits behind the email must be MORE useful than what is free, and should use the visitor's own numbers (for example a personal report), not generic tips.

## Steps
1. Pick a URL-friendly slug (e.g. `ghosting-risk-score`).
2. Create `src/bonuses/<slug>/meta.ts` (copy `cost-per-hire-calculator/meta.ts`). Fill in:
   - `title`, `h1`, `description` (under 160 chars, include the main search phrase)
   - `audience`, `format`, `keywords`, `datePublished`
   - `type`, `problem`, `headlines`, `formats`, `bridge`: see the design section above (all required)
   - `intro`: one crawlable paragraph (what it is, who it is for, why it helps)
   - `faq`: 3 to 5 real questions with plain answers
3. Create `src/bonuses/<slug>/<Component>.tsx` (add `"use client"` if it uses state). Reuse classes from `globals.css`.
4. Register it in `src/bonuses/index.ts` (import meta + component, add one line to `bonuses`; remove it from `planned`).
5. Create `src/bonuses/<slug>/posts.md` with the Instagram carousel + caption + hashtags and the LinkedIn post. Use `{{LINK}}` for the page URL.
6. Update `CHECKLIST.md`, including the quality gate columns.
7. Run `npm run build`. Fix any errors.

## Toolkit (standard for every bonus)
Each bonus should be self-contained: add a server-rendered `Toolkit.tsx` (registered as `Extra` in `src/bonuses/index.ts`) with reference tables, formulas, glossary and a checklist, so visitors never need to leave the page. Mark planning assumptions as assumptions and attach a source link to every published figure.

## Quality gate (tick all before marking a bonus done)
Existing standards: self-contained toolkit, real sourced statistics, SEO page and FAQ, Instagram and LinkedIn posts, `npm run build` passes.
Hormozi additions: narrow problem named, solves it completely, reveals the next problem, bridge to HireTrack on the page, type set, 2+ formats, 3+ headline variants (one tested), CTA at top, middle and end, unlock is more useful than the free part.

## Rules
- Calculations use only numbers the visitor enters. Published statistics may be shown for context in `benchmarks`, but every one needs a named source, a year, a working link, and a region/currency label. Prefer primary sources, flag secondary ones, and never repeat a figure whose origin you cannot verify.
- Anything about law or country rules must say "confirm with local counsel".
- Lead capture: reuse the form pattern from `cost-per-hire-calculator/Calculator.tsx`. POST to `/api/lead` with `{ email, bonus: "<slug>", website: "", consentProcessing: true, consentMarketing: <bool>, path }`. Consent text comes from `src/lib/consent.ts`; the required box must be ticked or nothing is stored. `website` is the spam honeypot.
- Keep one H1 per page, descriptive link text, and labels on every input.
- Share link for a bonus: `${NEXT_PUBLIC_SITE_URL}/bonuses/<slug>`.
