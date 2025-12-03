import { ExtendedCourseModule, ExtendedLesson, ExtendedQuiz } from "@/types/userCourse";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://dms-edu.runasp.net";

export type LearningSelection = {
  moduleId?: number;
  lessonId?: number;
  quizId?: number;
};

export const resolveAttachmentUrl = (path?: string | null): string | null => {
  if (!path) return null;
  const isExternal = /^https?:\/\//i.test(path);
  return isExternal ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
};

export const findInitialSelection = (
  modules?: ExtendedCourseModule[]
): LearningSelection | null => {
  if (!modules?.length) return null;
  const firstModule = [...modules].sort((a, b) => (a.sequence || 0) - (b.sequence || 0))[0];
  const firstLesson = firstModule.course_module_lessons?.[0];
  if (firstLesson?.id) {
    return { moduleId: firstModule.id, lessonId: firstLesson.id };
  }
  const firstQuiz = firstModule.quizzes?.[0];
  if (firstQuiz?.id) {
    return { moduleId: firstModule.id, quizId: firstQuiz.id };
  }
  return null;
};

export const findLessonById = (
  modules: ExtendedCourseModule[] | undefined,
  moduleId?: number,
  lessonId?: number
): ExtendedLesson | undefined => {
  if (!modules || !moduleId || !lessonId) return undefined;
  const module = modules.find((m) => m.id === moduleId);
  return module?.course_module_lessons?.find((lesson) => lesson.id === lessonId);
};

export const findQuizById = (
  modules: ExtendedCourseModule[] | undefined,
  moduleId?: number,
  quizId?: number
): ExtendedQuiz | undefined => {
  if (!modules || !moduleId || !quizId) return undefined;
  const module = modules.find((m) => m.id === moduleId);
  return module?.quizzes?.find((quiz) => quiz.id === quizId);
};
