import { SITE } from "@/config/site";
import { Badge, ButtonLink } from "@/shared/ui";
import { STACK } from "../profile";

export function Hero() {
  return (
    <section className="pt-6 sm:pt-12">
      <p className="text-sm text-muted">{SITE.fullName}</p>
      <h1 className="mt-2 text-3xl sm:text-5xl font-bold tracking-tight">
        Frontend &amp; Mobile Developer.<br className="hidden sm:block" /> React · Next.js · React Native.
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        5 năm TypeScript. Thích những bài toán client-side khó: realtime, offline, race condition, payment.
        Trang này vừa là portfolio, vừa là nơi tôi lưu kiến thức và bài học, đọc được trên điện thoại.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">{STACK.map((s) => <Badge key={s}>{s}</Badge>)}</div>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/docs">Đọc kiến thức</ButtonLink>
        <ButtonLink href={SITE.github} variant="outline">GitHub</ButtonLink>
      </div>
    </section>
  );
}
