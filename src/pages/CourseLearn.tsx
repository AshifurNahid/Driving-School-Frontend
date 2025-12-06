import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addDays, format, parse } from "date-fns";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { CourseLearnHeader } from "@/components/course-learn/CourseLearnHeader";
import { ModuleSidebar } from "@/components/course-learn/ModuleSidebar";
import { LessonViewer } from "@/components/course-learn/LessonViewer";
import { QuizViewer } from "@/components/course-learn/QuizViewer";
import { CourseLearnSkeleton } from "@/components/course-learn/CourseLearnSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import CourseSlotBookingModal from "@/components/course-learn/CourseSlotBookingModal";
import BookingStatusModal from "@/components/appointments/BookingStatusModal";
import { useToast } from "@/hooks/use-toast";
import { useUserCourse } from "@/hooks/useUserCourse";
import {
  LearningSelection,
  findInitialSelection,
  findLessonById,
  findQuizById,
  resolveAttachmentUrl,
} from "@/utils/courseLearn";
import { ExtendedCourseModule } from "@/types/userCourse";
import {
  getAppointmentSlotsByDate,
  bookCourseBasedAppointment,
  bookCourseAppointmentReset,
  BookCourseAppointmentPayload,
} from "@/redux/actions/appointmentAction";
import { RootState } from "@/redux/reducers";
import { AppointmentSlot } from "@/redux/reducers/appointmentReducer";

const formatTimeRange = (start: string, end: string) => {
  const startDate = parse(start, "HH:mm:ss", new Date());
  const endDate = parse(end, "HH:mm:ss", new Date());
  return `${format(startDate, "h:mm a")} – ${format(endDate, "h:mm a")}`;
};

