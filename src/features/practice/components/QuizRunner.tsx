"use client";
import { useState } from "react";
import { STRINGS } from "@/config/strings";
import { Button, Card, H2, Input, Muted, styles } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import type { Question } from "../types";
import { correctText, isCorrect, type RunResult } from "../lib/quiz";

type Props = { title: string; questions: Question[]; onFinish: (results: RunResult[]) => void; onExit: () => void; onAgain: () => void };

/** Runs one quiz: one question at a time, instant feedback, summary at the end. */
export function QuizRunner({ title, questions, onFinish, onExit, onAgain }: Props) {
  const t = STRINGS.practice.quiz;
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<RunResult[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[index];
  const answered = results.length > index;
  const last = results[index];

  const submit = (answer: string | number) => {
    if (answered) return;
    if (q.kind === "choice") setPicked(answer as number);
    setResults([...results, { id: q.id, correct: isCorrect(q, answer) }]);
  };
  const next = () => {
    if (index + 1 < questions.length) { setIndex(index + 1); setTyped(""); setPicked(null); return; }
    onFinish(results);
    setDone(true);
  };

  if (done) {
    const score = results.filter((r) => r.correct).length;
    const wrong = questions.filter((x) => results.find((r) => r.id === x.id && !r.correct));
    return (
      <Card className="mt-5 space-y-4">
        <H2>{t.resultTitle}: {title}</H2>
        <p className="text-2xl font-bold">{t.score(score, results.length)}</p>
        {wrong.length > 0 && (
          <div>
            <Muted>{t.reviewWrong}</Muted>
            <ul className="mt-2 space-y-2 text-sm">
              {wrong.map((x) => (
                <li key={x.id}><div>{x.prompt}</div><b>{correctText(x)}</b>{x.explain && <Muted size="xs">{x.explain}</Muted>}</li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.control.ctaRow}>
          <Button onClick={onAgain}>{t.again}</Button>
          <Button variant="outline" onClick={onExit}>{t.back}</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mt-5 space-y-4">
      <div className={styles.practice.row}>
        <Button variant="ghost" className="px-0" onClick={onExit}>{t.exit}</Button>
        <Muted size="xs">{title} · {t.question(index + 1, questions.length)}</Muted>
      </div>
      <div className={styles.quiz.track}><div className={styles.quiz.progress} style={{ width: `${(index / questions.length) * 100}%` }} /></div>
      <p className="text-lg font-medium leading-snug">{q.prompt}</p>

      {q.kind === "choice" ? (
        <div className="space-y-2">
          {q.options.map((o, i) => (
            <button
              key={o}
              disabled={answered}
              onClick={() => submit(i)}
              className={cn(styles.quiz.option, answered && i === q.answer && styles.quiz.optionRight, answered && i === picked && i !== q.answer && styles.quiz.optionWrong)}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) submit(typed); }}>
          <Input autoFocus autoCapitalize="none" autoCorrect="off" spellCheck={false} disabled={answered} value={typed} placeholder={t.typeHere} onChange={(e) => setTyped(e.target.value)} />
          {!answered && <Button type="submit">{t.check}</Button>}
        </form>
      )}

      {answered && (
        <div className={styles.quiz.feedback}>
          {last.correct ? t.right : <>{t.wrong} <b>{correctText(q)}</b></>}
          {q.explain && <Muted size="xs" className="mt-1">{q.explain}</Muted>}
        </div>
      )}
      {answered && <Button className="w-full" onClick={next}>{index + 1 < questions.length ? t.next : t.finish}</Button>}
    </Card>
  );
}
