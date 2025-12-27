import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Users, Star, BookOpen, Award, CheckCircle, Edit, Trash2, ChevronDown, ChevronRight, Video, Brain, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [openModules, setOpenModules] = useState<number[]>([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatusPayload | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  if (!id) {
    return <div>Loading...</div>; // or navigate away, etc.
  }
  const dispatch = useDispatch();
  const { course, loading, error } = useCourseDetails(Number(id));
  const {courses:userCourseList, loading: userCoursesLoading} = useSelector((state: RootState) => state.userCourseList);

  const descriptionParagraphs = useMemo(() => {
    if (!course?.description) return [];
    const parts = course.description
      .split(/\n+/)
      .map((part) => part.trim())
      .filter(Boolean);
    return parts.slice(0, 3);
  }, [course?.description]);

  const learningHighlights = useMemo(() => {
    if (!course?.course_modules) return [];
    return course.course_modules
      .flatMap((module) => (module.module_title ? [module.module_title] : []))
      .slice(0, 8);
  }, [course?.course_modules]);

  const originalPrice = useMemo(() => {
    if (!course?.price) return null;
    return Math.max(course.price * 4, course.price);
  }, [course?.price]);

  // Fetch user courses when component mounts and user is logged in
  useEffect(() => {
    if (userInfo?.id && (!userCourseList || userCourseList.length === 0)) {
      dispatch(getUserCourses(userInfo.id) as any);
    }
  }, [dispatch, userInfo?.id]);

  useEffect(() => {
    if (!id || !userInfo?.id) return;

    const loadEnrollmentStatus = async () => {
      setEnrollmentLoading(true);
      setEnrollmentError(null);
      try {
        const data = await fetchEnrollmentStatusByCourseId(id);
        setEnrollmentStatus(data);
      } catch (error) {
        setEnrollmentError("Unable to load enrollment status");
      } finally {
        setEnrollmentLoading(false);
      }
    };

    loadEnrollmentStatus();
  }, [id, userInfo?.id]);

  // Find the enrolled course for this course ID
  const enrolledCourse = userCourseList.find((uc: any) => uc?.course_id === Number(id));

  const paymentStatus = enrollmentStatus?.payment_status;
  const isPaid = paymentStatus === "Paid" || !!enrolledCourse;
  const isPartiallyPaid = paymentStatus === "PartiallyPaid";

  // Check if user is enrolled in this course
  useEffect(() => {
    if (enrolledCourse) {
      setIsEnrolled(true);
    } else {
      setIsEnrolled(false);
    }
  }, [enrolledCourse, userCourseList]);

  

  // Find if user already posted a review
  // const userReview = course?.course_reviews?.find((r: any) => r.review_from_id === userInfo?.id);



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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#212835] text-[#E5E7EB]">
      <header className="backdrop-blur bg-white/5 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center h-16">
            <RoleBasedNavigation />
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]">
              <div className="relative h-72 md:h-80">
                <img
                  src={import.meta.env.VITE_API_BASE_URL + "/" + course?.thumbnail_photo_path}
                  alt={course?.title}
                  className="w-full h-full object-cover brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge className="bg-[#FFB5A0] text-[#1a1f2e] font-semibold px-3 py-1 rounded-full">
                    {course?.category}
                  </Badge>
                  <Badge variant="outline" className="border-white/40 text-white bg-black/30 px-3 py-1 rounded-full">
                    {course?.level}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Button
                    size="lg"
                    className="bg-white text-[#1a1f2e] hover:brightness-110 rounded-full px-5 py-2 text-lg font-semibold shadow-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Preview this course
                  </Button>
                </div>
              </div>
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#E5E7EB]/80">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#FFB5A0] fill-[#FFB5A0]" />
                    <span className="font-semibold text-white">{course?.rating}</span>
                    <span className="text-[#E5E7EB]/60">({course?.total_reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#7DD3C0]" />
                    <span className="text-[#E5E7EB]/80">Industry-ready pace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#7DD3C0]" />
                    <span className="text-[#E5E7EB]/80">{course?.duration} hrs</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-[32px] font-bold text-white leading-tight">{course?.title}</h1>
                <p className="text-base md:text-lg leading-7 text-[#E5E7EB]/80">{course?.description}</p>
                {error && (
                  <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
              </CardContent>
            </div>

            <Tabs defaultValue="overview" className="rounded-2xl border border-white/10 bg-[#1f2536] shadow-lg">
              <TabsList className="flex w-full justify-start gap-10 rounded-t-2xl border-b border-white/10 bg-transparent px-6 py-4">
                <TabsTrigger
                  value="overview"
                  className="text-sm font-semibold uppercase tracking-wide text-[#7DD3C0] data-[state=active]:border-b-2 data-[state=active]:border-[#7DD3C0] data-[state=active]:text-white rounded-none pb-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="text-sm font-semibold uppercase tracking-wide text-[#E5E7EB]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#7DD3C0] data-[state=active]:text-white rounded-none pb-2"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-sm font-semibold uppercase tracking-wide text-[#E5E7EB]/70 data-[state=active]:border-b-2 data-[state=active]:border-[#7DD3C0] data-[state=active]:text-white rounded-none pb-2"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="p-6 md:p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-[#7DD3C0]" />
                    <h2 className="text-2xl font-bold text-white">About This Course</h2>
                  </div>
                  <div className="space-y-4 text-base leading-[1.7] text-[#E5E7EB]/80">
                    {descriptionParagraphs.length > 0 ? (
                      descriptionParagraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                    ) : (
                      <div
                        className="ql-editor leading-relaxed [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5 space-y-3 text-[#E5E7EB]/80"
                        dangerouslySetInnerHTML={{ __html: course?.content || "" }}
                      />
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7 shadow-inner">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-[#FFB5A0]" />
                    <h3 className="text-xl md:text-2xl font-bold text-white">What You&apos;ll Learn</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningHighlights.length > 0 ? (
                      learningHighlights.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 hover:border-[#4ADE80]/60 transition"
                        >
                          <CheckCircle className="h-5 w-5 text-[#4ADE80] mt-1" />
                          <span className="text-[#E5E7EB]">{item}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#E5E7EB]/70">Course outcomes will appear here once modules are available.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-7 shadow-inner space-y-4">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                    <Award className="h-5 w-5 text-[#FF7A2F]" />
                    Prerequisites
                  </h3>
                  <p className="text-[#E5E7EB]/80 leading-[1.7]">{course?.prerequisites}</p>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="p-6 md:p-8 space-y-5">
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#E5E7EB]/70">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {course?.course_modules?.length || 0} Modules
                  </span>
                  <span className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    {course?.course_modules?.reduce((acc, m) => acc + m.course_module_lessons.length, 0) || 0} Lectures
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {course?.duration} hrs
                  </span>
                  <span className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    {course?.total_no_of_quizzes} Quizzes
                  </span>
                </div>

                <div className="space-y-3">
                  {course?.course_modules?.map((section, index) => {
                    const isOpen = openModules.includes(index);
                    return (
                      <Card key={index} className="border-white/10 bg-black/30 text-white">
                        <CardHeader
                          className="pb-3 cursor-pointer select-none"
                          onClick={() => {
                            setOpenModules((prev) =>
                              prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
                            );
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {isOpen ? (
                                <ChevronDown className="h-5 w-5 transition-transform text-[#7DD3C0]" />
                              ) : (
                                <ChevronRight className="h-5 w-5 transition-transform text-[#7DD3C0]" />
                              )}
                              <CardTitle className="text-lg text-white">{section?.module_title}</CardTitle>
                            </div>
                            <div className="text-sm text-[#E5E7EB]/60">
                              {section?.course_module_lessons.length} lessons
                            </div>
                          </div>
                        </CardHeader>
                        {isOpen && (
                          <CardContent>
                            <div className="space-y-2">
                              {section?.course_module_lessons.map((item, itemIndex) => {
                                const lessonNumber = `${index + 1}.${itemIndex + 1}`;
                                return (
                                  <div
                                    key={itemIndex}
                                    className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs font-semibold text-[#FFB5A0]">{lessonNumber}</span>
                                      <Play className="h-4 w-4 text-[#7DD3C0]" />
                                      <span className="text-[#E5E7EB]">{item?.lesson_title}</span>
                                    </div>
                                    <span className="text-sm text-[#E5E7EB]/60">{item?.duration} min</span>
                                  </div>
                                );
                              })}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-[#7DD3C0]">Student Rating</p>
                    <div className="text-4xl font-bold text-white flex items-center gap-2">
                      {course?.rating}
                      <Star className="h-6 w-6 text-[#FFB5A0] fill-[#FFB5A0]" />
                    </div>
                    <p className="text-[#E5E7EB]/70">{course?.total_reviews} reviews</p>
                  </div>
                </div>

                {userInfo ? (
                  <Card className="bg-black/30 border-white/10 text-white">
                    <CardContent className="p-4 md:p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#FF7A2F]" />
                        <h4 className="text-lg font-semibold">
                          {editing ? "Update Your Review" : "Share your experience"}
                        </h4>
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#E5E7EB]/70">Rating:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setRating(star)}
                              className={`transition-colors ${star <= rating ? "text-[#FFB5A0]" : "text-gray-500 hover:text-[#FFB5A0]"}`}
                            >
                              <Star className="h-5 w-5" fill={star <= rating ? "#FFB5A0" : "none"} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full border border-white/10 bg-black/20 rounded-xl p-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-[#7DD3C0]"
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Tell others how this course helped you..."
                          required
                        />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="submit"
                            disabled={loading || rating === 0}
                            className="bg-[#FF7A2F] hover:brightness-110 text-white px-5"
                          >
                            {editing ? "Update Review" : "Post Review"}
                          </Button>
                          {editing && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={loading}
                                className="border-white/30 text-white hover:bg-white/10"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-red-500 hover:brightness-110"
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
                  <Card className="bg-black/30 border-white/10 text-white">
                    <CardContent className="p-4 text-center space-y-3">
                      <p className="text-[#E5E7EB]/80">Want to share your experience?</p>
                      <Button variant="outline" asChild className="border-[#7DD3C0] text-white hover:bg-[#7DD3C0]/10">
                        <Link to="/login">Log in to post a review</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  <h4 className="text-lg font-semibold text-white sticky top-0 bg-[#1f2536] py-2">
                    Student Reviews ({course?.course_reviews?.length || 0})
                  </h4>

                  {course?.course_reviews?.length === 0 ? (
                    <div className="text-center py-8 text-[#E5E7EB]/70">
                      <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    course?.course_reviews?.map((reviewData) => (
                      <Card key={reviewData?.id} className="relative bg-black/30 border-white/10 text-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <Avatar className="h-9 w-9">
                                  {reviewData?.review_from_image_path ? (
                                    <AvatarImage
                                      src={import.meta.env.VITE_API_BASE_URL + "/" + reviewData.review_from_image_path}
                                      alt={reviewData?.review_from_name}
                                    />
                                  ) : (
                                    <AvatarFallback className="bg-[#7DD3C0]/20 text-[#7DD3C0] text-xs">
                                      {reviewData?.review_from_name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <span className="font-medium text-sm text-white">{reviewData?.review_from_name}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="flex">
                                      {[...Array(reviewData.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-[#FFB5A0] fill-[#FFB5A0]" />
                                      ))}
                                      {[...Array(5 - reviewData.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-gray-600" />
                                      ))}
                                    </div>
                                    <span className="text-xs text-[#E5E7EB]/60">
                                      {new Date(reviewData?.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-[#E5E7EB]/90 text-sm leading-relaxed">{reviewData?.review}</p>
                            </div>

                            {userInfo?.id === reviewData?.review_from_id && (
                              <div className="flex space-x-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditReview(reviewData)}
                                  className="h-8 w-8 p-0 text-white hover:bg-white/10"
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
                                  className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10"
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

          <div className="space-y-6 w-full">
            <div className="lg:sticky lg:top-10 rounded-2xl border border-white/10 bg-[#121728] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] overflow-hidden">
              <div className="relative h-48">
                <img
                  src={import.meta.env.VITE_API_BASE_URL + "/" + course?.thumbnail_photo_path}
                  alt={course?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-[#7DD3C0]/20" />
                <div className="absolute bottom-3 left-3">
                  <Button className="bg-white text-[#1a1f2e] px-4 py-2 rounded-full text-sm font-semibold hover:brightness-110">
                    Preview this course
                  </Button>
                </div>
              </div>

              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-[#FF7A2F] text-white rounded-full px-3 py-1 font-semibold">75% OFF</Badge>
                  <div className="flex items-center gap-2 text-sm text-[#E5E7EB]/70">
                    <Clock className="h-4 w-4 text-[#FFB5A0]" />
                    Ends in 2 days
                  </div>
                </div>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-white">${course?.price}</span>
                  {originalPrice && (
                    <span className="text-lg text-[#E5E7EB]/60 line-through">${originalPrice}</span>
                  )}
                </div>

                {userInfo ? (
                  userCoursesLoading || enrollmentLoading ? (
                    <Button className="w-full mb-2 bg-[#FF7A2F] hover:brightness-110 text-lg font-semibold rounded-xl" disabled>
                      Loading...
                    </Button>
                  ) : isPartiallyPaid ? (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-[#FF7A2F] hover:brightness-110 text-lg font-semibold rounded-xl"
                        onClick={() => navigate(`/course/${id}/checkout`)}
                      >
                        Complete installment payment
                      </Button>
                      <Button
                        className="w-full border border-white/20 text-white hover:bg-white/10 rounded-xl"
                        variant="outline"
                        asChild
                      >
                        <Link to={`/course/${enrolledCourse?.id || course?.id}/learn`}>Continue Learning</Link>
                      </Button>
                    </div>
                  ) : isPaid && (enrolledCourse?.id || course?.id) ? (
                    <Button className="w-full bg-[#7DD3C0] hover:brightness-110 text-[#1a1f2e] text-lg font-semibold rounded-xl" asChild>
                      <Link to={`/course/${enrolledCourse?.id || course?.id}/learn`}>Continue Learning</Link>
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        className="w-full bg-[#FF7A2F] hover:brightness-110 text-lg font-semibold rounded-xl"
                        onClick={handleEnroll}
                      >
                        Enroll Now
                      </Button>
                      <Button className="w-full border border-white/30 text-white hover:bg-white/10 rounded-xl" variant="outline">
                        Add to Cart
                      </Button>
                    </div>
                  )
                ) : (
                  <Button className="w-full bg-[#FF7A2F] hover:brightness-110 text-lg font-semibold rounded-xl" asChild>
                    <Link to="/login">Login to Enroll</Link>
                  </Button>
                )}
                {enrollmentError && (
                  <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {enrollmentError}
                  </p>
                )}

                <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-[#4ADE80]" />
                  <div className="text-sm">
                    <p className="text-white font-semibold">30-Day Money-Back Guarantee</p>
                    <p className="text-[#E5E7EB]/70">Learn risk-free</p>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="space-y-2 text-sm text-[#E5E7EB]/80">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold text-white">{course?.duration} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level</span>
                    <span className="font-semibold text-white">{course?.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language</span>
                    <span className="font-semibold text-white">{course?.language}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
