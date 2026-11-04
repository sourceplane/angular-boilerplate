# angular-boilerplate — where this repository stands

The entry page for anyone (or any agent) picking this repository up. It is
this repository's own state and does not ship to an app built from it; the
two pages that do are [operations.md](operations.md) and
[deployment.md](deployment.md).

## What it is

Vercel's Angular Boilerplate — the Angular CLI's welcome app — moved from
Angular 15 to Angular 22 (standalone, esbuild), built fully static and served
as Cloudflare Workers Static Assets behind one Worker as a single-page app,
packaged as an Orun baseline: `orun new --blueprint repo-blueprint.yaml`
builds a new Angular app in its own repository and takes it to live on stage
and prod in one landing (`01-product`), then records what went live
(`03-docs`).

## Release

| | |
|---|---|
| Latest tag | `baseline-v1` — NG0–NG2: the template on Angular 22 on Workers, and the baseline |
| Proven live | No — proven offline in Baseline CI only (risk NG-A) |

## Where to read

| Question | Page |
|---|---|
| What shipped, and every departure from upstream | `specs/epics/angular-boilerplate/IMPLEMENTATION-STATUS.md` |
| Why it is built this way | [decisions.md](decisions.md), then `specs/epics/angular-boilerplate/design.md` |
| What could still go wrong | [open-risks.md](open-risks.md), then `specs/epics/angular-boilerplate/risks-and-open-questions.md` |
| How to instantiate it | `BOOTSTRAP.md`, `docs/phases/` |
| What each component is | `apps/web/docs/`, `tests/web/docs/` (generated; `python3 tooling/catalog/gen-component-docs.py`) |

## Next

1. Bootstrap one app from `baseline-v1` from the console, and record its
   timings against the 5-minute estimate (closes NG-A).
