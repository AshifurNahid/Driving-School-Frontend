import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { CourseLearnHeader } from "@/components/course-learn/CourseLearnHeader";
import { ModuleSidebar } from "@/components/course-learn/ModuleSidebar";
import { LessonViewer } from "@/components/course-learn/LessonViewer";
import { QuizViewer } from "@/components/course-learn/QuizViewer";
import { CourseLearnSkeleton } from "@/components/course-learn/CourseLearnSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useUserCourse } from "@/hooks/useUserCourse";
import {
  LearningSelection,
  findInitialSelection,
  findLessonById,
  findQuizById,
  resolveAttachmentUrl,
} from "@/utils/courseLearn";
import { ExtendedCourseModule } from "@/types/userCourse";

const CourseLearn = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useUserCourse(id);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [selection, setSelection] = useState<LearningSelection | null>(null);
  const [isContentOpen, setIsContentOpen] = useState(false);

  const course = data?.course;
  const modules = course?.course_modules || [];
  const totalLessons = useMemo(
    () => modules.reduce((sum, mod) => sum + (mod.course_module_lessons?.length || 0), 0),
    [modules]
  );
  const totalQuizzes = useMemo(
    () => modules.reduce((sum, mod) => sum + (mod.quizzes?.length || 0), 0),
    [modules]
  );

  useEffect(() => {
    if (modules.length) {
      const initial = findInitialSelection(modules);
      setSelection(initial);
      const allOpen: Record<number, boolean> = {};
      modules.forEach((mod) => {
        if (mod.id) allOpen[mod.id] = true;
      });
      setExpanded(allOpen);
    }
  }, [modules]);

  const toggleModule = (moduleId: number) => {
    setExpanded((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const selectLesson = (moduleId: number, lessonId: number) => {
    setSelection({ moduleId, lessonId, quizId: undefined });
  };

  const selectQuiz = (moduleId: number, quizId: number) => {
    setSelection({ moduleId, quizId, lessonId: undefined });
  };

  const activeLesson = useMemo(
    () => findLessonById(modules, selection?.moduleId, selection?.lessonId),
    [modules, selection]
  );

  const activeQuiz = useMemo(
    () => findQuizById(modules, selection?.moduleId, selection?.quizId),
    [modules, selection]
  );

  const activeModule = useMemo(
    () => modules.find((mod) => mod.id === selection?.moduleId),
    [modules, selection?.moduleId]
  );

  const totalHours = useMemo(() => {
    if (course?.total_duration_hours) return course.total_duration_hours;
    if (course?.duration) return course.duration;
    if (modules?.length) {
      return modules.reduce(
        (sum: number, mod: ExtendedCourseModule) => sum + Number(mod.duration || 0),
        0
      );
    }
    return 0;
  }, [course, modules]);

  const attachmentUrl = resolveAttachmentUrl(activeLesson?.lesson_attachment_path);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RoleBasedNavigation currentPath={`/course/${id}/learn`} />
      <CourseLearnHeader
        title={course?.title || "Course"}
        progress={data?.progress_percentage || 0}
        totalHours={Number(totalHours || 0)}
        offlineHours={Number(course?.offline_training_hours || 0)}
      />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-8">
        {isLoading && <CourseLearnSkeleton />}

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Unable to load course</AlertTitle>
            <AlertDescription>{error?.message || "Please try again later."}</AlertDescription>
            <div className="mt-4">
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </Alert>
        )}

        {!isLoading && !isError && !course && (
          <Alert>
            <AlertTitle>No course found</AlertTitle>
            <AlertDescription>
              We couldn't locate this enrollment. Please return to your dashboard and try again.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && course && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
            <div className="hidden lg:block">
              <ModuleSidebar
                courseTitle={course.title}
                progressPercentage={data?.progress_percentage}
                totalLessons={totalLessons}
                totalQuizzes={totalQuizzes}
                modules={modules}
                expanded={expanded}
                onToggle={toggleModule}
                onSelectLesson={selectLesson}
                onSelectQuiz={selectQuiz}
                activeLessonId={selection?.lessonId}
                activeQuizId={selection?.quizId}
              />
            </div>

            <section className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-2">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="text-muted-foreground">Course</BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem className="text-muted-foreground">
                        {activeModule?.module_title || "Section"}
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem className="font-semibold text-foreground">
                        {activeLesson?.lesson_title || activeQuiz?.title || "Choose content"}
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {selection?.lessonId ? "Active Lesson" : selection?.quizId ? "Active Quiz" : "Learning"}
                    </p>
                    <h2 className="text-2xl font-semibold leading-tight text-foreground">
                      {activeLesson?.lesson_title || activeQuiz?.title || "Select content to get started"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeModule?.module_title ? `Section: ${activeModule.module_title}` : "Pick a section from the course content"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{modules.length} sections</span>
                    <Separator orientation="vertical" className="h-6" />
                    <span>{totalLessons} lessons</span>
                    <Separator orientation="vertical" className="h-6" />
                    <span>{totalQuizzes} quizzes</span>
                  </div>
                  <Sheet open={isContentOpen} onOpenChange={setIsContentOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        Course content
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-md p-0">
                      <div className="h-full overflow-y-auto bg-muted/50 p-4">
                        <ModuleSidebar
                          courseTitle={course.title}
                          progressPercentage={data?.progress_percentage}
                          totalLessons={totalLessons}
                          totalQuizzes={totalQuizzes}
                          modules={modules}
                          expanded={expanded}
                          onToggle={toggleModule}
                          onSelectLesson={(moduleId, lessonId) => {
                            selectLesson(moduleId, lessonId);
                            setIsContentOpen(false);
                          }}
                          onSelectQuiz={(moduleId, quizId) => {
                            selectQuiz(moduleId, quizId);
                            setIsContentOpen(false);
                          }}
                          activeLessonId={selection?.lessonId}
                          activeQuizId={selection?.quizId}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {activeLesson && (
                <LessonViewer lesson={activeLesson} attachmentUrl={attachmentUrl} />
              )}

              {activeQuiz && <QuizViewer quiz={activeQuiz} />}

              {!activeLesson && !activeQuiz && (
                <Alert>
                  <AlertTitle>Select a lesson or quiz</AlertTitle>
                  <AlertDescription>
                    Use the course content navigation to open lessons and quizzes.
                  </AlertDescription>
                </Alert>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseLearn;
