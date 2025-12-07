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
    <div className="overflow-hidden rounded-xl border border-slate-800/60 bg-gradient-to-br from-[#0d1220] to-[#0b101b] text-slate-50 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.8)]">
      <button
        className="flex w-full items-center justify-between border-l-4 border-transparent px-4 py-3 text-left transition hover:border-amber-400 hover:bg-white/5"
        onClick={onToggle}
      >
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-slate-50">
            Section {moduleIndex + 1}: {module.module_title || "Module"}
          </span>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-300">
            <span>{lectureCount} lecture{lectureCount !== 1 ? "s" : ""}</span>
            {quizCount ? <span>• {quizCount} quiz{quizCount !== 1 ? "zes" : ""}</span> : null}
            {module.module_description ? (
              <span className="line-clamp-1 text-xs text-slate-400">
                {module.module_description}
              </span>
            ) : null}
          </div>
        </div>
        {isOpen ? <ChevronDown className="h-4 w-4 text-amber-400" /> : <ChevronRight className="h-4 w-4 text-slate-300" />}
      </button>
      {isOpen && (
        <div className="divide-y divide-slate-800/70">
          {lessons.map((lesson: ExtendedLesson, lessonIndex) => {
            const lessonNumber = `${moduleIndex + 1}.${lessonIndex + 1}`;
            return (
              <button
                key={lesson.id}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                  "hover:bg-white/5",
                  activeLessonId === lesson.id && "border-l-4 border-amber-400 bg-white/5"
                )}
                onClick={() => lesson.id && onSelectLesson(lesson.id)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">{lessonNumber}</span>
                    <span className="text-[13px] font-medium text-slate-50">
                      {lesson.lesson_title || "Lesson"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>PDF resource</span>
                    {lesson.duration ? (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-100">
                        {lesson.duration} mins
                      </span>
                    ) : null}
                  </div>
                </div>
                {activeLessonId === lesson.id ? (
                  <BadgeCheck className="ml-auto h-4 w-4 text-amber-400" />
                ) : null}
              </button>
            );
          })}
          {quizzes.map((quiz: ExtendedQuiz, quizIndex) => {
            const quizNumber = `${moduleIndex + 1}.Q${quizIndex + 1}`;
            return (
              <button
                key={quiz.id}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                  "hover:bg-white/5",
                  activeQuizId === quiz.id && "border-l-4 border-amber-400 bg-white/5"
                )}
                onClick={() => quiz.id && onSelectQuiz(quiz.id)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
                  <FileQuestion className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">{quizNumber}</span>
                    <span className="text-sm font-semibold text-slate-50">{quiz.title || "Quiz"}</span>
                  </div>
                  {quiz.questions?.length ? (
                    <span className="text-xs text-slate-300">
                      {quiz.questions.length} question{quiz.questions.length > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>
                {activeQuizId === quiz.id ? (
                  <BadgeCheck className="ml-auto h-4 w-4 text-amber-400" />
                ) : null}
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
    <aside className="sticky top-24 h-[calc(100vh-6rem)] w-full max-w-sm sm:max-w-md lg:max-w-[420px] space-y-4 overflow-y-auto pb-10 pr-2 text-slate-50">
      <div className="space-y-3 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-[#0d1220] via-[#0f1424] to-[#0b101b] p-4 shadow-[0_22px_60px_-45px_rgba(0,0,0,0.85)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
            <BookOpenCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Course progress</p>
            <h3 className="text-base font-semibold leading-tight text-slate-50 line-clamp-2">
              {courseTitle || "Course"}
            </h3>
          </div>
        </div>
        <div className="space-y-3 rounded-xl bg-white/5 p-3">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span>{progress}% complete</span>
            <span className="text-slate-300">
              {totalLessons || 0} lessons • {totalQuizzes || 0} quizzes
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-slate-800"
            indicatorClassName="bg-gradient-to-r from-emerald-400 via-amber-300 to-orange-400"
          />
          {totalItems ? (
            <p className="text-xs text-slate-300">
              {totalItems} learning items to explore
            </p>
          ) : null}
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
