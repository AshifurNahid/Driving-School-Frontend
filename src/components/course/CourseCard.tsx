import { Star, Clock } from 'lucide-react';
import { type Course } from '@/types/courses';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const CourseCard = ({ course }: { course: Course }) => {
  const getImageUrl = (thumbnailPath: string | undefined) => {
    if (!thumbnailPath) return '/placeholder.svg';
    if (thumbnailPath.startsWith('http')) return thumbnailPath;

    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath.substring(1) : thumbnailPath;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dms-edu.runasp.net';
    return `${baseUrl}/${cleanPath}`;
  };

  const imageSrc = getImageUrl(course.thumbnail_photo_path);
  const rating = course.rating ?? 0;
  const reviewCount = course.course_reviews?.length || 0;

  return (
    <Link to={`/course/${course.id}`} className="block h-full">
      <div className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative h-52 overflow-hidden">
          <img
            src={imageSrc}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-xs text-white">
            <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-sm">
              {course.category || 'Course'}
            </Badge>
            <div className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 backdrop-blur">
              <Star className="h-3.5 w-3.5 text-yellow-400" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
              <span className="text-[11px] text-white/80">({reviewCount})</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 backdrop-blur">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration ? `${course.duration} hrs` : 'Self-paced'}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="text-lg font-semibold leading-tight text-card-foreground transition-colors duration-200 group-hover:text-blue-600">
            {course.title}
          </h3>
          <div className="prose prose-sm max-w-none text-muted-foreground line-clamp-3 dark:prose-invert">
            <div
              className="line-clamp-3"
              dangerouslySetInnerHTML={{ __html: course.description || '' }}
            />
          </div>
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-red-600 dark:text-red-400">${course.price?.toFixed(2) || '0.00'}</span>
              <span className="text-xs text-muted-foreground">{reviewCount} reviews</span>
            </div>
            <span className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-blue-700">
              View Course
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
