import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CourseNavigationSidebar from "@/components/course/CourseNavigationSidebar";
import CourseTopBar from "@/components/course/CourseTopBar";
import VideoPlayerSection from "@/components/course/VideoPlayerSection";
import LessonContent from "@/components/course/LessonContent";
import RightSidebar from "@/components/course/RightSidebar";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { getUserCourseById } from "@/redux/actions/userCourseAction";
import { RootState, AppDispatch } from "@/redux/store";
import { LearnCourse, mapEnrolledToLearnCourse } from "@/utils/learnMapper";

const CourseLearn = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, userCourse } = useSelector(
    (state: RootState) => state.userCourseDetails
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([]);
  const [currentModule, setCurrentModule] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    if (id) {
      const numericId = Number(id);
      if (!Number.isNaN(numericId)) {
        dispatch(getUserCourseById(numericId));
      }
    }
  }, [dispatch, id]);

  const course: LearnCourse | undefined = useMemo(() => {
    if (!userCourse) return undefined;
    return mapEnrolledToLearnCourse(userCourse);
  }, [userCourse]);

  useEffect(() => {
    if (course) {
      setCurrentModule(0);
      setCurrentLesson(0);
      setExpandedModules([0]);
    }
  }, [course]);

  const toggleModuleExpansion = (index: number) => {
    setExpandedModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  const currentModuleObj = course?.modules[currentModule];
  const currentLessonData = currentModuleObj?.lessons[currentLesson];

  const goToNextLesson = () => {
    if (!course || !currentModuleObj) return;
    const nextLesson = currentLesson + 1;
    if (nextLesson < currentModuleObj.lessons.length) {
      setCurrentLesson(nextLesson);
    } else {
      const nextModule = currentModule + 1;
      if (nextModule < course.modules.length) {
        setCurrentModule(nextModule);
        setCurrentLesson(0);
      }
    }
  };

  const goToPreviousLesson = () => {
    if (!course || !currentModuleObj) return;
    const prevLesson = currentLesson - 1;
    if (prevLesson >= 0) {
      setCurrentLesson(prevLesson);
    } else if (currentModule > 0) {
      const prevModuleIndex = currentModule - 1;
      const prevModule = course.modules[prevModuleIndex];
      setCurrentModule(prevModuleIndex);
      setCurrentLesson(Math.max(prevModule.lessons.length - 1, 0));
    }
  };

  const isPreviousDisabled = !course || (currentModule === 0 && currentLesson === 0);
  const markAsComplete = () => {
    // TODO: integrate completion API if available
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedNavigation currentPath="/course/learn" />
        <div className="p-6">Loading course...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedNavigation currentPath="/course/learn" />
        <div className="p-6 text-red-600">Failed to load course: {error}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <RoleBasedNavigation currentPath="/course/learn" />
        <div className="p-6">No course found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation currentPath="/course/learn" />
      <div className="flex">
        <CourseNavigationSidebar
          course={course}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          expandedModules={expandedModules}
          toggleModuleExpansion={toggleModuleExpansion}
          selectLesson={selectLesson}
          currentModule={currentModule}
          currentLesson={currentLesson}
        />
        <div className="flex-1 flex flex-col">
          <CourseTopBar
            lessonTitle={currentLessonData?.title || ""}
            moduleTitle={course.modules[currentModule]?.title || ""}
            moduleIndex={currentModule}
            totalProgress={course.totalProgress}
          />
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            <div className="lg:col-span-3 space-y-6">
              <VideoPlayerSection videoUrl={currentLessonData?.videoUrl} />
              <LessonContent
                title={currentLessonData?.title || ""}
                duration={String(currentLessonData?.duration || "")}
                description={currentLessonData?.description || ""}
                onPrevious={goToPreviousLesson}
                onNext={goToNextLesson}
                onMarkComplete={markAsComplete}
                isPreviousDisabled={isPreviousDisabled}
              />
            </div>
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;