import { Progress } from "@/components/ui/progress";

interface CourseLearnHeaderProps {
  title?: string;
  progress?: number;
  totalHours?: number;
  offlineHours?: number;
}

export const CourseLearnHeader = ({
  title,
  progress = 0,
  totalHours = 0,
  offlineHours = 0,
}: CourseLearnHeaderProps) => {
  const metricItem = (label: string, value: string) => (
    <div className="flex flex-col gap-1 rounded-lg bg-white/10 px-4 py-3 text-sm text-blue-50 shadow-sm">
      <span className="text-xs uppercase tracking-wide text-blue-100/90">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/80">Course</p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
            <p className="text-sm text-blue-100/90">Track your progress and keep up with both online and offline hours.</p>
          </div>
          <div className="flex flex-col items-end gap-2 rounded-xl bg-white/10 px-4 py-3 text-right shadow-sm">
            <span className="text-sm text-blue-100/90">Progress</span>
            <span className="text-3xl font-bold">{progress.toFixed(0)}%</span>
            <Progress value={progress} className="h-2 w-48 bg-white/25" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metricItem("Total Hours", `${totalHours ?? 0} hrs`)}
          {metricItem("Offline Hours", `${offlineHours ?? 0} hrs`)}
          {metricItem("Online Hours", `${Math.max((totalHours || 0) - (offlineHours || 0), 0)} hrs`)}
          {metricItem("Completion", `${progress.toFixed(1)}%`)}
        </div>
      </div>
    </header>
  );
};
