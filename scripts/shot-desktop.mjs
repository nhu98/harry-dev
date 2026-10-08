// Desktop screenshots (1440x900) to check alignment. Usage: node scripts/shot-desktop.mjs [baseUrl]
import { webkit } from "playwright";
import { mkdirSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3000";
mkdirSync("shots", { recursive: true });
const b = await webkit.launch();
const c = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
const p = await c.newPage();
for (const path of ["/today", "/checklist", "/phrases", "/assistant", "/docs"]) {
  await p.goto(base + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(300);
  const m = await p.evaluate(() => {
    const logo = document.querySelector("header a")?.getBoundingClientRect();
    const main = document.querySelector("main > div")?.getBoundingClientRect();
    return { logoLeft: Math.round(logo?.left ?? 0), contentLeft: Math.round(main?.left ?? 0), contentRight: Math.round(main?.right ?? 0), vw: window.innerWidth };
  });
  console.log(path, JSON.stringify(m), "centerOffset=", Math.round((m.contentLeft + m.contentRight) / 2 - m.vw / 2));
  await p.screenshot({ path: `shots/d${path.replace(/\//g, "_")}.png` });
}
await b.close();
