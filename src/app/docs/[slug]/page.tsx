import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GROUPS, getAllDocs, getDoc } from "@/features/docs/service";
import { DocToc } from "@/features/docs/components/DocToc";
import { DocArticle } from "@/features/docs/components/DocArticle";
import { DocPager } from "@/features/docs/components/DocPager";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = await getDoc((await params).slug);
  return doc ? { title: doc.meta.title, description: doc.meta.summary } : {};
}

export default async function DocPage({ params }: Props) {
  const doc = await getDoc((await params).slug);
  if (!doc) notFound();
  const { meta, html, headings, prev, next } = doc;
  return (
    <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-10">
      <article className="min-w-0">
        <p className="text-xs text-muted">
          <Link href="/docs" className="hover:text-accent">Kiến thức</Link> · {meta.group} {GROUPS[meta.group].name} · ~{meta.readMinutes} phút
        </p>
        <div className="lg:hidden"><DocToc headings={headings} /></div>
        <DocArticle html={html} />
        <DocPager prev={prev} next={next} />
      </article>
      <div className="hidden lg:block"><DocToc headings={headings} /></div>
    </div>
  );
}
