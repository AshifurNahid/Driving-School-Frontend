export type Course = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  thumbnail_photo_path: string;
  rating?:number | 5
};

