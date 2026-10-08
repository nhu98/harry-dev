// Generates public/harry-lich-hoc.ics from src/features/today/reminders.json.
// Import once into iPhone Calendar → every block gets a native alert. Runs on prebuild.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const items = JSON.parse(readFileSync("src/features/today/reminders.json", "utf8"));
const TZ = "Asia/Ho_Chi_Minh";
const START = "20261008"; // first occurrence; RRULE repeats weekly (or monthly on last weekday for freq=monthly-last)

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,");
const pad = (n) => String(n).padStart(2, "0");
function plus(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const t = h * 60 + m + minutes;
  return `${pad(Math.floor(t / 60) % 24)}${pad(t % 60)}00`;
}

const events = items.map((it) => [
  "BEGIN:VEVENT",
  `UID:harry-${it.id}@harry-dev`,
  `DTSTAMP:20261007T000000Z`,
  `DTSTART;TZID=${TZ}:${START}T${it.time.replace(":", "")}00`,
  `DTEND;TZID=${TZ}:${START}T${plus(it.time, it.minutes)}`,
  it.freq === "monthly-last" ? `RRULE:FREQ=MONTHLY;BYDAY=-1${it.days[0]}` : `RRULE:FREQ=WEEKLY;BYDAY=${it.days.join(",")}`,
  `SUMMARY:${esc(it.title)}`,
  `DESCRIPTION:${esc(it.note)}`,
  "BEGIN:VALARM",
  "ACTION:DISPLAY",
  `DESCRIPTION:${esc(it.title)}`,
  "TRIGGER:-PT0M",
  "END:VALARM",
  "END:VEVENT",
].join("\r\n"));

const ics = [
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "PRODID:-//harry-dev//lich-hoc//VI",
  "CALSCALE:GREGORIAN",
  "X-WR-CALNAME:Lịch học Harry",
  `X-WR-TIMEZONE:${TZ}`,
  ...events,
  "END:VCALENDAR",
  "",
].join("\r\n");

mkdirSync("public", { recursive: true });
writeFileSync("public/harry-lich-hoc.ics", ics);
console.log(`build-ics: ${items.length} events → public/harry-lich-hoc.ics`);
