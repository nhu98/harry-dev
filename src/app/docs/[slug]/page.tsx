import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { styles } from "@/shared/ui";
import { getAllDocs, getDoc } from "@/features/docs/service";
import { DocBreadcrumb } from "@/features/docs/components/DocBreadcrumb";
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
    <div className={styles.grid.docLayout}>
      <article className="min-w-0">
        <DocBreadcrumb meta={meta} />
        <div className="lg:hidden"><DocToc headings={headings} variant="mobile" /></div>
        <DocArticle html={html} />
        <DocPager prev={prev} next={next} />
      </article>
      <div className="hidden lg:block"><DocToc headings={headings} variant="desktop" /></div>
    </div>
  );
}
