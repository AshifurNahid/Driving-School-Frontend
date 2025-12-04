import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, BookOpen } from 'lucide-react';

interface Course {
  id: number;
  user_course?: number; // Optional for learner courses
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  completed?: boolean;
}

interface LearnerCourseListProps {
  courses: Course[];
}

const LearnerCourseList = ({ courses }: LearnerCourseListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course?.id} className="overflow-hidden">
          <div className="relative">
            <img
              src={import.meta.env.VITE_API_BASE_URL + "/"+course?.thumbnail}
              alt={course?.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={course?.completed ? "default" : "secondary"}>
                {course?.completed ? "Completed" : `${course?.progress}% Complete`}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="line-clamp-2 text-foreground">{course?.title}</CardTitle>
            <CardDescription>by {course?.instructor}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>{course?.completedLessons} of {course?.totalLessons} lessons</span>
                  <span>{course?.progress}%</span>
                </div>
                <Progress value={course?.progress} className="w-full" />
              </div>
              <div className="flex space-x-2">
                {course?.user_course ? (
                <Button asChild className="flex-1">
                    <Link to={`/course/${course.user_course}/learn`}>
                      <Play className="h-4 w-4 mr-2" />
                      {course?.completed ? "Review" : "Continue"}
                    </Link>
                  </Button>
                ) : (
                  <Button className="flex-1" disabled>
                    <Play className="h-4 w-4 mr-2" />
                    {course?.completed ? "Review" : "Continue"}
                </Button>
                )}
                <Button variant="outline" asChild>
                  <Link to={`/course/${course?.id}`}>
                    <BookOpen className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LearnerCourseList; 