import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExtendedQuiz } from "@/types/userCourse";
import { QuizQuestion } from "@/types/courses";
import { CheckCircle2, XCircle, FileQuestion } from "lucide-react";

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
    // ignore
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
    <Card className="border-0 bg-white shadow-sm">
      <CardHeader className="space-y-4 border-b bg-gradient-to-br from-orange-50 to-white pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 px-3 py-1">
            <FileQuestion className="mr-1.5 h-3.5 w-3.5" />
            Quiz
          </Badge>
          {quiz.passing_score && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
              Pass: {quiz.passing_score}%
            </Badge>
          )}
          {quiz.max_attempts && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1">
              {quiz.max_attempts} Attempts
            </Badge>
          )}
        </div>
    
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
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
            <div key={question.id ?? idx} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-medium text-slate-900">
                        {question.question}
                      </p>
                      {question.points && (
                        <p className="mt-1 text-xs text-slate-500">{question.points} points</p>
                      )}
                    </div>
                  </div>
                </div>
                {submitted && (
                  <Badge 
                    variant={isCorrect ? "default" : isIncorrect ? "destructive" : "secondary"}
                    className={isCorrect ? "bg-green-500" : ""}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Correct
                      </>
                    ) : isIncorrect ? (
                      <>
                        <XCircle className="mr-1 h-3 w-3" />
                        Incorrect
                      </>
                    ) : (
                      "Submitted"
                    )}
                  </Badge>
                )}
              </div>
              
              {questionType === 2 ? (
                <Input
                  placeholder="Type your answer"
                  value={selected ?? ""}
                  onChange={(event) => handleInputChange(selectionKey, event.target.value)}
                  className="bg-white"
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {options.length === 0 ? (
                    <p className="text-sm text-slate-500">No options provided for this question.</p>
                  ) : (
                    options.map((option) => {
                      const isThisCorrect = submitted && hasCorrectAnswers && correctAnswers.includes(normalizeSelection(option.key));
                      const isSelected = selected === option.key;
                      
                      return (
                        <button
                          key={option.key}
                          onClick={() => handleSelect(selectionKey, option.key)}
                          className={`rounded-lg border-2 bg-white px-4 py-3 text-left transition-all ${
                            isSelected && !submitted
                              ? "border-orange-500 bg-orange-50"
                              : isSelected && isCorrect
                              ? "border-green-500 bg-green-50"
                              : isSelected && isIncorrect
                              ? "border-red-500 bg-red-50"
                              : isThisCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                isSelected && !submitted
                                  ? "border-orange-500 bg-orange-500"
                                  : isSelected && isCorrect
                                  ? "border-green-500 bg-green-500"
                                  : isSelected && isIncorrect
                                  ? "border-red-500 bg-red-500"
                                  : "border-slate-300"
                              }`}>
                                {isSelected && (
                                  <div className="h-2 w-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <span className="text-sm font-medium text-slate-800">{option.label}</span>
                            </div>
                            {isThisCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4">
          <p className="text-sm text-slate-600">
            {submitted ? "Quiz submitted! Review your answers above." : "Select your answers and click submit when ready."}
          </p>
          <Button 
            onClick={handleSubmit} 
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6"
          >
            {submitted ? "Retake Quiz" : "Submit Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};