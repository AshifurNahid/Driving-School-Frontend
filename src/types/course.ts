
export type Course = {
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


