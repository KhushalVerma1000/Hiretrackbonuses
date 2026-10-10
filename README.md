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
- `/api/lead` email capture that forwards to `LEAD_WEBHOOK_URL`

## Add a bonus
See [BONUS_GUIDE.md](BONUS_GUIDE.md). Progress is tracked in [CHECKLIST.md](CHECKLIST.md).

## Deploy
Vercel works out of the box. Set `NEXT_PUBLIC_SITE_URL` to your production domain, then submit `/sitemap.xml` in Google Search Console.
