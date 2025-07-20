import { useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import PublicHeader from '@/components/PublicHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Download, Play, Calendar, Award, Car, Clock, MapPin, User, Phone, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
// Removed react-router-dom import as it's not available

const DrivingSchoolLearnerProfile = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Get actual logged-in user info from Redux store
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const user = {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2024-01-10",
    studentId: "DS2024001"
  };

  // Mock data for driving courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Beginner Driving Course",
      instructor: "Sarah Johnson",
      thumbnail: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=200&fit=crop",
      progress: 75,
      totalLessons: 20,
      completedLessons: 15,
      lastAccessed: "2024-01-20",
      enrolledDate: "2024-01-10",
      type: "Theory + Practical"
    },
    {
      id: 2,
      title: "Defensive Driving",
      instructor: "Michael Chen",
      thumbnail: "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=300&h=200&fit=crop",
      progress: 100,
      totalLessons: 12,
      completedLessons: 12,
      lastAccessed: "2024-01-18",
      enrolledDate: "2024-01-05",
      completed: true,
      type: "Theory"
    },
    {
      id: 3,
      title: "Highway Driving Mastery",
      instructor: "John Doe",
      thumbnail: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=300&h=200&fit=crop",
      progress: 40,
      totalLessons: 15,
      completedLessons: 6,
      lastAccessed: "2024-01-19",
      enrolledDate: "2024-01-15",
      type: "Practical"
    }
  ];

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

  const activeCourses = enrolledCourses.filter(course => !course.completed);
  const completedCourses = enrolledCourses.filter(course => course.completed);

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
                    <div className="text-2xl font-bold text-blue-600">{enrolledCourses.length}</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{course.progress}% Complete</Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500">{course.type}</Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2 text-foreground">{course.title}</CardTitle>
                      <CardDescription>Instructor: {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="w-full" />
                        </div>
                        
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Completed Courses */}
            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Completed Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-green-500">Completed</Badge>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-500">{course.type}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-foreground">{course.title}</CardTitle>
                        <CardDescription>Instructor: {course.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={100} className="w-full" />
                          <Button variant="outline" className="w-full">
                            <Award className="h-4 w-4 mr-2" />
                            View Certificate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-64 bg-card border-r min-h-screen p-6">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-foreground">{userInfo.full_name}</h2>
                <p className="text-sm text-muted-foreground">{userInfo.role.title}</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {user.studentId}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

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
                        {userInfo.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                      {/* Replace license_type with a placeholder or remove if not needed */}
                      <Badge variant="outline">{userInfo.role?.title || "Learner"}</Badge>
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