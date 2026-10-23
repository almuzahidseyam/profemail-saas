import test from "node:test";
import assert from "node:assert/strict";
import {
  exportReport,
  redactContacts,
  reviewResume,
} from "../src/lib/resume-review";
import { readResume, validateDocxZip } from "../src/lib/read-resume";
import { academicSample, softwareSample } from "../src/lib/resume-samples";

test("complete fictional CV has bounded, explainable points adding up to 100", () => {
  const r = reviewResume(softwareSample, "software");
  assert.equal(r.score, 100);
  assert.equal(
    r.checks.reduce((n, c) => n + c.max, 0),
    100,
  );
  assert.ok(r.checks.every((c) => c.evidence && c.advice && c.adviceBn));
});
test("academic review allows research without publications and has a longer range", () => {
  const text = academicSample + " Study".repeat(1000);
  const academic = reviewResume(text, "academic");
  assert.equal(academic.checks.find((c) => c.id === "focus")?.points, 15);
  assert.equal(academic.checks.find((c) => c.id === "length")?.points, 5);
  assert.equal(
    reviewResume(text, "software").checks.find((c) => c.id === "length")
      ?.points,
    0,
  );
});
test("keyword boundaries distinguish Java, JavaScript, C++ and C#", () => {
  const r = reviewResume(
    softwareSample.replaceAll("JavaScript", "JavaScript"),
    "software",
    "Java, JavaScript, C++, C#, Kubernetes, React",
  );
  assert.deepEqual(r.keywords.matched, ["JavaScript", "React"]);
  assert.deepEqual(r.keywords.missing, ["C++", "C#", "Java", "Kubernetes"]);
  const cpp = reviewResume(softwareSample + "\nC++ C#", "software", "C++ C#");
  assert.equal(cpp.keywords.score, 100);
});
test("opportunity keywords do not alter readiness and unknown vocabulary has no fit score", () => {
  const r = reviewResume(softwareSample, "software", "Kubernetes");
  assert.equal(r.score, reviewResume(softwareSample, "software").score);
  assert.equal(r.keywords.score, 0);
  assert.equal(
    reviewResume(softwareSample, "software", "compassionate coordination")
      .keywords.score,
    null,
  );
});
test("empty, numeric, scanned and oversized input cannot produce a reassuring score", () => {
  for (const s of ["", "123 ".repeat(100), "short text", "a".repeat(100001)])
    assert.throws(() => reviewResume(s, "software"));
  assert.throws(() =>
    reviewResume(softwareSample, "software", "x".repeat(100001)),
  );
});
test("isolated years are not counted as measured outcomes", () => {
  const r = reviewResume(
    "Education\n2025\n" +
      "Studied computer science and developed software with a small university team. ".repeat(
        10,
      ),
    "software",
  );
  assert.equal(r.checks.find((c) => c.id === "evidence")?.points, 0);
  assert.equal(r.checks.find((c) => c.id === "dates")?.points, 5);
});
test("unfinished placeholders and unreadable characters lose their own points", () => {
  const r = reviewResume(softwareSample + "\n[insert metric] �", "software");
  assert.equal(r.score, 85);
});
test("redacted exports mask excerpts and omit the raw CV", () => {
  const text =
    softwareSample +
    "\nBuilt a dashboard for 20 users; contact person@private.test +8801712345678 https://secret.test\nReferences";
  const r = reviewResume(text, "software");
  r.checks[0].evidence =
    "person@private.test +8801712345678 https://secret.test";
  const output = exportReport(r, "bn");
  assert.ok(!output.includes("person@private.test"));
  assert.ok(!output.includes("+8801712345678"));
  assert.ok(!output.includes("https://secret.test"));
  assert.ok(!output.includes("Avery Example"));
  assert.ok(output.includes("শিক্ষাগত"));
  assert.ok(redactContacts("x@test.org").includes("[EMAIL]"));
  assert.ok(r.privacy.some((p) => p.includes("References")));
});
test("TXT reading is local; invalid and oversized formats fail", async () => {
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("Unexpected network request");
  };
  try {
    assert.equal(
      (await readResume(new File([softwareSample], "sample.txt"))).text,
      softwareSample,
    );
  } finally {
    globalThis.fetch = oldFetch;
  }
  await assert.rejects(
    readResume(new File(["x"], "bad.exe")),
    /PDF, DOCX or TXT/,
  );
  await assert.rejects(readResume(new File(["x"], "fake.pdf")), /PDF header/);
  await assert.rejects(
    readResume(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.txt")),
    /5 MB/,
  );
  await assert.rejects(
    readResume(new File(["short"], "scan.txt")),
    /readable text/,
  );
  assert.throws(() => validateDocxZip(new ArrayBuffer(50)), /DOCX/);
});
