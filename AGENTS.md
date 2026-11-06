# AGENTS.md

This repo is expected to have SEO + agent-readiness primitives including metadata, JSON-LD, OG images, robots/sitemap and `llms.txt`

When making changes related to SEO, crawling, indexing, social previews, or AI/agent access, apply these rules.

**Architecture note**: This is a **Next.js static export using the Pages Router** (`output: 'export'`, deployed by Netlify from `out/`). SEO metadata is handled via `next/head` in `src/components/layout/SEO.tsx`, not via Next.js `metadata` exports.

## Canonical + URLs

- Keep the canonical origin in one place: the `siteUrl` constant in `src/components/layout/SEO.tsx` (`https://studio.codevideo.io`).
- If the domain changes, update all of:
  - the `siteUrl` constant used in `src/components/layout/SEO.tsx` for canonical/OG URLs
  - `public/robots.txt` sitemap URL
  - JSON-LD `url` fields
  - `public/llms.txt` canonical links
  - OG image absolute URLs

## Metadata + OG images

- Every public indexable route must have a unique `title` and `description` via the SEO component.
- If you add a new public page, add `<SEO title="..." description="..." />` with unique values.
- If you change the OG image path, verify the file exists in `public/` and is accessible at the expected URL.
- The SEO component (`src/components/layout/SEO.tsx`) handles all `<head>` meta tags via `next/head`. Do not add duplicate meta tags outside this component.

## Indexing controls

- Private, authenticated, personalized, and post-checkout routes must stay `noindex`.
- Current non-indexable route patterns:
  - `/account`
  - `/success-starter`
  - `/success-creator`
  - `/success-enterprise`
  - `/success-lifetime`
  - `/success-topup`
- Keep those routes out of `public/sitemap-0.xml`.
- Keep crawl disallows in sync in `public/robots.txt`.
- Use the `noIndex` prop on the SEO component to emit `<meta name="robots" content="noindex, nofollow">`.
- Auth is handled via Clerk overlays (not dedicated routes), so sign-in/sign-up do not create separate indexable pages.

## Sitemap / robots

- `public/robots.txt` must always point at the canonical sitemap on the canonical host.
- The sitemap is two static files, `public/sitemap-index.xml` and `public/sitemap-0.xml`. Edit `sitemap-0.xml` by hand when public routes change.
- Keep the sitemap limited to index-worthy public routes only (currently: `/`, `/faq/`, `/contact/`, `/embed/`).
- If you add or remove public routes, update `public/sitemap-0.xml`.

## Structured data (JSON-LD)

- If page meaning changes, update the relevant JSON-LD schema too.
- JSON-LD is added via the `JsonLd` helper component, which puts `<script type="application/ld+json">` tags in `next/head`.
- Expected schemas:
  - Home: `SoftwareApplication` + `Organization` + `WebSite`
  - FAQ: `FAQPage`
- Only add schemas when the content genuinely matches the schema type.

## Written Content Attribution

- If Markdown/blog content is added to this repo, every absolute owned-product link in that content must include GrowthKit-friendly UTM parameters:
  - `utm_source=studio.codevideo.io`
  - `utm_medium=blog`, `guide`, `feature`, or `learn`
  - `utm_campaign=<content-slug>`
  - `utm_content=<anchor-or-target>`
- Owned product domains include `fullstackcraft.com`, `wheelscreener.com`, `vannacharm.com`, `leapsscreener.com`, `option-screener.com`, `codevideo.io`, `studio.codevideo.io`, `genie.codevideo.io`, `chatvideolab.com`, and `amtjoy.com`.
- Preserve existing query parameters and append UTMs with `&`.
- For new-tab links, use `target="_blank" rel="noopener"`. Do not rely on `target="_blank"` for attribution; GrowthKit reads URL/referrer/UTM data on page landing.
- Do not rely on same-domain internal UTMs as click tracking. GrowthKit records one landing event per product per tab session.

## Checks 

- Sanity-check:
  - `GET /robots.txt` → 200, contains sitemap URL
  - `GET /sitemap-index.xml` → 200, contains only public marketing routes
  - `GET /og.png` → 200 (or equivalent OG image)
  - View source of at least one page → has canonical link, OG tags, JSON-LD
  - `/account` → renders `noindex` robots meta
  - `/success-starter` → renders `noindex` robots meta
  - Build succeeds: `npm run build`
