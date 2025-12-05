import { Course, CourseModule, Lesson, Quiz, QuizQuestion } from "@/types/courses";

export interface ApiStatus {
  code?: string;
  message?: string;
}

export interface UserCourseResponse {
  id?: number;
  user_id?: number;
  course_id?: number;
  progress_percentage?: number;
  completion_date?: string;
  certificate_attachment?: string;
  certificate_issue_date?: string;
  status?: number;
  created_by_id?: number;
  updated_by_id?: number;
  created_at?: string;
  updated_at?: string;
  totalOfflineHours?: number;
  consumedOfflineHours?: number;
  remainingOfflineHours?: number;
  course?: ExtendedCourse;
}

export interface UserCourseApiResponse {
  status?: ApiStatus;
  data?: UserCourseResponse;
}

export interface ExtendedCourse extends Course {
  total_duration_hours?: number;
  offline_training_hours?: number;
  course_modules?: ExtendedCourseModule[];
}

export interface ExtendedCourseModule extends CourseModule {
  course_module_lessons?: ExtendedLesson[];
  quizzes?: ExtendedQuiz[];
}

export interface ExtendedLesson extends Lesson {
  lesson_attachment_path?: string;
}

export interface ExtendedQuiz extends Quiz {
  questions?: QuizQuestion[];
}
