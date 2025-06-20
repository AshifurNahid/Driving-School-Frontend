
import { 
  Check, 
  Download, 
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface LessonContentProps {
  title: string;
  duration: string;
  description: string;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  isPreviousDisabled: boolean;
}

const LessonContent = ({
  title,
  duration,
  description,
  onPrevious,
  onNext,
  onMarkComplete,
  isPreviousDisabled
}: LessonContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <Badge variant="outline">{duration}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button onClick={onPrevious} variant="outline" disabled={isPreviousDisabled}>
              <SkipBack className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={onNext} variant="outline">
              Next
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <Button onClick={onMarkComplete} className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-2" />
            Mark as Complete
          </Button>
        </div>

        {/* Downloadable Resources */}
        <div className="space-y-2">
          <h4 className="font-medium">Resources</h4>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Course Materials.pdf
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Source Code.zip
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContent;
