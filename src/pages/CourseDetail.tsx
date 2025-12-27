import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, Star, BookOpen, CheckCircle, Edit, Trash2, ChevronDown, ChevronRight, Video, Brain, Check, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import { useCourseDetails } from '@/hooks/useCourseDetail';
import { useAuth } from '@/hooks/useAuth';
import { createCourseReview, deleteCourseReview, updateCourseReview } from '@/redux/actions/reviewAction';
import { getUserCourses } from '@/redux/actions/userCourseAction';
import { fetchEnrollmentStatusByCourseId } from '@/services/userCourses';
import { RootState } from '@/redux/store';
import { EnrollmentStatusPayload } from '@/types/payment';
import "react-quill/dist/quill.snow.css";

const CourseDetail = () => {
  const { userInfo } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [openModules, setOpenModules] = useState<number[]>([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatusPayload | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  const { course, loading, error } = useCourseDetails(Number(id));
  const userCourseState = useSelector((state: RootState) => state.userCourseList);
  const userCourseList = userCourseState?.courses || [];
  const userCoursesLoading = userCourseState?.loading;

  useEffect(() => {
    if (userInfo?.id && (!userCourseList || userCourseList.length === 0)) {
      dispatch(getUserCourses(userInfo.id) as any);
    }
  }, [dispatch, userInfo?.id, userCourseList?.length]);

  useEffect(() => {
    if (!id || !userInfo?.id) return;

    const loadEnrollmentStatus = async () => {
      setEnrollmentLoading(true);
      try {
        const data = await fetchEnrollmentStatusByCourseId(id);
        setEnrollmentStatus(data);
      } catch (err) {
        console.error(err);
      } finally {
        setEnrollmentLoading(false);
      }
    };

    loadEnrollmentStatus();
  }, [id, userInfo?.id]);

  const enrolledCourse = userCourseList?.find((uc: any) => uc?.course_id === Number(id));
  const paymentStatus = enrollmentStatus?.payment_status;
  const isPaid = paymentStatus === "Paid" || !!enrolledCourse;
  const isPartiallyPaid = paymentStatus === "PartiallyPaid";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requestBody = {
      course_id: course?.id,
      rating,
      review,
      is_verified_purchase: true,
    };

    const updatedBody = {
      course_id: course?.id,
      rating,
      review,
      isVerifiedPurchase: true
    };

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

  const modules = course?.course_modules || [];
  const totalLessons = useMemo(
    () => modules.reduce((sum, mod) => sum + (mod?.course_module_lessons?.length || 0), 0),
    [modules]
  );
  const quizzesCount = course?.total_no_of_quizzes ?? 0;
  const totalReviewsCount = course?.course_reviews?.length || course?.total_reviews || 0;

  const learningHighlights = useMemo(() => {
    const highlights: string[] = [];

    const featureList = (course as any)?.features;
    if (Array.isArray(featureList) && featureList.length) {
      highlights.push(...featureList.filter(Boolean));
    }

    if (!highlights.length && modules.length) {
      modules.forEach((mod) => {
        if (mod?.module_title) highlights.push(mod.module_title);
        mod?.course_module_lessons?.forEach((lesson) => {
          if (lesson?.lesson_title) highlights.push(lesson.lesson_title);
        });
      });
    }

    if (!highlights.length && course?.content) {
      const plainText = course.content.replace(/<[^>]+>/g, " ");
      const sentences = plainText
        .split(/[•\n\.]/)
        .map((item) => item.trim())
        .filter(Boolean);
      highlights.push(...sentences);
    }

    return highlights.slice(0, 8);
  }, [course?.content, modules, (course as any)?.features]);

  const requirementsList = useMemo(() => {
    const raw = course?.prerequisites || "";
    if (!raw) return [];
    return raw
      .split(/[\n•-]/)
      .map((item) => item.replace(/^[^a-zA-Z0-9]+/, "").trim())
      .filter(Boolean);
  }, [course?.prerequisites]);

  const reviewCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    course?.course_reviews?.forEach((reviewData) => {
      const ratingValue = Math.min(5, Math.max(1, Math.round(reviewData?.rating || 0)));
      counts[ratingValue] += 1;
    });
    return counts;
  }, [course?.course_reviews]);

  const courseIncludes = [
    course?.duration ? `${course.duration} hours total` : null,
    modules.length ? `${modules.length} modules` : null,
    totalLessons ? `${totalLessons} lessons` : null,
    quizzesCount ? `${quizzesCount} quizzes` : null,
    course?.language ? `${course.language} audio` : null,
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
        <RoleBasedNavigation currentPath={`/course/${id}`} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="h-[500px] w-full rounded-2xl lg:col-span-2" />
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
        <RoleBasedNavigation currentPath={`/course/${id}`} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">Unable to load course</h2>
            <p className="text-muted-foreground">
              We couldn&apos;t find the course details. Please try again or return to the courses list.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-slate-950">
      <RoleBasedNavigation currentPath={`/course/${id}`} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-emerald-50/80 via-white to-transparent dark:from-slate-900 dark:via-slate-950" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-white/80 dark:bg-slate-900 shadow-sm backdrop-blur border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Overview</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">{course?.title}</h1>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-4">{course?.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {course?.category && <Badge variant="secondary" className="rounded-full">{course.category}</Badge>}
                  {course?.level && <Badge variant="outline" className="rounded-full border-emerald-200 text-emerald-700 dark:text-emerald-300 dark:border-emerald-800">{course.level}</Badge>}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-none shadow-none bg-slate-50 dark:bg-slate-800/70">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">Rating</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{course?.rating ?? "—"}</div>
                      <p className="text-xs text-muted-foreground">{totalReviewsCount} reviews</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-none bg-slate-50 dark:bg-slate-800/70">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-semibold">Modules</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{modules.length}</div>
                      <p className="text-xs text-muted-foreground">Structured sections</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-none bg-slate-50 dark:bg-slate-800/70">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-sky-500">
                        <Play className="h-4 w-4" />
                        <span className="text-sm font-semibold">Lessons</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{totalLessons}</div>
                      <p className="text-xs text-muted-foreground">Video & reading</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-none bg-slate-50 dark:bg-slate-800/70">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-indigo-500">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-semibold">Duration</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{course?.duration ?? "—"} hrs</div>
                      <p className="text-xs text-muted-foreground">{quizzesCount} quizzes</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full w-full max-w-lg">
                      <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
                      <TabsTrigger value="curriculum" className="rounded-full">Curriculum</TabsTrigger>
                      <TabsTrigger value="reviews" className="rounded-full">Reviews</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="pt-6 space-y-6">
                      <Card className="border-slate-100 dark:border-slate-800">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-5 w-5 text-emerald-500" />
                            <CardTitle>About This Course</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div
                            className="ql-editor px-0 leading-relaxed text-slate-700 dark:text-slate-200 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5 space-y-2"
                            dangerouslySetInnerHTML={{ __html: course?.content }}
                          />
                        </CardContent>
                      </Card>

                      <Card className="border-slate-100 dark:border-slate-800">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                            <CardTitle>What You&apos;ll Learn</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {learningHighlights.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {learningHighlights.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3">
                                  <div className="mt-0.5 text-emerald-500">
                                    <Check className="h-4 w-4" />
                                  </div>
                                  <span className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed">{item}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Course objectives will appear here.</p>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-slate-100 dark:border-slate-800">
                        <CardHeader>
                          <CardTitle>Requirements</CardTitle>
                          <CardDescription>Everything you need before starting the course</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {requirementsList.length ? (
                            <ul className="space-y-2">
                              {requirementsList.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">No prerequisites listed for this course.</p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="curriculum" className="pt-6 space-y-4">
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-emerald-500" />
                          {modules.length} sections
                        </span>
                        <span className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-sky-500" />
                          {totalLessons} lectures
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-indigo-500" />
                          {course?.duration} hours
                        </span>
                        <span className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-amber-500" />
                          {quizzesCount} quizzes
                        </span>
                      </div>

                      <div className="space-y-3">
                        {modules.map((section, index) => {
                          const isOpen = openModules.includes(index);
                          return (
                            <Card key={index} className="border-slate-100 dark:border-slate-800">
                              <CardHeader
                                className="pb-3 cursor-pointer select-none"
                                onClick={() => {
                                  setOpenModules((prev) =>
                                    prev.includes(index)
                                      ? prev.filter((i) => i !== index)
                                      : [...prev, index]
                                  );
                                }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    {isOpen ? (
                                      <ChevronDown className="h-5 w-5 mr-2 transition-transform" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 mr-2 transition-transform" />
                                    )}
                                    <CardTitle className="text-lg">{index + 1}. {section?.module_title}</CardTitle>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {section?.course_module_lessons?.length || 0} lessons • {section?.duration || "—"}
                                  </div>
                                </div>
                              </CardHeader>
                              {isOpen && (
                                <CardContent className="pt-0">
                                  <div className="space-y-2">
                                    {section?.course_module_lessons?.map((item, itemIndex) => {
                                      const lessonNumber = `${index + 1}.${itemIndex + 1}`;
                                      return (
                                        <div
                                          key={itemIndex}
                                          className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                                        >
                                          <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-muted-foreground">{lessonNumber}</span>
                                            <Play className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-foreground">{item?.lesson_title}</span>
                                          </div>
                                          <span className="text-sm text-muted-foreground">{item?.duration || "—"}</span>
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

                    <TabsContent value="reviews" className="pt-6 space-y-6">
                      <Card className="border-slate-100 dark:border-slate-800">
                        <CardContent className="p-6 grid md:grid-cols-3 gap-6">
                          <div className="md:border-r md:border-slate-200 dark:md:border-slate-800 pr-0 md:pr-6">
                            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{course?.rating ?? "—"}</div>
                            <div className="flex items-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-5 w-5 ${i < Math.round(course?.rating || 0) ? "text-amber-400 fill-current" : "text-slate-300"}`} />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{totalReviewsCount} reviews</p>
                          </div>

                          <div className="md:col-span-2 space-y-3">
                            {[5, 4, 3, 2, 1].map((starValue) => {
                              const count = reviewCounts[starValue] || 0;
                              const percentage = totalReviewsCount ? Math.round((count / totalReviewsCount) * 100) : 0;
                              return (
                                <div key={starValue} className="flex items-center gap-3">
                                  <span className="w-6 text-sm font-medium text-slate-700 dark:text-slate-200">{starValue}</span>
                                  <Progress value={percentage} className="flex-1 h-2" />
                                  <span className="text-xs text-muted-foreground w-10 text-right">{percentage}%</span>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      {userInfo ? (
                        <Card className="border-slate-100 dark:border-slate-800">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">Share your thoughts</p>
                                <h4 className="text-xl font-semibold">{editing ? "Update your review" : "Write a review"}</h4>
                              </div>
                              <Badge variant="secondary" className="rounded-full">
                                Verified purchase
                              </Badge>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`transition-colors ${star <= rating ? "text-amber-400" : "text-slate-300 hover:text-amber-200"}`}
                                  >
                                    <Star className="h-6 w-6" fill={star <= rating ? "#facc15" : "none"} />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                className="w-full border rounded-xl p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-900/70"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your experience with this course..."
                                required
                              />
                              <div className="flex flex-wrap gap-2">
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
                                      className="flex items-center gap-1"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="border-slate-100 dark:border-slate-800">
                          <CardContent className="p-6 text-center space-y-3">
                            <p className="text-muted-foreground">Want to share your experience?</p>
                            <Button variant="outline" asChild>
                              <Link to="/login">Log in to post a review</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      )}

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Student Reviews ({course?.course_reviews?.length || 0})</h4>
                        {course?.course_reviews?.length === 0 ? (
                          <Card className="border-dashed border-slate-200 dark:border-slate-800">
                            <CardContent className="p-6 text-center text-muted-foreground">
                              No reviews yet. Be the first to share your experience!
                            </CardContent>
                          </Card>
                        ) : (
                          course?.course_reviews?.map((reviewData) => (
                            <Card key={reviewData?.id} className="border-slate-100 dark:border-slate-800">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={reviewData?.avatar} alt={reviewData?.reviewer_name} />
                                        <AvatarFallback className="text-xs">U</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <div className="flex">
                                            {[...Array(reviewData.rating)].map((_, i) => (
                                              <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                                            ))}
                                            {[...Array(5 - reviewData.rating)].map((_, i) => (
                                              <Star key={i} className="h-4 w-4 text-slate-200" />
                                            ))}
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                            {new Date(reviewData?.created_at).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{reviewData?.review}</p>
                                  </div>

                                  {userInfo?.id === reviewData?.review_from_id && (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditReview(reviewData)}
                                        className="h-8 w-8 p-0"
                                        aria-label="Edit review"
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
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        aria-label="Delete review"
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
              </div>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-24 overflow-hidden border-slate-100 dark:border-slate-800 shadow-lg">
                <div className="relative h-52 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={import.meta.env.VITE_API_BASE_URL + "/" + course?.thumbnail_photo_path}
                    alt={course?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                      <Play className="h-5 w-5 mr-2" />
                      Preview this course
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">${course?.price}</span>
                        {course?.price && (
                          <span className="text-lg text-muted-foreground line-through opacity-70">
                            ${(Number(course?.price) * 1.5).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Limited time offer</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Best Seller</Badge>
                  </div>

                  {userInfo ? (
                    userCoursesLoading || enrollmentLoading ? (
                      <Button className="w-full" disabled>
                        Loading...
                      </Button>
                    ) : isPartiallyPaid ? (
                      <div className="space-y-3">
                        <Button className="w-full" variant="outline" asChild>
                          <Link to={`/course/${enrolledCourse?.id || course?.id}/learn`}>Continue Learning</Link>
                        </Button>
                        <Button className="w-full" onClick={() => navigate(`/course/${id}/checkout`)}>
                          Complete installment payment
                        </Button>
                      </div>
                    ) : isPaid && (enrolledCourse?.id || course?.id) ? (
                      <Button className="w-full" asChild>
                        <Link to={`/course/${enrolledCourse?.id || course?.id}/learn`}>Continue Learning</Link>
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={handleEnroll}>
                        Enroll Now
                      </Button>
                    )
                  ) : (
                    <Button className="w-full" asChild>
                      <Link to="/login">Login to Enroll</Link>
                    </Button>
                  )}

                  <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-semibold">30-Day Money-Back Guarantee</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Full access to course materials after enrollment.</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-900 dark:text-white">This course includes:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {courseIncludes.length ? (
                        courseIncludes.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-muted-foreground">Course benefits will appear here.</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
