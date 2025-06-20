
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseManager } from '@/hooks/useCourseManager';
import CourseNavigationSidebar from '@/components/course/CourseNavigationSidebar';
import CourseTopBar from '@/components/course/CourseTopBar';
import VideoPlayerSection from '@/components/course/VideoPlayerSection';
import LessonContent from '@/components/course/LessonContent';
import RightSidebar from '@/components/course/RightSidebar';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';

const CourseLearn = () => {
  const { id } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    course,
    currentLessonData,
    currentModule,
    currentLesson,
    expandedModules,
    toggleModuleExpansion,
    selectLesson,
    markAsComplete,
    goToNextLesson,
    goToPreviousLesson,
    isPreviousDisabled
  } = useCourseManager(id);

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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <CourseTopBar
            lessonTitle={currentLessonData?.title || ''}
            moduleTitle={course.modules[currentModule]?.title || ''}
            moduleIndex={currentModule}
            totalProgress={course.totalProgress}
          />

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
            {/* Video Player and Content */}
            <div className="lg:col-span-3 space-y-6">
              <VideoPlayerSection videoUrl={currentLessonData?.videoUrl} />
              
              <LessonContent
                title={currentLessonData?.title || ''}
                duration={currentLessonData?.duration || ''}
                description={currentLessonData?.description || ''}
                onPrevious={goToPreviousLesson}
                onNext={goToNextLesson}
                onMarkComplete={markAsComplete}
                isPreviousDisabled={isPreviousDisabled}
              />
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearn;
