import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <Card className="overflow-hidden border border-gray-200 bg-white text-card-foreground shadow-sm">
        <div className="relative flex items-center justify-center bg-slate-900">
          <div className="aspect-video w-full bg-gradient-to-b from-slate-800 via-slate-900 to-black opacity-90" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur">
              <Play className="h-8 w-8" />
            </div>
            <p className="text-sm text-slate-200">Lesson preview placeholder</p>
          </div>
        </div>

        <CardHeader className="space-y-3 bg-gradient-to-r from-slate-50 via-white to-slate-50">
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

        <CardContent className="space-y-6 bg-white">
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-lg" variant="default" size="sm">
              Mark as complete
            </Button>
            <Button className="rounded-lg" variant="outline" size="sm">
              Next lesson
            </Button>
          </div>

          {attachmentUrl && (
            <div className="rounded-xl border bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>Attached resources</span>
                <span className="text-xs font-medium text-foreground">PDF</span>
              </div>
              <Separator />
              <div className="mt-3">
                <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
