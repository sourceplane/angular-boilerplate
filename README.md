# angular-boilerplate

Vercel's [Angular Boilerplate](https://github.com/vercel/examples/tree/main/framework-boilerplates/angular)
template — the Angular CLI's welcome page, with its resources, its Next Steps
terminal and its router, and the template's specs — moved from Angular 15 to
Angular 22, running on **Cloudflare Workers + Static Assets**, deployed by
[Orun](https://github.com/sourceplane/orun) to stage and prod on every merge.
Packaging it as an Orun baseline is the next milestone (NG2).

Angular builds fully static: `ng build` (Angular's esbuild application
builder) writes the app's shell, its hashed JavaScript and CSS bundles and
the favicon to `dist/browser`. That folder is uploaded as Workers Static
Assets with one small Worker in front, and the app is served as a
single-page app: every page address is answered with the app, whose router
shows the page, and a missing file is a 404. The welcome page, its styles and
its specs do not change; the app's name moves into one module, the app is
standalone (Angular 22's own shape — its test builder cannot compile the
template's NgModule), and the specs run on Angular's own Vitest builder. See [`specs/epics/angular-boilerplate`](specs/epics/angular-boilerplate/README.md)
for the design, the milestones and the as-built status.

## What is here (the app)

| Surface | Where |
|---|---|
| The app's name, which the welcome banner reads | `apps/web/src/app/site.ts` |
| The welcome page (the template's, byte for byte), its component and its styles | `apps/web/src/app/app.component.{html,css,ts}`, `apps/web/src/styles.css` |
| The app's configuration, its routes (none yet) and its bootstrap | `apps/web/src/app/app.config.ts`, `apps/web/src/app/app.routes.ts`, `apps/web/src/main.ts` |
| The shell and the favicon | `apps/web/src/index.html`, `apps/web/src/favicon.ico` |
| The Angular workspace: build, serve and test targets | `apps/web/angular.json` |
| The template's specs, and one for the Next Steps terminal | `apps/web/src/app/*.spec.ts` (Angular's Vitest builder) |
| The Worker in front of the assets, its config, deploy contract | `apps/web/worker/index.ts`, `apps/web/wrangler.jsonc`, `apps/web/component.yaml` |
| Tests (the name seam, the build config, the Worker's routing, the template's page) | `tests/web` (vitest) |

## Getting started

```bash
pnpm install
pnpm typecheck        # tsc: the app, its specs and the Worker
pnpm lint             # eslint
pnpm test             # ng test (the app's specs) and vitest (tests/web)
pnpm build            # ng build → apps/web/dist/browser
```

```bash
pnpm --filter @app/web dev        # ng serve on http://localhost:3000
pnpm --filter @app/web preview    # wrangler dev over the built app and its Worker
```

## How it maps to Vercel

| Vercel | Here |
|---|---|
| Static output on Vercel's CDN, from its Angular framework preset | Workers Static Assets: `dist/browser` uploaded with the Worker `<repo>-web-<env>` (`apps/web/wrangler.jsonc`) |
| The template's build (`ng build`, Angular 15's webpack browser builder) | `ng build` on Angular 22's esbuild application builder (`@angular/build:application`), through turbo — Angular 15 cannot build on Node 22, the runners' Node |
| `ng test` on Karma and Chrome | `ng test` on Angular's Vitest builder (`@angular/build:unit-test`, jsdom): the template's three specs, run without a browser |
| A page address other than `/` answered by the host (the template sets no rewrite) | Every page address is the app's: a browser's navigation that matches no file gets `index.html` (`not_found_handling: single-page-application`), and the Worker hands any other page request back to the assets, so the router owns every route the app adds |
| The host's 404 for a missing file | The Worker answers 404 when the path names a file (`/missing.js`), so a stale script reference fails as a 404, not as HTML parsed as JavaScript |
| Deploy on push | Orun deploys `<repo>-web-{stage,prod}` on merge to `main` (`apps/web/component.yaml`) |
| "Deploy with Vercel" (clone the template) | `orun new --blueprint repo-blueprint.yaml` — a new repository, branded, deployed |

## CI

| Workflow | What it runs | Ships to an app |
|---|---|---|
| `ci.yml` | the Orun pipeline, and the only workflow an app carries: `orun plan --changed`, then one job per lane. A pull request runs the verify lanes (the app built and dry-deployed per environment; the tests' `quick-check` lane installs and checks the package, it does not run them), except the bootstrap's own landings (`orun/BASE-*`), where `plan` alone is the check; a merge deploys stage → prod. It plans nothing while `intent.yaml` names the placeholder workspace `ws_CHANGE_ME`, as this repository does. A manual run (Orunbase's Deploy button, or Run workflow on `main`) plans the environment and components it names under the push-to-main trigger, so they deploy as a merge deploys them | yes |

## Credits

The app is Vercel's Angular example
([vercel/examples](https://github.com/vercel/examples),
`framework-boilerplates/angular`, © 2023 Vercel, MIT — `apps/web/LICENSE.md`),
itself the Angular CLI's generated welcome app, at vercel/examples `de86723`.
