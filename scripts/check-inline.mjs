// Flags inline UI that should live in shared/ui/styles.ts or config/strings.ts.
// Heuristics, not a compiler: review each hit, then move it or whitelist it here.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["src/app", "src/features"];
const MAX_CLASS_TOKENS = 6;           // className="a b c d e f g" → move to styles.ts
const TEXT_RE = /^[^{}<>]*[A-Za-zÀ-ỹ]{3,}[^{}<>]*$/; // JSX text with letters
const ALLOW_TEXT = new Set(["·", "🔴", "←", "→"]);

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx$/.test(p)) out.push(p);
  }
  return out;
}

const problems = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const where = `${file}:${i + 1}`;
      for (const m of line.matchAll(/className="([^"]+)"/g)) {
        if (m[1].split(/\s+/).length > MAX_CLASS_TOKENS) problems.push(`${where}  long className → styles.ts: "${m[1]}"`);
      }
      // text between tags, e.g. >Mục lục<
      for (const m of line.matchAll(/>([^<>{}]+)</g)) {
        const t = m[1].trim();
        if (t && !ALLOW_TEXT.has(t) && TEXT_RE.test(t)) problems.push(`${where}  hardcoded text → strings.ts: "${t}"`);
      }
    });
  }
}

if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\ncheck-inline: ${problems.length} hit(s). Move to shared/ui/styles.ts or config/strings.ts.`);
  process.exit(1);
}
console.log("check-inline: ok");
