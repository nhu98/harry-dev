// Extracts quiz data from synced markdown (content/E12, content/E13) into
// src/features/practice/generated.json. Runs on prebuild after sync, so a new
// verb row in E12 §7 or a new topic in E13 becomes a quiz without code changes.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const E12 = "content/E12-on-tap-lop-giao-tiep.md";
const E13 = "content/E13-tu-vung-theo-chu-de.md";
const OUT = "src/features/practice/generated.json";

const cells = (line) => line.split("|").slice(1, -1).map((c) => c.trim());
const isRow = (line) => line.startsWith("|") && !/^\|\s*-/.test(line);
const plain = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").trim();

/** Section body between a "## N." heading and the next "## ". */
function sections(md) {
  const out = [];
  let cur = null;
  for (const line of md.split("\n")) {
    const m = /^## (\d+)\. (.+)$/.exec(line);
    if (m) { cur = { n: Number(m[1]), heading: `${m[1]}. ${m[2]}`, title: m[2], lines: [] }; out.push(cur); continue; }
    if (line.startsWith("## ")) { cur = null; continue; }
    if (cur) cur.lines.push(line);
  }
  return out;
}

/** "read /red/" → ["read"], "was / were" → ["was", "were"], "got (US: gotten)" → ["got", "gotten"]. */
function forms(cell) {
  const extra = [...cell.matchAll(/\(US: ([^)]+)\)/g)].map((m) => m[1].trim());
  const base = cell.replace(/\([^)]*\)/g, "").replace(/\s\/[a-z]+\/(?=\s|$)/g, "").replace(/⭐/g, "");
  return [...base.split("/").map((s) => s.trim()).filter(Boolean), ...extra];
}

function verbs(md) {
  const sec = sections(md).find((s) => s.n === 7);
  if (!sec) return [];
  const rows = [];
  for (const line of sec.lines) {
    if (!isRow(line)) continue;
    const c = cells(line);
    if (c.length !== 4 || c[0] === "V1") continue;
    rows.push({ v1: forms(c[0])[0], star: c[0].includes("⭐"), v2: forms(c[1]), v3: forms(c[2]), vi: plain(c[3]) });
  }
  return rows;
}

function topics(md) {
  return sections(md).filter((s) => s.n >= 1 && s.n <= 99 && s.lines.some((l) => l.includes("⭐ Học trước"))).map((s) => {
    const start = s.lines.findIndex((l) => l.includes("⭐ Học trước"));
    const words = [];
    for (const line of s.lines.slice(start + 1)) {
      if (words.length && !line.startsWith("|")) break;
      if (!isRow(line)) continue;
      const [en, vi] = cells(line).map(plain);
      if (!en || /^(Từ|Cụm)/.test(en)) continue;
      words.push({ en, vi });
    }
    return { n: s.n, title: s.title, heading: s.heading, words };
  });
}

if (!existsSync(E12) || !existsSync(E13)) {
  console.log("build-practice: content not found, keeping committed generated.json.");
  process.exit(0);
}
const data = { verbs: verbs(readFileSync(E12, "utf8")), topics: topics(readFileSync(E13, "utf8")) };
writeFileSync(OUT, JSON.stringify(data, null, 1) + "\n");
console.log(`build-practice: ${data.verbs.length} verbs, ${data.topics.length} topics → ${OUT}`);
