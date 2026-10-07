import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDocs, getDoc, GROUPS } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  return doc ? { title: doc.meta.title, description: doc.meta.summary } : {};
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) notFound();
  const { meta, html, headings, prev, next } = doc;
  return (
    <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-10">
      <article className="min-w-0">
        <p className="text-xs text-muted">
          <Link href="/docs" className="hover:text-accent">Kiến thức</Link> · {meta.group} {GROUPS[meta.group].name} · ~{Math.round(meta.words / 200)} phút
        </p>
        {headings.length > 0 && (
          <details className="lg:hidden mt-4 rounded-md border border-border bg-card px-3 py-2 text-sm">
            <summary className="cursor-pointer font-medium">Mục lục</summary>
            <ol className="mt-2 space-y-1 text-muted">
              {headings.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="hover:text-accent">{h.text}</a></li>
              ))}
            </ol>
          </details>
        )}
        <div
          className="doc prose prose-neutral dark:prose-invert mt-4 prose-headings:tracking-tight prose-a:text-accent prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <nav className="mt-10 flex justify-between gap-4 text-sm border-t border-border pt-4">
          {prev ? <Link href={`/docs/${prev.slug}`} className="hover:text-accent">← {prev.code} {prev.title}</Link> : <span />}
          {next ? <Link href={`/docs/${next.slug}`} className="hover:text-accent text-right">{next.code} {next.title} →</Link> : <span />}
        </nav>
      </article>
      {headings.length > 0 && (
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[80vh] overflow-y-auto text-sm">
            <p className="font-medium mb-2">Mục lục</p>
            <ol className="space-y-1.5 text-muted border-l border-border">
              {headings.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="block pl-3 hover:text-accent line-clamp-2">{h.text}</a></li>
              ))}
            </ol>
          </div>
        </aside>
      )}
    </div>
  );
}
