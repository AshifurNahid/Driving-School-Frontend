import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpenCheck, Clock3 } from "lucide-react";
import { ExtendedLesson } from "@/types/userCourse";
import { PdfCarouselViewer } from "./PdfCarouselViewer";

interface LessonViewerProps {
  lesson?: ExtendedLesson;
  attachmentUrl?: string | null;
  moduleTitle?: string;
  courseTitle?: string;
}

export const LessonViewer = ({ lesson, attachmentUrl, moduleTitle, courseTitle }: LessonViewerProps) => {
  if (!lesson) return null;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border border-border/70 bg-card/90 text-card-foreground shadow-lg">
        <CardHeader className="space-y-4 bg-gradient-to-r from-background via-card to-background/80 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {courseTitle || "Course"}
              </p>
              <CardTitle className="text-2xl font-semibold leading-tight text-foreground">
                {lesson.lesson_title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {moduleTitle ? `${moduleTitle} • Lesson` : "Lesson"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                Lesson content
              </Badge>
              {lesson.duration ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Clock3 className="h-4 w-4" /> {lesson.duration} mins
                </span>
              ) : null}
            </div>
          </div>
          {lesson.lesson_description ? (
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {lesson.lesson_description}
            </p>
          ) : null}
          <div className="inline-flex items-center gap-2 rounded-xl bg-muted/70 px-3 py-2 text-xs text-muted-foreground">
            <BookOpenCheck className="h-4 w-4 text-primary" />
            <span>
              {courseTitle || "Course"} {'>'} {moduleTitle || "Section"} {'>'} {lesson.lesson_title}
            </span>
          </div>
        </CardHeader>
        {attachmentUrl && (
          <CardContent className="space-y-4 bg-muted/40">
            <Separator />
            <div className="rounded-2xl border border-border/60 bg-background/90 p-3 shadow-inner">
              <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
