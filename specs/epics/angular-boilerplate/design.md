# angular-boilerplate — design

## The template

Vercel's Angular example (`framework-boilerplates/angular` in
[vercel/examples](https://github.com/vercel/examples)) is the app the Angular
CLI 15 generates: an `AppModule` declaring one `AppComponent`, an
`AppRoutingModule` with no routes, and the CLI's welcome page in
`app.component.html` — a toolbar, the "`<title>` app is running!" banner,
five Resources cards, and a Next Steps terminal whose command switches with
the card you click (a hidden input's value, read by `ngSwitch`), above a
`<router-outlet>`. Its title is `angular-test`, the CLI project it was
generated as. Three Karma/Jasmine specs check that the component is created,
that its title is `angular-test`, and that the banner renders it. Vercel
builds it with its Angular framework preset and serves `dist/` statically.

## Angular 15 → 22

The runners' Node is 22. Angular CLI 15 supports Node 14, 16 and 18, and on
Node 22 it reports "Unsupported"; `ng build` then fails outright
(`lib.es5.d.ts: Duplicate identifier 'ReturnType'` — TypeScript 4.8 against
today's `@types/node`). Making it pass would mean pinning old types on a
Node the CLI refuses to support. So the template moves to the current major,
22.2: Angular's esbuild application builder (`@angular/build:application`,
output `dist/browser`), TypeScript 6.0 (whose tsconfig rejects an `outDir`
without a `rootDir`, so the template's are dropped), zone.js 0.16, and RxJS
7.8.

## Standalone

Angular 22's test builder (`@angular/build:unit-test`) cannot compile the
template of a component declared in an NgModule: the template's own spec
fails with NG8001 (`router-outlet` is not a known element) and NG8002
(`ngSwitch`), and so does the spec of a stock Angular 22.2.5 project
generated with `ng new --standalone=false`. So `AppComponent` is standalone,
the shape Angular 22 generates by default: it imports `NgSwitch`,
`NgSwitchCase`, `NgSwitchDefault` and `RouterOutlet`; `main.ts` calls
`bootstrapApplication(AppComponent, appConfig)`; `app.config.ts` provides
zone change detection (the template ran on zone.js) and the router; the
routes, still none, are `app.routes.ts`. `AppModule` and
`AppRoutingModule` go. The welcome page's HTML and CSS are byte for byte the
template's, and the three specs keep what they assert (the title they
compare against is the name seam's).

## How it maps to Cloudflare

| Vercel | Here | Why |
|---|---|---|
| Static output on Vercel's CDN | `dist/browser` as Workers Static Assets, uploaded with `<repo>-web-<env>` | The app is static; the assets are the app |
| — | One Worker, `apps/web/worker/index.ts` | The `cloudflare-workers-assets-turbo` composition deploys a Worker with its assets; it answers what the assets leave |
| A page address other than `/`: the host's (no rewrite in the template) | `not_found_handling: single-page-application`: a browser's navigation that matches no file gets `index.html` | The app routes in the browser; a route added to `app.routes.ts` must work on a deep link and a reload |
| A missing file: the host's 404 | The Worker answers 404 when the path's last segment names a file, and hands any other page request back to the assets (which answer `index.html`) | Only requests the assets did not answer reach it: a non-navigation miss. The assets binding applies the same fallback, so forwarding a `/missing.js` would answer HTML with a 200 |
| `ng build` / `ng test` on Karma and Chrome | `ng build` on the esbuild builder; `ng test` on Angular's Vitest builder in jsdom | The current Angular's defaults; no browser on a runner |

## Every page is the app's

A request reaches Workers Static Assets first. A file is served as it is
(the bundles carry content hashes). A browser's navigation that matches no
file (`Sec-Fetch-Mode: navigate`) is answered with `index.html` and a 200.
Everything else that matches no file reaches the Worker, and the Worker
decides by the path: a last segment with an extension (`/missing.js`,
`/assets/logo.png`) is a missing file and gets a plain-text 404; any other
path is a page asked for without a browser's headers (a link preview, curl)
and is handed back to the assets, which answer `index.html`. A browser that
navigates to `/missing.js` still gets the app: the assets answer navigations
before the Worker sees them. The rule is one function, `namesAFile`, tested
in `tests/web/src/worker.test.ts` and read over HTTP by the e2e tier.

## The repository

docusaurus' shape, the same static build behind one Worker: `apps/web` (the
Angular workspace, the app, the Worker, the deploy contract), `tests/web`
(vitest), the shared TypeScript and ESLint configuration, the wrangler
renderer, `ci.yml` byte for byte docusaurus' (turso-starter's but for one
comment). The rename engine is astro-boilerplate's: the same
`<framework>-boilerplate` slug, which no framework module spells, so nothing
of Angular's needs masking; the seam is `SITE_NAME` in
`apps/web/src/app/site.ts`, defaulting to the template's `angular-test`.

## The alternative rejected

**Server rendering with `@angular/ssr`** on a Worker. The template has no
server routes and no SSR; adding Angular's server build would change what
the template is and put a server bundle in front of a page that renders in
the browser. A static build behind the assets is the template as Vercel
serves it.
