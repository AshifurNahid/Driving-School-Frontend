export type CourseReview = {
  course_id?: number;
  review_from_id?: number;
  rating?: number;
  review?: string;
  is_verified_purchase?: boolean;
};

export type QuizQuestion = {
  id?: number;
  quiz_id?: number;
  question?: string;
  type?: number;
  options?: string;
  correct_answers?: string;
  points?: number;
  order_index?: number;
  status?: number;
};

export type Quiz = {
  id?: number;
  course_module_id?: number;
  title?: string;
  description?: string;
  passing_score?: number;
  max_attempts?: number;
  status?: number;
  questions?: QuizQuestion[];
};

export type Lesson = {
  id?: number;
  course_module_id?: number;
  lesson_title?: string;
  lesson_description?: string;
  lesson_attachment_path?: string;
  duration?: number;
  sequence?: number;
  status?: number;
};

export type CourseModule = {
  id?: number;
  course_id?: number;
  module_title?: string;
  module_description?: string;
  sequence?: number;
  status?: number;
  course_module_lesones?: Lesson[];
  quizzes?: Quiz[];
};

export type Course = {
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  price?: number;
  duration?: number;
  level?: string;
  language?: string;
  course_type?: number;
  prerequisites?: string;
  thumbnail_photo_path?: string;
  status?: number;
  created_at?: string;
  course_modules?: CourseModule[];
  course_reviews?: CourseReview[];
};