// Copies the PUBLIC subset of the knowledge base (../*.md) into ./content.
// Private files (plans with colleague names, CV, brag doc, interview stories) are never copied.
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

const SRC = resolve(process.cwd(), "..");
const DEST = resolve(process.cwd(), "content");

const ALLOW = [
  "A1-core-javascript.md", "A2-core-architecture-patterns.md", "A3-core-react.md",
  "A4-core-redux-thunk.md", "A5-core-testing.md", "A6-core-algorithms.md", "A7-core-backend.md",
  "B1-web-browser-internals.md", "B2-web-performance-security.md", "B3-web-electron-realtime-e2ee.md",
  "C1-mobile-react-native.md", "C2-mobile-performance-security-testing.md",
  "D1-interview-questions.md", "D3-personal-notes.md",
  "E2-career-fullstack-ai.md", "E4-english-for-devs.md", "E5-thoi-gian-bieu-tieng-anh.md",
  "E6-hoc-lieu-tieng-anh.md", "E7-ngan-hang-du-lieu-hang-ngay.md",
];

// Names of real people / employers must not reach the public site.
const REDACT = [
  [/\bAllan\b/g, "PO"], [/\bOleg\b/g, "PM"], [/anh Tôn( Nguyễn)?/g, "leader"],
  [/Tôn Nguyễn/g, "leader"], [/\bIMT( Solutions)?\b/g, "công ty hiện tại"],
];

if (!existsSync(join(SRC, "A1-core-javascript.md"))) {
  console.log("sync-content: source folder not found, keeping committed content/.");
  process.exit(0);
}

for (const f of readdirSync(DEST)) if (f.endsWith(".md") && !ALLOW.includes(f)) unlinkSync(join(DEST, f));

let n = 0;
for (const f of ALLOW) {
  const p = join(SRC, f);
  if (!existsSync(p)) { console.warn("missing:", f); continue; }
  let text = readFileSync(p, "utf8");
  for (const [re, to] of REDACT) text = text.replace(re, to);
  writeFileSync(join(DEST, f), text);
  n++;
}
console.log(`sync-content: copied ${n} files → content/`);
