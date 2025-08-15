import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';

interface ProgressOverviewCardProps {
  totalCourses: number;
  completedCourses: number;
  activeCourses: number;
}

const ProgressOverviewCard = ({ 
  totalCourses, 
  completedCourses, 
  activeCourses 
}: ProgressOverviewCardProps) => {
  return (
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
            <div className="text-2xl font-bold text-blue-600">{totalCourses}</div>
            <div className="text-sm text-muted-foreground">Total Courses</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedCourses}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{activeCourses}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressOverviewCard;