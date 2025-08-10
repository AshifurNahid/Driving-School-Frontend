// src/utils/learnMapper.ts
import { EnrolledCourses, CourseModule, Lesson, Course } from "@/types/courses";

export type LearnLesson = {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
  videoUrl: string;
  description: string;
};

export type LearnModule = {
  id: number;
  title: string;
  progress: number;
  lessons: LearnLesson[];
};

export type LearnCourse = {
  id: number;
  title: string;
  totalProgress: number;
  modules: LearnModule[];
};

export function mapEnrolledToLearnCourse(enrolled: EnrolledCourses): LearnCourse {
  const course: Course | undefined = enrolled.course;

  const modulesRaw: CourseModule[] = Array.isArray(course?.course_modules)
    ? (course!.course_modules as CourseModule[])
    : [];

  const modules: LearnModule[] = modulesRaw.map((mod, mIdx) => {
    const lessonsRaw: Lesson[] = Array.isArray(mod.course_module_lessons)
      ? (mod.course_module_lessons as Lesson[])
      : [];

    const lessons: LearnLesson[] = lessonsRaw.map((les, lIdx) => ({
      id: Number(les?.id ?? lIdx),
      title: String(les?.lesson_title ?? `Lesson ${lIdx + 1}`),
      duration: String(les?.duration ?? ""),
      description: String(les?.lesson_description ?? ""),
      videoUrl: String(les?.lesson_attachment_path ?? ""),
      completed: false,
      current: false,
    }));

    return {
      id: Number(mod?.id ?? mIdx),
      title: String(mod?.module_title ?? `Module ${mIdx + 1}`),
      progress: 0,
      lessons,
    };
  });

  return {
    id: Number(course?.id ?? enrolled?.id ?? 0),
    title: String(course?.title ?? ""),
    totalProgress: Number(enrolled?.progress_percentage ?? 0),
    modules,
  };
}