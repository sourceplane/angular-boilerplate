# angular-boilerplate — implementation status

| Milestone | State | Landed |
|---|---|---|
| NG0 — the spec | ✅ | the repository's first commit and NG-1 |
| NG1 — the app on Workers | ✅ | NG-2 |
| NG2 — a baseline | ✅ | NG-3, tagged `baseline-v1` |

## Departures from the upstream template

Everything not listed here is the template as it is in vercel/examples at
`de86723` (`framework-boilerplates/angular`).

| # | What | Why |
|---|---|---|
| 1 | Angular 15.0 → 22.2 (`@angular/*` ^22.2, `@angular/build` and `@angular/cli` ^22.2.5), TypeScript 4.8 → 6.0, zone.js 0.12 → 0.16, RxJS 7.5 → 7.8; `@angular/animations` and `@angular/platform-browser-dynamic` dropped (unused, and the second deprecated) | Angular 15 does not build on Node 22, the runners' Node |
| 2 | `AppComponent` is standalone (imports `NgSwitch`, `NgSwitchCase`, `NgSwitchDefault`, `RouterOutlet`), bootstrapped by `bootstrapApplication` with `app.config.ts` (`provideZoneChangeDetection()`, `provideRouter(routes)`); `AppModule` and `AppRoutingModule` are replaced by those and `app.routes.ts` (still no routes) | Angular 22's test builder cannot compile an NgModule-declared component's template |
| 3 | The specs run on `@angular/build:unit-test` (Vitest 5, jsdom), not Karma and Chrome; `RouterTestingModule` → `provideRouter([])`, the component imported rather than declared; the title spec compares against `SITE_NAME` | Angular 22's default test builder; no browser on a runner. The three specs keep what they assert |
| 4 | `src/app/site.ts` holds the app's name (`SITE_NAME = "angular-test"`, the template's title); `AppComponent`'s `title` reads it | One rename seam |
| 5 | `angular.json`'s project is `web` (upstream `angular-test`), the build is `@angular/build:application` writing `dist/browser`, `buildOptimizer`/`vendorChunk` (browser-builder options) are gone, and the template's budgets are kept | The component's name; the esbuild builder's options |
| 6 | tsconfig: `moduleResolution: bundler`, `isolatedModules`, `skipLibCheck`; no `outDir`; `tsconfig.spec.json` includes every source and `vitest/globals` | TypeScript 6 and Angular 22's own tsconfig |
| 7 | A spec for the Next Steps terminal (`next-steps.spec.ts`): each card's command shows when it is clicked | The one interactive part of the page; the template's specs check only the banner |
| 8 | `wrangler.jsonc` names the Worker `<repo>-web`, with `main: ./worker/index.ts`, the `ASSETS` binding over `dist/browser` and `not_found_handling: single-page-application`; `worker/index.ts` answers 404 for a path that names a file | The composition deploys a Worker with its assets; the app owns every page address, a missing file is not a page |
| 9 | The package scripts keep the template's (`ng`, `start`, `build`, `watch`, `test`) and add `dev` (`ng serve --port 3000`), `preview` (`wrangler dev`), `typecheck` (`tsc` over the app, its specs and the Worker) and `lint` (`eslint .`) | The workspace's `dev` / `typecheck` / `lint` / `test` / `build` contract |
| 10 | Tests: `tests/web` (vitest) — the name seam, the build and test config, the Worker's routing (`namesAFile`, 404 vs. the app), the template's page, the licence | The template ships only the three component specs |
| 11 | `.angular/` and `dist/` are ignored by git, the blueprint and the leak gate | What a build generates is a build's, not the app's |
