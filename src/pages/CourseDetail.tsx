import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Users, Star, BookOpen, ChevronDown, ChevronRight, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDispatch, useSelector } from 'react-redux';
import { useCourseDetails } from '@/hooks/useCourseDetail';
import { RootState } from '@/redux/store';
import { createCourseReview, deleteCourseReview, updateCourseReview } from '@/redux/actions/reviewAction';
import { getUserCourses } from '@/redux/actions/userCourseAction';
import { useAuth } from '@/hooks/useAuth';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { fetchEnrollmentStatusByCourseId } from '@/services/userCourses';
import { EnrollmentStatusPayload } from '@/types/payment';
import "react-quill/dist/quill.snow.css";

const CourseDetail = () => {
  const { userInfo } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [openModules, setOpenModules] = useState<number[]>([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatusPayload | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  if (!id) {
    return <div>Loading...</div>;
  }

  const dispatch = useDispatch();
  const { course, loading } = useCourseDetails(Number(id));
  const { courses: userCourseList, loading: userCoursesLoading } = useSelector((state: RootState) => state.userCourseList);

  // Calculate real review statistics from backend data
  const reviewStats = useMemo(() => {
    if (!course?.course_reviews || course.course_reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const reviews = course.course_reviews;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });

    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : 0;

    const percentages = {
      5: totalReviews > 0 ? Math.round((distribution[5] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((distribution[4] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((distribution[3] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((distribution[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((distribution[1] / totalReviews) * 100) : 0
    };

    return { averageRating, totalReviews, distribution, percentages };
  }, [course?.course_reviews]);

  useEffect(() => {
    if (userInfo?.id && (!userCourseList || userCourseList.length === 0)) {
      dispatch(getUserCourses(userInfo.id) as any);
    }
  }, [dispatch, userInfo?.id]);

  useEffect(() => {
    if (!id || !userInfo?.id) return;
    const loadEnrollmentStatus = async () => {
      setEnrollmentLoading(true);
      try {
        const data = await fetchEnrollmentStatusByCourseId(id);
        setEnrollmentStatus(data);
      } catch (error) {
        console.error(error);
      } finally {
        setEnrollmentLoading(false);
      }
    };
    loadEnrollmentStatus();
  }, [id, userInfo?.id]);

  const enrolledCourse = userCourseList.find((uc: any) => uc?.course_id === Number(id));
  const paymentStatus = enrollmentStatus?.payment_status;
  const isPaid = paymentStatus === "Paid" || !!enrolledCourse;
  const isPartiallyPaid = paymentStatus === "PartiallyPaid";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = { course_id: course?.id, rating, review, is_verified_purchase: true };
    const updatedBody = { course_id: course?.id, rating, review, isVerifiedPurchase: true };
    
    if (editing && editId) {
      dispatch(updateCourseReview(updatedBody, editId) as any);
    } else {
      dispatch(createCourseReview(requestBody) as any);
    }
    
    setRating(0);
    setReview("");
    setEditing(false);
    setEditId(null);
  };

  const handleDelete = () => {
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
    if (!id) return;
    if (!userInfo) {
      navigate('/login');
      return;
    }
    navigate(`/course/${id}/checkout`);
  };

  const totalLectures = course?.course_modules?.reduce((acc, m) => acc + m.course_module_lessons.length, 0) || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1419]">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1419]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="space-y-3">
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border-0">
                {course?.category}
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{course?.title}</h1>
              <p className="text-base text-gray-600 dark:text-gray-400">{course?.description}</p>
              
              <div className="flex items-center gap-6 text-sm">
                
              
              </div>
            </div>

            {/* Course Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 dark:bg-gray-800/50">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1f2e] data-[state=active]:text-teal-500 dark:data-[state=active]:text-teal-400">Overview</TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1f2e] data-[state=active]:text-teal-500 dark:data-[state=active]:text-teal-400">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1f2e] data-[state=active]:text-teal-500 dark:data-[state=active]:text-teal-400">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* About This Course */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-teal-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">About This Course</h2>
                  </div>
                  <div
                    className="ql-editor text-gray-600 dark:text-gray-300 leading-relaxed [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5 space-y-2"
                    dangerouslySetInnerHTML={{ __html: course?.content }}
                  />
                </div>


                {/* Requirements */}
                {course?.prerequisites && (
                  <div className="space-y-3">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Requirements</h2>
                    <p className="text-gray-600 dark:text-gray-400">{course?.prerequisites}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6 space-y-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Course Content</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{course?.course_modules?.length || 0} sections</span>
                    <span>•</span>
                    <span>{totalLectures} lectures</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course?.duration} hours
                    </span>
                  </div>

                  <div className="space-y-2">
                    {course?.course_modules?.map((section, index) => {
                      const isOpen = openModules.includes(index);
                      return (
                        <Card key={index} className="overflow-hidden bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-800">
                          <CardHeader 
                            className="py-3 px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            onClick={() => {
                              setOpenModules((prev) =>
                                prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
                              );
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {isOpen ? (
                                  <ChevronDown className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                )}
                                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                                  {index + 1}. {section?.module_title}
                                </CardTitle>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {section?.course_module_lessons?.length} lectures • {section?.duration}
                              </div>
                            </div>
                          </CardHeader>
                          {isOpen && (
                            <CardContent className="pt-0 pb-3 px-4">
                              <div className="space-y-0">
                                {section?.course_module_lessons?.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Play className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{item?.lesson_title}</span>
                                      {itemIndex < 2 && (
                                        <Badge variant="outline" className="text-xs text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400">
                                          Preview
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item?.duration}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                {/* Rating Overview */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Reviews</h2>
                  <div className="bg-gray-100 dark:bg-[#1a1f2e] rounded-lg p-8">
                    <div className="flex items-center gap-12">
                      {/* Left Side - Overall Rating */}
                      <div className="flex flex-col items-center justify-center min-w-[180px]">
                        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-3">{reviewStats.averageRating}</div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => {
                            const rating = parseFloat(reviewStats.averageRating.toString());
                            const isFullStar = i < Math.floor(rating);
                            const isHalfStar = i === Math.floor(rating) && rating % 1 >= 0.5;
                            
                            return (
                              <Star 
                                key={i} 
                                className={`h-6 w-6 ${
                                  isFullStar 
                                    ? "text-yellow-500 fill-yellow-500" 
                                    : isHalfStar 
                                    ? "text-yellow-500 fill-yellow-500" 
                                    : "text-gray-400 dark:text-gray-600"
                                }`}
                              />
                            );
                          })}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{reviewStats.totalReviews.toLocaleString()} reviews</div>
                      </div>

                      {/* Right Side - Rating Breakdown */}
                      <div className="flex-1 space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const percentage = reviewStats.percentages[star as keyof typeof reviewStats.percentages];
                          const count = reviewStats.distribution[star as keyof typeof reviewStats.distribution];
                          return (
                            <div key={star} className="flex items-center gap-4">
                              <div className="flex items-center gap-1 w-10">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{star}</span>
                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out"
                                  style={{ 
                                    width: `${percentage}%`,
                                    animation: 'expandWidth 1s ease-out'
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">{percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <style>{`
                  @keyframes expandWidth {
                    from {
                      width: 0%;
                    }
                  }
                `}</style>

                <Separator className="dark:bg-gray-800" />

                {/* Review Form */}
                {userInfo ? (
                  <Card className="bg-gray-50 dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4">
                      <h3 className="text-base font-semibold mb-3 text-gray-900 dark:text-white">
                        {editing ? "Update Your Review" : "Write a Review"}
                      </h3>
                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              className="transition-colors"
                            >
                              <Star 
                                className={`h-5 w-5 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400 dark:text-gray-600"}`}
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-[#0f1419] text-gray-900 dark:text-white"
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Share your experience with this course..."
                          required
                        />
                        <div className="flex gap-2">
                          <Button type="submit" disabled={loading || rating === 0} className="bg-orange-500 hover:bg-orange-600 text-white">
                            {editing ? "Update Review" : "Post Review"}
                          </Button>
                          {editing && (
                            <>
                              <Button type="button" variant="outline" onClick={handleCancelEdit} className="dark:border-gray-700 dark:text-gray-300">
                                Cancel
                              </Button>
                              <Button type="button" variant="destructive" onClick={handleDelete}>
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
                  <Card className="bg-gray-50 dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4 text-center">
                      <p className="text-gray-600 dark:text-gray-400 mb-3">Want to share your experience?</p>
                      <Button variant="outline" asChild className="dark:border-gray-700 dark:text-gray-300">
                        <Link to="/login">Log in to post a review</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {course?.course_reviews?.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    course?.course_reviews?.map((reviewData) => (
                      <Card key={reviewData?.id} className="bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-800">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                    {reviewData?.review_from_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white">{reviewData?.review_from_name || 'Anonymous'}</div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-4 w-4 ${i < reviewData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {new Date(reviewData?.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{reviewData?.review}</p>
                            </div>
                            {userInfo?.id === reviewData?.review_from_id && (
                              <div className="flex gap-1 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditReview(reviewData)}
                                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditId(reviewData.id);
                                    handleDelete();
                                  }}
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Course Preview Card */}
            <Card className="sticky top-6 overflow-hidden bg-white dark:bg-[#1a1f2e] border-gray-200 dark:border-gray-800">
              <div className="relative">
                <img
                  src={import.meta.env.VITE_API_BASE_URL + "/r/" + course?.thumbnail_photo_path}
                  alt={course?.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" variant="secondary" className="bg-white/90 text-black hover:bg-white">
                    <Play className="h-5 w-5 mr-2" />
                    Preview this course
                  </Button>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Discount Badge and Timer */}
                   

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${course?.price}</span>
                
                </div>

                {/* CTA Button */}
                {userInfo ? (
                  userCoursesLoading || enrollmentLoading ? (
                    <Button className="w-full h-12 text-base" disabled>
                      Loading...
                    </Button>
                  ) : isPartiallyPaid ? (
                    <div className="space-y-2">
                      <Button className="w-full h-12 text-base" variant="outline" asChild>
                        <Link to={`/course/${enrolledCourse?.id || course?.id}/learn`}>Continue Learning</Link>
                      </Button>
                      <Button 
                        className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white" 
                        onClick={() => navigate(`/course/${id}/checkout`)}
                      >
                        Complete Payment
                      </Button>
                    </div>
                  ) : isPaid && (enrolledCourse?.id || course?.id) ? (
                    <Button className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white" asChild>
                      <Link to={`/course/${enrolledCourse?.id || course?.id}/learn`}>Continue Learning</Link>
                    </Button>
                  ) : (
                    <Button className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                  )
                ) : (
                  <Button className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 text-white" asChild>
                    <Link to="/login">Login to Enroll</Link>
                  </Button>
                )}

                {/* Money Back Guarantee */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="h-4 w-4 text-teal-500" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>

                <Separator className="dark:bg-gray-800" />

                {/* Course Includes */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">This course includes:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Quiz Exam</span>
                    </div>
                  
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-teal-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">Certificate of completion</span>
                    </div>
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

export default CourseDetail;