import { useState,useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Users, Star, DollarSign, BookOpen, Award, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseDetail } from '@/redux/actions/courseAction';
import { useCourseDetails } from '@/hooks/useCourseDetail';
import { RootState } from '@/redux/store';
import { createCourseReview, deleteCourseReview, updateCourseReview } from '@/redux/actions/reviewAction';
import { useAuth } from '@/hooks/useAuth';

const CourseDetail = () => {
  const { userInfo } = useAuth();
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  if (!id) return <div>Loading...</div>; // or navigate away, etc.

  const dispatch = useDispatch();
  const { course, loading, error } = useCourseDetails(Number(id));
  const { enrolledCourses, loading: enrolledCoursesLoading, error: enrolledCoursesError } = useSelector((state: RootState) => state.enrolled_course);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch reviews on mount
  useEffect(() => {
    if(enrolledCourses.length > 0){
      setIsEnrolled(true);
    }
    else{
      setIsEnrolled(false);
    }
  }, []);

  // Find if user already posted a review
  const userReview = course?.course_reviews?.find((r: any) => r.review_from_id === userInfo?.id);



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody={
        course_id: course?.id,
        rating,
        review,
        is_verified_purchase: true,

    }

    const updatedBody={
      course_id: course?.id,
      rating,
      review,
      isVerifiedPurchase:true}

    if (editing && editId) {
 dispatch(updateCourseReview(updatedBody,editId) as any);
    } else {
      dispatch(createCourseReview(requestBody) as any);
    }

    setRating(0);
    setReview("");
    setEditing(false);
    setEditId(null);
  };

  const handleDelete = () => {
    console.log(editId);
    
    if (editId) {
  dispatch(deleteCourseReview(editId) as any);

    setRating(0);
    setReview("");
    setEditing(false);
    setEditId(null);
    }
  };

  const handleCancelEdit = () => {
    setRating(0);
    setReview("");
    setEditing(false);
    setEditId(null);
  };

  const handleEditReview = (reviewData: any) => {
    setRating(reviewData.rating);
    setReview(reviewData.review);
    setEditing(true);
    setEditId(reviewData.id);
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
                  src={import.meta.env.VITE_API_BASE_URL + "/" +course?.thumbnail_photo_path}
                  alt={course?.title}
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
                  <Badge>{course?.category}</Badge>
                  <Badge variant="outline">{course?.level}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
                <p className="text-muted-foreground mb-6">{course?.description}</p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{course?.rating}</span>
                    <span className="ml-1">({course?.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {/* <span>{course.students.toLocaleString()} students</span> */}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course?.duration}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="bg-card rounded-lg shadow-sm">
              <TabsList className="w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                {/* <TabsTrigger value="instructor">Instructor</TabsTrigger> */}
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About This Course</h3>
                    <p className="text-muted-foreground leading-relaxed">{course?.description}</p>
                  </div>

                  {/* <div>
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
                  </div> */}

                  {/* <div>
                    <h3 className="text-xl font-semibold mb-4">Course Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course?.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Course Curriculum</h3>
                  <p className="text-muted-foreground">
                    {course?.course_modules.length} Modules • {course?.course_modules.reduce((acc, course_modules) => acc + course_modules.course_module_lessons.length, 0)} lectures • {course?.duration} total length
                  </p>
                  
                  <div className="space-y-4">
                    {course?.course_modules.map((section, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">{section?.module_title}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {section?.course_module_lessons.length} lessons • {section?.duration}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {section?.course_module_lessons.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                                <div className="flex items-center">
                                  <Play className="h-4 w-4 text-muted-foreground mr-2" />
                                  <span className="text-foreground">{item?.lesson_title}</span>
                                  {/* {item?.free && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Free
                                    </Badge>
                                  )} */}
                                </div>
                                <span className="text-sm text-muted-foreground">{item?.duration}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* <TabsContent value="instructor" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={course?.instructor.avatar} alt={course?.instructor.name} />
                      <AvatarFallback>{course?.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-semibold">{course?.instructor.name}</h3>
                      <p className="text-muted-foreground mb-4">{course?.instructor.bio}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{course?.instructor.rating}</div>
                          <div className="text-sm text-muted-foreground">Instructor Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course?.instructor.students.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{course?.instructor.courses}</div>
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
              </TabsContent> */}

              <TabsContent value="reviews" className="p-6">
                <div className="space-y-6">
                  {/* Reviews Header */}
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{course?.rating}</div>
                      <div className="flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{course?.total_reviews} reviews</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Review Form - Always visible at the top */}
                  {userInfo ? (
                    <Card className="bg-muted/30 sticky top-4 z-10">
                      <CardContent className="p-4">
                        <h4 className="text-lg font-semibold mb-4">
                          {editing ? "Update Your Review" : "Write a Review"}
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground mr-2">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className={`transition-colors ${star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"}`}
                              >
                                <Star className="h-5 w-5" fill={star <= rating ? "#facc15" : "none"} />
                              </button>
                            ))}
                          </div>
                          <textarea
                            className="w-full border rounded-md p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Share your experience with this course..."
                            required
                          />
                          <div className="flex gap-2">
                            <Button type="submit" disabled={loading || rating === 0}>
                              {editing ? "Update Review" : "Post Review"}
                            </Button>
                            {editing && (
                              <>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={handleCancelEdit}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  onClick={handleDelete} 
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-muted/30">
                      <CardContent className="p-4 text-center">
                        <p className="text-muted-foreground mb-2">Want to share your experience?</p>
                        <Button variant="outline" asChild>
                          <Link to="/login">Log in to post a review</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    <h4 className="text-lg font-semibold sticky top-0 bg-background py-2">
                      Student Reviews ({course?.course_reviews?.length || 0})
                    </h4>
                    
                    {course?.course_reviews?.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No reviews yet. Be the first to share your experience!</p>
                      </div>
                    ) : (
                      course?.course_reviews?.map((reviewData) => (
                        <Card key={reviewData?.id} className="relative">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {/* {reviewData?.reviewer_name?.charAt(0) || 'U'} */}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    {/* <span className="font-medium text-sm">{reviewData?.reviewer_name || 'Anonymous'}</span> */}
                                    <div className="flex items-center space-x-2">
                                      <div className="flex">
                                        {[...Array(reviewData.rating)].map((_, i) => (
                                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                                        ))}
                                        {[...Array(5 - reviewData.rating)].map((_, i) => (
                                          <Star key={i} className="h-3 w-3 text-gray-300" />
                                        ))}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(reviewData?.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-foreground text-sm leading-relaxed">{reviewData?.review}</p>
                              </div>
                              
                              {/* Edit/Delete buttons for user's own review */}
                              {userInfo?.id === reviewData?.review_from_id && (
                                <div className="flex space-x-1 ml-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditReview(reviewData)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditId(reviewData.id);
                                      handleDelete();
                                    }}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
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
                    <span className="text-3xl font-bold">${course?.price}</span>
                    {/* <span className="text-lg text-muted-foreground line-through">${course?.originalPrice}</span> */}
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

                {/* <Button variant="outline" className="w-full mb-6">
                  Add to Wishlist
                </Button> */}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{course?.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span>{course?.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>{course?.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated:</span>
                    {/* <span>{course?.lastUpdated}</span> */}
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