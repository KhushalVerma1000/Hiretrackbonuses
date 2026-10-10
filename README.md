# HireTrack Bonuses

SEO-friendly lead magnet bundle for HireTrack (a product by Codzen). Built with Next.js (App Router) and TypeScript.

## Run
```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL and LEAD_WEBHOOK_URL
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## What you get
- `/` bundle landing page listing all bonuses
- `/bonuses/<slug>` one shareable page per bonus, with title, description, canonical, Open Graph and Twitter tags
- JSON-LD: Organization, WebApplication, FAQPage, BreadcrumbList, ItemList
- Auto-generated `/sitemap.xml`, `/robots.txt` and a social share image per bonus
- Share bar (copy link, LinkedIn, WhatsApp, X, email)
- `/api/lead` email capture saved to PostgreSQL with Prisma: lead, which bonus they unlocked, and an append-only consent log (what was agreed, exact wording, policy version, timestamp, hashed IP, user agent). Optional webhook copy via `LEAD_WEBHOOK_URL`
- `/privacy` privacy policy page (have it reviewed by a lawyer and edit it to match how you actually use the data)

## Add a bonus
See [BONUS_GUIDE.md](BONUS_GUIDE.md). Progress is tracked in [CHECKLIST.md](CHECKLIST.md).

## Deploy
Vercel works out of the box. Set `NEXT_PUBLIC_SITE_URL` to your production domain, then submit `/sitemap.xml` in Google Search Console.

## Database (PostgreSQL + Prisma)
1. Create a Postgres database (Neon, Supabase, Vercel Postgres, RDS, or local) and put its URL in `.env.local` as `DATABASE_URL`. Also set `IP_HASH_SALT` to a long random string.
2. Create the tables:
   ```bash
   npx prisma migrate dev --name init   # local: creates and applies prisma/migrations/...
   npx prisma migrate deploy            # production: applies committed migrations
   ```
   Commit the generated `prisma/migrations` folder.
3. View data: `npm run db:studio`.

Tables: `Lead` (unique email, createdAt/updatedAt), `BonusSignup` (lead + bonus + createdAt), `Consent` (append-only: type, granted, exact text, policy version, bonus, page, hashed IP, user agent, createdAt).
Latest marketing consent for a person = their newest `MARKETING_EMAILS` row. To record a withdrawal, insert a new row with `granted = false` (never edit old rows).
