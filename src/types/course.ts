
export interface CourseModule {
  id: number;
  course_id: number;
  module_title: string;
  module_description: string;
  sequence: number;
  status: number;
  course_module_lessons: CourseModuleLesson[];
  quizzes: Quiz[];
}

export interface CourseModuleLesson {
  id: number;
  course_module_id: number;
  lesson_title: string;
  lesson_description: string | null;
  lesson_attachment_path: string;
  duration: number;
  sequence: number;
  status: number;
}

export interface Quiz {
  id: number;
  course_module_id: number;
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  status: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  type: number;
  options: string;
  correct_answers: string;
  points: number;
  order_index: number;
  status: number;
}

export interface CourseReview {
  id: number;
  course_id: number;
  review_from_id: number;
  review_from_name: string;
  review_from_image_path: string | null;
  rating: number;
  review: string;
  is_verified_purchase: boolean;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface CourseMaterial {
  id: number;
  course_id: number;
  title: string;
  file_path: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  price: number;
  duration: number | null;
  region_id: number;
  region_name: string | null;
  level: string;
  language: string;
  course_type: number;
  prerequisites: string;
  thumbnail_photo_path: string;
  status: number;
  created_at: string;
  total_no_of_quizzes: number;
  total_reviews: number;
  rating: number;
  course_modules: CourseModule[];
  course_reviews: CourseReview[];
  course_materials: CourseMaterial[];
}

// Legacy type for backward compatibility
export type LegacyCourse = {
  id: string | number;
  title: string;
  thumbnail: string;
  instructor: string;
  rating: number;
  price: number;
  category: string;
  enrollments: number;
  duration?: string;
  description?: string;
  featured?: boolean;
};
