# angular-boilerplate

Vercel's [Angular Boilerplate](https://github.com/vercel/examples/tree/main/framework-boilerplates/angular)
template — the Angular CLI's welcome page, with its resources, its Next Steps
terminal and its router, and the template's specs — moved from Angular 15 to
Angular 22, running on **Cloudflare Workers + Static Assets**, and packaged
as an **Orun baseline**: one command takes a new Angular app from nothing to
live on stage and prod, in its own repository, under its own name.

Angular builds fully static: `ng build` (Angular's esbuild application
builder) writes the app's shell, its hashed JavaScript and CSS bundles and
the favicon to `dist/browser`. That folder is uploaded as Workers Static
Assets with one small Worker in front, and the app is served as a
single-page app: every page address is answered with the app, whose router
shows the page, and a missing file is a 404. The welcome page, its styles and
its specs do not change; the app's name moves into one module, the app is
standalone (Angular 22's own shape — its test builder cannot compile the
template's NgModule), and the specs run on Angular's own Vitest builder. What
the baseline adds is everything needed to make a copy of it somebody else's —
built the way [cirrus-baseline](https://github.com/sourceplane/cirrus-baseline)
is. See [`specs/epics/angular-boilerplate`](specs/epics/angular-boilerplate/README.md)
for the design, the milestones and the as-built status.

## Instantiating an app

```bash
git clone --depth 1 --branch <baseline-tag> https://github.com/sourceplane/angular-boilerplate
cd angular-boilerplate
orun new --blueprint repo-blueprint.yaml --out ~/sites/acme-app --run-hooks --resume \
  --set reponame=acme-app --set productname="Acme App" \
  --set githuborg=acme-inc --set subdomain=<workers-dev-subdomain>
```

Or, once the platform's registry lists it, from the Orun console (Baselines →
`angular-boilerplate` → Build). Two phases — `01-product` (the repository
created, then the whole app in one pull request, deployed to stage and prod
and smoke-tested) and `03-docs` (the live deployment recorded) — each landing
one pull request in the new repository. **[BOOTSTRAP.md](BOOTSTRAP.md)** is
the operator guide; [docs/phases/](docs/phases/README.md) has a page per
phase.

The new repository receives the **app only** — the app and its tests, its
CI, its tooling, a README of its own and its operating contract — renamed
throughout to the app's name, repository and Cloudflare Worker. None of this
repository's machinery ships.

| What makes it a baseline | Where |
|---|---|
| The console card (inputs, secrets, programme) | `blueprint.yaml` |
| The build document (modules, phases, hooks) | `repo-blueprint.yaml` |
| This tree's identity, and the bootstrap's task contracts | `.baseline/` |
| The rename engine | `tooling/rebrand/rebrand.mjs` |
| The bootstrap's helpers (deferrals, redeploy marker, work-tree strip) | `tooling/bootstrap/` |
| The deployment-record renderer | `hooks/render-deployment-docs.sh` |
| The app's README and context pack | `.baseline/product/README.md`, `ai/context/` |
| The baseline's tests: contract, leak, offline bootstrap, end to end | `testing/`, `.github/workflows/baseline.yml` |
| Cutting a `baseline-vN` tag | `.github/workflows/tag.yml` |

The framework's name is not the app's: Angular's packages (`@angular/core`,
`@angular/build`), its CLI (`ng build`) and its workspace file
(`angular.json`) never spell this repository's slug, so the rename engine has
nothing of the framework's to mask. The app's display name is one literal,
`SITE_NAME` in `apps/web/src/app/site.ts` (the template's own name,
`angular-test`, the Angular CLI project it was generated as); the placement
tier fails on any placed app that spells it anywhere else, or imports a
scoped module that is not `@angular`.

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
| `baseline.yml` | the baseline's own tiers: contract tests, the blueprint read by the pinned orun, the leak gate, the offline bootstrap, the app built in a staged job tree, dry-deployed and served | no |
| `tag.yml` | cuts a `baseline-vN` tag (manual) | no |

## Credits

The app is Vercel's Angular example
([vercel/examples](https://github.com/vercel/examples),
`framework-boilerplates/angular`, © 2023 Vercel, MIT — `apps/web/LICENSE.md`),
itself the Angular CLI's generated welcome app, at vercel/examples `de86723`.
