import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtendedLesson } from "@/types/userCourse";
import { PdfCarouselViewer } from "./PdfCarouselViewer";
import { Clock, FileText } from "lucide-react";

interface LessonViewerProps {
  lesson?: ExtendedLesson;
  attachmentUrl?: string | null;
}

export const LessonViewer = ({ lesson, attachmentUrl }: LessonViewerProps) => {
  if (!lesson) return null;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-0 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:shadow-lg/10">
        <CardHeader className="space-y-4 border-b bg-gradient-to-br from-orange-50 to-white pb-6 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-orange-200 bg-orange-50 text-orange-700 px-3 py-1 dark:border-orange-500/40 dark:bg-orange-500/10 dark:text-orange-200"
            >
              <FileText className="mr-1.5 h-3 w-3" />
              Lesson
            </Badge>
            {lesson.duration && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1 dark:bg-slate-800 dark:text-slate-200">
                <Clock className="mr-1.5 h-3 w-3" />
                {lesson.duration} min
              </Badge>
            )}
          </div>
          <CardTitle className="text-1xl sm:text-1xl font-bold leading-tight text-slate-900 dark:text-white">
            {lesson.lesson_title}
          </CardTitle>
        </CardHeader>

        {attachmentUrl && (
          <CardContent className="p-3 sm:p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
            <div className="w-full max-w-4xl mx-auto">
              <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full bg-white dark:bg-slate-900 rounded-lg shadow-inner overflow-hidden border border-transparent dark:border-slate-800">
                <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

     
    </div>
  );
};