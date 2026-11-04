# Epics

Orun-style work programs. Each epic is a folder carrying `epic.yaml` (the
declaration the platform reads: slug, key prefix, milestones with exit
criteria and task keys) beside its doc set. The pull request that adds the
folder is the adoption; the merge creates the epic in the workspace.

| Epic | Cluster | Status | What it is |
|------|---------|--------|------------|
| [`angular-boilerplate/`](./angular-boilerplate/) | **NG** | ✅ Shipped (`baseline-v1`); not yet live | Vercel's Angular Boilerplate — the Angular CLI's welcome app, moved to Angular 22 — built static and served as Cloudflare Workers Static Assets behind one Worker as a single-page app, and an Orun baseline that instantiates it (NG2) |

As-built ≠ intent: what shipped lives in each epic's `IMPLEMENTATION-STATUS.md`.
