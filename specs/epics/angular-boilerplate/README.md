# angular-boilerplate — Vercel's Angular Boilerplate on Cloudflare Workers

**Angular builds fully static, so the port is two things: the template moved
from Angular 15 to Angular 22 — the only Angular that builds and tests on
the runners' Node 22, standalone because Angular 22's test builder cannot
compile the template's NgModule — and where it is served — `dist/browser` as
Cloudflare Workers Static Assets behind one small Worker, every page address
answered by the app, deployed by Orun to stage and prod on every merge — and
then the baseline that makes a copy of it somebody else's app in one
landing.**

| | |
|---|---|
| Status | In progress — NG0 on main |
| Upstream | [vercel/examples](https://github.com/vercel/examples) `framework-boilerplates/angular` (MIT), at `de86723` (2026-10-16; the folder last changed in `cb2643e`): the Angular CLI 15's welcome app |
| Reference | [docusaurus](https://github.com/sourceplane/docusaurus) — the same static build behind one Worker, its tests and its bootstrap; [astro-boilerplate](https://github.com/sourceplane/astro-boilerplate) — the same `<framework>-boilerplate` identity and rename rules |
| Key | `NG` |

## Read in this order

1. [design.md](design.md) — the template, the move to Angular 22 and to a
   standalone component, how each Vercel piece maps to Cloudflare, the
   single-page-app routing and the Worker's 404 rule, the repository, and
   the alternative rejected.
2. [implementation-plan.md](implementation-plan.md) — the milestones and
   what each one lands.
3. [risks-and-open-questions.md](risks-and-open-questions.md) — what is not
   proven, and what was accepted.
4. [IMPLEMENTATION-STATUS.md](IMPLEMENTATION-STATUS.md) — what shipped, and
   every departure from the upstream template.

## Milestones

| Milestone | What it lands | Task |
|---|---|---|
| NG0 — the spec | the repository, its intent, CI, tooling and spec index; this doc set | NG-1 |
| NG1 — the app on Workers | the template on Angular 22 in `apps/web`, built static, served as assets behind one Worker as a single-page app, with its specs and tests | NG-2 |
| NG2 — a baseline | the console card, the build document, the context pack and the baseline's tests | NG-3 |
