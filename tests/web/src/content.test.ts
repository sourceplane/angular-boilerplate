import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

// The template's own page, ported as it was: the Angular CLI welcome page
// (src/app/app.component.html, byte for byte), its shell (src/index.html) and
// its global stylesheet.
const appDir = path.resolve(__dirname, "../../../apps/web");
const read = (rel: string) => fs.readFileSync(path.join(appDir, rel), "utf8");
const page = read("src/app/app.component.html");

describe("the welcome page (apps/web/src/app/app.component.html)", () => {
  it("is the template's placeholder, toolbar and banner", () => {
    expect(page).toContain("<!-- * * * * * * * * * * is only a placeholder * * * * * * * * * * -->");
    expect(page).toContain('<div class="toolbar" role="banner">');
    expect(page).toContain("<span>Welcome</span>");
    expect(page).toContain("<h2>Resources</h2>");
    expect(page).toContain("<h2>Next Steps</h2>");
  });

  it("links the template's resources", () => {
    const cards = [...page.matchAll(/<a class="card" target="_blank" rel="noopener" href="([^"]+)">/g)].map((m) => m[1]);
    expect(cards).toEqual([
      "https://angular.io/tutorial",
      "https://angular.io/cli",
      "https://material.angular.io",
      "https://blog.angular.io/",
      "https://angular.io/devtools/",
    ]);
  });

  it("keeps the Next Steps terminal and its six commands", () => {
    const commands = [...page.matchAll(/<pre \*ngSwitch(?:Default|Case="'[a-z]+'")>([^<]+)<\/pre>/g)].map((m) => m[1]);
    expect(commands).toEqual([
      "ng generate component xyz",
      "ng add @angular/material",
      "ng add @angular/pwa",
      "ng add _____",
      "ng test",
      "ng build",
    ]);
  });

  it("ends with the router outlet the app's routes render into", () => {
    expect(page.trimEnd().endsWith("<router-outlet></router-outlet>")).toBe(true);
  });
});

describe("the shell (apps/web/src/index.html)", () => {
  it("is the template's: its title, base href, viewport and favicon", () => {
    const shell = read("src/index.html");
    expect(shell).toContain("<title>Angular</title>");
    expect(shell).toContain('<base href="/" />');
    expect(shell).toContain('<meta name="viewport" content="width=device-width, initial-scale=1" />');
    expect(shell).toContain('<link rel="icon" type="image/x-icon" href="favicon.ico" />');
    expect(shell).toContain("<app-root></app-root>");
  });
});

describe("the routes (apps/web/src/app/app.routes.ts)", () => {
  it("are the template's: none yet", async () => {
    const { routes } = await import("@/src/app/app.routes");
    expect(routes).toEqual([]);
  });
});

describe("the licence", () => {
  it("is the template's MIT licence, © Vercel", () => {
    const licence = read("LICENSE.md");
    expect(licence).toContain("The MIT License (MIT)");
    expect(licence).toContain("Copyright (c) 2023 Vercel, Inc.");
  });
});
