import LearnerCourseList from "@/components/course/LearnerCourseList";

interface CoursesSectionProps {
  activeCourses: any[];
  completedCourses: any[];
  loading: boolean;
  error: string | null;
}

const CoursesSection = ({ activeCourses, completedCourses, loading, error }: CoursesSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Continue Learning</h2>
        {loading ? (
          <div className="text-center py-8">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <LearnerCourseList courses={activeCourses} />
        )}
      </div>
      
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Completed Courses</h2>
          {loading ? (
            <div className="text-center py-8">Loading completed courses...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <LearnerCourseList courses={completedCourses} />
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesSection;
