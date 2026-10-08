// E2E check of assistant history with a mocked API (no Gemini quota used).
// Usage: node scripts/test-assistant-history.mjs [baseUrl]
import { webkit, devices } from "playwright";
const base = process.argv[2] ?? "http://localhost:3000";
const b = await webkit.launch();
const c = await b.newContext({ ...devices["iPhone 13"] });
const p = await c.newPage();
let n = 0;
await p.route("**/api/assistant", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ text: `mock reply ${++n}` }) }));
const fail = (m) => { console.error("FAIL:", m); process.exitCode = 1; };

await p.goto(base + "/today", { waitUntil: "networkidle" });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: "networkidle" });
await p.getByRole("button", { name: /Hỏi trợ lý/ }).click();

// thread 1 (ask)
await p.locator("textarea").fill("redux la gi");
await p.getByRole("button", { name: "Gửi" }).click();
await p.getByText("mock reply 1").waitFor();
// thread 2 (english mode → new thread)
await p.getByRole("button", { name: "Gia sư tiếng Anh" }).click();
await p.locator("textarea").fill("i like coffee");
await p.getByRole("button", { name: "Gửi" }).click();
await p.getByText("mock reply 2").waitFor();

await p.getByRole("button", { name: /Lịch sử \(2\)/ }).click();
const rows = await p.locator("li button:has(span)").count();
if (rows !== 2) fail(`expected 2 threads in history, got ${rows}`);
await p.screenshot({ path: "shots/_history.png" });

// open the first (older) thread → shows its messages
await p.getByText("redux la gi").first().click();
await p.getByText("mock reply 1").waitFor();
if (await p.getByText("i like coffee").count()) fail("thread 2 text leaked into thread 1");

// persists to the full page
await p.goto(base + "/assistant", { waitUntil: "networkidle" });
await p.getByRole("button", { name: /Lịch sử \(2\)/ }).click();
if ((await p.locator("li button:has(span)").count()) !== 2) fail("history lost on full page");

// delete one
await p.getByLabel("Xoá cuộc này").first().click();
await p.getByRole("button", { name: /Lịch sử \(1\)/ }).waitFor();

// pruning: inject 60 old threads + 1 ancient → capped / aged out
await p.evaluate(() => {
  const now = Date.now(); const threads = [];
  for (let i = 0; i < 60; i++) threads.push({ id: "t" + i, mode: "ask", title: "t" + i, createdAt: now - i * 1000, updatedAt: now - i * 1000, messages: [{ role: "user", text: "x" }] });
  threads.push({ id: "old", mode: "ask", title: "ancient", createdAt: 1, updatedAt: now - 120 * 86400000, messages: [{ role: "user", text: "x" }] });
  localStorage.setItem("harry-assistant-v2", JSON.stringify({ activeId: null, mode: "ask", docSlug: "", threads }));
});
await p.reload({ waitUntil: "networkidle" });
await p.getByRole("button", { name: "Lịch sử (61)" }).waitFor(); // parse keeps raw until next write
await p.getByRole("button", { name: "Trò chuyện" }).click();
await p.locator("textarea").fill("trigger prune");
await p.getByRole("button", { name: "Gửi" }).click();
await p.getByText(/mock reply/).last().waitFor();
const label = await p.getByRole("button", { name: /Lịch sử \(\d+\)/ }).innerText();
if (!/\(50\)/.test(label)) fail(`expected cap 50 after prune, got ${label}`);
console.log(process.exitCode ? "history test: FAILED" : "history test: ok");
await b.close();
