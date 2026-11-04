import { describe, expect, it, vi } from "vitest";

import worker, { namesAFile } from "@/worker/index";

// What reaches the Worker is a request the assets did not answer: no file
// matched it and it was not a browser's navigation (those get index.html from
// the assets directly). A missing file must be a 404; a page asked for
// without a browser's navigation headers is still the app's page.
function assets() {
  return {
    fetch: vi.fn(async (_req: Request) => new Response("<app-root></app-root>", { status: 200 })),
  };
}

describe("namesAFile", () => {
  it("is true when the last path segment has an extension", () => {
    for (const p of ["/missing.js", "/main-ABC123.js", "/assets/logo.png", "/styles.css", "/a/b/c.map", "/favicon.ico"]) {
      expect(namesAFile(p)).toBe(true);
    }
  });

  it("is false for the app's page addresses", () => {
    for (const p of ["/", "/some/deep/link", "/no-such-page", "/a.b/c", "/trailing/"]) {
      expect(namesAFile(p)).toBe(false);
    }
  });
});

describe("the Worker", () => {
  it("answers a missing file with a 404, without asking the assets", async () => {
    const ASSETS = assets();
    const res = await worker.fetch(new Request("https://site.example/missing.js"), { ASSETS });
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(ASSETS.fetch).not.toHaveBeenCalled();
  });

  it("hands a page address back to the assets, which answer with the app", async () => {
    const ASSETS = assets();
    const req = new Request("https://site.example/some/deep/link");
    const res = await worker.fetch(req, { ASSETS });
    expect(ASSETS.fetch).toHaveBeenCalledWith(req);
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("<app-root></app-root>");
  });

  it("reads the path, not the query", async () => {
    const ASSETS = assets();
    const res = await worker.fetch(new Request("https://site.example/page?file=x.js"), { ASSETS });
    expect(res.status).toBe(200);
    expect(ASSETS.fetch).toHaveBeenCalledOnce();
  });
});
