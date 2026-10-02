import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hashSync } from "bcryptjs";
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_DURATION, createAdminSession } from "@/lib/admin-auth";

const mocks = vi.hoisted(() => ({
  getSupabase: vi.fn(),
  getPublicKnowledgeEntries: vi.fn(),
  listArtifacts: vi.fn(), getArtifact: vi.fn(), createArtifact: vi.fn(),
  updateArtifact: vi.fn(), deleteArtifact: vi.fn(), rechunkArtifact: vi.fn(),
}));
vi.mock("@/lib/supabase-server", () => ({ getSupabase: mocks.getSupabase }));
vi.mock("@/lib/dossier", () => ({ getPublicKnowledgeEntries: mocks.getPublicKnowledgeEntries }));
vi.mock("@/lib/artifacts", () => ({
  listArtifacts: mocks.listArtifacts, getArtifact: mocks.getArtifact,
  createArtifact: mocks.createArtifact, updateArtifact: mocks.updateArtifact,
  deleteArtifact: mocks.deleteArtifact, rechunkArtifact: mocks.rechunkArtifact,
}));

import { GET as listPublic, POST as createArtifact } from "../artifacts/route";
import { GET as getArtifact, PUT as updateArtifact, DELETE as deleteArtifact } from "../artifacts/[id]/route";
import { POST as publishArtifact } from "../artifacts/[id]/publish/route";
import { POST as rechunkArtifact } from "../artifacts/[id]/rechunk/route";
import { GET as listAnalyses } from "../admin/analyses/route";
import { GET as getAnalysis, PATCH as updateAnalysis, DELETE as deleteAnalysis } from "../admin/analyses/[id]/route";
import { GET as getAnalytics } from "../admin/analytics/route";

