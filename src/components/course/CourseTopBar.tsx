
import { Badge } from '@/components/ui/badge';

interface CourseTopBarProps {
  lessonTitle: string;
  moduleTitle: string;
  moduleIndex: number;
  totalProgress: number;
}

const CourseTopBar = ({ lessonTitle, moduleTitle, moduleIndex, totalProgress }: CourseTopBarProps) => {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{lessonTitle}</h1>
          <p className="text-sm text-muted-foreground">
            Module {moduleIndex + 1}: {moduleTitle}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline">{totalProgress}% Complete</Badge>
        </div>
      </div>
    </div>
  );
};

export default CourseTopBar;
