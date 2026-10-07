/** Join class names, skipping falsy values. Small on purpose; no dependency. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
