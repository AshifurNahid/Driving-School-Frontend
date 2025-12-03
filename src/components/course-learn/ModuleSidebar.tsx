import { useMemo } from "react";
import {
  BadgeCheck,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileQuestion,
  FileText,
  ListChecks,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedCourseModule, ExtendedLesson, ExtendedQuiz } from "@/types/userCourse";
import { Progress } from "../ui/progress";

interface ModuleSidebarProps {
  courseTitle?: string;
  progressPercentage?: number;
  totalLessons?: number;
  totalQuizzes?: number;
  modules?: ExtendedCourseModule[];
  expanded: Record<number, boolean>;
  onToggle: (moduleId: number) => void;
  onSelectLesson: (moduleId: number, lessonId: number) => void;
  onSelectQuiz: (moduleId: number, quizId: number) => void;
  activeLessonId?: number;
  activeQuizId?: number;
}

const ModuleSidebarItem = ({
  module,
  isOpen,
  onToggle,
  onSelectLesson,
  onSelectQuiz,
  activeLessonId,
  activeQuizId,
}: {
  module: ExtendedCourseModule;
  isOpen: boolean;
  onToggle: () => void;
  onSelectLesson: (lessonId: number) => void;
  onSelectQuiz: (quizId: number) => void;
  activeLessonId?: number;
  activeQuizId?: number;
}) => {
  const lessons = module.course_module_lessons || [];
  const quizzes = module.quizzes || [];

  const orderedLessons = useMemo(
    () => [...lessons].sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
    [lessons]
  );

  const lessonIcon = (lesson: ExtendedLesson) => {
    const path = lesson.lesson_attachment_path?.toLowerCase();
    if (path?.match(/\.(mp4|mov|avi|mkv)$/)) return <PlayCircle className="h-4 w-4" />;
    if (path?.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <button
        className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-muted/70"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">Section</span>
          <span className="text-sm font-semibold text-foreground leading-tight">
            {module.module_title || "Module"}
          </span>
          {module.module_description && (
            <span className="text-xs text-muted-foreground line-clamp-2">
              {module.module_description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {module.duration ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[11px] font-medium">
              <Clock3 className="h-3 w-3" /> {module.duration} hrs
            </span>
          ) : null}
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>
      {isOpen && (
        <div className="divide-y">
          {orderedLessons.map((lesson: ExtendedLesson, idx: number) => {
            const isCompleted = Boolean(lesson.is_completed || lesson.status === 2);
            return (
              <button
                key={lesson.id || idx}
                className={cn(
                  "group flex w-full items-start gap-3 px-4 py-3 text-left transition",
                  "hover:bg-muted/70",
                  activeLessonId === lesson.id && "bg-primary/5 border-l-4 border-primary"
                )}
                onClick={() => lesson.id && onSelectLesson(lesson.id)}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border text-primary transition",
                    isCompleted ? "border-primary/40 bg-primary/10" : "border-border/70 bg-muted/60",
                    activeLessonId === lesson.id && "border-primary bg-primary/10"
                  )}
                >
                  {lessonIcon(lesson)}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold leading-tight text-foreground">
                      {lesson.lesson_title || "Lesson"}
                    </span>
                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">
                      <FileText className="h-3 w-3" /> PDF resource
                    </span>
                    {lesson.duration ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium">
                        <Clock3 className="h-3 w-3" /> {lesson.duration} mins
                      </span>
                    ) : null}
                  </div>
                </div>
                {activeLessonId === lesson.id ? (
                  <BadgeCheck className="ml-auto h-4 w-4 text-primary" />
                ) : null}
              </button>
            );
          })}
          {quizzes.map((quiz: ExtendedQuiz) => (
            <button
              key={quiz.id}
              className={cn(
                "group flex w-full items-start gap-3 px-4 py-3 text-left transition",
                "hover:bg-muted/70",
                activeQuizId === quiz.id && "bg-primary/5 border-l-4 border-primary"
              )}
              onClick={() => quiz.id && onSelectQuiz(quiz.id)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-500">
                <FileQuestion className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">{quiz.title || "Quiz"}</span>
                {quiz.questions?.length ? (
                  <span className="text-xs text-muted-foreground">
                    {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                  </span>
                ) : null}
              </div>
              {activeQuizId === quiz.id ? (
                <BadgeCheck className="ml-auto h-4 w-4 text-primary" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ModuleSidebar = ({
  courseTitle,
  progressPercentage,
  totalLessons,
  totalQuizzes,
  modules,
  expanded,
  onToggle,
  onSelectLesson,
  onSelectQuiz,
  activeLessonId,
  activeQuizId,
}: ModuleSidebarProps) => {
  const sortedModules = useMemo(
    () => [...(modules || [])].sort((a, b) => (a.sequence || 0) - (b.sequence || 0)),
    [modules]
  );

  const totalItems = (totalLessons || 0) + (totalQuizzes || 0);
  const progress = Math.round(progressPercentage || 0);

  return (
    <aside className="sticky top-24 h-[calc(100vh-6rem)] w-full max-w-sm space-y-4 overflow-y-auto pb-10 pr-2 lg:pr-4">
      <div className="space-y-4 rounded-2xl border border-border/70 bg-card/70 p-5 shadow-md backdrop-blur">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Course content</p>
            <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
              {courseTitle || "Course"}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                <ListChecks className="h-3 w-3" /> {totalLessons || 0} lessons
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                <FileQuestion className="h-3 w-3" /> {totalQuizzes || 0} quizzes
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Learning progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {totalItems ? (
            <p className="text-xs text-muted-foreground">
              {totalItems} total items • Keep going!
            </p>
          ) : null}
        </div>
      </div>

      {sortedModules.map((module) => (
        <ModuleSidebarItem
          key={module.id}
          module={module}
          isOpen={Boolean(module.id && expanded[module.id])}
          onToggle={() => module.id && onToggle(module.id)}
          onSelectLesson={(lessonId) => module.id && onSelectLesson(module.id, lessonId)}
          onSelectQuiz={(quizId) => module.id && onSelectQuiz(module.id, quizId)}
          activeLessonId={activeLessonId}
          activeQuizId={activeQuizId}
        />
      ))}
    </aside>
  );
};
