export interface UserRole {
  id: number;
  title: string;
}

export interface UserDetail {
  id: number;
  user_id: number;
  image_path: string | null;
  date_of_birth?: string | null;
  street_address?: string | null;
  street_address_two?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  parent_email?: string | null;
  parent_phone_number?: string | null;
  learners_permit_issue_date?: string | null;
  has_foreign_driving_license?: boolean;
  driving_experience?: string | null;
  status: number;
  // Legacy fields kept for backwards compatibility with older payloads
  address_line_one?: string | null;
  address_line_two?: string | null;
  emergency_contact_email?: string | null;
  emergency_contact_phone?: string | null;
  emergency_contact_person?: string | null;
  nationality?: string | null;
}

export interface User {
  last_name: string;
  first_name: string;
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  status: number;
  role: UserRole;
  user_detail: UserDetail;
}

export interface UserCourse {
  id: number;
  user_id: number;
  course_id: number;
  progress_percentage: number;
  completion_date: string | null;
  certificate_attachment: string | null;
  certificate_issue_date: string | null;
  status: number;
  created_by_id: number;
  updated_by_id: number;
  created_at: string;
  updated_at: string;
  course: {
    id: number;
    title: string;
    description: string;
    content: string;
    category: string;
    price: number;
    duration: number;
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
    course_modules: any[];
  };
}

export interface UserCourseApiResponse {
  status: {
    code: string;
    message: string;
  };
  data: UserCourse[];
}

export interface LearnerCourseCard {
  id: number;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  completed?: boolean;
}
