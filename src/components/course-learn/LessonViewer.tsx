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
      <Card className="overflow-hidden border border-[#222832] bg-[#1E2329] shadow-xl shadow-black/30">
        <CardHeader className="space-y-4 border-b border-[#222832] bg-gradient-to-br from-[#1A1D23] via-[#12161C] to-[#0F1419] pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-[#FF7F50]/60 bg-[#FF7F50]/15 text-[#FFB4A2] px-3 py-1"
            >
              <FileText className="mr-1.5 h-3 w-3" />
              Lesson
            </Badge>
            {lesson.duration && (
              <Badge variant="secondary" className="bg-[#0F1419] text-[#4ECDC4] border border-[#2A3038] px-3 py-1">
                <Clock className="mr-1.5 h-3 w-3" />
                {lesson.duration} min
              </Badge>
            )}
          </div>
          <CardTitle className="text-1xl sm:text-1xl font-bold leading-tight text-[#F8F9FA]">
            {lesson.lesson_title}
          </CardTitle>
        </CardHeader>

        {attachmentUrl && (
          <CardContent className="p-3 sm:p-4 md:p-6 bg-[#0F1419]">
            <div className="w-full max-w-4xl mx-auto">
              <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full bg-[#1E2329] rounded-lg shadow-inner overflow-hidden border border-[#222832]">
                <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

     
    </div>
  );
};
