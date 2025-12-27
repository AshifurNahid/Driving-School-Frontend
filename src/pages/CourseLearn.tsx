import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RoleBasedNavigation from "@/components/navigation/RoleBasedNavigation";
import { ModuleSidebar } from "@/components/course-learn/ModuleSidebar";
import { LessonViewer } from "@/components/course-learn/LessonViewer";
import { QuizViewer } from "@/components/course-learn/QuizViewer";
import { CourseLearnSkeleton } from "@/components/course-learn/CourseLearnSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CourseSlotBookingModal from "@/components/course-learn/CourseSlotBookingModal";
import BookingStatusModal from "@/components/appointments/BookingStatusModal";
import { useToast } from "@/hooks/use-toast";
import { useUserCourse } from "@/hooks/useUserCourse";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Check, Menu, Upload, Calendar as CalendarIcon } from "lucide-react";
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
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  return `${formatTime(parseTime(start))} – ${formatTime(parseTime(end))}`;
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
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
    className={`w-full text-left rounded-xl border-2 p-4 transition-colors bg-white hover:border-[#4ECDC4] dark:bg-[#1E2329] ${
      selected
        ? "border-[#4ECDC4] ring-2 ring-[#4ECDC4]/40"
        : "border-slate-200 dark:border-[#2A3038]"
    }`}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-xs text-slate-500 dark:text-[#8B92A0]">Time</p>
        <p className="font-semibold text-slate-900 dark:text-white">{formatTimeRange(slot.startTime, slot.endTime)}</p>
      </div>
      <div className="text-xs px-2 py-1 rounded-full bg-[#E6F6EE] text-[#15803D] font-medium border border-[#22C55E]/40 dark:bg-[#103323] dark:text-[#22C55E]">
        Available
      </div>
    </div>
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-[#9CA3AF]">
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

  const nextAvailableDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (selectedDate) {
      const dateString = formatDateString(selectedDate);
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

  const courseType = course?.course_type ?? 0;
  const totalOfflineHours = Number(data?.totalOfflineHours ?? course?.offline_training_hours ?? 0);
  const consumedOfflineHours = Number(data?.consumedOfflineHours ?? 0);
  const remainingOfflineHours = Number(
    data?.remainingOfflineHours ?? Math.max(totalOfflineHours - consumedOfflineHours, 0)
  );

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

  const activeLesson = useMemo(
    () => findLessonById(modules, selection?.moduleId, selection?.lessonId),
    [modules, selection]
  );

  const activeQuiz = useMemo(
    () => findQuizById(modules, selection?.moduleId, selection?.quizId),
    [modules, selection]
  );

  const availableSlots = useMemo(
    () =>
      appointmentSlots.filter(
        (slot) => !slot.isBooked && !(slot as any).isbooked && Number((slot as any).isbooked) !== 1
      ),
    [appointmentSlots]
  );

  const attachmentUrl = resolveAttachmentUrl(activeLesson?.lesson_attachment_path);

  // Navigation functions
  const allItems = useMemo(() => {
    const items: Array<{ type: 'lesson' | 'quiz', moduleId: number, itemId: number }> = [];
    modules.forEach(mod => {
      if (mod.id) {
        mod.course_module_lessons?.forEach(lesson => {
          if (lesson.id) items.push({ type: 'lesson', moduleId: mod.id!, itemId: lesson.id });
        });
        mod.quizzes?.forEach(quiz => {
          if (quiz.id) items.push({ type: 'quiz', moduleId: mod.id!, itemId: quiz.id });
        });
      }
    });
    return items;
  }, [modules]);

  const currentIndex = useMemo(() => {
    return allItems.findIndex(item => 
      (item.type === 'lesson' && item.itemId === selection?.lessonId) ||
      (item.type === 'quiz' && item.itemId === selection?.quizId)
    );
  }, [allItems, selection]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prev = allItems[currentIndex - 1];
      if (prev.type === 'lesson') {
        selectLesson(prev.moduleId, prev.itemId);
      } else {
        selectQuiz(prev.moduleId, prev.itemId);
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < allItems.length - 1) {
      const next = allItems[currentIndex + 1];
      if (next.type === 'lesson') {
        selectLesson(next.moduleId, next.itemId);
      } else {
        selectQuiz(next.moduleId, next.itemId);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f9fa] text-slate-900 dark:bg-gradient-to-br dark:from-[#0F1419] dark:via-[#0F1419] dark:to-[#1A1D23] dark:text-[#F8F9FA]"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        ["--font-mono" as string]:
          "'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Courier New', monospace",
      }}
    >
      <RoleBasedNavigation currentPath={`/course/${id}/learn`} />

      <main className="flex mt-16 text-slate-900 dark:text-[#F8F9FA]">
        {isLoading && (
          <div className="flex-1 p-6">
            <CourseLearnSkeleton />
          </div>
        )}

        {isError && (
          <div className="flex-1 p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Unable to load course</AlertTitle>
              <AlertDescription>{error?.message || "Please try again later."}</AlertDescription>
              <div className="mt-4">
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            </Alert>
          </div>
        )}

        {!isLoading && !isError && !course && (
          <div className="flex-1 p-6">
            <Alert>
              <AlertTitle>No course found</AlertTitle>
              <AlertDescription>
                We couldn't locate this enrollment. Please return to your dashboard and try again.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!isLoading && !isError && course && (
          <>
            {/* Fixed Sidebar - Desktop Only */}
      <div className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white overflow-y-auto border-r border-slate-200 dark:bg-[#1A1D23] dark:border-[#222832]">
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

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-96 min-h-screen bg-[#f8f9fa] dark:bg-[#0F1419]">
              {/* Offline Training Appointment Card */}
              {courseType !== 0 && (
                <Card className="m-6 border border-slate-200 bg-white rounded-2xl dark:border-[#222832] dark:bg-gradient-to-r dark:from-[#1E2329] dark:via-[#151A20] dark:to-[#1E2329]">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl lg:text-2xl font-semibold text-slate-900 dark:text-[#F8F9FA]">
                          Schedule Your Offline Training
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="rounded-lg bg-white px-4 py-2 border border-slate-200 dark:bg-[#0F1419] dark:border-[#222832]">
                          <p className="text-xs text-slate-500 dark:text-[#8B92A0]">Total</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{totalOfflineHours} hrs</p>
                        </div>
                        <div className="rounded-lg bg-white px-4 py-2 border border-slate-200 dark:bg-[#0F1419] dark:border-[#222832]">
                          <p className="text-xs text-slate-500 dark:text-[#8B92A0]">Used</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">{consumedOfflineHours} hrs</p>
                        </div>
                        <div className="rounded-lg bg-[#FF7F50]/10 px-4 py-2 border border-[#FF7F50]/30 dark:bg-[#FF7F50]/15 dark:border-[#FF7F50]/40">
                          <p className="text-xs text-[#FF7F50] dark:text-[#FFB4A2]">Remaining</p>
                          <p className="text-lg font-semibold text-[#FF7F50] dark:text-[#FF8C61]">{remainingOfflineHours} hrs</p>
                        </div>

                        <Button
                        size="lg"
                        className="w-full sm:w-auto bg-[#4ECDC4] text-[#0F1419] hover:bg-[#5DD9C1] gap-2 font-semibold"
                        onClick={() => {
                          setIsSlotPickerOpen(true);
                          setSelectedDate(nextAvailableDate());
                        }}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        Book Offline Slot
                      </Button>
                      </div>
                    </div>
                  </CardHeader>
                 
                </Card>
              )}

              {/* Lesson Content Section */}
              <section className="space-y-4 px-2 pb-8">
                {/* Header with Category and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 
                  <div className="flex items-center gap-1 w-full sm:w-auto">
                
                    {/* Mobile Menu Button */}
                    <Sheet open={isContentOpen} onOpenChange={setIsContentOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden border-[#2A3038] text-[#F8F9FA]">
                          <Menu className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-full max-w-md p-0 bg-white text-slate-900 dark:bg-[#0F1419] dark:text-white">
                        <div className="h-full overflow-y-auto bg-white p-4 dark:bg-[#0F1419]">
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

                {/* Active Lesson Content */}
                {activeLesson && (
                  <LessonViewer lesson={activeLesson} attachmentUrl={attachmentUrl} />
                )}

                {/* Active Quiz Content */}
                {activeQuiz && <QuizViewer quiz={activeQuiz} courseId={course?.id} />}

                {/* Empty State */}
                {!activeLesson && !activeQuiz && (
                  <Alert className="bg-white border border-slate-200 text-slate-900 dark:bg-[#1E2329] dark:border-[#2A3038] dark:text-white">
                    <AlertTitle className="text-slate-900 dark:text-[#F8F9FA]">Select a lesson or quiz</AlertTitle>
                    <AlertDescription className="text-slate-600 dark:text-[#8B92A0]">
                      Use the course content navigation to open lessons and quizzes.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-[#222832]">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={goToPrevious}
                    disabled={currentIndex <= 0}
                    className="gap-2 w-full sm:w-auto border-slate-200 text-slate-900 hover:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 dark:border-[#2A3038] dark:text-[#F8F9FA] dark:hover:bg-[#222832] dark:disabled:text-[#8B92A0] dark:disabled:border-[#2A3038]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <Button
                    size="lg"
                    className="gap-2 bg-[#FF7F50] hover:bg-[#FF8C61] text-white dark:text-[#0F1419] font-semibold w-full sm:w-auto order-first sm:order-none"
                  >
                    <Check className="h-4 w-4" />
                    Mark as Complete
                  </Button>

                  <Button
                    size="lg"
                    onClick={goToNext}
                    disabled={currentIndex >= allItems.length - 1}
                    className="gap-2 bg-[#4ECDC4] hover:bg-[#5DD9C1] text-white dark:text-[#0F1419] font-semibold w-full sm:w-auto disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-[#2A3038] dark:disabled:text-[#8B92A0]"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </section>
            </div>
          </>
        )}

        {/* Slot Picker Dialog */}
        <Dialog open={isSlotPickerOpen} onOpenChange={handleSlotPickerChange}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-slate-900 border border-slate-200 dark:bg-[#1A1D23] dark:text-white dark:border-[#2A3038]">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-[#F8F9FA]">Select an offline slot</DialogTitle>
              <p className="text-sm text-slate-600 dark:text-[#8B92A0]">
                Choose a date after today to see the available in-car training times.
              </p>
            </DialogHeader>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
              <div className="space-y-3">
                <p className="text-sm text-slate-900 dark:text-[#F8F9FA] font-medium">Choose a date</p>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date ?? nextAvailableDate())}
                  disabled={(date) => date < nextAvailableDate()}
                  className="rounded-lg border border-slate-200 bg-white text-slate-900 dark:border-[#2A3038] dark:bg-[#0F1419] dark:text-white"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-[#8B92A0]">Available slots</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-[#F8F9FA]">
                    {selectedDate ? formatDate(selectedDate) : "Select a date to view slots"}
                  </p>
                </div>

                {slotLoading && <p className="text-sm text-slate-600 dark:text-[#8B92A0]">Loading slots...</p>}

                {!slotLoading && selectedDate && availableSlots.length === 0 && (
                  <Alert className="bg-white border border-slate-200 text-slate-900 dark:bg-[#1E2329] dark:border-[#2A3038] dark:text-white">
                    <AlertTitle className="text-slate-900 dark:text-[#F8F9FA]">No slots available</AlertTitle>
                    <AlertDescription className="text-slate-600 dark:text-[#8B92A0]">
                      There are no appointment slots for the selected date. Please choose another day.
                    </AlertDescription>
                  </Alert>
                )}

                {!slotLoading && selectedDate && availableSlots.length > 0 && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
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

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSlotPickerChange(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                disabled={!selectedSlot}
                onClick={() => {
                  setIsBookingModalOpen(true);
                  setIsSlotPickerOpen(false);
                }}
                className="bg-[#4ECDC4] hover:bg-[#5DD9C1] text-[#0F1419] font-semibold w-full sm:w-auto disabled:bg-[#2A3038] disabled:text-[#8B92A0]"
              >
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Booking Modals */}
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
