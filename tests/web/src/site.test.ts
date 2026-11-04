import { describe, expect, it } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

const appDir = path.resolve(__dirname, "../../../apps/web");
const read = (rel: string) => fs.readFileSync(path.join(appDir, rel), "utf8");

describe("site identity (apps/web/src/app/site.ts)", () => {
  it("names the site", async () => {
    const { SITE_NAME } = await import("@/src/app/site");
    expect(SITE_NAME.trim()).not.toBe("");
  });

  it("is a literal the rename seam can find", () => {
    expect(read("src/app/site.ts")).toMatch(/^export const SITE_NAME = "[^"]+";$/m);
  });

  it("is the one place the welcome banner takes its name from", () => {
    const component = read("src/app/app.component.ts");
    expect(component).toContain("import { SITE_NAME } from './site';");
    expect(component).toMatch(/^\s+title = SITE_NAME;$/m);
    expect(read("src/app/app.component.html")).toContain("<span>{{ title }} app is running!</span>");
    // Nothing else in the app spells a name of its own.
    for (const file of ["src/app/app.component.ts", "src/app/app.config.ts", "src/main.ts"]) {
      expect(read(file)).not.toMatch(/angular-test/);
    }
  });
});

describe("the build (apps/web/angular.json)", () => {
  const project = JSON.parse(read("angular.json")).projects.web;

  it("is Angular's esbuild application builder, writing dist/browser", () => {
    expect(project.architect.build.builder).toBe("@angular/build:application");
    expect(project.architect.build.options.outputPath).toBe("dist");
    expect(project.architect.build.options.browser).toBe("src/main.ts");
    expect(project.architect.build.defaultConfiguration).toBe("production");
    expect(project.architect.build.configurations.production.outputHashing).toBe("all");
  });

  it("ships the template's favicon and assets folder", () => {
    expect(project.architect.build.options.assets).toEqual(["src/favicon.ico", "src/assets"]);
    expect(fs.existsSync(path.join(appDir, "src/favicon.ico"))).toBe(true);
  });

  it("runs the specs with Angular's own test builder, once", () => {
    expect(project.architect.test.builder).toBe("@angular/build:unit-test");
    expect(project.architect.test.options.watch).toBe(false);
  });
});

describe("the Worker and its assets (apps/web/wrangler.jsonc)", () => {
  const wrangler = read("wrangler.jsonc");

  it("serves the static build behind the Worker", () => {
    expect(wrangler).toContain('"main": "./worker/index.ts"');
    expect(wrangler).toContain('"directory": "./dist/browser"');
    expect(wrangler).toContain('"binding": "ASSETS"');
  });

  it("answers a navigation to any page with the app (it routes in the browser)", () => {
    expect(wrangler).toContain('"not_found_handling": "single-page-application"');
  });
});
