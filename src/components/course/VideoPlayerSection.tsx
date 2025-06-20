
import { 
  Play, 
  Settings,
  Maximize,
  SkipBack,
  SkipForward,
  Volume2,
  Car,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VideoPlayerSectionProps {
  videoUrl?: string;
  courseType?: 'online' | 'physical';
  physicalCourseData?: {
    title: string;
    duration: string;
    includes: string[];
    description: string;
    location?: string;
  };
}

const VideoPlayerSection = ({ videoUrl, courseType = 'online', physicalCourseData }: VideoPlayerSectionProps) => {
  if (courseType === 'physical') {
    return (
      <Card className="overflow-hidden">
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 aspect-video">
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Car className="h-16 w-16 text-blue-600 mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Physical Course</h3>
            <p className="text-muted-foreground mb-4">
              No video included – this is an in-person driving course
            </p>
            
            {physicalCourseData && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">{physicalCourseData.duration}</span>
                  <span>of hands-on instruction</span>
                </div>
                {physicalCourseData.location && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{physicalCourseData.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative bg-black aspect-video">
        {videoUrl ? (
          <video 
            controls 
            className="w-full h-full"
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <Play className="h-16 w-16" />
          </div>
        )}
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:text-white">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayerSection;
