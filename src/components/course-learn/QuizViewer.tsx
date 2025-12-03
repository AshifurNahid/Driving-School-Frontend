import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExtendedQuiz } from "@/types/userCourse";
import { QuizQuestion } from "@/types/courses";

interface QuizViewerProps {
  quiz?: ExtendedQuiz;
}

type QuizAnswers = Record<number, string>;

const parseOptions = (question?: QuizQuestion): string[] => {
  if (!question?.options) return [];
  try {
    const parsed = JSON.parse(question.options);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch (err) {
    // ignore JSON parse errors and fall back to comma split
  }
  return String(question.options)
    .split(/\r?\n|,/) // support new lines or comma separated
    .map((opt) => opt.trim())
    .filter(Boolean);
};

export const QuizViewer = ({ quiz }: QuizViewerProps) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(() => quiz?.questions || [], [quiz]);

  const handleSelect = (questionId?: number, option?: string) => {
    if (!questionId || !option) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (!quiz) return null;

  return (
    <Card className="border bg-card text-card-foreground shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Quiz</Badge>
          {quiz.passing_score ? <Badge variant="secondary">Pass: {quiz.passing_score}%</Badge> : null}
          {quiz.max_attempts ? <Badge variant="secondary">Attempts: {quiz.max_attempts}</Badge> : null}
        </div>
        <CardTitle className="text-xl font-semibold text-foreground">{quiz.title || "Quiz"}</CardTitle>
        {quiz.description ? (
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, idx) => {
          const options = parseOptions(question);
          const selected = answers[question.id ?? idx];
          const isCorrect = submitted && selected && question.correct_answers?.includes(selected);
          const isIncorrect = submitted && selected && question.correct_answers && !question.correct_answers.includes(selected);

          return (
            <div key={question.id ?? idx} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Q{idx + 1}. {question.question}
                  </p>
                  {question.points ? (
                    <p className="text-xs text-muted-foreground">{question.points} points</p>
                  ) : null}
                </div>
                {submitted && (
                  <Badge variant={isCorrect ? "default" : isIncorrect ? "destructive" : "secondary"}>
                    {isCorrect ? "Correct" : isIncorrect ? "Incorrect" : "Submitted"}
                  </Badge>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(question.id ?? idx, option)}
                    className={`rounded-lg border px-4 py-3 text-left transition hover:border-primary hover:bg-primary/5 ${
                      selected === option ? "border-primary bg-primary/10" : "border-muted"
                    }`}
                  >
                    <span className="text-sm text-foreground">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Answers are stored locally for a smooth learning experience.
          </div>
          <Button onClick={handleSubmit} size="lg">
            Submit Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
