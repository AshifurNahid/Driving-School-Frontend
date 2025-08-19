import { Star, Clock } from 'lucide-react';
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
    <div className="bg-card dark:bg-[#23235b] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full min-h-[420px] text-card-foreground">
      <div className="relative p-3">
        <img 
          src={imageSrc}
          alt={course.title}
          className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 bg-white"
          onError={(e) => {
            console.error(`CourseCard - Failed to load image: ${imageSrc}`);
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-5 left-5">
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Popular
          </span>
        </div>
        <div className="absolute top-5 right-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full px-2 py-1">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
            <span className="text-xs font-medium">{course.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-gray-100 dark:bg-slate-700 text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
            {course.category}
          </span>
          <span className="text-muted-foreground dark:text-slate-300 text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {course.duration}
          </span>
        </div>
        <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-muted-foreground mb-3 line-clamp-7">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-red-600 dark:text-red-400">${course.price?.toFixed(2)}</span>
            <div className="text-xs text-muted-foreground">{course.course_reviews?.length || 0} reviews</div>
          </div>
          <Link to={`/course/${course.id}`}>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
              Enroll
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}