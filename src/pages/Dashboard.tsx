import { type ComponentType, type ReactNode, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Line,
  LineChart,
} from "recharts";
import { CalendarDays, CircleDollarSign, Clock3, Users as UsersIcon, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import api from "@/utils/axios";

interface DashboardSummary {
  status: {
    code: string;
    message: string;
  };
  data: {
    currentMonth: string;
    courseStats: {
      currentMonthEnrollments: number;
      currentMonthRevenue: number;
      topCourses: {
        courseId: number;
        name: string;
        enrollments: number;
      }[];
    };
    appointmentStats: {
      todayDate: string;
      todayAppointments: number;
      currentMonthAppointments: number;
      upcoming7DaysAppointments: number;
      pendingAppointments: number;
      completedAppointments: number;
      bookedAppointments: number;
      dailyBookedAppointments: {
        date: string;
        bookedCount: number;
      }[];
    };
    userStats: {
      totalActiveUsers: number;
      newUsersThisMonth: number;
      totalUsers: number;
      userGrowthLast6Months: {
        month: string;
        userCount: number;
      }[];
    };
  };
}

const COLORS = ["#2563EB", "#22C55E", "#F97316", "#A855F7", "#0EA5E9", "#EF4444"];

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
}) => (
  <Card className="relative overflow-hidden border border-border/60 bg-gradient-to-br from-background to-muted/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
    <div className="pointer-events-none absolute inset-0 opacity-40 blur-3xl" aria-hidden>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20" />
      <div className="absolute -left-14 bottom-0 h-28 w-28 rounded-full bg-emerald-400/15" />
    </div>
    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
      <div>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-2xl font-semibold text-foreground mt-1">{value}</div>
      </div>
      <div className="rounded-2xl bg-primary/10 p-3 text-primary ring-1 ring-primary/20">
        <Icon className="h-5 w-5" />
      </div>
    </CardHeader>
    <CardContent className="relative">
      <CardDescription>{subtitle}</CardDescription>
    </CardContent>
  </Card>
);

const ChartCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) => (
  <Card className="h-full border border-border/60 bg-gradient-to-br from-background to-muted/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
    <CardHeader>
      <CardTitle className="text-lg text-foreground">{title}</CardTitle>
      <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent className="h-[320px] lg:h-[360px]">
      {children}
    </CardContent>
  </Card>
);

