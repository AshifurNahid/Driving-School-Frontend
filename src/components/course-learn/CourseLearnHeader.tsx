import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseLearnHeaderProps {
  title?: string;
  progress?: number;
  totalHours?: number;
  offlineHours?: number;
}

const metricItem = (label: string, value: string) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold text-foreground">{value}</span>
  </div>
);

export const CourseLearnHeader = ({
  title,
  progress = 0,
  totalHours = 0,
  offlineHours = 0,
}: CourseLearnHeaderProps) => {
  return (
    <header className={cn(
      "sticky top-0 z-30 w-full border-b bg-background/90 backdrop-blur",
      "px-4 sm:px-8 py-4 flex flex-col gap-3"
    )}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Course</p>
          <h1 className="truncate text-2xl font-semibold text-foreground">{title}</h1>
        </div>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">Progress</span>
          <div className="text-2xl font-bold text-primary">{progress.toFixed(0)}%</div>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metricItem("Total Hours", `${totalHours ?? 0} hrs`)}
        {metricItem("Offline Hours", `${offlineHours ?? 0} hrs`)}
        {metricItem("Online Hours", `${Math.max((totalHours || 0) - (offlineHours || 0), 0)} hrs`)}
        {metricItem("Completion", `${progress.toFixed(1)}%`)}
      </div>
    </header>
  );
};