const SlotCard = ({
  slot,
  onSelect,
  selected,
}: {
  slot: AppointmentSlot;
  onSelect: (slot: AppointmentSlot) => void;
  selected: boolean;
}) => (
  <button
    onClick={() => onSelect(slot)}
    className={`w-full text-left rounded-xl border p-4 transition hover:border-primary hover:shadow ${
      selected ? "border-primary ring-2 ring-primary/30" : "border-border/70"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Time</p>
        <p className="font-semibold">{formatTimeRange(slot.startTime, slot.endTime)}</p>
      </div>
      <div className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Available</div>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-2">Instructor: {slot.instructorName || `Instructor ${slot.instructorId}`}</span>
      <span className="flex items-center gap-2">Location: {slot.location || "TBD"}</span>
    </div>
  </button>
);

const CourseLearn = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { data, isLoading, isError, error, refetch } = useUserCourse(id);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [selection, setSelection] = useState<LearningSelection | null>(null);
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);

  const { appointmentSlots, loading: slotLoading } = useSelector(
    (state: RootState) => state.appointmentSlots
  );
  const courseBooking = useSelector((state: RootState) => state.bookCourseAppointment);

  const course = data?.course;
  const modules = course?.course_modules || [];
  const totalLessons = useMemo(
    () => modules.reduce((sum, mod) => sum + (mod.course_module_lessons?.length || 0), 0),
    [modules]
  );
  const totalQuizzes = useMemo(
    () => modules.reduce((sum, mod) => sum + (mod.quizzes?.length || 0), 0),
    [modules]
  );

  useEffect(() => {
    if (selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      dispatch<any>(getAppointmentSlotsByDate(dateString));
    }
  }, [selectedDate, dispatch]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  useEffect(() => {
    if (courseBooking.success || courseBooking.error) {
      setIsStatusModalOpen(true);
      setIsBookingModalOpen(false);
    }
  }, [courseBooking.success, courseBooking.error]);

  useEffect(() => {
    if (modules.length) {
      const initial = findInitialSelection(modules);
      setSelection(initial);
      const allOpen: Record<number, boolean> = {};
      modules.forEach((mod) => {
        if (mod.id) allOpen[mod.id] = true;
      });
      setExpanded(allOpen);
    }
  }, [modules]);

  const toggleModule = (moduleId: number) => {
    setExpanded((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const selectLesson = (moduleId: number, lessonId: number) => {
    setSelection({ moduleId, lessonId, quizId: undefined });
  };

  const selectQuiz = (moduleId: number, quizId: number) => {
    setSelection({ moduleId, quizId, lessonId: undefined });
  };

  const calculateHoursToConsume = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * 100) / 100;
  };

  const handleSlotSelect = (slot: AppointmentSlot) => {
    const slotHours = calculateHoursToConsume(slot.startTime, slot.endTime);
    if (remainingOfflineHours < slotHours) {
      toast({
        title: "Slot exceeds remaining hours",
        description: `Hey we have only ${remainingOfflineHours} hour(s), you cannot select a slot longer than ${remainingOfflineHours}.`,
        variant: "destructive",
      });
      return;
    }
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = (payload: BookCourseAppointmentPayload) => {
    dispatch<any>(bookCourseBasedAppointment(payload));
  };

  const handleStatusClose = () => {
    const wasSuccess = courseBooking.success;
    setIsStatusModalOpen(false);
    dispatch<any>(bookCourseAppointmentReset());
    if (wasSuccess) {
      window.location.reload();
    }
  };

  const handleSlotPickerChange = (open: boolean) => {
    setIsSlotPickerOpen(open);
    if (!open) {
      setSelectedSlot(null);
    }
  };

  const nextAvailableDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return addDays(today, 1);
  };

  const activeLesson = useMemo(
    () => findLessonById(modules, selection?.moduleId, selection?.lessonId),
    [modules, selection]
  );

  const activeQuiz = useMemo(
    () => findQuizById(modules, selection?.moduleId, selection?.quizId),
    [modules, selection]
  );

  const activeModule = useMemo(
    () => modules.find((mod) => mod.id === selection?.moduleId),
    [modules, selection?.moduleId]
  );

  const totalHours = useMemo(() => {
    if (course?.total_duration_hours) return course.total_duration_hours;
    if (course?.duration) return course.duration;
    if (modules?.length) {
      return modules.reduce(
        (sum: number, mod: ExtendedCourseModule) => sum + Number(mod.duration || 0),
        0
      );
    }
    return 0;
  }, [course, modules]);

  const courseType = course?.course_type ?? 0;
  const totalOfflineHours = Number(data?.totalOfflineHours ?? course?.offline_training_hours ?? 0);
  const consumedOfflineHours = Number(data?.consumedOfflineHours ?? 0);
  const remainingOfflineHours = Number(
    data?.remainingOfflineHours ?? Math.max(totalOfflineHours - consumedOfflineHours, 0)
  );

  const availableSlots = useMemo(
    () =>
      appointmentSlots.filter(
        (slot) => !slot.isBooked && !(slot as any).isbooked && Number((slot as any).isbooked) !== 1
      ),
    [appointmentSlots]
  );

  const attachmentUrl = resolveAttachmentUrl(activeLesson?.lesson_attachment_path);

    return (
      <div className="min-h-screen bg-slate-50 text-foreground">
        <RoleBasedNavigation currentPath={`/course/${id}/learn`} />
        <CourseLearnHeader
          title={course?.title || "Course"}
        progress={data?.progress_percentage || 0}
        totalHours={Number(totalHours || 0)}
        offlineHours={totalOfflineHours}
      />

        <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-8">
        {isLoading && <CourseLearnSkeleton />}

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Unable to load course</AlertTitle>
            <AlertDescription>{error?.message || "Please try again later."}</AlertDescription>
            <div className="mt-4">
              <Button onClick={() => refetch()}>Retry</Button>
            </div>
          </Alert>
        )}

        {!isLoading && !isError && !course && (
          <Alert>
            <AlertTitle>No course found</AlertTitle>
            <AlertDescription>
              We couldn't locate this enrollment. Please return to your dashboard and try again.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && course && (
          <>
              {courseType !== 0 && (
                <Card className="mb-8 rounded-2xl border-0 bg-white shadow-md shadow-blue-100/60">
                  <CardHeader className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">Offline training</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Reserve your next in-car training session at a time that works for you.
                      </p>
                    </div>
                    <div className="grid w-full grid-cols-3 gap-3 sm:w-auto">
                      <div className="rounded-xl border border-blue-50 bg-blue-50/60 px-4 py-3 text-center">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-blue-700">{totalOfflineHours} hrs</p>
                      </div>
                      <div className="rounded-xl border border-blue-50 bg-white px-4 py-3 text-center shadow-sm">
                        <p className="text-xs text-muted-foreground">Consumed</p>
                        <p className="text-lg font-bold text-blue-600">{consumedOfflineHours} hrs</p>
                      </div>
                      <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-center">
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className="text-lg font-bold text-green-700">{remainingOfflineHours} hrs</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Choose a time that works best for your next in-car session.
                    </div>
                    <Button
                      className="rounded-lg px-6 py-2"
                      onClick={() => {
                        setIsSlotPickerOpen(true);
                        setSelectedDate(nextAvailableDate());
                      }}
                    >
                      Book offline slot
                    </Button>
                  </CardContent>
                </Card>
              )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
              <div className="hidden lg:block">
                <ModuleSidebar
                  courseTitle={course.title}
                  progressPercentage={data?.progress_percentage}
                  totalLessons={totalLessons}
                  totalQuizzes={totalQuizzes}
                  modules={modules}
                  expanded={expanded}
                  onToggle={toggleModule}
                  onSelectLesson={selectLesson}
                  onSelectQuiz={selectQuiz}
                  activeLessonId={selection?.lessonId}
                  activeQuizId={selection?.quizId}
                />
              </div>

              <section className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className="text-muted-foreground">Course</BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="text-muted-foreground">
                          {activeModule?.module_title || "Section"}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="font-semibold text-foreground">
                          {activeLesson?.lesson_title || activeQuiz?.title || "Choose content"}
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>

                  </div>

                  <div className="flex flex-col items-end gap-2 text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span>{modules.length} sections</span>
                      <Separator orientation="vertical" className="h-6" />
                      <span>{totalLessons} lessons</span>
                      <Separator orientation="vertical" className="h-6" />
                      <span>{totalQuizzes} quizzes</span>
                    </div>
                    <Sheet open={isContentOpen} onOpenChange={setIsContentOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          Course content
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-full max-w-md p-0">
                        <div className="h-full overflow-y-auto bg-muted/50 p-4">
                          <ModuleSidebar
                            courseTitle={course.title}
                            progressPercentage={data?.progress_percentage}
                            totalLessons={totalLessons}
                            totalQuizzes={totalQuizzes}
                            modules={modules}
                            expanded={expanded}
                            onToggle={toggleModule}
                            onSelectLesson={(moduleId, lessonId) => {
                              selectLesson(moduleId, lessonId);
                              setIsContentOpen(false);
                            }}
                            onSelectQuiz={(moduleId, quizId) => {
                              selectQuiz(moduleId, quizId);
                              setIsContentOpen(false);
                            }}
                            activeLessonId={selection?.lessonId}
                            activeQuizId={selection?.quizId}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>

                {activeLesson && (
                  <LessonViewer lesson={activeLesson} attachmentUrl={attachmentUrl} />
                )}

                {activeQuiz && <QuizViewer quiz={activeQuiz} />}

                {!activeLesson && !activeQuiz && (
                  <Alert>
                    <AlertTitle>Select a lesson or quiz</AlertTitle>
                    <AlertDescription>
                      Use the course content navigation to open lessons and quizzes.
                    </AlertDescription>
                  </Alert>
                )}
              </section>
            </div>
          </>
        )}

        <Dialog open={isSlotPickerOpen} onOpenChange={handleSlotPickerChange}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Select an offline slot</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Choose a date after today to see the available in-car training times.
              </p>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-[320px_1fr]">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Choose a date</p>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date ?? nextAvailableDate())}
                  disabled={(date) => date < nextAvailableDate()}
                  className="rounded-lg border"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Available slots</p>
                  <p className="text-sm font-medium">
                    {selectedDate ? format(selectedDate, "PPP") : "Select a date to view slots"}
                  </p>
                </div>

                {slotLoading && <p className="text-sm text-muted-foreground">Loading slots...</p>}

                {!slotLoading && selectedDate && availableSlots.length === 0 && (
                  <Alert>
                    <AlertTitle>No slots available</AlertTitle>
                    <AlertDescription>
                      There are no appointment slots for the selected date. Please choose another day.
                    </AlertDescription>
                  </Alert>
                )}

                {!slotLoading && selectedDate && availableSlots.length > 0 && (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {availableSlots.map((slot) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onSelect={handleSlotSelect}
                        selected={selectedSlot?.id === slot.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleSlotPickerChange(false)}>
                Close
              </Button>
              <Button
                disabled={!selectedSlot}
                onClick={() => {
                  setIsBookingModalOpen(true);
                  setIsSlotPickerOpen(false);
                }}
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CourseSlotBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
          slot={selectedSlot}
          userCourseId={data?.id}
          loading={courseBooking.loading}
        />

        <BookingStatusModal
          isOpen={isStatusModalOpen}
          onClose={handleStatusClose}
          success={courseBooking.success}
          message={courseBooking.message}
          errorMessage={courseBooking.error}
          appointmentData={courseBooking.data}
        />
      </main>
    </div>
  );
};

export default CourseLearn;
