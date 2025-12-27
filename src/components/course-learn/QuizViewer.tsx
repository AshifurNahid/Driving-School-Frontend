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
      <Card className="border border-[#222832] bg-[#1E2329] shadow-xl shadow-black/30">
        <CardHeader className="space-y-4 border-b border-[#222832] bg-gradient-to-br from-[#1A1D23] via-[#12161C] to-[#0F1419] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-[#FF7F50]/60 bg-[#FF7F50]/15 text-[#FFB4A2] px-3 py-1">
              <FileQuestion className="mr-1.5 h-3.5 w-3.5" />
              Quiz
            </Badge>
            {quiz.passing_score && (
              <Badge variant="secondary" className="bg-[#0F2A1F] text-[#22C55E] border border-[#22C55E]/40 px-3 py-1">
                Pass: {quiz.passing_score}%
              </Badge>
            )}
            {quiz.max_attempts && (
              <Badge variant="secondary" className="bg-[#0F1419] text-[#F8F9FA] border border-[#2A3038] px-3 py-1">
                {quiz.max_attempts} Attempts
              </Badge>
            )}
          </div>

        </CardHeader>

        <CardContent className="space-y-6 p-6 bg-[#0F1419] text-white">
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
              className="space-y-4 rounded-lg border border-[#222832] bg-[#1E2329] p-5 shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#222832] text-sm font-semibold text-[#F8F9FA]">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-base font-medium text-[#F8F9FA]">
                        {question.question}
                      </p>
                      {question.points && (
                        <p className="mt-1 text-xs text-[#8B92A0]">{question.points} points</p>
                      )}
                    </div>
                  </div>
                </div>
                {submitted && (
                  <Badge
                    variant={isCorrect ? "default" : isIncorrect ? "destructive" : "secondary"}
                    className={isCorrect ? "bg-[#22C55E] text-[#0F1419]" : isIncorrect ? "bg-[#FF6B35]/20 border border-[#FF6B35]/60 text-[#FF6B35]" : "bg-[#222832] text-[#F8F9FA]"}
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
                  className="bg-[#0F1419] border-[#2A3038] text-white"
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {options.length === 0 ? (
                    <p className="text-sm text-[#8B92A0]">No options provided for this question.</p>
                  ) : (
                    options.map((option) => {
                      const isThisCorrect = submitted && hasCorrectAnswers && correctAnswers.includes(normalizeSelection(option.key));
                      const isSelected = selected === option.key;

                      return (
                        <button
                          key={option.key}
                          onClick={() => handleSelect(selectionKey, option.key)}
                          className={`rounded-lg border-2 bg-[#0F1419] px-4 py-3 text-left transition-all border-[#2A3038] text-white ${
                            isSelected && !submitted
                              ? "border-[#4ECDC4] bg-[#4ECDC4]/10"
                              : isSelected && isCorrect
                              ? "border-[#22C55E] bg-[#22C55E]/10"
                              : isSelected && isIncorrect
                              ? "border-[#FF6B35] bg-[#FF6B35]/10"
                              : isThisCorrect
                              ? "border-[#22C55E] bg-[#22C55E]/10"
                              : "hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/5"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                  isSelected && !submitted
                                    ? "border-[#4ECDC4] bg-[#4ECDC4]"
                                    : isSelected && isCorrect
                                    ? "border-[#22C55E] bg-[#22C55E]"
                                    : isSelected && isIncorrect
                                    ? "border-[#FF6B35] bg-[#FF6B35]"
                                    : "border-[#2A3038]"
                                }`}
                              >
                                {isSelected && (
                                  <div className="h-2 w-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <span className="text-sm font-medium text-[#F8F9FA]">{option.label}</span>
                            </div>
                            {isThisCorrect && (
                              <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
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

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#2A3038] bg-[#1E2329] p-4 shadow-lg shadow-black/20">
          <p className="text-sm text-[#8B92A0]">
            {submitted ? "Quiz submitted! Review your answers above." : "Select your answers and click submit when ready."}
          </p>
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={isSubmitting}
            className="bg-[#FF7F50] hover:bg-[#FF8C61] text-[#0F1419] font-semibold px-6 disabled:bg-[#2A3038] disabled:text-[#8B92A0]"
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
        <DialogContent className="sm:max-w-md bg-[#1A1D23] text-white border border-[#2A3038]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35]/15 text-[#FF6B35] shadow-inner">
                <AlertCircle className="h-6 w-6" />
              </span>
              <div>
                <DialogTitle className="text-lg font-semibold text-[#F8F9FA]">Submission blocked</DialogTitle>
                <DialogDescription className="text-sm text-[#8B92A0]">
                  {errorDialog.message || "We couldn't submit your quiz right now."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog({ open: false, message: "" })} className="w-full sm:w-auto bg-[#4ECDC4] hover:bg-[#5DD9C1] text-[#0F1419] font-semibold">
              Okay, got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
