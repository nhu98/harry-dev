// Emulated-iPhone screenshots + overflow report. Usage: node scripts/shot-mobile.mjs [baseUrl]
// First time: pnpm exec playwright install webkit
import { webkit, devices } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const PATHS = ["/", "/today", "/checklist", "/phrases", "/docs", "/docs/a4-core-redux-thunk", "/assistant"];
mkdirSync("shots", { recursive: true });

const overflow = () => {
  const vw = window.innerWidth; const out = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    const scrollable = !!el.closest("[class*='overflow-x-auto'], pre, table");
    if (r.right > vw + 1 && r.width > 0 && !scrollable) out.push(`${el.tagName.toLowerCase()} .${String(el.className).slice(0, 50)} right=${Math.round(r.right)}`);
  }
  return { docWidth: document.documentElement.scrollWidth, vw, offenders: out.slice(0, 6) };
};

const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
let bad = 0;
for (const path of PATHS) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const r = await page.evaluate(overflow);
  const ok = r.docWidth <= r.vw && r.offenders.length === 0;
  if (!ok) bad++;
  console.log(`${ok ? "ok " : "BAD"} ${path} doc=${r.docWidth}/${r.vw}${r.offenders.length ? "\n    " + r.offenders.join("\n    ") : ""}`);
  await page.screenshot({ path: `shots${path.replace(/\//g, "_") || "_home"}.png` });
}
await page.goto(base + "/today", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /Hỏi trợ lý/ }).click();
await page.waitForTimeout(400);
const r = await page.evaluate(overflow);
const ok = r.docWidth <= r.vw && r.offenders.length === 0;
if (!ok) bad++;
console.log(`${ok ? "ok " : "BAD"} /today + bubble doc=${r.docWidth}/${r.vw}${r.offenders.length ? "\n    " + r.offenders.join("\n    ") : ""}`);
await page.screenshot({ path: "shots/_bubble.png" });
await browser.close();
console.log(bad ? `shot-mobile: ${bad} page(s) overflow` : "shot-mobile: ok");
process.exit(bad ? 1 : 0);
