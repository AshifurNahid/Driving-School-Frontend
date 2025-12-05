import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ExtendedQuiz } from "@/types/userCourse";
import { QuizQuestion } from "@/types/courses";

interface QuizViewerProps {
  quiz?: ExtendedQuiz;
}

type QuizAnswers = Record<number, string>;

type ParsedOption = { key: string; label: string };

const normalizeOption = (option: unknown, index: number): ParsedOption | null => {
  if (typeof option === "string") {
    const trimmed = option.trim();
    return trimmed ? { key: trimmed, label: trimmed } : null;
  }

  if (option && typeof option === "object") {
    const opt = option as Record<string, unknown>;
    const label = opt.value ?? opt.label ?? opt.key;
    if (!label) return null;
    const key = opt.key ?? opt.value ?? `option-${index}`;
    return { key: String(key), label: String(label) };
  }

  return null;
};

const parseOptions = (question?: QuizQuestion): ParsedOption[] => {
  if (!question?.options) return [];

  const rawOptions = question.options;

  if (Array.isArray(rawOptions)) {
    return rawOptions
      .map((opt, idx) => normalizeOption(opt, idx))
      .filter(Boolean) as ParsedOption[];
  }

  const rawString = String(rawOptions);

  try {
    const parsed = JSON.parse(rawString);
    if (Array.isArray(parsed)) {
      return parsed
        .map((opt, idx) => normalizeOption(opt, idx))
        .filter(Boolean) as ParsedOption[];
    }
  } catch (err) {
    // ignore JSON parse errors and fall back to comma/newline split
  }

  return rawString
    .split(/\r?\n|,/)
    .map((opt) => opt.trim())
    .filter(Boolean)
    .map((opt) => ({ key: opt, label: opt }));
};

const parseCorrectAnswers = (question?: QuizQuestion): string[] => {
  if (!question) return [];

  const answers: string[] = [];

  if (Array.isArray(question.correct_answer_keys)) {
    answers.push(...question.correct_answer_keys.map((key) => String(key)));
  } else if (typeof question.correct_answer_keys === "string") {
    answers.push(
      ...question.correct_answer_keys
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean)
    );
  }

  if (typeof question.correct_answers === "string") {
    answers.push(
      ...question.correct_answers
        .split(",")
        .map((ans) => ans.trim())
        .filter(Boolean)
    );
  }

  return answers.map((ans) => ans.toLowerCase());
};

const normalizeSelection = (selection?: string): string => selection?.trim().toLowerCase() ?? "";

const FALLBACK_TRUE_FALSE: ParsedOption[] = [
  { key: "true", label: "True" },
  { key: "false", label: "False" },
];

export const QuizViewer = ({ quiz }: QuizViewerProps) => {
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(() => quiz?.questions || [], [quiz]);

  const handleSelect = (questionId?: number, option?: string) => {
    if (!questionId || !option) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleInputChange = (questionId?: number, value?: string) => {
    if (!questionId) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value ?? "" }));
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
          const questionType = question.type ?? 0;
          const parsedOptions = parseOptions(question);
          const options =
            questionType === 1 && parsedOptions.length === 0 ? FALLBACK_TRUE_FALSE : parsedOptions;
          const selectionKey = question.id ?? idx;
          const selected = answers[selectionKey];
          const correctAnswers = parseCorrectAnswers(question);
          const normalizedSelected = normalizeSelection(selected);
          const hasCorrectAnswers = correctAnswers.length > 0;
          const isCorrect = submitted && normalizedSelected && hasCorrectAnswers && correctAnswers.includes(normalizedSelected);
          const isIncorrect = submitted && normalizedSelected && hasCorrectAnswers && !correctAnswers.includes(normalizedSelected);

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
              {questionType === 2 ? (
                <Input
                  placeholder="Type your answer"
                  value={selected ?? ""}
                  onChange={(event) => handleInputChange(selectionKey, event.target.value)}
                />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No options provided for this question.</p>
                  ) : (
                    options.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => handleSelect(selectionKey, option.key)}
                        className={`rounded-lg border px-4 py-3 text-left transition hover:border-primary hover:bg-primary/5 ${
                          selected === option.key ? "border-primary bg-primary/10" : "border-muted"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-foreground">{option.label}</span>
                          {submitted && hasCorrectAnswers && correctAnswers.includes(normalizeSelection(option.key)) && (
                            <Badge variant="outline" className="text-[11px]">
                              Correct answer
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
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
