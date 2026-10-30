// Cloudflare Pages Function: content negotiation for AI agents.
//
// Serves Markdown when the client explicitly asks for it
// (`Accept: text/markdown`), otherwise passes the request through to the
// static asset untouched. Browsers never send `text/markdown`, so normal
// visitors (styling, fonts, images, GSAP) are completely unaffected.
//
// Cost control: this middleware only runs on routes allowed by
// `public/_routes.json` (extensionless document paths). Static assets
// (`/_next/*`, images, css, txt, xml, ...) bypass Functions entirely and
// stay on unlimited free static serving.

const SITE = 'https://fatosyilmazcasting.com';

const HOME_MARKDOWN = `# Fatoş Yılmaz Management

> Professional cast directing and talent management for film and TV.
> 20+ years of experience. Istanbul, Zurich, Berlin, Rotterdam.

## About

Fatoş Yılmaz is a casting director based in Istanbul. After starting at
Ay Yapım in 2004, she founded "Fatoş Yılmaz Management" in 2019 and has
since served as casting director for 20+ Turkish and international film
and TV productions. She also runs audition-technique workshops in
Istanbul, Switzerland, Germany and the Netherlands.

## Site sections

- Hero — ${SITE}/#hero
- About — ${SITE}/#about
- Filmography (20+ productions with director, year and production
  company where available) — ${SITE}/#filmography
- Education / workshops — ${SITE}/#education
- Contact — ${SITE}/#contact

## Contact

- Email: info@fatosyilmazcasting.com
- Instagram: https://www.instagram.com/fatosyilmazmanagement/

## Machine-readable resources

- Agent guide: ${SITE}/llms.txt
- Sitemap: ${SITE}/sitemap.xml
- Privacy policy: ${SITE}/privacy
`;

const NOT_FOUND_MARKDOWN = `# 404 — Page not found

Sorry, there is nothing at this address on fatosyilmazcasting.com.

- Start from the homepage: ${SITE}/
- Full site map: ${SITE}/sitemap.xml
- Agent guide: ${SITE}/llms.txt
`;

function markdownResponse(body, status) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
      // Short edge cache; Vary: Accept keeps HTML and Markdown
      // representations from being mixed up.
      'Cache-Control': 'public, max-age=300',
    },
  });
}

export async function onRequest(context) {
  const accept = context.request.headers.get('Accept') || '';
  if (!accept.includes('text/markdown')) {
    return context.next();
  }

  const { pathname } = new URL(context.request.url);

  if (pathname === '/' || pathname === '/index.html') {
    return markdownResponse(HOME_MARKDOWN, 200);
  }

  // Any other document path: check the static asset. Missing -> Markdown
  // 404 (status preserved). Existing pages -> serve the HTML as-is.
  const asset = await context.env.ASSETS.fetch(context.request);
  if (asset.status === 404) {
    return markdownResponse(NOT_FOUND_MARKDOWN, 404);
  }
  return asset;
}
