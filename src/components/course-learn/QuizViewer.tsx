import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/utils/axios";
import { useToast } from "@/hooks/use-toast";
import { ExtendedQuiz } from "@/types/userCourse";
import { QuizQuestion } from "@/types/courses";
import { CheckCircle2, XCircle, FileQuestion, AlertCircle } from "lucide-react";

interface QuizViewerProps {
  quiz?: ExtendedQuiz;
  courseId?: number;
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

export const QuizViewer = ({ quiz, courseId }: QuizViewerProps) => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startedAt, setStartedAt] = useState<Date>(() => new Date());
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });

  const questions = useMemo(() => quiz?.questions || [], [quiz]);

  useEffect(() => {
    setStartedAt(new Date());
  }, [quiz?.id]);

  const buildGivenAnswers = () =>
    questions
      .filter((question): question is QuizQuestion & { id: number } => Boolean(question?.id))
      .map((question, idx) => {
        const selectionKey = question.id ?? idx;
        return {
          queston_id: question.id,
          given_answer: answers[selectionKey] ?? "",
        };
      });

  const handleSelect = (questionId?: number, option?: string) => {
    if (!questionId || !option) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleInputChange = (questionId?: number, value?: string) => {
    if (!questionId) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value ?? "" }));
  };

  const handleSubmit = async () => {
    if (submitted) {
      setSubmitted(false);
      setAnswers({});
      setStartedAt(new Date());
      return;
    }

    if (!courseId || !quiz?.id) {
      toast({
        title: "Missing information",
        description: "Course or quiz details are not available for submission.",
        variant: "destructive",
      });
      return;
    }

    const given_answers = buildGivenAnswers();

    if (!given_answers.length) {
      toast({
        title: "No questions to submit",
        description: "There are no valid quiz questions available to submit.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      course_id: courseId,
      quiz_id: quiz.id,
      started_at: startedAt.toISOString(),
      completed_at: new Date().toISOString(),
      given_answers,
    };

    try {
      setIsSubmitting(true);
      await api.post("/submit-quiz-attempt", payload);
      setSubmitted(true);
      toast({
        title: "Quiz submitted",
        description: "Your answers have been submitted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to submit quiz attempt", error);
      const backendMessage =
        (error as any)?.response?.data?.status?.message ||
        (error as any)?.response?.data?.message;

      if (backendMessage) {
        setErrorDialog({ open: true, message: backendMessage });
      } else {
        toast({
          title: "Submission failed",
          description: "We couldn't submit your quiz. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz) return null;

  return (
    <>
      <Card className="border-0 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-lg/10">
        <CardHeader className="space-y-4 border-b bg-gradient-to-br from-orange-50 to-white pb-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 px-3 py-1 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-200">
              <FileQuestion className="mr-1.5 h-3.5 w-3.5" />
              Quiz
            </Badge>
            {quiz.passing_score && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1 dark:bg-green-900/40 dark:text-green-200">
                Pass: {quiz.passing_score}%
              </Badge>
            )}
            {quiz.max_attempts && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1 dark:bg-slate-800 dark:text-slate-200">
                {quiz.max_attempts} Attempts
              </Badge>
            )}
          </div>

        </CardHeader>

        <CardContent className="space-y-6 p-6 dark:bg-slate-900">
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
            <div
              key={question.id ?? idx}
              className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                        {question.question}
                      </p>
                      {question.points && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{question.points} points</p>
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
                  className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {options.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No options provided for this question.</p>
                  ) : (
                    options.map((option) => {
                      const isThisCorrect = submitted && hasCorrectAnswers && correctAnswers.includes(normalizeSelection(option.key));
                      const isSelected = selected === option.key;

                      return (
                        <button
                          key={option.key}
                          onClick={() => handleSelect(selectionKey, option.key)}
                          className={`rounded-lg border-2 bg-white px-4 py-3 text-left transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 ${
                            isSelected && !submitted
                              ? "border-orange-500 bg-orange-50"
                              : isSelected && isCorrect
                              ? "border-green-500 bg-green-50"
                              : isSelected && isIncorrect
                              ? "border-red-500 bg-red-50"
                              : isThisCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 dark:border-slate-700 dark:hover:border-orange-400 dark:hover:bg-orange-500/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                  isSelected && !submitted
                                    ? "border-orange-500 bg-orange-500"
                                    : isSelected && isCorrect
                                    ? "border-green-500 bg-green-500"
                                    : isSelected && isIncorrect
                                    ? "border-red-500 bg-red-500"
                                    : "border-slate-300 dark:border-slate-600"
                                }`}
                              >
                                {isSelected && (
                                  <div className="h-2 w-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
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

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-900/50 dark:bg-orange-500/10">
          <p className="text-sm text-slate-600 dark:text-slate-200">
            {submitted ? "Quiz submitted! Review your answers above." : "Select your answers and click submit when ready."}
          </p>
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 disabled:opacity-70"
          >
            {submitted ? "Retake Quiz" : isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </CardContent>
    </Card>

      <Dialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner dark:bg-red-900/30 dark:text-red-200">
                <AlertCircle className="h-6 w-6" />
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold">Submission blocked</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {errorDialog.message || "We couldn't submit your quiz right now."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog({ open: false, message: "" })} className="w-full sm:w-auto">
              Okay, got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
