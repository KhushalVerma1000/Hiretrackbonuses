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
- Email delivery with [Resend](https://resend.com): after unlock, `/api/lead` emails the visitor their bonus (see below)
- `/unsubscribe` + `/api/unsubscribe`: signed one-click unsubscribe, logged as a new `MARKETING_EMAILS` consent row with `granted = false`
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

## Email (Resend)
Every bonus gets a delivery email automatically.
1. Create a Resend account, verify your sending domain, create an API key.
2. Set `RESEND_API_KEY`, `EMAIL_FROM` (an address on the verified domain) and `EMAIL_TOKEN_SECRET` in `.env.local` / your host. `EMAIL_REPLY_TO` is optional.
3. Apply the new migration: `npx prisma migrate deploy` (adds the `EmailLog` table).

How it works: the bonus page posts `{ email, bonus, consent..., payload }` to `/api/lead`. After the lead and consent are saved, `src/lib/email/send.ts` builds the email and sends it through Resend. A failed or skipped email never blocks the unlock; the API returns `email: "sent" | "recent" | "off" | "failed"`.
- Bonus without an email builder: sends a generic "here is your link" email.
- Bonus with an email builder (`src/bonuses/<slug>/email.ts`, registered as `email` in `src/bonuses/index.ts`): sends a personalised email. See BONUS_GUIDE.md.
- The shared shell (`src/lib/email/layout.ts`) adds the brand header, the bridge-to-HireTrack block with UTM links, the footer and the unsubscribe link.
- Rate limit: one delivery email per person per bonus every 2 minutes, and 3 per day (`EmailLog` table).
- This sends the report the person asked for (they ticked the required consent box). Do not use it for marketing emails; check the latest `MARKETING_EMAILS` consent row before any marketing send.