const TopCoursesTable = ({ courses }: { courses: DashboardSummary["data"]["courseStats"]["topCourses"] }) => {
  if (!courses.length) {
    return (
      <Card className="border border-border/60 bg-gradient-to-br from-background to-muted/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Top Courses</CardTitle>
          <CardDescription>Most popular courses by enrollment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No course enrollments this month.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/60 bg-gradient-to-br from-background to-muted/50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Top Courses</CardTitle>
        <CardDescription>Most popular courses by enrollment</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2">Rank</th>
              <th className="py-2">Course Name</th>
              <th className="py-2 text-right">Enrollments</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr
                key={course.courseId}
                className="border-t border-border/70 transition-colors hover:bg-muted/50"
              >
                <td className="py-2 font-medium">{index + 1}</td>
                <td className="py-2">{course.name}</td>
                <td className="py-2 text-right font-semibold text-foreground">{course.enrollments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, idx) => (
      <Card key={idx} className="shadow-sm">
        <CardHeader className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const DashboardContent = ({ embedded = false }: { embedded?: boolean }) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<DashboardSummary>("/dashboard/summary");
        const data = response.data;

        if (!data?.status?.code) {
          throw new Error("Invalid dashboard response format");
        }

        setSummary(data);
      } catch (err) {
        if (isAxiosError(err)) {
          const messageFromApi =
            typeof err.response?.data === "string"
              ? err.response.data
              : err.response?.data?.status?.message;
          setError(messageFromApi || "Unable to reach dashboard service.");
        } else {
          setError(err instanceof Error ? err.message : "Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const formattedMonth = useMemo(() => {
    if (!summary?.data.currentMonth) return "";
    const date = new Date(`${summary.data.currentMonth}-01`);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [summary?.data.currentMonth]);

  const formattedToday = useMemo(() => {
    if (!summary?.data.appointmentStats.todayDate) return "";
    const date = new Date(summary.data.appointmentStats.todayDate);
    return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }, [summary?.data.appointmentStats.todayDate]);

  const statusInvalid = summary && summary.status.code !== "200";

  const appointmentStatusData = useMemo(
    () => [
      { name: "Pending", value: summary?.data.appointmentStats.pendingAppointments ?? 0 },
      { name: "Completed", value: summary?.data.appointmentStats.completedAppointments ?? 0 },
      { name: "Booked", value: summary?.data.appointmentStats.bookedAppointments ?? 0 },
    ],
    [summary?.data.appointmentStats]
  );

  const userActivityData = useMemo(() => {
    const active = summary?.data.userStats.totalActiveUsers ?? 0;
    const total = summary?.data.userStats.totalUsers ?? 0;
    const inactive = Math.max(total - active, 0);
    return [
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
    ];
  }, [summary?.data.userStats]);

  const activePercentage = useMemo(() => {
    const active = summary?.data.userStats.totalActiveUsers ?? 0;
    const total = summary?.data.userStats.totalUsers ?? 0;
    if (!total) return 0;
    return Math.round((active / total) * 100);
  }, [summary?.data.userStats]);

  const content = (
    <>
      <header className="space-y-2">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Dashboard</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Driving School Dashboard</h1>
        <p className="text-muted-foreground text-base">Overview for {formattedMonth || "--"}</p>
      </header>

      {loading && (
        <>
          <LoadingGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!loading && (error || statusInvalid) && (
        <Card className="border-destructive/30 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Unable to load dashboard</CardTitle>
            <CardDescription className="text-destructive">
              {error || summary?.status.message || "Unexpected error fetching dashboard data."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!loading && summary && !statusInvalid && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard
              title="Monthly Enrollments"
              value={summary.data.courseStats.currentMonthEnrollments}
              subtitle="New students this month"
              icon={UsersIcon}
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${summary.data.courseStats.currentMonthRevenue.toLocaleString()}`}
              subtitle="Total revenue this month"
              icon={CircleDollarSign}
            />
            <StatCard
              title="Today’s Appointments"
              value={summary.data.appointmentStats.todayAppointments}
              subtitle={formattedToday || "--"}
              icon={CalendarDays}
            />
            <StatCard
              title="Total Users"
              value={summary.data.userStats.totalUsers}
              subtitle="Total registered users"
              icon={UsersIcon}
            />
            <StatCard
              title="Pending Appointments"
              value={summary.data.appointmentStats.pendingAppointments}
              subtitle="Awaiting confirmation"
              icon={Clock3}
            />
            <StatCard
              title="New Users This Month"
              value={summary.data.userStats.newUsersThisMonth}
              subtitle="New users this month"
              icon={UserPlus}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Monthly Appointments" subtitle="Daily appointment distribution">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.data.appointmentStats.dailyBookedAppointments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} tickLine={false} />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString("en-US")}
                    formatter={(value: number) => [`${value} booked`, "Appointments"]}
                  />
                  <Bar dataKey="bookedCount" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Appointment Status Distribution" subtitle="Current status breakdown">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(value: number) => [`${value}`, "Appointments"]} />
                  <Legend />
                  <Pie data={appointmentStatusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                    {appointmentStatusData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="User Growth" subtitle="New user registrations over time">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.data.userStats.userGrowthLast6Months}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => new Date(`${value}-01`).toLocaleDateString("en-US", { month: "short" })}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} tickLine={false} />
                  <Tooltip
                    labelFormatter={(value) => new Date(`${value}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    formatter={(value: number) => [`${value}`, "Users"]}
                  />
                  <Line type="monotone" dataKey="userCount" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Activity" subtitle="Active vs total users">
              <div className="h-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip formatter={(value: number) => [`${value}`, "Users"]} />
                    <Pie data={userActivityData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                      {userActivityData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <div className="text-3xl font-semibold text-foreground">{activePercentage}%</div>
                  <p className="text-sm text-muted-foreground">Active users</p>
                </div>
              </div>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopCoursesTable courses={summary.data.courseStats.topCourses} />

            <ChartCard title="Top Courses" subtitle="Most popular courses by enrollment">
              {summary.data.courseStats.topCourses.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary.data.courseStats.topCourses}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} />
                    <Tooltip formatter={(value: number) => [`${value}`, "Enrollments"]} />
                    <Bar dataKey="enrollments" radius={[6, 6, 0, 0]} fill="#7C3AED">
                      {summary.data.courseStats.topCourses.map((course, index) => (
                        <Cell key={course.courseId} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No course enrollments this month.</div>
              )}
            </ChartCard>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Appointments</p>
              <p>Current month: {summary.data.appointmentStats.currentMonthAppointments}</p>
              <p>Upcoming 7 days: {summary.data.appointmentStats.upcoming7DaysAppointments}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Courses</p>
              <p>Top course count: {summary.data.courseStats.topCourses.length}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Users</p>
              <p>Total active users: {summary.data.userStats.totalActiveUsers}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-8">{content}</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <RoleBasedNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {content}
      </div>
    </div>
  );
};

const Dashboard = () => <DashboardContent />;

export default Dashboard;
