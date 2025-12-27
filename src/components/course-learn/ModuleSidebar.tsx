import { useMemo } from "react";
import { BadgeCheck, BookOpenCheck, ChevronDown, ChevronRight, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtendedCourseModule, ExtendedLesson, ExtendedQuiz } from "@/types/userCourse";

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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md shadow-black/10 dark:border-[#222832] dark:bg-[#1E2329] dark:shadow-black/30">
      <button
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-slate-50 dark:hover:bg-[#222832]"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-900 dark:text-[#F8F9FA]">
            {moduleIndex + 1}. {module.module_title || "Module"}
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-[#8B92A0]">
            <span>{lectureCount} lesson{lectureCount !== 1 ? "s" : ""}</span>
            {quizCount > 0 && <span>• {quizCount} quiz{quizCount !== 1 ? "zes" : ""}</span>}
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-slate-500 dark:text-[#8B92A0]" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-500 dark:text-[#8B92A0]" />
        )}
      </button>
      {isOpen && (
        <div className="border-t border-slate-200 dark:border-[#222832]">
          {lessons.map((lesson: ExtendedLesson, lessonIndex) => {
            const isActive = activeLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                  "hover:bg-slate-50 dark:hover:bg-[#222832]",
                  isActive && "bg-[#FF7F50]/10 border-l-3 border-l-[#FF7F50]"
                )}
                onClick={() => lesson.id && onSelectLesson(lesson.id)}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0",
                  isActive ? "bg-[#4ECDC4] text-[#0F1419]" : "bg-slate-100 text-slate-600 dark:bg-[#222832] dark:text-[#9CA3AF]"
                )}>
                  {isActive ? (
                    <BadgeCheck className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-medium">{moduleIndex + 1}.{lessonIndex + 1}</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-[#4ECDC4]" : "text-slate-900 dark:text-[#F8F9FA]"
                  )}>
                    {lesson.lesson_title || "Lesson"}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#8B92A0]">
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
          {quizzes.map((quiz: ExtendedQuiz) => {
            const isActive = activeQuizId === quiz.id;
            return (
              <button
                key={quiz.id}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                  "hover:bg-slate-50 dark:hover:bg-[#222832]",
                  isActive && "bg-[#FF7F50]/10 border-l-3 border-l-[#FF7F50]"
                )}
                onClick={() => quiz.id && onSelectQuiz(quiz.id)}
              >
                <div className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0",
                  isActive ? "bg-[#4ECDC4] text-[#0F1419]" : "bg-slate-100 text-slate-600 dark:bg-[#222832] dark:text-[#9CA3AF]"
                )}>
                  <FileQuestion className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-[#4ECDC4]" : "text-slate-900 dark:text-[#F8F9FA]"
                  )}>
                    {quiz.title || "Quiz"}
                  </span>
                  {quiz.questions?.length ? (
                    <span className="text-xs text-slate-500 dark:text-[#8B92A0]">
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
    <aside className="h-full w-full space-y-4 overflow-y-auto pb-10 p-4">
      {/* Course Progress Card */}
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-md shadow-black/10 dark:border-[#222832] dark:bg-[#1E2329] dark:shadow-black/30">
        <div className="flex items-start gap-3">
          <BookOpenCheck className="mt-0.5 h-5 w-5 text-[#4ECDC4] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-[#8B92A0]">Course Progress</p>
            <h3 className="mt-1 text-base font-semibold leading-tight text-slate-900 dark:text-[#F8F9FA] line-clamp-2">
              {courseTitle || "Course"}
            </h3>
          </div>
        </div>
        <div className="space-y-2 rounded-lg bg-slate-50 border border-slate-200 p-3 dark:bg-[#0F1419] dark:border-[#222832]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#4ECDC4]">{progress}%</span>
            <span className="text-slate-500 dark:text-[#8B92A0]">{progress}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-[#222832]">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#5DD9C1] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#8B92A0]">
            <span>{totalLessons || 0} lessons</span>
            <span>•</span>
            <span>{totalQuizzes || 0} quizzes</span>
          </div>
        </div>
      </div>

      {/* Module Items */}
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
