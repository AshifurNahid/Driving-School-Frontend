export type CourseReview = {
  id?: number;
  course_id?: number;
  review_from_id?: number;
  rating?: number;
  review?: string;
  is_verified_purchase?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type QuizQuestionOption = {
  key?: string;
  value?: string;
  label?: string;
};

export type QuizQuestion = {
  id?: number;
  quiz_id?: number;
  question?: string;
  type?: number;
  options?: string | (string | QuizQuestionOption)[];
  correct_answers?: string;
  correct_answer_keys?: string | string[] | null;
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
  course_module_lessons?: Lesson[];
  quizzes?: Quiz[];
  duration?: number;
};
export type CourseMaterial = {
  id?: number;
  title?: string;
  file_path?: string;
};
export type Course = {
  id?: number;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  price?: number;
  duration?: number;
  region_id?:number;
  offline_training_hours?:number;
  level?: string;
  language?: string;
  course_type?: number;
  prerequisites?: string;
  thumbnail_photo_path?: string;
  status?: number;
  created_at?: string;
  course_modules?: CourseModule[];
  course_reviews?: CourseReview[];
  rating?: number;
  total_reviews?: number;
  total_number_of_quizzes?:number;
  total_no_of_quizzes?:number;
  course_materials?: CourseMaterial[];
};


export type EnrolledCourses={
  id?:number;
  user_id?:number;
  course_id?:number;
  progress_percentage?:number;
  completion_date?:string;
  certificate_attachment?:string;
  certificate_issue_date?:string;
  status?:number;
  created_by_id?:number;
  updated_by_id?:number;
  
  created_at?:string;
  updated_at?:string;
  course?:Course;
}