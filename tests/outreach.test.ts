import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/generate/route";
test("cloud outreach fails closed and requires authentication, consent and PDF content", async () => {
  const key = process.env.GEMINI_API_KEY,
    code = process.env.OUTREACH_ACCESS_CODE;
  delete process.env.GEMINI_API_KEY;
  delete process.env.OUTREACH_ACCESS_CODE;
  try {
    assert.equal(
      (
        await POST(
          new Request("http://localhost/api/generate", { method: "POST" }),
        )
      ).status,
      503,
    );
    process.env.GEMINI_API_KEY = "test-never-call-provider";
    process.env.OUTREACH_ACCESS_CODE = "test-owner-code";
    assert.equal(
      (
        await POST(
          new Request("http://localhost/api/generate", { method: "POST" }),
        )
      ).status,
      401,
    );
    const headers = { "x-outreach-access-code": "test-owner-code" };
    assert.equal(
      (
        await POST(
          new Request("http://localhost/api/generate", {
            method: "POST",
            headers: { ...headers, origin: "https://other.test" },
          }),
        )
      ).status,
      403,
    );
    const withoutConsent = new FormData();
    assert.equal(
      (
        await POST(
          new Request("http://localhost/api/generate", {
            method: "POST",
            headers,
            body: withoutConsent,
          }),
        )
      ).status,
      400,
    );
    const invalid = new FormData();
    invalid.set("consent", "true");
    invalid.set("researchField", "AI");
    invalid.set("resume", new File(["not a PDF"], "fake.pdf"));
    assert.equal(
      (
        await POST(
          new Request("http://localhost/api/generate", {
            method: "POST",
            headers,
            body: invalid,
          }),
        )
      ).status,
      400,
    );
  } finally {
    if (key === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = key;
    if (code === undefined) delete process.env.OUTREACH_ACCESS_CODE;
    else process.env.OUTREACH_ACCESS_CODE = code;
  }
});
