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

  const course = data?.course;
  const modules = course?.course_modules || [];

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
            <ModuleSidebar
              modules={modules}
              expanded={expanded}
              onToggle={toggleModule}
              onSelectLesson={selectLesson}
              onSelectQuiz={selectQuiz}
              activeLessonId={selection?.lessonId}
              activeQuizId={selection?.quizId}
            />

            <section className="space-y-6">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {selection?.lessonId ? "Active Lesson" : "Active Quiz"}
                    </p>
                    <h2 className="text-xl font-semibold text-foreground">
                      {activeLesson?.lesson_title || activeQuiz?.title || "Select content"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{modules.length} modules</span>
                    <Separator orientation="vertical" className="h-6" />
                    <span>{course.total_number_of_quizzes || course.total_no_of_quizzes || 0} quizzes</span>
                  </div>
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
                    Use the module navigation on the left to open lessons and quizzes.
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
