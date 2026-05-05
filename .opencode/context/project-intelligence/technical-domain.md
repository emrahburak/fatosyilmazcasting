<!-- Context: project-intelligence/technical | Priority: critical | Version: 1.0 | Updated: 2026-05-05 -->

# Technical Domain

**Purpose**: Tech stack, architecture, development patterns for Fatoş Yılmaz Casting.
**Last Updated**: 2026-05-05

## Quick Reference
**Update Triggers**: Tech stack changes | New patterns | Architecture decisions
**Audience**: Developers, AI agents

## Primary Stack
| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js (App Router) | 16.1.6 | Server-first, RSC default |
| UI Library | React | 19.2.3 | Server Components + client interactivity |
| Language | TypeScript | 5.x | Strict mode mandatory |
| Styling | Tailwind CSS | 4.x | CSS-first, OKLCH color space |
| Animation | GSAP + @gsap/react | 3.14+ | Editorial motion, timeline control |
| Assets | Cloudflare R2/CDN | — | Centralized asset management |
| Fonts | Geist Sans/Mono | — | Next.js font optimization |

## Code Patterns

### Server Action / API
```typescript
"use server"
import { z } from "zod"

const schema = z.object({ name: z.string().min(2) })

export async function submitForm(data: FormData) {
  const validated = schema.parse(Object.fromEntries(data))
  // ... logic
  return { success: true }
}
```

### Component (Editorial + GSAP)
```typescript
"use client"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { getHeroImageUrl } from "@/utils/imageHelpers"

interface EditorialHeroProps {
  title: string; subtitle: string; image: string; locale: 'tr' | 'en'
}

export default function EditorialHero({ title, subtitle, image, locale }: EditorialHeroProps) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
    tl.from(".hero-image", { scale: 1.1, opacity: 0, duration: 2 })
      .from(".hero-title", { y: 60, opacity: 0, duration: 1.2 }, "-=1.2")
  }, { scope: container })

  return (
    <section ref={container} className="relative min-h-[80vh] bg-charcoal overflow-hidden">
      <img src={getHeroImageUrl(image)} alt={title} className="hero-image h-full w-full object-cover" />
      <h1 className="hero-title text-[clamp(3.5rem,10vw,8rem)] font-serif italic text-champagne">{title}</h1>
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

## Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `editorial-hero.tsx` |
| Components | PascalCase | `EditorialHero` |
| Functions | camelCase | `getHeroImageUrl` |
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

## Related Files
- Business Domain (example: `business-domain.md`)
- Decisions Log (example: `decisions-log.md`)
