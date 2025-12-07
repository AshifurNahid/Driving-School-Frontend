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
      <Card className="overflow-hidden border-0 bg-gradient-to-b from-white to-slate-50 text-slate-900 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.8)]">
        <CardHeader className="space-y-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 via-white to-emerald-50">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
              Lesson
            </Badge>
            {lesson.duration ? (
              <Badge variant="secondary" className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                {lesson.duration} mins
              </Badge>
            ) : null}
          </div>
          <CardTitle className="text-3xl font-semibold leading-tight text-slate-900">
            {lesson.lesson_title}
          </CardTitle>
          {lesson.lesson_description ? (
            <p className="text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {lesson.lesson_description}
            </p>
          ) : null}
        </CardHeader>
        {attachmentUrl && (
          <CardContent className="space-y-5 bg-slate-50">
            <Separator />
            <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
          </CardContent>
        )}
      </Card>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm">
        <p className="text-sm font-semibold">Tip:</p>
        <p className="text-sm leading-relaxed">
          Take notes as you move through the lesson and try implementing the ideas in your own project right away.
        </p>
      </div>
    </div>
  );
};
