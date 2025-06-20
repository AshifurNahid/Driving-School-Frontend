
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { Play, BookOpen } from 'lucide-react';

const LearnerCourses = () => {
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
      lastAccessed: "2024-01-20"
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
      lastAccessed: "2024-01-19"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-2">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={course.completed ? "default" : "secondary"}>
                    {course.completed ? "Completed" : `${course.progress}% Complete`}
                  </Badge>
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
                  
                  <div className="flex space-x-2">
                    <Button asChild className="flex-1">
                      <Link to={`/course/${course.id}/learn`}>
                        <Play className="h-4 w-4 mr-2" />
                        {course.completed ? "Review" : "Continue"}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to={`/course/${course.id}`}>
                        <BookOpen className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnerCourses;
