
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { BookOpen, Download, Play, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnerProfile = () => {
  const { user } = useUser();

  // Mock data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Johnson",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
      progress: 65,
      totalLessons: 120,
      completedLessons: 78,
      lastAccessed: "2024-01-20",
      enrolledDate: "2024-01-10"
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      instructor: "Michael Chen",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop",
      progress: 100,
      totalLessons: 45,
      completedLessons: 45,
      lastAccessed: "2024-01-18",
      enrolledDate: "2024-01-05",
      completed: true
    },
    {
      id: 3,
      title: "Advanced React Patterns",
      instructor: "John Doe",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
      progress: 25,
      totalLessons: 80,
      completedLessons: 20,
      lastAccessed: "2024-01-19",
      enrolledDate: "2024-01-15"
    }
  ];

  // Mock data for materials
  const materials = [
    {
      id: 1,
      title: "Web Development Cheat Sheet",
      type: "PDF",
      course: "Complete Web Development Bootcamp",
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "JavaScript ES6 Reference",
      type: "PDF",
      course: "JavaScript Fundamentals",
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "React Hooks Guide",
      type: "PDF",
      course: "Advanced React Patterns",
      downloadUrl: "#"
    }
  ];

  if (!user) return null;

  const activeCourses = enrolledCourses.filter(course => !course.completed);
  const completedCourses = enrolledCourses.filter(course => course.completed);

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground mt-1">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <Badge variant="secondary">{user.role}</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{enrolledCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Courses Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{completedCourses.length}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
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
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-foreground">{course.title}</CardTitle>
                        <CardDescription>by {course.instructor}</CardDescription>
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
                          
                          <Button asChild className="w-full">
                            <Link to={`/course/${course.id}/learn`}>
                              <Play className="h-4 w-4 mr-2" />
                              Continue Learning
                            </Link>
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
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-2 text-foreground">{course.title}</CardTitle>
                          <CardDescription>by {course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Progress value={100} className="w-full" />
                            <Button variant="outline" asChild className="w-full">
                              <Link to={`/course/${course.id}`}>
                                <Award className="h-4 w-4 mr-2" />
                                View Certificate
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
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
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground">First Course Completed</h3>
                    <p className="text-sm text-muted-foreground mt-2">Completed your first course</p>
                  </CardContent>
                </Card>
                
                <Card className="opacity-50">
                  <CardContent className="pt-6 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground">Course Collector</h3>
                    <p className="text-sm text-muted-foreground mt-2">Complete 5 courses</p>
                    <p className="text-xs text-muted-foreground mt-1">Progress: 1/5</p>
                  </CardContent>
                </Card>
                
                <Card className="opacity-50">
                  <CardContent className="pt-6 text-center">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground">Learning Streak</h3>
                    <p className="text-sm text-muted-foreground mt-2">Learn 7 days in a row</p>
                    <p className="text-xs text-muted-foreground mt-1">Progress: 3/7</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LearnerProfile;
