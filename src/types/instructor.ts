export interface Instructor {
    id?: number;
    instructorName: string;
    description?: string;
    courseId?: number; // ID of the course this instructor is associated with
    createdById?: number;
    updatedById?: number;
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
  }