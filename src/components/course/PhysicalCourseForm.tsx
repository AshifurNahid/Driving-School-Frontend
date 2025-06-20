
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Clock, DollarSign, MapPin, CheckCircle } from 'lucide-react';

interface PhysicalCourseData {
  title: string;
  price: number;
  duration: string;
  includes: string;
  description: string;
  location: string;
}

interface PhysicalCourseFormProps {
  data: PhysicalCourseData;
  onChange: (field: keyof PhysicalCourseData, value: string | number) => void;
}

const PhysicalCourseForm = ({ data, onChange }: PhysicalCourseFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5 text-blue-600" />
          Physical Course Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="course-title" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Course Title
            </Label>
            <Input
              id="course-title"
              value={data.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Test Prep Package"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price (CAD)
            </Label>
            <Input
              id="price"
              type="number"
              value={data.price}
              onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
              placeholder="550"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">+ Tax will be calculated automatically</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </Label>
            <Input
              id="duration"
              value={data.duration}
              onChange={(e) => onChange('duration', e.target.value)}
              placeholder="e.g., 7 hours of in-car instruction"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location (Optional)
            </Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g., Toronto Downtown Location"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="includes" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            What's Included
          </Label>
          <Textarea
            id="includes"
            value={data.includes}
            onChange={(e) => onChange('includes', e.target.value)}
            placeholder="Use of car for the road test&#10;Experienced certified instructor&#10;Pick-up and drop-off service&#10;Pre-test preparation materials"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">Enter each item on a new line</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Comprehensive test preparation package designed for new drivers. Our experienced instructors will guide you through essential driving skills and help you feel confident for your road test..."
            rows={6}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PhysicalCourseForm;
