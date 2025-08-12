import { Card, CardContent } from '@/components/ui/card';
import { Award, Car } from 'lucide-react';

const AchievementsSection = () => {
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
};

export default AchievementsSection;