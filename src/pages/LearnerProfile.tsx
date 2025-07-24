import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUserCourses } from "@/redux/actions/userCourseAction";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import PublicHeader from '@/components/PublicHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Download, Play, Calendar, Award, Car, Clock, MapPin, User, Phone, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import LearnerCourseList from "@/components/course/LearnerCourseList";
import ProfileSidebar from '@/components/learnerProfile/ProfileSidebar';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
// Removed react-router-dom import as it's not available

const DrivingSchoolLearnerProfile = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Get actual logged-in user info from Redux store
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const userId = userInfo?.id;
  const { courses, loading, error } = useSelector((state: RootState) => state.userCourseList);

  useEffect(() => {
    if (userId) {
      dispatch(getUserCourses(userId) as any);
    }
  }, [dispatch, userId]);

  const mappedCourses = courses.map((uc: any) => ({
    id: uc.course?.id,
    title: uc.course?.title,
    instructor: uc.course?.instructor || "Instructor",
    thumbnail: uc.course?.thumbnail_photo_path,
    progress: uc.progress_percentage,
    totalLessons: uc.course?.course_modules?.reduce((sum: number, m: any) => sum + (m.course_module_lessons?.length || 0), 0) || 0,
    completedLessons: Math.round((uc.progress_percentage / 100) * (
      uc.course?.course_modules?.reduce((sum: number, m: any) => sum + (m.course_module_lessons?.length || 0), 0) || 0
    )),
    lastAccessed: uc.updated_at,
    completed: uc.progress_percentage === 100,
  }));

  const activeCourses = mappedCourses.filter(course => !course?.completed);
  const completedCourses = mappedCourses.filter(course => course?.completed);

  // Mock data for appointments
  const appointments = [
    {
      id: 1,
      type: "Practical Lesson",
      instructor: "Sarah Johnson",
      date: "2025-07-25",
      start_time: "10:00 AM",
      end_time: "12:00 PM",
      location: "Main Training Ground",
      status: "confirmed",
      vehicle: "Toyota Corolla - ABC123",
      notes: "Focus on parallel parking"
    },
    {
      id: 2,
      type: "Road Test",
      instructor: "Michael Chen",
      date: "2025-07-28",
      start_time: "2:00 PM",
      end_time: "3:00 PM",
      location: "DMV Testing Center",
      status: "pending",
      vehicle: "Honda Civic - XYZ456",
      notes: "Final driving test for license"
    },
    {
      id: 3,
      type: "Theory Class",
      instructor: "Emma Wilson",
      date: "2025-07-30",
      start_time: "9:00 AM",
      end_time: "10:30 AM",
      location: "Classroom A",
      status: "confirmed",
      vehicle: "N/A",
      notes: "Traffic laws and regulations"
    },
    {
      id: 4,
      type: "Practical Lesson",
      instructor: "Sarah Johnson",
      date: "2025-08-02",
      start_time: "11:00 AM",
      end_time: "1:00 PM",
      location: "City Driving Route",
      status: "cancelled",
      vehicle: "Toyota Corolla - ABC123",
      notes: "Cancelled due to weather"
    }
  ];

  // Mock data for materials
  const materials = [
    {
      id: 1,
      title: "Driver's Handbook 2024",
      type: "PDF",
      course: "Beginner Driving Course",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Road Signs Reference",
      type: "PDF",
      course: "Defensive Driving",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Highway Driving Guidelines",
      type: "PDF",
      course: "Highway Driving Mastery",
      downloadUrl: "#"
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'My Appointments', icon: Calendar },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'materials', label: 'Materials', icon: Download },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Learning Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{mappedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Total Courses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{activeCourses.length}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(apt => apt.status !== 'cancelled').slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(appointment.status)}
                        <div>
                          <div className="font-medium">{appointment.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.date} | {appointment.start_time} - {appointment.end_time}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'appointments':
        // Split appointments
        const now = new Date();
        const upcomingAppointments = appointments.filter(
          apt => apt.status !== 'cancelled' && new Date(apt.date) >= now
        );
        const historyAppointments = appointments.filter(
          apt => apt.status === 'cancelled' || new Date(apt.date) < now
        );

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
              <Button onClick={() => window.location.href = "/appointments"}>
                <Calendar className="h-4 w-4 mr-2" />
                Take New Appointment
              </Button>
            </div>

            {/* Side by side grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upcoming Appointments */}
              <div>
                <h3 className="text-xl font-semibold mb-2">Upcoming Appointments</h3>
                <div className="space-y-4">
                  {upcomingAppointments.length === 0 && (
                    <div className="text-muted-foreground">No upcoming appointments.</div>
                  )}
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{appointment.type}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {appointment.date} | {appointment.start_time} - {appointment.end_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="text-xl font-semibold mb-2">History</h3>
                <div className="space-y-4">
                  {historyAppointments.length === 0 && (
                    <div className="text-muted-foreground">No appointment history.</div>
                  )}
                  {historyAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="pt-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{appointment.type}</h3>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {appointment.date} | {appointment.start_time} - {appointment.end_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            {/* Active Courses */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Continue Learning</h2>
              {loading ? (
                <div className="text-center py-8">Loading courses...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : (
                <LearnerCourseList courses={activeCourses} />
              )}
            </div>
            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Completed Courses</h2>
                {loading ? (
                  <div className="text-center py-8">Loading completed courses...</div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">{error}</div>
                ) : (
                  <LearnerCourseList courses={completedCourses} />
                )}
              </div>
            )}
          </div>
        );

      case 'materials':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Course Materials</h2>
            <div className="grid gap-4">
              {materials.map((material) => (
                <Card key={material.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-red-100 dark:bg-red-900 p-3 rounded">
                          <Download className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{material.title}</h3>
                          <p className="text-sm text-muted-foreground">{material.course}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">First Course Completed</h3>
                  <p className="text-sm text-muted-foreground mt-2">Completed Defensive Driving</p>
                </CardContent>
              </Card>
              
              <Card className="opacity-50">
                <CardContent className="pt-6 text-center">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">Road Test Ready</h3>
                  <p className="text-sm text-muted-foreground mt-2">Complete all practical lessons</p>
                  <p className="text-xs text-muted-foreground mt-1">Progress: 21/35 lessons</p>
                </CardContent>
              </Card>
              
              <Card className="opacity-50">
                <CardContent className="pt-6 text-center">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">Perfect Student</h3>
                  <p className="text-sm text-muted-foreground mt-2">Attend 10 appointments without cancellation</p>
                  <p className="text-xs text-muted-foreground mt-1">Progress: 6/10</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <RoleBasedNavigation />
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Left Sidebar */}
          <ProfileSidebar
            userInfo={userInfo}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sidebarItems={sidebarItems}
          />

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {sidebarItems.find(item => item.id === activeSection)?.label}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-1" />
                        {userInfo?.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {/* Joined date fallback to '-' since no created_at property exists */}
                        Joined -
                      </div>
                      {/* Replace license_type with a placeholder or remove if not needed */}
                      <Badge variant="outline">{userInfo?.role?.title || "Learner"}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Content */}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrivingSchoolLearnerProfile;