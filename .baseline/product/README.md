# angular-boilerplate

An Angular app — the Angular CLI's welcome page, with its resources, its
Next Steps terminal and its router — built with
[Angular](https://angular.dev) 22, fully static, and served as **Cloudflare
Workers + Static Assets** behind one small Worker, as a single-page app.

## Live deployment

<!-- 03-docs:begin -->
Not recorded yet. The bootstrap's last phase writes the live URLs, the
workspace and the secrets the app uses into
[ai/context/deployment.md](ai/context/deployment.md); how the app deploys
and how to operate it is in
[ai/context/operations.md](ai/context/operations.md).
<!-- 03-docs:end -->

## What is here

| Surface | Where |
|---|---|
| The app's name, which the welcome banner reads | `apps/web/src/app/site.ts` |
| The welcome page, its component and its styles | `apps/web/src/app/app.component.{html,css,ts}`, `apps/web/src/styles.css` |
| The app's routes (none yet), its configuration and its bootstrap | `apps/web/src/app/app.routes.ts`, `apps/web/src/app/app.config.ts`, `apps/web/src/main.ts` |
| The page shell and the favicon | `apps/web/src/index.html`, `apps/web/src/favicon.ico` |
| Images and other files served as they are | `apps/web/src/assets` |
| The Angular workspace: build, serve and test | `apps/web/angular.json` |
| The app's specs | `apps/web/src/app/*.spec.ts` |
| The Worker in front of the static files, and the deploy contract | `apps/web/worker/index.ts`, `apps/web/wrangler.jsonc`, `apps/web/component.yaml` |
| Tests of the build, the Worker and the page | `tests/web` (vitest) |

## Getting started

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test             # ng test (the app's specs) and the vitest suite
pnpm build            # ng build → apps/web/dist/browser
```

```bash
pnpm --filter @app/web dev        # ng serve on http://localhost:3000, reloading as you edit
pnpm --filter @app/web preview    # wrangler dev over the built app, as the Worker serves it
```

Generate a component with `pnpm --filter @app/web ng generate component
<name>` and add a page by giving it a route in `apps/web/src/app/app.routes.ts`:
every page address is answered with the app, so a route you add works on a
deep link and a reload without any server change. A path that names a file
the build did not write (`/missing.js`) is a 404. Make the app yours in
`apps/web/src/app/` (the welcome page is the Angular CLI's placeholder: delete
it to start) and `apps/web/src/app/site.ts` (its name).

## How it deploys

Merges to `main` converge through [Orun](https://github.com/sourceplane/orun):
`.github/workflows/ci.yml` plans the changed components and runs each lane
against the workspace in `intent.yaml`. The app deploys to `stage`, then to
`prod` once stage has converged on the same commit; `dev` only verifies. The
Worker is `angular-boilerplate-web-<env>` on your account's workers.dev
subdomain, and every deploy is smoke-tested over HTTP: the home page must be
the app's shell, the main bundle it loads must be served with the welcome
page in it, a deep link must answer with the app, and a missing file must be
a 404. A pull request runs the same pipeline's verify lanes: the app built
and dry-deployed for each environment, with nothing deployed. They do not
lint or run the tests, so run `pnpm typecheck`, `pnpm lint` and `pnpm test`
before you push. (A push to `main` builds, deploys and smoke-tests.)

The pipeline holds one credential, GitHub's own `GITHUB_TOKEN`. The
Cloudflare token and account id are brokered per run from the workspace's
Cloudflare connection; nothing provider-shaped is stored in the repository
or in GitHub.

**Deploy by hand.** Orunbase's **Deploy** button on a component, or **Run
workflow** on the CI workflow in GitHub's Actions tab (on `main`), runs
`ci.yml` for the environment and components you pick, and each one deploys
exactly as a merge would deploy it. Leave the component blank to redeploy
every component in that environment, with nothing changed: after rotating a
secret, say. A component with nothing to run in that environment (a test
suite in `prod`) is left out with a notice.

## Custom domain

The app answers on workers.dev from its first deploy. To serve it on your
own domain:

1. Add the domain to the Cloudflare account the app deploys into, and attach
   it to the Worker (dashboard → Workers & Pages →
   `angular-boilerplate-web-prod` → Settings → Domains & Routes → Add →
   Custom domain). Do the same for stage with a subdomain if you want one.
2. Record the environment's public origin in `intent.yaml`. The app writes
   no absolute URL, so the build does not change; the deployment record
   probes the domain beside the workers.dev URL:

   ```yaml
   environments:
     prod:
       env:
         SITE_URL: https://angular-boilerplate.example.com
   ```

   The app was born with the reserved placeholder
   `angular-boilerplate.example.com` where its domain goes: that example,
   and `BASE_DOMAIN` under each environment (dev, stage and prod) in
   `intent.yaml`. Replace it with your domain in the same change.

## Credits

The app is Vercel's Angular example
([vercel/examples](https://github.com/vercel/examples),
`framework-boilerplates/angular`, © 2023 Vercel, MIT-licensed —
`apps/web/LICENSE.md`), itself the Angular CLI's generated welcome app,
moved to Angular 22. Its welcome page links Angular's documentation; replace
it with your own app as you make it yours.
