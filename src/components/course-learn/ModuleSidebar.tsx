import { useMemo } from "react";
import {
  BadgeCheck,
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  FileQuestion,
  FileText,
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

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-muted"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Section</span>
          <span className="text-base font-bold text-primary">
            {module.module_title || "Module"}
          </span>
          {module.module_description && (
            <span className="text-xs text-muted-foreground line-clamp-2">
              {module.module_description}
            </span>
          )}
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isOpen && (
        <div className="divide-y">
          {lessons.map((lesson: ExtendedLesson) => (
            <button
              key={lesson.id}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                "hover:bg-muted",
                activeLessonId === lesson.id && "bg-primary/5 border-l-4 border-primary"
              )}
              onClick={() => lesson.id && onSelectLesson(lesson.id)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-normal text-foreground">
                  {lesson.lesson_title || "Lesson"}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>PDF resource</span>
                  {lesson.duration ? (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                      {lesson.duration} mins
                    </span>
                  ) : null}
                </div>
              </div>
              {activeLessonId === lesson.id ? (
                <BadgeCheck className="ml-auto h-4 w-4 text-primary" />
              ) : null}
            </button>
          ))}
          {quizzes.map((quiz: ExtendedQuiz) => (
            <button
              key={quiz.id}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                "hover:bg-muted",
                activeQuizId === quiz.id && "bg-primary/5 border-l-4 border-primary"
              )}
              onClick={() => quiz.id && onSelectQuiz(quiz.id)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
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
    <aside className="sticky top-24 h-[calc(100vh-6rem)] w-full max-w-sm sm:max-w-md lg:max-w-[420px] space-y-4 overflow-y-auto pb-10 pr-2">
      <div className="space-y-3 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Course content</p>
            <h3 className="text-base font-semibold leading-tight text-foreground line-clamp-2">
              {courseTitle || "Course"}
            </h3>
          </div>
        </div>
        <div className="space-y-2 rounded-xl bg-muted/60 p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{progress}% complete</span>
            <span>
              {totalLessons || 0} lessons • {totalQuizzes || 0} quizzes
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          {totalItems ? (
            <p className="text-xs text-muted-foreground">
              {totalItems} learning items to explore
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
