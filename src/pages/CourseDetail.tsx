
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Users, Star, DollarSign, BookOpen, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CourseDetail = () => {
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Mock course data - in a real app, this would be fetched based on the ID
  const course = {
    id: 1,
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more. This comprehensive course will take you from beginner to advanced web developer with hands-on projects and real-world examples.",
    longDescription: "This complete web development bootcamp is designed to take you from zero to hero in web development. You'll learn all the essential technologies including HTML5, CSS3, JavaScript ES6+, React, Node.js, Express, MongoDB, and much more. The course includes over 40 hours of content, 15+ projects, and lifetime access to all materials.",
    instructor: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face",
      bio: "Full-stack developer with 8+ years of experience. Former senior developer at Google and Microsoft.",
      rating: 4.9,
      students: 25000,
      courses: 12
    },
    category: "Web Development",
    price: 99.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 2847,
    students: 12500,
    duration: "42 hours",
    level: "Beginner to Advanced",
    language: "English",
    lastUpdated: "January 2024",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    features: [
      "42 hours of on-demand video",
      "15 coding exercises",
      "12 downloadable resources",
      "Full lifetime access",
      "Access on mobile and TV",
      "Certificate of completion",
      "30-day money-back guarantee"
    ],
    curriculum: [
      {
        title: "Getting Started",
        lessons: 8,
        duration: "2 hours",
        items: [
          { title: "Welcome to the Course", duration: "5:30", free: true },
          { title: "Setting Up Your Development Environment", duration: "15:20", free: true },
          { title: "HTML Basics", duration: "20:45", free: false },
          { title: "CSS Fundamentals", duration: "25:30", free: false }
        ]
      },
      {
        title: "JavaScript Essentials",
        lessons: 12,
        duration: "6 hours",
        items: [
          { title: "Variables and Data Types", duration: "18:20", free: false },
          { title: "Functions and Scope", duration: "22:15", free: false },
          { title: "DOM Manipulation", duration: "28:40", free: false },
          { title: "Event Handling", duration: "20:10", free: false }
        ]
      },
      {
        title: "React Development",
        lessons: 15,
        duration: "8 hours",
        items: [
          { title: "Introduction to React", duration: "12:30", free: false },
          { title: "Components and Props", duration: "25:20", free: false },
          { title: "State Management", duration: "30:15", free: false },
          { title: "React Hooks", duration: "35:45", free: false }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        comment: "Excellent course! Sarah explains everything clearly and the projects are very practical.",
        date: "2 weeks ago"
      },
      {
        id: 2,
        user: "Emily Chen",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        rating: 5,
        comment: "Best web development course I've taken. Great value for money!",
        date: "1 month ago"
      }
    ]
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    console.log('Enrolling in course:', course.id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Hero */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Play className="h-6 w-6 mr-2" />
                    Preview Course
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge>{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="ml-1">({course.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="bg-card rounded-lg shadow-sm">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About This Course</h3>
                    <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Build responsive websites with HTML, CSS, and JavaScript",
                        "Create dynamic web applications with React",
                        "Develop backend APIs with Node.js and Express",
                        "Work with databases using MongoDB",
                        "Deploy applications to production",
                        "Best practices for web development"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">Course Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Course Curriculum</h3>
                  <p className="text-muted-foreground">
                    {course.curriculum.length} sections • {course.curriculum.reduce((acc, section) => acc + section.lessons, 0)} lectures • {course.duration} total length
                  </p>
                  
                  <div className="space-y-4">
                    {course.curriculum.map((section, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {section.lessons} lessons • {section.duration}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                                <div className="flex items-center">
                                  <Play className="h-4 w-4 text-muted-foreground mr-2" />
                                  <span className="text-foreground">{item.title}</span>
                                  {item.free && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">{item.duration}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructor" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                      <AvatarFallback>{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-semibold">{course.instructor.name}</h3>
                      <p className="text-muted-foreground mb-4">{course.instructor.bio}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{course.instructor.rating}</div>
                          <div className="text-sm text-muted-foreground">Instructor Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course.instructor.students.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course.instructor.courses}</div>
                          <div className="text-sm text-muted-foreground">Courses</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">8+</div>
                          <div className="text-sm text-muted-foreground">Years Experience</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{course.rating}</div>
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{course.reviewCount} reviews</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    {course.reviews.map((review) => (
                      <div key={review.id} className="flex space-x-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} alt={review.user} />
                          <AvatarFallback>{review.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-foreground">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold">${course.price}</span>
                    <span className="text-lg text-muted-foreground line-through">${course.originalPrice}</span>
                  </div>
                  <Badge className="bg-red-500">50% OFF</Badge>
                </div>

                {isEnrolled ? (
                  <Button className="w-full mb-4" asChild>
                    <Link to={`/course/${course.id}/learn`}>
                      Continue Learning
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full mb-4" onClick={handleEnroll}>
                    Enroll Now
                  </Button>
                )}

                <Button variant="outline" className="w-full mb-6">
                  Add to Wishlist
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>{course.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span>{course.lastUpdated}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-center text-sm text-muted-foreground">
                  <p className="mb-2">30-Day Money-Back Guarantee</p>
                  <p>Full Lifetime Access</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Students Also Bought</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Advanced React Patterns",
                      price: 79.99,
                      rating: 4.7,
                      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=60&fit=crop"
                    },
                    {
                      title: "Node.js Backend Development",
                      price: 89.99,
                      rating: 4.6,
                      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=60&fit=crop"
                    }
                  ].map((relatedCourse, index) => (
                    <div key={index} className="flex space-x-3">
                      <img
                        src={relatedCourse.thumbnail}
                        alt={relatedCourse.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{relatedCourse.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-bold">${relatedCourse.price}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-muted-foreground ml-1">{relatedCourse.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
