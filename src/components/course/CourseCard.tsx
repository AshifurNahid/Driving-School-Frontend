import { Star, Clock, ArrowRight } from 'lucide-react';
import { type Course } from '@/types/courses';
import { Link } from 'react-router-dom';

export const CourseCard = ({ course }: { course: Course }) => {
  // Helper function to get image URL
  const getImageUrl = (thumbnailPath: string | undefined) => {
    if (!thumbnailPath) return '/placeholder.svg';
    
    // If it's already a full URL, use it as-is
    if (thumbnailPath.startsWith('http')) {
      console.log(`CourseCard - Using full URL: ${thumbnailPath}`);
      return thumbnailPath;
    }
    
    // Clean the path - remove leading slash if present
    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath.substring(1) : thumbnailPath;
    
    // Construct the full URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dms-edu.runasp.net';
    const fullUrl = `${baseUrl}/${cleanPath}`;
    console.log(`CourseCard - Constructed URL: ${fullUrl} from path: ${thumbnailPath}`);
    return fullUrl;
  };

  const imageSrc = getImageUrl(course.thumbnail_photo_path);

  return (
    <Link
      to={`/course/${course.id}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950"
      aria-label={`View details for ${course.title}`}
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-cyan-900/60 dark:bg-gradient-to-b dark:from-[#0f1d32] dark:via-[#0b2341] dark:to-[#08192d] dark:shadow-xl dark:shadow-cyan-900/30 dark:hover:shadow-cyan-700/40">
        <div className="relative p-4">
          <div className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-[#0f2944] dark:ring-[#103a5c]/70">
            <img
              src={imageSrc}
              alt={course.title}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                console.error(`CourseCard - Failed to load image: ${imageSrc}`);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent dark:from-[#040b14]/70" />

          <div className="absolute left-6 top-6">
            <span className="rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-purple-500/25 dark:from-[#7f5cff] dark:to-[#c845ff] dark:shadow-[#7f5cff]/30">
              Online
            </span>
          </div>
          <div className="absolute right-6 top-6 rounded-full bg-white/80 px-3 py-1 text-slate-800 shadow-sm backdrop-blur dark:bg-[#0f2b45]/80 dark:text-amber-200 dark:border dark:border-cyan-500/30">
            <div className="flex items-center space-x-1 text-xs font-semibold text-amber-500 dark:text-amber-200">
              <Star className="h-3 w-3 fill-amber-500 dark:fill-amber-200" />
              <span className="text-xs font-semibold">{course.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-3 px-5 pb-6">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-200">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-[#103553] dark:text-cyan-200 dark:border dark:border-cyan-600/40">
              {course.category}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="h-4 w-4 text-blue-500 dark:text-cyan-200" />
              <span className="text-slate-700 dark:text-slate-100">{course.duration}</span>
            </span>
          </div>

          <h3 className="line-clamp-2 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-white dark:group-hover:text-cyan-100">
            {course.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-200/90">
            {course.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <div>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-cyan-200">
                ${course.price?.toFixed(2)}
              </span>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                {course.course_reviews?.length || 0} reviews
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-200/40 transition-all duration-300 group-hover:from-teal-400 group-hover:to-blue-400 dark:from-[#19c8c0] dark:to-[#0f8ed6] dark:shadow-[#0f8ed6]/40">
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}