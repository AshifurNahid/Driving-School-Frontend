import { useMemo } from "react";
import {
  BadgeCheck,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white text-card-foreground shadow-sm">
      <button
        className="flex w-full items-center justify-between px-4 py-4 text-left transition hover:bg-slate-50"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">
              Section {moduleIndex + 1}: {module.module_title || "Module"}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{lectureCount} lesson{lectureCount !== 1 ? "s" : ""}</span>
              {quizCount ? <span>• {quizCount} quiz{quizCount !== 1 ? "zes" : ""}</span> : null}
              {module.module_description ? (
                <span className="line-clamp-1 text-xs text-muted-foreground/90">
                  {module.module_description}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="divide-y border-t bg-slate-50">
          {lessons.map((lesson: ExtendedLesson, lessonIndex) => {
            const lessonNumber = `${moduleIndex + 1}.${lessonIndex + 1}`;
            const isActiveLesson = activeLessonId === lesson.id;
            return (
              <button
                key={lesson.id}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                  isActiveLesson ? "bg-white shadow-inner" : "hover:bg-white"
                )}
                onClick={() => lesson.id && onSelectLesson(lesson.id)}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    isActiveLesson ? "bg-blue-100 text-blue-700" : "bg-white text-blue-500"
                  )}
                >
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">{lessonNumber}</span>
                    <span className="text-[13px] font-semibold text-foreground">
                      {lesson.lesson_title || "Lesson"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.duration ? `${lesson.duration} mins` : "Self paced"}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700">
                      Lesson overview
                    </span>
                  </div>
                </div>
                {isActiveLesson ? (
                  <BadgeCheck className="ml-auto h-4 w-4 text-blue-600" />
                ) : null}
              </button>
            );
          })}
          {quizzes.map((quiz: ExtendedQuiz, quizIndex) => {
            const quizNumber = `${moduleIndex + 1}.Q${quizIndex + 1}`;
            const isActiveQuiz = activeQuizId === quiz.id;
            return (
              <button
                key={quiz.id}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                  isActiveQuiz ? "bg-white shadow-inner" : "hover:bg-white"
                )}
                onClick={() => quiz.id && onSelectQuiz(quiz.id)}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    isActiveQuiz ? "bg-amber-100 text-amber-600" : "bg-white text-amber-500"
                  )}
                >
                  <FileQuestion className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">{quizNumber}</span>
                    <span className="text-sm font-semibold text-foreground">{quiz.title || "Quiz"}</span>
                  </div>
                  {quiz.questions?.length ? (
                    <span className="text-xs text-muted-foreground">
                      {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>
                {isActiveQuiz ? <BadgeCheck className="ml-auto h-4 w-4 text-amber-500" /> : null}
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

  const totalItems = (totalLessons || 0) + (totalQuizzes || 0);
  const progress = Math.round(progressPercentage || 0);

  return (
    <aside className="sticky top-24 h-[calc(100vh-6rem)] w-full max-w-sm space-y-4 overflow-y-auto rounded-2xl bg-transparent pb-10 pr-2 sm:max-w-md lg:max-w-[420px]">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Course content</p>
            <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
              {courseTitle || "Course"}
            </h3>
            <p className="text-xs text-muted-foreground">{progress}% completed</p>
          </div>
          <div className="rounded-xl bg-blue-50 px-3 py-2 text-right text-blue-700">
            <p className="text-[11px] uppercase">Overall</p>
            <p className="text-xl font-bold">{progress}%</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> {modules?.length || 0} sections
          </span>
          <span className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> {totalLessons || 0} lessons
          </span>
          <span className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" /> {totalQuizzes || 0} quizzes
          </span>
          {totalItems ? <span className="text-xs text-blue-700">{totalItems} items to explore</span> : null}
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
