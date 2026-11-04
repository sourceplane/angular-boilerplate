# angular-boilerplate — risks and open questions

| ID | Risk | State | Notes |
|---|---|---|---|
| NG-A | `baseline-v1` is not yet proven live | OPEN | Proven offline in Baseline CI: the offline bootstrap with the blueprint's own hooks, the stage lane's own steps in a staged job tree, the app served by `wrangler dev` and smoke-tested with the component's own command, every route read. A console bootstrap closes it |
| NG-B | Angular 22, not the template's 15 | ACCEPTED | Angular 15 does not build on Node 22 (spike: `~/orunbase/spikes/angular-boilerplate.md`). The welcome page renders the same; its links point at angular.io pages that now redirect to angular.dev, as the template's do |
| NG-C | Standalone, not NgModule | ACCEPTED | Angular 22's test builder cannot compile an NgModule-declared component's template (reproduced on a stock `ng new --standalone=false` project). A product that wants NgModules back can add one; its specs would need the same workaround |
| NG-D | The Worker's 404 rule reads the path | ACCEPTED | A page route whose last segment has a dot (`/v1.2`) asked for without a browser's navigation headers would be a 404; a browser's navigation to it is still the app. `namesAFile` is the one place to change it |
| NG-E | The template's component-style budget warns | ACCEPTED | The welcome page's inline `<style>` is 3.76 kB against the template's own 2 kB `anyComponentStyle` warning budget; `ng build` warns and succeeds, as the template's budgets say. A product replacing the page clears it |
| NG-F | stack-tectonic 0.19.0, not 0.20.0 | ACCEPTED | 0.20.0's lane-shared install links each job's `node_modules` out of its tree; the siblings pin 0.19.0 for it and the app would save nothing |
| NG-G | zone.js kept | ACCEPTED | The template ran on zone.js; Angular 22 generates zoneless apps by default. `provideZoneChangeDetection()` keeps the template's behaviour; dropping zone.js is the owner's change |
