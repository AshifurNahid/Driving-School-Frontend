
import { useState } from 'react';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  current?: boolean;
  videoUrl: string;
  description: string;
}

interface Module {
  id: number;
  title: string;
  progress: number;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  totalProgress: number;
  modules: Module[];
}

export const useCourseManager = (courseId?: string) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  // Mock course data - in a real app, this would be fetched from an API
  const course: Course = {
    id: 1,
    title: "Complete Web Development Bootcamp",
    totalProgress: 35,
    modules: [
      {
        id: 1,
        title: "Getting Started",
        progress: 75,
        lessons: [
          {
            id: 1,
            title: "Welcome to the Course",
            duration: "5:30",
            completed: true,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Introduction to the course and what you'll learn"
          },
          {
            id: 2,
            title: "Setting Up Development Environment",
            duration: "15:20",
            completed: true,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Install necessary tools and setup your workspace"
          },
          {
            id: 3,
            title: "HTML Basics",
            duration: "20:45",
            completed: false,
            current: true,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Learn the fundamentals of HTML markup language"
          }
        ]
      },
      {
        id: 2,
        title: "JavaScript Essentials",
        progress: 0,
        lessons: [
          {
            id: 4,
            title: "Variables and Data Types",
            duration: "18:20",
            completed: false,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Understanding JavaScript variables and data types"
          },
          {
            id: 5,
            title: "Functions and Scope",
            duration: "22:15",
            completed: false,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            description: "Deep dive into JavaScript functions"
          }
        ]
      }
    ]
  };

  const currentLessonData = course.modules[currentModule]?.lessons[currentLesson];

  const toggleModuleExpansion = (moduleIndex: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleIndex) 
        ? prev.filter(i => i !== moduleIndex)
        : [...prev, moduleIndex]
    );
  };

  const selectLesson = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModule(moduleIndex);
    setCurrentLesson(lessonIndex);
  };

  const markAsComplete = () => {
    console.log('Marking lesson as complete');
    // In a real app, this would update the backend
  };

  const goToNextLesson = () => {
    const currentModuleLessons = course.modules[currentModule].lessons;
    if (currentLesson < currentModuleLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else if (currentModule < course.modules.length - 1) {
      setCurrentModule(currentModule + 1);
      setCurrentLesson(0);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    } else if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
      setCurrentLesson(course.modules[currentModule - 1].lessons.length - 1);
    }
  };

  const isPreviousDisabled = currentModule === 0 && currentLesson === 0;

  return {
    // Data
    course,
    currentLessonData,
    
    // State
    currentModule,
    currentLesson,
    expandedModules,
    
    // Actions
    toggleModuleExpansion,
    selectLesson,
    markAsComplete,
    goToNextLesson,
    goToPreviousLesson,
    
    // Computed values
    isPreviousDisabled
  };
};
