import { useMemo } from "react";
import { ChevronDown, ChevronRight, FileQuestion, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedCourseModule, ExtendedLesson, ExtendedQuiz } from "@/types/userCourse";

interface ModuleSidebarProps {
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
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-foreground">
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
                activeLessonId === lesson.id && "bg-muted/80 border-l-4 border-primary"
              )}
              onClick={() => lesson.id && onSelectLesson(lesson.id)}
            >
              <FileText className="mt-0.5 h-4 w-4 text-primary" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {lesson.lesson_title || "Lesson"}
                </span>
                {lesson.duration && (
                  <span className="text-xs text-muted-foreground">
                    {lesson.duration} mins
                  </span>
                )}
              </div>
            </button>
          ))}
          {quizzes.map((quiz: ExtendedQuiz) => (
            <button
              key={quiz.id}
              className={cn(
                "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                "hover:bg-muted",
                activeQuizId === quiz.id && "bg-muted/80 border-l-4 border-primary"
              )}
              onClick={() => quiz.id && onSelectQuiz(quiz.id)}
            >
              <FileQuestion className="mt-0.5 h-4 w-4 text-amber-500" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">{quiz.title || "Quiz"}</span>
                {quiz.questions?.length ? (
                  <span className="text-xs text-muted-foreground">
                    {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ModuleSidebar = ({
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

  return (
    <aside className="sticky top-24 h-[calc(100vh-6rem)] w-full max-w-xs space-y-4 overflow-y-auto pb-10 pr-2">
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
