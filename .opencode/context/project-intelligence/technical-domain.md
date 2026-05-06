<!-- Context: project-intelligence/technical | Priority: critical | Version: 1.3 | Updated: 2026-05-06 -->

# Technical Domain

**Purpose**: Tech stack, architecture, development patterns for Fatoş Yılmaz Casting.
**Last Updated**: 2026-05-06

## Quick Reference
**Update Triggers**: Tech stack changes | New patterns | Architecture decisions
**Audience**: Developers, AI agents

## Primary Stack
| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js (App Router, SSG) | 16.1.6 | Static export, zero maintenance |
| UI Library | React | 19.2.3 | Server Components + client interactivity |
| Language | TypeScript | 5.x | Strict mode mandatory |
| Styling | Tailwind CSS | 4.x | CSS-first, OKLCH color space |
| Animation | GSAP + @gsap/react | 3.14+ | Editorial motion, ScrollTrigger, timeline control |
| Validation | Zod | Latest | API endpoints + JSON data contracts |
| Data | Static JSON (/data) | — | education_gallery, projects |
| Assets | Cloudflare R2/CDN | — | Centralized asset management |
| Fonts | Geist Sans/Mono | — | Next.js font optimization |
| Catalog | Static PDF (R2) | — | Modal viewer via object tag |
| Deployment | Static export | — | `next export`, zero server |

## Code Patterns

### Media URL Helper (R2 + Custom CDN)
```typescript
// lib/utils/media.ts
type MediaFolder = 'afis' | 'general' | 'instructor' | 'education' | 'catalog';

const FOLDER_PATHS: Record<MediaFolder, string> = {
  afis:       'timeright/fatosyilmazcasting/afis',
  general:    'timeright/fatosyilmazcasting',
  instructor: 'images/instructor',
  education:  'timeright/fatosyilmazcasting/education',
  catalog:    'timeright/fatosyilmazcasting/catalog',
};

export const getMediaUrl = (filename: string | null, folder: MediaFolder = 'general'): string => {
  if (!filename) return "/placeholder-thumbnail.webp";
  const cleanFilename = filename.replace(/^\/+/, "");
  return `${CDN_BASE_URL}/${FOLDER_PATHS[folder]}/${cleanFilename}`;
};

export const getCatalogPdfUrl = (filename: string = 'fatosyilmazcasting-catalog.pdf'): string => {
  return `${CDN_BASE_URL}/${FOLDER_PATHS['catalog']}/${filename}`;
};
```

### Component (Editorial + GSAP + next/image)
```typescript
"use client"
import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { getMediaUrl } from "@/lib/utils/media"

interface EditorialHeroProps {
  title: string; subtitle: string; image: string; locale: 'tr' | 'en';
}

export default function EditorialHero({ title, subtitle, image, locale }: EditorialHeroProps) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
    tl.from(".hero-image", { scale: 1.05, opacity: 0, duration: 2.4 })
      .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 }, "-=1.2")
      .from(".hero-title", { y: 40, opacity: 0, duration: 1.2 }, "-=0.8")
      .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  }, { scope: container })

  return (
    <section ref={container} className="relative min-h-[100svh] bg-[#faf8f4] overflow-hidden flex items-center">
      <Image src={getMediaUrl(image, 'general')} alt={title} fill priority className="hero-image object-cover object-top grayscale" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f4]/90 via-[#faf8f4]/60 to-transparent" />
      <div className="relative z-10 px-8 md:px-16 max-w-2xl">
        <p className="hero-eyebrow font-cinzel text-[#c9a96e] text-xs tracking-[0.22em] uppercase mb-4">Cast Direktörü</p>
        <h1 className="hero-title font-cinzel text-[clamp(2.8rem,7vw,6rem)] text-[#1c1a17] leading-tight tracking-wide">{title}</h1>
        <p className="hero-subtitle font-crimson text-[#3d3629] text-xl italic mt-4 tracking-wide">{subtitle}</p>
      </div>
    </section>
  )
}
```

### SEO Config (Locale-Based)
```typescript
export interface SeoConfig {
  title: string; description: string; keywords: string[]
}
export const seoConfig: Record<'tr' | 'en', SeoConfig> = {
  tr: { title: "Fatoş Yılmaz Casting", description: "...", keywords: ["casting"] },
  en: { title: "Fatoş Yılmaz Casting", description: "...", keywords: ["casting"] },
}
```

### Data Validation (Zod)
```typescript
// lib/validations/project.ts
import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(), title: z.string(), year: z.string(), type: z.string(),
  director: z.string().nullable().optional(), production: z.string().nullable().optional(),
  fileName: z.string().nullable(),
});
```

## Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `editorial-hero.tsx` |
| Components | PascalCase | `EditorialHero` |
| Functions | camelCase | `getMediaUrl` |
| Folders | kebab-case | `components/shared/` |
| Constants | UPPER_SNAKE_CASE | `CDN_BASE_URL` |

## Code Standards
- TypeScript strict mode mandatory for all files
- Functional components with arrow functions + explicit prop interfaces
- Server Components (RSC) by default; `"use client"` only when needed
- GSAP: strictly use `useGSAP` hook with container ref scoping
- No hardcoded strings — use centralized i18n locale context + dictionaries
- Centralized asset management via R2/CDN helper functions
- Tailwind CSS 4: CSS-first approach, OKLCH color space
- SEO: centralized config + `generateMetadata` API
- Semantic HTML (`<article>`, `<aside>`, `<section>`) for LLM comprehension
- JSON-LD schemas (Person, Organization, Specialist) for AIEO
- AI crawler management via `robots.txt` + `security.txt`
- No-AI metadata flags (`noarchive`) for talent privacy
- Technical Honesty: Use explicit "Coming Soon" or "Data Unavailable" states for missing project metadata; never hallucinate or use speculative filler
- Media Standards: Mandatory .webp format for all R2 assets with strict filename matching as defined in projects.json
- PDF assets: served via `getCatalogPdfUrl()` helper, never hardcoded paths
- Education gallery: data-driven via `/data/education.json`, Zod-validated at build time
- Color tokens: exact hex values in `globals.css` as CSS custom properties, never inline hardcoded hex in components

## Security Requirements
- All secrets in `.env.local` — never commit
- No R2 write-access keys or sensitive logic on client-side
- Zod validation mandatory for all API endpoints + forms
- Public assets only via verified/normalized CDN URLs
- Rate limit all public API endpoints (prevent scraping)
- Sanitize all dynamic content before rendering (XSS prevention)
- robots.txt + meta tags for AI crawler access control

## 📂 Codebase References
**Layout + Metadata**: `app/layout.tsx` — Metadata API, OG/Twitter config, Geist fonts
**Landing Page**: `app/page.tsx` — GSAP 3D animation, stagger effects, client component
**Global Styles**: `app/globals.css` — Tailwind 4 `@import`, `@theme inline` custom properties
**Config**: `tsconfig.json` (strict: true), `next.config.ts`, `package.json`
**Admin Panel**: `app/panel-admin/` — Admin route structure
**Media Utils**: `lib/utils/media.ts` — getMediaUrl + getCatalogPdfUrl helpers
**Data**: `/data/` — Static JSON files (education_gallery, projects)

## Related Files
- Business Domain: `project-intelligence/business-domain.md`
- Decisions Log (example: `decisions-log.md`)
