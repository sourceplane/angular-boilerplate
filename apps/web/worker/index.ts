// The site's Worker. `ng build` writes the app as static files in
// dist/browser — index.html, the hashed JavaScript and CSS bundles, the
// favicon — uploaded as Workers Static Assets. The app routes in the browser,
// so every page address is one of its routes:
//
//   - a request that matches a file is served from the assets, and never
//     reaches this Worker;
//   - a browser's navigation that matches no file is answered by the assets
//     with index.html (`not_found_handling: "single-page-application"` in
//     wrangler.jsonc), and the Angular router shows the page;
//   - anything else that matches no file reaches this Worker. A path whose
//     last segment names a file (`/missing.js`, `/assets/logo.png`) is a
//     missing file: a 404, not the app's page, so a stale script reference
//     fails as a 404 instead of parsing HTML as JavaScript. Any other path is
//     a page asked for without a browser's navigation headers (a link
//     preview, curl): it is handed back to the assets, which answer with
//     index.html as they do for a navigation.
//
// It exists because a Workers + Static Assets deploy has a Worker in front of
// the assets — the place a redirect, a header or an API route goes when the
// app needs one.
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

/** The last path segment has an extension: the address of a file. */
export function namesAFile(pathname: string): boolean {
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  return /\.[A-Za-z0-9]+$/.test(last);
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    if (namesAFile(new URL(request.url).pathname)) {
      return Promise.resolve(
        new Response("Not Found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } }),
      );
    }
    return env.ASSETS.fetch(request);
  },
};
