<!-- Context: project-intelligence/business | Priority: critical | Version: 1.0 | Updated: 2026-05-05 -->

# Business Domain

**Purpose**: Brand identity, audience, voice, and business rules for Fatoş Yılmaz Casting.
**Last Updated**: 2026-05-05

## Brand Identity
**Positioning**: High-end boutique casting & talent consultancy. 20+ years industry experience (Ay Yapım heritage). "Editorial Curator" bridging Turkish film industry with European hubs (Zurich, Berlin, Amsterdam).

**Personality**: The "F" Signature — personal, boutique, high-prestige. Like entering a private art gallery where every talent is hand-picked.

## Target Audiences
| Priority | Audience | Goal |
|----------|----------|------|
| Primary | Production companies & directors (Ay Yapım, Statü, Oji Film) | Hire as Cast Director |
| Secondary | Professional actors & aspirants | Join workshops / seek mentorship |
| Tertiary | International casting directors | Turkey Lead for cross-border projects |

## Brand Voice
- **Voice**: Authoritative, artistic, sophisticated — experienced mentor + creative partner
- **Tone**: Editorial, minimalist, cinematic — sparse but impactful
- **Avoid**: Generic agency jargon, aggressive CTAs ("Join Now"), cluttered communication

## Business Rules
1. **No database** — static-only architecture (max performance, zero maintenance)
2. **Instagram-centric discovery** — CTAs direct to Instagram for talent pool
3. **Static filmography** — curated editorial gallery (Çocuk Kalbi, Gecenin Nakaratı, İşin Aslı)
4. **Global workshops** — static showcase: Istanbul, Zurich, Berlin, Netherlands
5. **Direct contact only** — WhatsApp/Email, no public forms
6. **Multilingual (TR/EN)** — all content + SEO metadata native bilingual

## Content Strategy
**Primary Drivers**:
- Cinematic Showcase: GSAP-animated filmography for immediate authority
- Workshop Legacy: Visual storytelling of international training sessions
- Curator's Bio: 20-year journey narrative (Ay Yapım → global consultancy)

**Strategic CTAs**:
- Main: "Discover Talents on Instagram" → links static site to dynamic talent pool
- Secondary: "Request Professional Collaboration" → direct WhatsApp/Email

**Success Metrics**:
- Engagement: Filmography retention, Instagram click-through
- Conversion: Producer inquiries, workshop requests
- Performance: 100/100 Lighthouse (static-first, zero DB)

## 📂 Codebase References
**Metadata**: `app/layout.tsx` — OG/Twitter config, brand title, Google verification
**Landing**: `app/page.tsx` — "Coming Soon" with GSAP 3D logo, stagger animations
**Admin Route**: `app/panel-admin/` — Future admin structure
**Config**: `next.config.ts`, `package.json` — static export ready

## Related Files
- Technical Domain: `project-intelligence/technical-domain.md`
- Decisions Log (example: `decisions-log.md`)
