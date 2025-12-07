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
      <Card className="overflow-hidden border-0 bg-white shadow-sm">
        <CardHeader className="space-y-4 border-b bg-gradient-to-br from-orange-50 to-white pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700 px-3 py-1">
              <FileText className="mr-1.5 h-3 w-3" />
              Lesson
            </Badge>
            {lesson.duration && (
              <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1">
                <Clock className="mr-1.5 h-3 w-3" />
                {lesson.duration} min
              </Badge>
            )}
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight text-slate-900">
            {lesson.lesson_title}
          </CardTitle>
          {lesson.lesson_description && (
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 whitespace-pre-line">
              {lesson.lesson_description}
            </p>
          )}
        </CardHeader>
        
        {attachmentUrl && (
          <CardContent className="p-3 sm:p-4 md:p-6 bg-slate-50">
            <div className="w-full max-w-4xl mx-auto">
              <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full bg-white rounded-lg shadow-inner overflow-hidden">
                <PdfCarouselViewer src={attachmentUrl} title={lesson.lesson_title} />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 flex-shrink-0">
            <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-orange-900">Pro Tip</h4>
            <p className="mt-1 text-sm text-orange-700">
              Take notes while learning and try to implement what you learn in your own projects!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};