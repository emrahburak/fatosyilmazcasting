# Task Context: Fatoş Yılmaz Casting — Single Page Website

Session ID: 2026-05-06-single-page-website
Created: 2026-05-06
Status: completed
Branch: develop-02 (committed: 7362d20)

## Current Request
Fatoy Yilmaz Casting markası için single-page, smooth scroll özellikli web sitesi inşa et.
- 6 section: Hero → Hakkımda → Filmografi → Eğitimler → Katalog → İletişim
- Hakkımda: genel akış, timeline
- Hero: R2'deki portre görseli kullanılsın, ulaşılamazsa Image Specialist ile placeholder
- Filmografi: JSON'daki ilk 12 proje öne çıkan, asimetrik grid + accordion + overlay panel
- Katalog = PDF viewer modal (fatosyilmazcasting-catalog.pdf) — buton ile trigger, modal'da gösterim + indirme
- Eğitimler: 4 şehir, data-driven skeleton
- İletişim: Instagram + email

## Context Files (Standards to Follow)
- .opencode/context/core/standards/code-quality.md
- .opencode/context/project-intelligence/technical-domain.md
- .opencode/context/project-intelligence/business-domain.md
- .opencode/context/core/visual-development.md

## Reference Files (Source Material to Look At)
- project.md
- app/page.tsx (mevcut Coming Soon — değiştirilecek)
- app/layout.tsx (font + metadata güncellenecek)
- app/globals.css (color tokens güncellenecek)
- data/hero.json
- data/projects.json
- data/education.json
- public/favicon.svg
- package.json
- next.config.ts

## External Docs Fetched
- GSAP ScrollTrigger: gsap + @gsap/react zaten yüklü, ScrollTrigger plugin dahil

## Components
1. lib/utils/media.ts — CDN helper
2. lib/validations/project.ts — Zod schema
3. components/shared/navbar.tsx — Fixed nav
4. components/sections/hero.tsx
5. components/sections/about.tsx
6. components/sections/filmography.tsx
7. components/sections/education.tsx
8. components/sections/catalog.tsx
9. components/sections/contact.tsx
10. app/layout.tsx — güncelle
11. app/globals.css — güncelle
12. app/page.tsx — orchestrator

## Constraints
- TypeScript strict mode
- Tailwind CSS 4, CSS-first, color tokens in globals.css
- GSAP: useGSAP hook with container ref scoping
- Server Components default, "use client" only when needed
- No hardcoded hex in components — use CSS custom properties
- Semantic HTML
- Static export (next export)
- R2 CDN: cdn.timerightproduction.org

## Exit Criteria
- [x] Tüm 6 section çalışır durumda
- [x] Smooth scroll + GSAP animasyonlar
- [x] Filmografi grid + overlay panel
- [x] Katalog PDF modal
- [x] Navbar smooth scroll linkler
- [x] Build başarılı (npm run build) — ✅ 2.1s compile, 0 hata
- [x] Tip hatası yok

## Critical Fixes Applied
### Tailwind CSS v4 Build Error — "Module not found: Can't resolve '...'"
- **Root cause:** Tailwind v4 auto-scans entire project root including `.agents/` dir. Markdown files contain `bg-[url('...')]` examples. Tailwind tries to resolve `...` as real file path.
- **Failed attempts:** `@config` with content array, `@source "../app"` (adds but doesn't replace auto-detection), `@source not "../.agents"`
- **Working solution:** `@import "tailwindcss" source(none);` + explicit `@source` directives
- **File:** `app/globals.css` — disables auto-detection, only scans `app`, `components`, `lib`
- **Deleted:** `tailwind.config.mjs` (no longer needed in v4 with CSS-first config)

## Current File State (post-build)
- `app/globals.css` — `source(none)` + 3 explicit `@source` directives
- `tailwind.config.mjs` — DELETED
- All 6 section components + navbar + page orchestrator implemented
- Branch: `develop-02` (uncommitted changes)
