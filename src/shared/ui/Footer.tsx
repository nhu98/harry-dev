import { SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border text-sm text-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap gap-x-6 gap-y-2">
        <span>© {SITE.year} {SITE.owner}</span>
        <a className="hover:text-accent" href={SITE.github} target="_blank" rel="noreferrer">GitHub</a>
        <span>Next.js 16 · Tailwind v4 · Markdown → SSG · Vercel</span>
      </div>
    </footer>
  );
}
