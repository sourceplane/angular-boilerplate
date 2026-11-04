# angular-boilerplate — implementation plan

Three milestones, each one reviewed pull request (NG0 follows the
repository's first commit), each green before it merges.

## NG0 — the spec (NG-1)

The repository is born: `intent.yaml` with the placeholder workspace
`ws_CHANGE_ME`, `ci.yml` (byte for byte docusaurus', turso-starter's but for
one comment, which plans nothing until the workspace is set), the shared
TypeScript and ESLint configuration, the spec index, this doc set and the
task contracts.

## NG1 — the app on Workers (NG-2)

- The template's `src/` in `apps/web` on Angular 22.2: the welcome page,
  its styles, the shell and the favicon as they are; `AppComponent`
  standalone, `app.config.ts`, `app.routes.ts`, `main.ts` with
  `bootstrapApplication`; `site.ts`, the name seam.
- `angular.json` (project `web`): the esbuild application builder writing
  `dist/browser`, the dev server, and the Vitest test builder.
- `worker/index.ts` and `wrangler.jsonc`: the Worker in front of
  `dist/browser`, single-page-app routing, the 404 rule for file paths.
- `component.yaml`: the deploy contract and its smoke over the shell, the
  main bundle, a deep link and a missing file.
- Specs: the template's three, and one for the Next Steps terminal. Tests
  (`tests/web`): the name seam, the build and test config, the Worker's
  routing, the template's page.
- The README's "How it maps to Vercel".

## NG2 — a baseline (NG-3)

docusaurus' machinery, renamed: `blueprint.yaml`, `repo-blueprint.yaml`,
`.baseline/` (identity, product README, task contracts), `tooling/rebrand`
(astro-boilerplate's engine and rules, the seam at
`apps/web/src/app/site.ts`), `tooling/bootstrap`,
`hooks/render-deployment-docs.sh` (probing `/`, a deep link and each
`SITE_URL`), `docs/phases/`, the context pack, `testing/` (the leak and
placement gates on this tree's files, placement also failing on the
template's name left in the app or a framework module renamed; the e2e tier
building the app in the stage lane's staged tree and reading every route it
promises) and `baseline.yml` / `tag.yml`.
