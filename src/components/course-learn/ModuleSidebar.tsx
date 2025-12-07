import { useMemo } from "react";
import { BadgeCheck, BookOpenCheck, ChevronDown, ChevronRight, FileQuestion, FileText } from "lucide-react";
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
  moduleIndex,
  isOpen,
  onToggle,
  onSelectLesson,
  onSelectQuiz,
  activeLessonId,
  activeQuizId,
}: {
  module: ExtendedCourseModule;
  moduleIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onSelectLesson: (lessonId: number) => void;
  onSelectQuiz: (quizId: number) => void;
  activeLessonId?: number;
  activeQuizId?: number;
}) => {
  const lessons = module.course_module_lessons || [];
  const quizzes = module.quizzes || [];
  const lectureCount = lessons.length;
  const quizCount = quizzes.length;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
      <button
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-700/50"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-100">
            {moduleIndex + 1}. {module.module_title || "Module"}
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>{lectureCount} lesson{lectureCount !== 1 ? "s" : ""}</span>
            {quizCount > 0 && <span>• {quizCount} quiz{quizCount !== 1 ? "zes" : ""}</span>}
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-slate-700/50">
          {lessons.map((lesson: ExtendedLesson, lessonIndex) => {
            const isActive = activeLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                  "hover:bg-slate-700/50",
                  isActive && "bg-orange-500/10 border-l-3 border-l-orange-500"
                )}
                onClick={() => lesson.id && onSelectLesson(lesson.id)}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  isActive ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"
                )}>
                  {isActive ? (
                    <BadgeCheck className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{moduleIndex + 1}.{lessonIndex + 1}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-orange-500" : "text-slate-200"
                  )}>
                    {lesson.lesson_title || "Lesson"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {lesson.duration && (
                      <span className="flex items-center gap-1">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lesson.duration} min
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
          {quizzes.map((quiz: ExtendedQuiz, quizIndex) => {
            const isActive = activeQuizId === quiz.id;
            return (
              <button
                key={quiz.id}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                  "hover:bg-slate-700/50",
                  isActive && "bg-orange-500/10 border-l-3 border-l-orange-500"
                )}
                onClick={() => quiz.id && onSelectQuiz(quiz.id)}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full",
                  isActive ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"
                )}>
                  <FileQuestion className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-orange-500" : "text-slate-200"
                  )}>
                    {quiz.title || "Quiz"}
                  </span>
                  {quiz.questions?.length ? (
                    <span className="text-xs text-slate-400">
                      {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
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

  const progress = Math.round(progressPercentage || 0);

  return (
    <aside className="sticky top-24 h-[calc(100vh-7rem)] w-full space-y-4 overflow-y-auto pb-10 bg-slate-900 rounded-lg p-4">
      <div className="space-y-3 rounded-lg border border-slate-700/50 bg-slate-800/80 p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="mt-0.5 h-5 w-5 text-orange-500" />
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Course Progress</p>
            <h3 className="mt-1 text-base font-semibold leading-tight text-slate-100 line-clamp-2">
              {courseTitle || "Course"}
            </h3>
          </div>
        </div>
        <div className="space-y-2 rounded-lg bg-slate-900/50 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-orange-500">{progress}%</span>
            <span className="text-slate-400">{progress}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-700">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{totalLessons || 0} lessons</span>
            <span>•</span>
            <span>{totalQuizzes || 0} quizzes</span>
          </div>
        </div>
      </div>

      {sortedModules.map((module, moduleIndex) => (
        <ModuleSidebarItem
          key={module.id}
          module={module}
          moduleIndex={moduleIndex}
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