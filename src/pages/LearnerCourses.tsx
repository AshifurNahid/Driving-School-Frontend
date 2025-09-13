
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCourses } from "@/redux/actions/userCourseAction";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import LearnerCourseList from "@/components/course/LearnerCourseList";
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';

const LearnerCourses = () => {
  const dispatch = useDispatch();
  const { userInfo } = useAuth();
  const userId = userInfo?.id;
  const { courses, loading, error } = useSelector((state: RootState) => state.userCourseList);

  useEffect(() => {
    if (userId) {
      dispatch(getUserCourses(userId) as any);
    }
    
  }, [dispatch, userId]);

  // Map API data to LearnerCourseList props
  const mappedCourses = courses.map((uc: any) => ({
    user_course: uc?.id,
    id: uc.course?.id,
    title: uc.course?.title,
    instructor: uc.course?.instructor || "Instructor", // fallback if not present
    thumbnail: uc.course?.thumbnail_photo_path,
    progress: uc.progress_percentage,
    totalLessons: uc.course?.course_modules?.reduce((sum: number, m: any) => sum + (m.course_module_lessons?.length || 0), 0) || 0,
    completedLessons: Math.round((uc.progress_percentage / 100) * (
      uc.course?.course_modules?.reduce((sum: number, m: any) => sum + (m.course_module_lessons?.length || 0), 0) || 0
    )),
    lastAccessed: uc.updated_at,
    completed: uc.progress_percentage === 100,
  }));
console.log("Mapped Courses: ", mappedCourses);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-2">Continue your learning journey</p>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <LearnerCourseList courses={mappedCourses} />
        )}
      </div>
    </div>
  );
};

export default LearnerCourses;
