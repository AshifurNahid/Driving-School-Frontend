export interface CourseReview {
    id?: number;
    courseId?: number;
    reviewFromId?: number; // user id of reviewer
    rating: number;
    review: string;
    isVerifiedPurchase: true;
    status?: number;
    createdById?: number;
    updatedById?: number;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
  }