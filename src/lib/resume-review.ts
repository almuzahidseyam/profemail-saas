// Local, deterministic rubric adapted from skills/cv-resume-reviewer/SKILL.md.
export type Target = "software" | "academic";
export type Language = "en" | "bn";
export type Check = {
  id: string;
  title: string;
  bn: string;
  points: number;
  max: number;
  evidence: string;
  advice: string;
  adviceBn: string;
};
export type Review = {
  target: Target;
  score: number;
  words: number;
  checks: Check[];
  sections: string[];
  keywords: { matched: string[]; missing: string[]; score: number | null };
  privacy: string[];
};
export const RUBRIC_VERSION = "1.0";
export const MAX_TEXT = 100_000;
const sectionPatterns: Record<string, RegExp> = {
  summary:
    /^(?:profile|professional summary|summary|objective|research profile)\s*:?$/im,
  education:
    /^(?:education|educational summary|academic qualifications)\s*:?$/im,
  experience:
    /^(?:(?:academic and research|academic|research|professional|work|teaching)\s+)?experience\s*:?$/im,
  skills:
    /^(?:technical skills|skills|technical expertise|core competencies)\s*:?$/im,
  projects:
    /^(?:(?:selected|research|academic|undergraduate|software|personal)\s+)*projects\s*:?$/im,
  publications: /^(?:selected\s+)?publications?\s*:?$/im,
  research:
    /^(?:research interests|selected thesis and research work|research work|thesis|dissertation)\s*:?$/im,
  awards:
    /^(?:awards(?: and recognitions)?|honou?rs|achievements|awards\s*&\s*scholarship)\s*:?$/im,
};
const skills = [
  "C++",
  "C#",
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "SQL",
  "React",
  "Next.js",
  "Node.js",
  "Django",
  "Flutter",
  "Dart",
  "PHP",
  "HTML",
  "CSS",
  "Git",
  "Docker",
  "Kubernetes",
  "Firebase",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "AWS",
  "Azure",
  "Linux",
  "REST",
  "GraphQL",
  "CI/CD",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "NLP",
  "Cryptography",
  "Algorithms",
  "Data Structures",
  "Testing",
  "Research",
  "Teaching",
  "Statistics",
  "LaTeX",
];
function contains(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_+#])`,
    "iu",
  ).test(text);
}
export function redactContacts(text: string) {
  return text
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[EMAIL]")
    .replace(/(?:\+?\d[\d ()-]{7,}\d)/g, "[PHONE OR NUMBER]")
    .replace(/https?:\/\/[^\s)]+|(?:www\.)[^\s)]+/gi, "[LINK]");
}
export function reviewResume(raw: string, target: Target, job = ""): Review {
  const text = raw.replace(/\r/g, "").trim();
  if (text.length > MAX_TEXT || job.length > MAX_TEXT)
    throw new Error("Please use at most 100,000 characters per field.");
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words < 30 || text.replace(/[^\p{L}]/gu, "").length < 80)
    throw new Error(
      "Add at least 30 words of readable CV text. Scanned PDFs need OCR first.",
    );
  const lines = text
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
  const sections = Object.entries(sectionPatterns)
    .filter(([, rx]) => rx.test(text))
    .map(([key]) => key);
  const has = (key: string) => sections.includes(key);
  const checks: Check[] = [];
  const add = (
    id: string,
    title: string,
    bn: string,
    pass: boolean,
    max: number,
    evidence: string,
    advice: string,
    adviceBn: string,
  ) =>
    checks.push({
      id,
      title,
      bn,
      points: pass ? max : 0,
      max,
      evidence,
      advice,
      adviceBn,
    });
  add(
    "structure",
    "Recognisable section headings",
    "সহজে চেনা যায় এমন শিরোনাম",
    sections.length >= 3,
    15,
    `Detected: ${sections.join(", ") || "none"}`,
    "Use standalone headings such as Education, Experience, Skills and Projects. Check the extracted text before editing your document.",
    "Education, Experience, Skills, Projects-এর মতো আলাদা শিরোনাম ব্যবহার করো। বদলানোর আগে পড়তে পাওয়া লেখাটি দেখো।",
  );
  add(
    "education",
    "Education is easy to find",
    "শিক্ষাগত যোগ্যতা খুঁজে পাওয়া",
    has("education"),
    10,
    has("education")
      ? "Education heading detected."
      : "No standard Education heading detected.",
    "Label your education clearly; include the degree, institution and dates.",
    "শিক্ষাগত যোগ্যতায় ডিগ্রি, প্রতিষ্ঠান ও সময় উল্লেখ করো।",
  );
  add(
    "experience",
    target === "academic"
      ? "Research or teaching experience"
      : "Experience or project evidence",
    target === "academic"
      ? "গবেষণা বা শিক্ষকতার অভিজ্ঞতা"
      : "অভিজ্ঞতা বা প্রজেক্টের প্রমাণ",
    has("experience") ||
      has("projects") ||
      (target === "academic" && has("research")),
    15,
    `Experience: ${has("experience")}; projects: ${has("projects")}; research: ${has("research")}`,
    "Add relevant experience or substantial projects. A project can demonstrate ability without paid employment.",
    "প্রাসঙ্গিক অভিজ্ঞতা বা গুরুত্বপূর্ণ প্রজেক্ট যোগ করো। চাকরির অভিজ্ঞতা না থাকলেও প্রজেক্টে দক্ষতা দেখানো যায়।",
  );
  add(
    "focus",
    target === "academic"
      ? "Research interests or publications"
      : "Technical skills section",
    target === "academic" ? "গবেষণার বিষয় বা প্রকাশনা" : "কারিগরি দক্ষতার অংশ",
    target === "academic"
      ? has("research") || has("publications")
      : has("skills"),
    15,
    target === "academic"
      ? `Research heading: ${has("research")}; publication heading: ${has("publications")}`
      : `Skills heading: ${has("skills")}`,
    target === "academic"
      ? "Describe your research direction. Include publications only if you have them; label their status accurately."
      : "Group skills by languages, tools and core concepts. Only list skills you can discuss.",
    "নিজের কাজ অনুযায়ী দক্ষতা বা গবেষণার বিষয় সাজাও। প্রকাশনা থাকলে তার অবস্থা সঠিকভাবে উল্লেখ করো।",
  );
  const actionLines = lines.filter((x) =>
    /^(?:[-•*▪◦]\s*|\d+[.)]\s*)?(?:built|developed|implemented|designed|created|led|taught|mentored|evaluated|published|analysed|analyzed|conducted|improved|reduced|automated|supervised|organized|delivered|researched)\b/i.test(
      x,
    ),
  );
  add(
    "actions",
    "Specific action statements",
    "কাজ বোঝানো নির্দিষ্ট বাক্য",
    actionLines.length >= 2,
    10,
    `${actionLines.length} lines begin with recognised action verbs. ${actionLines.slice(0, 2).join(" / ").slice(0, 240)}`,
    "Start relevant bullets with what you did: Built, Evaluated, Taught or Implemented. This recogniser currently checks English verbs.",
    "প্রাসঙ্গিক বুলেটের শুরুতে কী করেছ তা লেখো—Built, Evaluated, Taught, Implemented। এই পরীক্ষাটি ইংরেজি ক্রিয়া চেনে।",
  );
  const measurable = lines.filter((x) =>
    /\b\d+(?:\.\d+)?\s*(?:%|users?|students?|tests?|problems?|teams?|papers?|courses?|hours?|seconds?|ms|datasets?|samples?|credits?)\b|\b\d+(?:\.\d+)?%/i.test(
      x,
    ),
  );
  add(
    "evidence",
    "Concrete scope or outcomes",
    "কাজের পরিসর বা ফলের তথ্য",
    measurable.length > 0,
    10,
    measurable[0]?.slice(0, 240) ||
      "No recognised quantity with a scope or outcome unit found.",
    "Add truthful scope, methods or outcomes where useful. Never invent metrics just to increase this score.",
    "যেখানে কাজে লাগে সত্য পরিসর, পদ্ধতি বা ফল লেখো। স্কোর বাড়াতে কোনো সংখ্যা বানিয়ো না।",
  );
  const dated = /\b(?:19|20)\d{2}\b/.test(text);
  add(
    "dates",
    "Timeline information",
    "সময়ের তথ্য",
    dated,
    5,
    dated ? "At least one four-digit year found." : "No four-digit year found.",
    "Include consistent dates for education and relevant roles. A detected year does not verify chronology.",
    "শিক্ষা ও অভিজ্ঞতায় ধারাবাহিক তারিখ দাও। সাল পাওয়া মানেই সময়ক্রম যাচাই নয়।",
  );
  const lengthOK =
    target === "academic"
      ? words >= 200 && words <= 2500
      : words >= 200 && words <= 1000;
  add(
    "length",
    "Length for your target",
    "লক্ষ্য অনুযায়ী লেখার দৈর্ঘ্য",
    lengthOK,
    5,
    `${words} words; suggested review range: ${target === "academic" ? "200–2,500" : "200–1,000"}.`,
    "Review relevance and readability. These are flexible word ranges, not a page limit; a long academic record may need more space.",
    "প্রাসঙ্গিকতা ও পড়ার সুবিধা দেখো। এটি নমনীয় শব্দসীমা; দীর্ঘ একাডেমিক রেকর্ডে বেশি জায়গা লাগতে পারে।",
  );
  const placeholders =
    text.match(
      /your name|lorem ipsum|\bxxx+\b|example@|\[insert[^\]]*\]|\[company\]|\[metric\]/gi,
    ) || [];
  add(
    "placeholders",
    "No unfinished placeholders",
    "অসমাপ্ত নমুনা তথ্য নেই",
    !placeholders.length,
    10,
    placeholders.length
      ? `Review: ${placeholders.join(", ")}`
      : "No recognised placeholder markers found.",
    "Replace template placeholders with verified facts, or remove the incomplete item.",
    "নমুনা লেখা সত্য তথ্য দিয়ে পূরণ করো অথবা অসমাপ্ত অংশ সরিয়ে দাও।",
  );
  add(
    "characters",
    "Readable extracted characters",
    "পড়া যায় এমন অক্ষর",
    !text.includes("�"),
    5,
    text.includes("�")
      ? "Replacement characters (�) found."
      : "No replacement characters found; visual layout still needs manual review.",
    "Check fonts and the extraction preview. This does not certify columns, font size or all ATS parsers.",
    "ফন্ট ও পড়তে পাওয়া লেখা দেখো। এতে কলাম, ফন্টের আকার বা সব ATS যাচাই হয় না।",
  );
  const requested = skills.filter((s) => contains(job, s));
  const matched = requested.filter((s) => contains(text, s));
  const missing = requested.filter((s) => !contains(text, s));
  const privacy: string[] = [];
  if (/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(text))
    privacy.push("Email address detected");
  if (/(?:\+?\d[\d ()-]{7,}\d)/.test(text))
    privacy.push("Phone number or long numeric identifier detected");
  if (/^references?\s*:?$/im.test(text))
    privacy.push(
      "References section detected: check other people’s contact details before sharing",
    );
  return {
    target,
    words,
    checks,
    sections,
    score: checks.reduce((n, c) => n + c.points, 0),
    keywords: {
      matched,
      missing,
      score: requested.length
        ? Math.round((matched.length / requested.length) * 100)
        : null,
    },
    privacy,
  };
}
export function exportReport(
  review: Review,
  language: Language,
  redact = true,
) {
  const clean = (s: string) => (redact ? redactContacts(s) : s);
  return [
    `# ProfEmail Resume Lab — review`,
    `Rubric ${RUBRIC_VERSION} | Target: ${review.target} | Readiness: ${review.score}/100 | Words: ${review.words}`,
    "Heuristic guidance, not an employer ATS score or hiring prediction. No visual-layout or factual verification.",
    ...review.checks.map(
      (c) =>
        `\n## ${language === "bn" ? c.bn : c.title} (${c.points}/${c.max})\nEvidence: ${clean(c.evidence)}\n${language === "bn" ? c.adviceBn : c.advice}`,
    ),
    `\n## Job keywords\nMatched: ${review.keywords.matched.join(", ") || "none"}\nNot detected: ${review.keywords.missing.join(", ") || "none"}\nOnly a curated English skills vocabulary is checked; synonyms and proficiency are not inferred.`,
    "\n## Privacy\nContact masking is best effort, not anonymisation. Names, addresses and identifying work history may remain.",
  ].join("\n");
}
