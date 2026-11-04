# angular-boilerplate — decisions

The choices that shape this repository, one line each, with where the full
reasoning lives. Superseded decisions stay listed, marked, so the history
reads in order.

| # | Decision | Why | Source |
|---|---|---|---|
| 1 | A static build served as Workers Static Assets behind one Worker; no adapter, no server rendering | The template renders in the browser; nothing renders at request time | design.md, "The alternative rejected" |
| 2 | Angular 22.2, not the template's 15.0 | Angular 15 does not build on Node 22 (the runners' Node): CLI 15 calls it unsupported and TS 4.8 cannot read today's @types/node | design.md, "Angular 15 → 22"; risk NG-B |
| 3 | A standalone `AppComponent` with `bootstrapApplication`, not the template's `AppModule` | Angular 22's own test builder cannot compile an NgModule-declared component's template (NG8001 on a stock `ng new --standalone=false` project) | design.md, "Standalone"; risk NG-C |
| 4 | The specs on Angular's Vitest builder (`@angular/build:unit-test`, jsdom), not Karma and Chrome | Angular's current default; runs on any runner without a browser; the template's three specs pass unchanged in what they assert | IMPLEMENTATION-STATUS, departure 3 |
| 5 | zone.js and `provideZoneChangeDetection()` kept | The template ran on zone.js; zoneless is Angular 22's default for new apps, a change of behaviour the owner can make | risk NG-G |
| 6 | Single-page-app routing (`not_found_handling: single-page-application`), and the Worker answers 404 for a path that names a file | The router owns every page address; a missing script must not be answered with HTML | design.md, "Every page is the app's"; risk NG-D |
| 7 | The app's name is one seam, `apps/web/src/app/site.ts`; the component reads it | One place a product's identity is written | IMPLEMENTATION-STATUS, departure 4 |
| 8 | No infra root: the app binds nothing | Nothing to provision; `infra/` and `packages/` stay as empty discovery roots | README |
| 9 | One landing (`01-product`) then the record (`03-docs`); each bootstrap pull request checked in the box | A landing has a fixed cost; the convergence on main builds, deploys and smoke-tests the app for real (docusaurus, cirrus-baseline baseline-v22) | `repo-blueprint.yaml` |
| 10 | stack-tectonic 0.19.0, not 0.20.0 | The siblings' pin; 0.20.0's lane-shared install is a layout this build has not been verified in | risk NG-F |
| 11 | Component docs are generated from the manifests and checked in CI | A hand-written copy of the component's facts drifts silently | `tooling/catalog/gen-component-docs.py` |
