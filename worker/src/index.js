// Serves the Brutal Eye site at mightymauls.com/brutaleye by proxying
// GitHub Pages. The upstream repo path is /brutal-eye (hyphenated); the
// public path is /brutaleye (not hyphenated), so every URL is rewritten
// in both directions.

const UPSTREAM_ORIGIN = "https://mightymauls.github.io";
const UPSTREAM_PREFIX = "/brutal-eye";
const PUBLIC_PREFIX = "/brutaleye";

// Headers worth forwarding upstream. Passing the original Request headers
// wholesale would also carry Host and CF-* headers, which confuse Pages.
const FORWARD = [
  "accept",
  "accept-encoding",
  "accept-language",
  "user-agent",
  "if-none-match",
  "if-modified-since",
];

// GitHub infrastructure headers that should not reach the visitor.
const STRIP = [
  "server",
  "x-github-request-id",
  "x-fastly-request-id",
  "x-served-by",
  "via",
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, HEAD" },
      });
    }

    // The site links to game.html relatively. Without the trailing slash the
    // browser resolves that against /, not /brutaleye/, so the links 404.
    if (url.pathname === PUBLIC_PREFIX) {
      return Response.redirect(`${url.origin}${PUBLIC_PREFIX}/${url.search}`, 301);
    }

    const tail = url.pathname.slice(PUBLIC_PREFIX.length);
    const upstream = new URL(UPSTREAM_ORIGIN + UPSTREAM_PREFIX + tail);
    upstream.search = url.search;

    const headers = new Headers();
    for (const name of FORWARD) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }

    const response = await fetch(
      new Request(upstream, { method: request.method, headers, redirect: "manual" }),
      { cf: { cacheEverything: true, cacheTtl: 300 } },
    );

    // Rewrite upstream redirects back into public paths so github.io never
    // becomes visible in the address bar.
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return new Response("Not Found", { status: 404 });

      const target = new URL(location, upstream);
      const sameSite =
        target.origin === UPSTREAM_ORIGIN && target.pathname.startsWith(UPSTREAM_PREFIX);
      if (!sameSite) return new Response("Not Found", { status: 404 });

      const rewritten = `${url.origin}${PUBLIC_PREFIX}${target.pathname.slice(
        UPSTREAM_PREFIX.length,
      )}${target.search}`;
      return Response.redirect(rewritten, response.status);
    }

    const out = new Headers(response.headers);
    for (const name of STRIP) out.delete(name);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: out,
    });
  },
};
