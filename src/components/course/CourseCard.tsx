
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Clock, Play } from 'lucide-react';
import { type Course } from '@/types/course';

export const CourseCard = ({ course }: { course: Course }) => (
  <Card className="group overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg bg-card">
    <div className="relative overflow-hidden">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Play className="h-10 w-10 text-white" />
      </div>
      {course.featured && (
        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium">
          Featured
        </Badge>
      )}
    </div>
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">{course.category}</Badge>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium ml-1 text-foreground">{course.rating}</span>
        </div>
      </div>
      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-semibold line-clamp-2">
        {course.title}
      </CardTitle>
      <CardDescription className="text-sm text-muted-foreground font-medium">
        by {course.instructor}
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-0 flex flex-col flex-grow">
      {course.description &&
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 font-medium">
          {course.description}
        </p>
      }
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {course.enrollments.toLocaleString()} students
          </div>
          {course.duration && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {course.duration}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${course.price.toFixed(2)}
          </span>
          <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
            <Link to={`/course/${course.id}`}>
              View Course
            </Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
