# angular-boilerplate — operating contract (for humans and agents)

This is the standing guide to how this app is deployed and operated.
Instance facts (live URLs, workspace, the secrets it uses) live in
[deployment.md](deployment.md), rendered from probed reality by the
bootstrap's `03-docs` phase; this file is the contract that stays true
between deployments. It is written to give an agent with repository read
access enough context to reason about and operate the app without any
other source.

## What this system is

An Angular app on Cloudflare alone, expressed as an Orun component-native
desired-state repo.

- **`apps/web`** — the app: Angular 22, built fully static. `ng build`
  (Angular's esbuild application builder) writes the shell (`index.html`),
  the hashed JavaScript and CSS bundles and the favicon to `dist/browser`,
  which deploys as Workers Static Assets behind one small Worker
  (`worker/index.ts`). The app routes in the browser: a browser's navigation
  that matches no file is answered with `index.html`
  (`not_found_handling: single-page-application`), and the Worker answers
  what the assets leave — a 404 for a path that names a file, the app for any
  other page. There is no database, no server rendering and no runtime
  secret.
- **`tests/web`** — the app-identity, build-config, Worker-routing and
  template-page tests (vitest), verified on the `dev` rung. The app's own
  specs (`apps/web/src/app/*.spec.ts`) run with `ng test`.
- **`tooling/*`** — shared TypeScript and ESLint configuration, and the
  deploy-time wrangler renderer for workers that take wiring.

Environments: **`stage`** and **`prod`** are deployed; **`dev` is
verify-only by design** — lanes build and test, nothing deploys.

## Identity and tenancy

Every remote operation runs against ONE Orun workspace, declared in
`intent.yaml` under `execution.state.workspace` — committed, enforced, and
what CI uses. Do not remove it; headless credentials depend on it. If it
reads `ws_SET_ME`, the bootstrap had no workspace to write: set the real one
before anything else.

## How deployment works

1. Merge (or push) to `main`.
2. CI (`.github/workflows/ci.yml`) runs `orun plan --changed` — only
   components whose files changed are planned — then runs each planned lane
   with `orun run --remote-state`, authenticated by GitHub OIDC (the
   exchange resolves this repository's linked workspace server-side).
3. `apps/web` builds once per environment (`ng build`; the app writes no
   absolute URL, so the build is the same everywhere), then `wrangler
   deploy` ships `angular-boilerplate-web-<env>` with `dist/browser` as its
   assets, and a smoke test fetches `/` (the shell), the main bundle it
   names (the welcome page) and a deep link (the shell again) from it, and
   checks that a missing file answers 404.
4. `prod` deploys after `stage` has converged on the same commit
   (`environments.prod.promotion` in intent.yaml).
5. **The convergence run is the deployment.** A green run means every
   planned lane applied. Failed lanes are retried with
   `gh run rerun --failed`, which resumes the same execution.

Caveats that matter:

- A push that touches no component files plans zero lanes — that run is
  green and deployed nothing. Never treat "latest run green" as "site
  converged"; probe the URLs instead.
- A change to `intent.yaml` alone maps to no component and redeploys nothing
  on its own. Land it with a change under `apps/web`.
- The build runs with its dependencies inside the job's own tree, as
  `intent.yaml`'s stack-tectonic 0.19.0 pin plans it (its comment says why).
  Do not bump it without building `apps/web` in a job tree staged the way
  the new composition plans it.
- Every page address is the app's. A route added to
  `apps/web/src/app/app.routes.ts` works on a deep link and a reload with no
  server change; a route whose last segment has a dot (`/v1.2`) would be
  taken for a file by the Worker when it arrives without a browser's
  navigation headers — `namesAFile` in `worker/index.ts` is the rule.

## Secrets model

- **Brokered provider secrets**: `CLOUDFLARE_API_TOKEN` (Workers deploy
  scope) and `CLOUDFLARE_ACCOUNT_ID` — pointers minted per run from the
  workspace's Cloudflare connection. No long-lived values at rest; nothing
  to rotate by hand.
- Inspect by NAME only: `orun secrets list --org <ws> --project` and
  `--env stage|prod`. No tooling in this repository prints a secret value,
  and no document in `ai/context/` may contain one.
- The app needs no runtime secret.

## Verifying the system

```bash
# the app on each environment (also recorded, probed, in deployment.md)
curl -s -o /dev/null -w '%{http_code}\n' https://angular-boilerplate-web-stage.your-workers-subdomain.workers.dev/
curl -s https://angular-boilerplate-web-prod.your-workers-subdomain.workers.dev/some/deep/link | grep -c '<app-root>'

# workspace readiness (integrations + repository link)
orun integrations list --org <ws> --json && orun cloud check --org <ws>
```

## Common operations

| task | how |
|---|---|
| add a component | `pnpm --filter @app/web ng generate component <name>`, merge |
| add a page | give it a route in `apps/web/src/app/app.routes.ts` (the welcome page's `<router-outlet>` renders it), merge |
| rename the app | edit `apps/web/src/app/site.ts` (`SITE_NAME`), merge |
| deploy a change | merge to `main`; watch the run; failed lanes → `gh run rerun --failed` |
| deploy by hand | Orunbase's Deploy button, or `gh workflow run ci.yml --ref main -f environment=<env> [-f component=<a,b>]` — the named components (blank: every one) run in that environment as a merge runs them; started off `main` it is refused |
| redeploy without a change | edit the last line of `apps/web/component.yaml` (`# orun: redeploy <reason> <stamp>`) and merge — it is a deploy trigger, nothing reads it |
| serve a custom domain | attach it to the Worker in Cloudflare and set `SITE_URL` for the environment in `intent.yaml` — the deployment record probes it (README, "Custom domain") — then replace the placeholder `angular-boilerplate.example.com` in `intent.yaml`'s `BASE_DOMAIN` (dev, stage and prod) with it |
| add a runtime secret | `orun secrets set <KEY> --org <ws> --env <env>` |
| headless credentials | `ORUN_TOKEN` (workspace-scoped) + `GITHUB_TOKEN` |

The deployment record is the bootstrap's `03-docs` phase. Re-running it (the
Orun console's Retry on that phase, or `orun new … --phase 03-docs`)
re-probes the URLs and re-renders [deployment.md](deployment.md); it is
idempotent.

## Evolution

A route the static app cannot answer (a redirect, an API, a header) goes in
`apps/web/worker/index.ts`, in front of the assets. Structural changes (a
second Worker, a data store) follow the same
contract that deployed the app: add a component under `apps/`, `infra/` or
`packages/` with a `component.yaml`, land it as a pull request, and the
convergence run applies it.
