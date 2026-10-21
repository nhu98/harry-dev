"use client";
import { useState } from "react";
import { STRINGS } from "@/config/strings";
import { Badge, Button, ButtonLink, Card, H3, List, ListRow, Muted, Section, Stat, styles } from "@/shared/ui";
import { addDays, toDateKey } from "@/shared/lib/date";
import { cn } from "@/shared/lib/cn";
import type { Lesson, Question } from "../types";
import { ALL_QUESTIONS, SETS, TOPIC_SETS } from "../sets";
import { LESSONS } from "../lessons";
import { bestPercent, countMastered, countWrongNow, docHref, dueMistakes, nextLesson, pendingLessons, practiceStreak, prepareRun } from "../lib/quiz";
import { usePractice } from "../usePractice";
import { QuizRunner } from "./QuizRunner";

const MAX_TODAY = 4;
const HISTORY_DAYS = 14;
const MISTAKES_ID = "mistakes";
const COPIED_MS = 1500;

type Run = { setId: string; title: string; questions: Question[]; source: Question[]; pick?: number };

export function PracticeHome() {
  const p = usePractice();
  const t = STRINGS.practice;
  const [run, setRun] = useState<Run | null>(null);
  const [copied, setCopied] = useState("");

  if (!p.ready) return <Muted className="mt-4">…</Muted>;

  const mistakes = dueMistakes(p.state, ALL_QUESTIONS, p.today);
  const start = (setId: string, title: string, source: Question[], pick?: number) => {
    setRun({ setId, title, source, pick, questions: prepareRun(source, pick, Math.random) });
    window.scrollTo({ top: 0 });
  };
  const startSet = (id: string) => {
    const s = SETS.find((x) => x.id === id);
    if (s) start(s.id, s.title, s.questions, s.pick);
  };

  if (run) {
    return (
      <QuizRunner
        key={run.questions.map((q) => q.id).join()}
        title={run.title}
        questions={run.questions}
        onFinish={(results) => p.recordRun(run.setId, results)}
        onExit={() => setRun(null)}
        onAgain={() => start(run.setId, run.title, run.setId === MISTAKES_ID ? dueMistakes(p.state, ALL_QUESTIONS, p.today) : run.source, run.pick)}
      />
    );
  }

  const pending = pendingLessons(LESSONS, p.state, p.today, MAX_TODAY);
  const upcoming = nextLesson(LESSONS, p.state, p.today);
  const mastered = countMastered(p.state, ALL_QUESTIONS);
  const wrongNow = countWrongNow(p.state);
  const doneLessons = LESSONS.filter((l) => p.state.lessons[l.id]).length;
  const now = new Date();
  const history = Array.from({ length: HISTORY_DAYS }, (_, i) => toDateKey(addDays(now, i - HISTORY_DAYS + 1)));

  const copyPrompt = (lesson: Lesson) => {
    const topic = TOPIC_SETS.find((x) => `topic-${x.n}` === lesson.sets[0]);
    if (!topic) return;
    navigator.clipboard?.writeText(t.promptFor(topic.title, topic.words)).then(() => {
      setCopied(lesson.id);
      setTimeout(() => setCopied(""), COPIED_MS);
    }, () => {});
  };
  const doImport = () => {
    const text = window.prompt(t.importPrompt);
    if (text && !p.importJson(text)) window.alert(t.importFail);
  };

  const lessonActions = (l: Lesson) => (
    <div className={styles.control.chipRow}>
      <ButtonLink variant="outline" href={docHref(l.source)}>{t.read}</ButtonLink>
      {l.sets.map((id) => <Button key={id} onClick={() => startSet(id)}>{t.start}</Button>)}
      {l.kind === "speak" && <Button variant="outline" onClick={() => copyPrompt(l)}>{copied === l.id ? t.copied : t.copyPrompt}</Button>}
    </div>
  );
  const lessonBadge = (l: Lesson) => <Badge active={l.kind === "class"}>{t.kind[l.kind]}</Badge>;

  return (
    <div className="mt-6 space-y-10">
      <Section title={t.todayTitle}>
        <div className="space-y-3">
          {pending.length === 0 && <Muted>{t.todayEmpty}</Muted>}
          {pending.map((l) => (
            <Card key={l.id} className="space-y-3">
              <div className={styles.practice.row}>
                <H3>{l.title}</H3>
                <div className="flex gap-2">{lessonBadge(l)}<Badge>{l.date < p.today ? `${t.overdue} · ${l.date}` : t.dueToday}</Badge></div>
              </div>
              {lessonActions(l)}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className={styles.control.checkbox} checked={false} onChange={() => p.toggleLesson(l.id)} />{t.markDone}
              </label>
            </Card>
          ))}
          {upcoming && <Muted size="xs">{t.nextUp}: {upcoming.date} · {t.kind[upcoming.kind]} · {upcoming.title}</Muted>}
          {mistakes.length > 0
            ? <Button className="w-full" onClick={() => start(MISTAKES_ID, t.quiz.mistakesTitle, mistakes)}>{t.mistakes(mistakes.length)}</Button>
            : <Muted size="xs">{t.noMistakes}</Muted>}
        </div>
      </Section>

      <Section title={t.progressTitle}>
        <div className={styles.practice.statGrid}>
          <Stat label={t.statLessons} value={`${doneLessons}/${LESSONS.length}`} />
          <Stat label={t.statMastered} value={`${mastered}/${ALL_QUESTIONS.length}`} />
          <Stat label={t.statStreak} value={practiceStreak(p.state.days, now)} />
          <Stat label={t.statMistakes} value={wrongNow} />
        </div>
        <Muted size="xs" className="mt-3">{t.last14}</Muted>
        <div className="mt-1 flex gap-1">
          {history.map((d) => <span key={d} title={d} className={cn(styles.practice.dayDot, p.state.days.includes(d) && styles.practice.dayDotOn)} />)}
        </div>
      </Section>

      <Section title={t.setsTitle} description={t.setsHint}>
        <List>
          {SETS.map((s) => {
            const best = bestPercent(p.state, s.id);
            return (
              <ListRow key={s.id} className={styles.practice.row}>
                <div className="min-w-0">
                  <div className="font-medium">{s.title}</div>
                  <Muted size="xs">{t.best(best)} · {t.tries(p.state.attempts[s.id]?.length ?? 0)}</Muted>
                </div>
                <div className="flex gap-2">
                  <ButtonLink variant="ghost" href={docHref(s.source)}>{t.read}</ButtonLink>
                  <Button onClick={() => startSet(s.id)}>{t.start}</Button>
                </div>
              </ListRow>
            );
          })}
        </List>
      </Section>

      <Section title={t.roadmapTitle} description={t.roadmapHint}>
        <List>
          {LESSONS.map((l) => (
            <ListRow key={l.id} className="flex-col">
              <label className="flex items-start gap-3">
                <input type="checkbox" className={styles.control.checkbox} checked={Boolean(p.state.lessons[l.id])} onChange={() => p.toggleLesson(l.id)} />
                <span className="min-w-0 flex-1">
                  <span className={cn("font-medium", p.state.lessons[l.id] && styles.state.done)}>{l.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={styles.text.code}>{l.date}</span>{lessonBadge(l)}
                  </span>
                </span>
              </label>
              <div className="pl-7">{lessonActions(l)}</div>
            </ListRow>
          ))}
        </List>
      </Section>

      <Section title={t.backupTitle} description={t.backupHint}>
        <div className={styles.control.ctaRow}>
          <Button variant="outline" onClick={() => navigator.clipboard?.writeText(p.exportJson())}>{t.exportBtn}</Button>
          <Button variant="outline" onClick={doImport}>{t.importBtn}</Button>
        </div>
      </Section>
    </div>
  );
}
