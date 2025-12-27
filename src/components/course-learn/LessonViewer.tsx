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
      <Card className="overflow-hidden border border-slate-200 bg-white dark:border-[#222832] dark:bg-[#1E2329]">
        <CardHeader className="space-y-4 border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white pb-6 dark:border-[#222832] dark:from-[#1A1D23] dark:via-[#12161C] dark:to-[#0F1419]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#FF7F50]/60 bg-[#FF7F50]/10 text-[#FF7F50] px-3 py-1 dark:bg-[#FF7F50]/15 dark:text-[#FFB4A2]"
            >
              <FileText className="mr-1.5 h-3 w-3" />
              Lesson
            </Badge>
            {lesson.duration && (
              <Badge variant="secondary" className="bg-slate-100 text-[#0F1419] border border-slate-200 px-3 py-1 dark:bg-[#0F1419] dark:text-[#4ECDC4] dark:border-[#2A3038]">
                <Clock className="mr-1.5 h-3 w-3" />
                {lesson.duration} min
              </Badge>
            )}
          </div>
          <CardTitle className="text-1xl sm:text-1xl font-bold leading-tight text-slate-900 dark:text-[#F8F9FA]">
            {lesson.lesson_title}
          </CardTitle>
        </CardHeader>

        {attachmentUrl && (
          <CardContent className="p-3 sm:p-4 md:p-6 bg-white dark:bg-[#0F1419]">
            <div className="w-full max-w-4xl mx-auto">
              <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full bg-white dark:bg-[#1E2329] rounded-lg overflow-hidden border border-slate-200 dark:border-[#222832]">
                <PdfCarouselViewer src={attachmentUrl} title=""/>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

     
    </div>
  );
};
