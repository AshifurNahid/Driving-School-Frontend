
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  Clock, 
  DollarSign, 
  MapPin, 
  CheckCircle, 
  Calendar,
  Star,
  User
} from 'lucide-react';

interface PhysicalCourseDetailProps {
  course: {
    id: number;
    title: string;
    price: number;
    duration: string;
    includes: string[];
    description: string;
    location?: string;
    instructor?: string;
    rating?: number;
    reviewCount?: number;
    courseType: 'physical';
  };
  onBookAppointment?: () => void;
  onEnroll?: () => void;
}

const PhysicalCourseDetail = ({ course, onBookAppointment, onEnroll }: PhysicalCourseDetailProps) => {
  const taxAmount = course.price * 0.13; // 13% HST for Ontario
  const totalPrice = course.price + taxAmount;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Physical Course
          </Badge>
        </div>
        <h1 className="text-4xl font-bold text-foreground">{course.title}</h1>
        <p className="text-xl text-muted-foreground">Professional in-car driving instruction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{course.duration}</p>
                  </div>
                </div>
                
                {course.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{course.location}</p>
                    </div>
                  </div>
                )}
                
                {course.instructor && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Instructor</p>
                      <p className="text-sm text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>
                )}
                
                {course.rating && (
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <div>
                      <p className="font-medium">{course.rating}/5.0</p>
                      <p className="text-sm text-muted-foreground">
                        {course.reviewCount} reviews
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  No video included – this is an in-person driving course
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                What's Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {course.includes.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Pricing and Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>Course Price:</span>
                    <span className="font-medium">${course.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>HST (13%):</span>
                    <span>+${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold text-foreground">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)} CAD</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={onEnroll}
                  >
                    Enroll Now
                  </Button>
                  
                  {onBookAppointment && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={onBookAppointment}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Certified instructors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Flexible scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Money-back guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalCourseDetail;
