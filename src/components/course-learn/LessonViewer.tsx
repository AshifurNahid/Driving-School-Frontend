import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExtendedLesson } from "@/types/userCourse";
import { PdfCarouselViewer } from "./PdfCarouselViewer";

interface LessonViewerProps {
  lesson?: ExtendedLesson;
  attachmentUrl?: string | null;
}

export const LessonViewer = ({ lesson, attachmentUrl }: LessonViewerProps) => {
  if (!lesson) return null;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border bg-card/90 text-card-foreground shadow-sm">
        <CardHeader className="space-y-3 bg-gradient-to-r from-background via-card to-background">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
              Lesson
            </Badge>
            {lesson.duration ? (
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                {lesson.duration} mins
              </Badge>
            ) : null}
          </div>
          <CardTitle className="text-2xl font-semibold leading-tight text-foreground">
            {lesson.lesson_title}
          </CardTitle>
          {lesson.lesson_description ? (
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {lesson.lesson_description}
            </p>
          ) : null}
        </CardHeader>
        {attachmentUrl && (
          <CardContent className="space-y-3 bg-muted/40">
            <Separator />
            <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
          </CardContent>
        )}
      </Card>
    </div>
  );
};
