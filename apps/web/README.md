# apps/web — the Angular app

An Angular app on [Angular](https://angular.dev) 22 — the Angular CLI's
welcome page, as Vercel's Angular example (MIT, `LICENSE.md`) ships it —
built fully static by Angular's esbuild application builder and served as
Cloudflare Workers + Static Assets, as a single-page app:

- the welcome page in `src/app/app.component.html` — its toolbar, the
  "<name> app is running!" banner, the Resources cards and the Next Steps
  terminal whose command switches with the card you click
- a standalone `AppComponent`, its configuration (`src/app/app.config.ts`:
  zone change detection and the router) and its routes (`src/app/app.routes.ts`,
  none yet), bootstrapped by `src/main.ts`
- the template's specs and one for the Next Steps terminal
  (`src/app/*.spec.ts`), run by `ng test` on Angular's Vitest builder

The app's name is in `src/app/site.ts`; `AppComponent` reads it as its
`title`, which the banner shows.

`worker/index.ts` sits in front of the static build: the assets answer every
file and every browser navigation (`not_found_handling:
"single-page-application"` in `wrangler.jsonc`), and the Worker answers what
is left — a 404 for a path that names a missing file, the app for any other
page.

```bash
pnpm dev        # ng serve on http://localhost:3000
pnpm build      # ng build → dist/browser
pnpm test       # ng test: the specs, once, in jsdom
pnpm preview    # wrangler dev over the built app, behind worker/index.ts
```

How it is deployed — per environment, on merge to `main` — is the
repository's README and `component.yaml` beside this file.