const id = "11111111-1111-4111-8111-111111111111";
const privateArtifact = { id, content: "Private historical content", status: "archived" };
const reviewedEntry = {
  id: "reviewed-role", slug: "reviewed-role", title: "Reviewed role", category: "experience",
  content: "Reviewed public role description.", summary: "Reviewed summary.",
  source_manifest: { internal_note: "Must not be returned by the public API" },
};
const context = (value = id) => ({ params: Promise.resolve({ id: value }) });
const request = (method = "GET", cookie = "", body?: unknown, path = "/api/test") =>
  new Request(`https://example.test${path}`, {
    method,
    headers: { ...(cookie ? { cookie: `${ADMIN_SESSION_COOKIE}=${cookie}` } : {}), "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("ADMIN_PASSWORD", hashSync("test password", 4));
  mocks.getPublicKnowledgeEntries.mockResolvedValue([reviewedEntry]);
  mocks.listArtifacts.mockResolvedValue([privateArtifact]);
  mocks.getArtifact.mockResolvedValue(privateArtifact);
  mocks.rechunkArtifact.mockResolvedValue(2);
});
afterEach(() => vi.unstubAllEnvs());

describe("public artifact boundary", () => {
  it("lists only reviewed entries and excludes internal review metadata", async () => {
    const response = await listPublic(request());
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.artifacts).toEqual([{
      id: reviewedEntry.id, slug: reviewedEntry.slug, title: reviewedEntry.title,
      category: reviewedEntry.category, content: reviewedEntry.content,
      summary: reviewedEntry.summary, status: "published",
    }]);
    expect(mocks.listArtifacts).not.toHaveBeenCalled();
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it.each(["draft", "archived", "anything"])("does not let status=%s expose the archive", async status => {
    const response = await listPublic(request("GET", "", undefined, `/api/artifacts?status=${status}`));
    expect(await response.json()).toEqual({ artifacts: [] });
    expect(mocks.listArtifacts).not.toHaveBeenCalled();
  });

  it("returns a reviewed slug and hides historical UUIDs without reading private rows", async () => {
    const publicResponse = await getArtifact(request(), context(reviewedEntry.id));
    expect(publicResponse.status).toBe(200);
    expect((await publicResponse.json()).artifact.source_manifest).toBeUndefined();
    const privateResponse = await getArtifact(request(), context());
    expect(privateResponse.status).toBe(404);
    expect(mocks.getArtifact).not.toHaveBeenCalled();
  });

  it("fails closed if the reviewed collection is empty", async () => {
    mocks.getPublicKnowledgeEntries.mockResolvedValue([]);
    expect(await (await listPublic(request())).json()).toEqual({ artifacts: [] });
    expect((await getArtifact(request(), context())).status).toBe(404);
    expect(mocks.listArtifacts).not.toHaveBeenCalled();
    expect(mocks.getArtifact).not.toHaveBeenCalled();
  });

  it("allows a valid admin to inspect the private archive", async () => {
    const token = createAdminSession();
    expect(await (await listPublic(request("GET", token))).json()).toEqual({ artifacts: [privateArtifact] });
    expect(await (await getArtifact(request("GET", token), context())).json()).toEqual({ artifact: privateArtifact });
    expect((await getArtifact(request("GET", token), context(reviewedEntry.id))).status).toBe(200);
  });

  it("cannot promote historical content through create, update, or publish", async () => {
    const token = createAdminSession();
    const body = { title: "Imported record", slug: "imported-record", content: "Unreviewed", category: "project", status: "published" };
    expect((await createArtifact(request("POST", token, body))).status).toBe(400);
    expect((await updateArtifact(request("PUT", token, { status: "published" }), context())).status).toBe(400);
    expect((await publishArtifact(request("POST", token))).status).toBe(409);
    expect(mocks.createArtifact).not.toHaveBeenCalled();
    expect(mocks.updateArtifact).not.toHaveBeenCalled();
  });

  it("preserves historical chunks and directs admins to the review workflow", async () => {
    const response = await rechunkArtifact(request("POST", createAdminSession()));
    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain("Historical chunks are preserved");
    expect(mocks.rechunkArtifact).not.toHaveBeenCalled();
    expect(mocks.getArtifact).not.toHaveBeenCalled();
  });
});

describe("private data authorization", () => {
  const guarded = [
    ["admin list", (cookie: string) => listAnalyses(request("GET", cookie))],
    ["admin detail", (cookie: string) => getAnalysis(request("GET", cookie), context())],
    ["admin analytics", (cookie: string) => getAnalytics(request("GET", cookie))],
    ["admin update", (cookie: string) => updateAnalysis(request("PATCH", cookie, { is_starred: true }), context())],
    ["admin delete", (cookie: string) => deleteAnalysis(request("DELETE", cookie), context())],
    ["artifact create", (cookie: string) => createArtifact(request("POST", cookie, {}))],
    ["artifact update", (cookie: string) => updateArtifact(request("PUT", cookie, {}), context())],
    ["artifact delete", (cookie: string) => deleteArtifact(request("DELETE", cookie), context())],
    ["artifact publish", (cookie: string) => publishArtifact(request("POST", cookie))],
    ["artifact rechunk", (cookie: string) => rechunkArtifact(request("POST", cookie))],
  ] as const;

  it.each(guarded)("rejects missing, forged, and expired sessions for %s before accessing data", async (_label, call) => {
    const forged = Buffer.from(`admin:${Date.now()}:attacker`).toString("base64");
    const expired = createAdminSession(Date.now() - ADMIN_SESSION_DURATION - 1);
    for (const cookie of ["", forged, expired]) expect((await call(cookie)).status).toBe(401);
    expect(mocks.getSupabase).not.toHaveBeenCalled();
    expect(mocks.getArtifact).not.toHaveBeenCalled();
    expect(mocks.createArtifact).not.toHaveBeenCalled();
    expect(mocks.updateArtifact).not.toHaveBeenCalled();
    expect(mocks.deleteArtifact).not.toHaveBeenCalled();
    expect(mocks.rechunkArtifact).not.toHaveBeenCalled();
  });

  it("does not expose the archive through forged-cookie public requests", async () => {
    const forged = Buffer.from(`admin:${Date.now()}:attacker`).toString("base64");
    const response = await listPublic(request("GET", forged));
    expect((await response.json()).artifacts[0].id).toBe(reviewedEntry.id);
    expect((await getArtifact(request("GET", forged), context())).status).toBe(404);
    expect(mocks.listArtifacts).not.toHaveBeenCalled();
    expect(mocks.getArtifact).not.toHaveBeenCalled();
  });

  it("allows a signed admin session to read analyses", async () => {
    const query: Record<string, unknown> = {};
    for (const method of ["from", "select", "order"]) query[method] = vi.fn(() => query);
    query.range = vi.fn().mockResolvedValue({ data: [{ id }], error: null, count: 1 });
    mocks.getSupabase.mockReturnValue(query);
    const response = await listAnalyses(request("GET", createAdminSession()));
    expect(response.status).toBe(200);
    expect((await response.json()).analyses).toEqual([{ id }]);
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("allows authenticated analysis updates while preserving the field allowlist", async () => {
    const query: Record<string, unknown> = {};
    const update = vi.fn(() => query);
    for (const method of ["from", "eq", "select"]) query[method] = vi.fn(() => query);
    query.update = update;
    query.single = vi.fn().mockResolvedValue({ data: { id, is_starred: true }, error: null });
    mocks.getSupabase.mockReturnValue(query);
    const response = await updateAnalysis(request("PATCH", createAdminSession(), {
      is_starred: true, fit_score: 100,
    }), context());
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ is_starred: true });
  });
});
