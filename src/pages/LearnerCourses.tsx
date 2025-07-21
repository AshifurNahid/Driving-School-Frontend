
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { Play, BookOpen } from 'lucide-react';
import LearnerCourseList from "@/components/course/LearnerCourseList";

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
        <LearnerCourseList courses={enrolledCourses} />
      </div>
    </div>
  );
};

export default LearnerCourses;
