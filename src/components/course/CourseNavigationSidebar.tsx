
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight,
  ChevronLeft,
  Check, 
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface CourseNavigationSidebarProps {
  course: Course;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  expandedModules: number[];
  toggleModuleExpansion: (moduleIndex: number) => void;
  selectLesson: (moduleIndex: number, lessonIndex: number) => void;
  currentModule: number;
  currentLesson: number;
}

const CourseNavigationSidebar = ({
  course,
  sidebarCollapsed,
  setSidebarCollapsed,
  expandedModules,
  toggleModuleExpansion,
  selectLesson,
  currentModule,
  currentLesson
}: CourseNavigationSidebarProps) => {
  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className={sidebarCollapsed ? 'w-full' : ''}>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Back to Dashboard</span>}
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {!sidebarCollapsed && (
          <>
            <h2 className="font-semibold text-lg mt-4 mb-2">{course?.title}</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{course?.totalProgress}%</span>
              </div>
              <Progress value={course?.totalProgress} className="h-2" />
            </div>
          </>
        )}
      </div>

      {/* Course Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {course?.modules.map((module, moduleIndex) => (
          <Collapsible
            key={module.id}
            open={expandedModules.includes(moduleIndex)}
            onOpenChange={() => toggleModuleExpansion(moduleIndex)}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className={`w-full justify-between p-3 h-auto ${sidebarCollapsed ? 'px-2' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedModules.includes(moduleIndex) ? 'rotate-90' : ''}`} />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="text-left">
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="text-xs text-muted-foreground">{module.progress}% complete</div>
                    </div>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <Badge variant="outline" className="text-xs">
                    {module.lessons.length}
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className={sidebarCollapsed ? 'hidden' : 'space-y-1 ml-4'}>
              {module.lessons.map((lesson, lessonIndex) => (
                <Button
                  key={lesson.id}
                  variant="ghost"
                  className={`w-full justify-start p-3 h-auto text-left ${
                    currentModule === moduleIndex && currentLesson === lessonIndex 
                      ? 'bg-primary/10 border border-primary/20' 
                      : ''
                  }`}
                  onClick={() => selectLesson(moduleIndex, lessonIndex)}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex-shrink-0">
                      {lesson.completed ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : lesson.current ? (
                        <Play className="h-4 w-4 text-primary" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground">{lesson.duration}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default CourseNavigationSidebar;
