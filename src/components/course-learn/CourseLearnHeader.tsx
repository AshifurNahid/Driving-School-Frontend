import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseLearnHeaderProps {
  title?: string;
  progress?: number;
  totalHours?: number;
  offlineHours?: number;
  modulesCount?: number;
  lessonsCount?: number;
  quizzesCount?: number;
}

const metricItem = (label: string, value: string) => (
  <div className="flex flex-col gap-1 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.55)]">
    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
    <span className="text-lg font-semibold text-slate-800">{value}</span>
  </div>
);

export const CourseLearnHeader = ({
  title,
  progress = 0,
  totalHours = 0,
  offlineHours = 0,
  modulesCount = 0,
  lessonsCount = 0,
  quizzesCount = 0,
}: CourseLearnHeaderProps) => {
  return (
    <header className={cn("mb-6 w-full") }>
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 px-5 py-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.75)] sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Course Progress
            </p>
            <h1 className="truncate text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
            <p className="text-sm text-slate-600">Keep moving forward—complete each lesson to unlock the next milestone.</p>
          </div>
          <div className="min-w-[200px] rounded-xl bg-slate-900 px-5 py-4 text-right text-slate-50 shadow-lg shadow-slate-900/25">
            <span className="text-xs uppercase tracking-[0.14em] text-slate-300">Progress</span>
            <div className="text-3xl font-bold leading-tight">{progress.toFixed(0)}%</div>
            <p className="text-[13px] text-slate-300">Total hours: {totalHours ?? 0} hrs</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Progress
            value={progress}
            className="h-3 overflow-hidden rounded-full bg-slate-200"
            indicatorClassName="bg-gradient-to-r from-emerald-400 via-amber-300 to-orange-400"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {metricItem("Sections", `${modulesCount}`)}
            {metricItem("Lessons", `${lessonsCount}`)}
            {metricItem("Quizzes", `${quizzesCount}`)}
            {metricItem("Total Hours", `${totalHours ?? 0} hrs`)}
            {metricItem("Offline Hours", `${offlineHours ?? 0} hrs`)}
            {metricItem("Completion", `${progress.toFixed(1)}%`)}
          </div>
        </div>
      </div>
    </header>
  );
};
