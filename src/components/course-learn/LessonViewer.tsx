import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ExtendedLesson } from "@/types/userCourse";
import { PdfCanvasViewer } from "./PdfCanvasViewer";

interface LessonViewerProps {
  lesson?: ExtendedLesson;
  attachmentUrl?: string | null;
}

export const LessonViewer = ({ lesson, attachmentUrl }: LessonViewerProps) => {
  if (!lesson) return null;

  return (
    <div className="space-y-4">
      <Card className="border bg-card text-card-foreground shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">Lesson</Badge>
            {lesson.duration ? (
              <Badge variant="secondary">{lesson.duration} mins</Badge>
            ) : null}
          </div>
          <CardTitle className="text-xl font-semibold text-foreground">
            {lesson.lesson_title}
          </CardTitle>
          {lesson.lesson_description ? (
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
              {lesson.lesson_description}
            </p>
          ) : null}
      </CardHeader>
      {attachmentUrl && (
        <CardContent className="space-y-3">
          <Separator />
          <PdfCanvasViewer src={attachmentUrl} title={lesson.lesson_title} />
        </CardContent>
      )}
    </Card>
  </div>
);
};
