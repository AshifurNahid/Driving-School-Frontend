// components/ui/AppointmentForm.tsx

import React, { useState } from 'react';
import { format, startOfDay, isBefore } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InstructorDropdown from './InstructorDropdown';

// Validation schema
const appointmentSchema = z.object({
  instructorId: z.string().min(1, 'Instructor is required'),
  courseId: z.string().min(1, 'Course is required'),
  date: z.date({ required_error: 'Date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().optional(),
}).refine(
  (data) => {
    return data.startTime < data.endTime;
  },
  {
    message: "End time must be greater than start time",
    path: ["endTime"],
  }
);

// Generate time options (00:00 to 23:30 in 30-minute intervals)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of ['00', '30']) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
      const displayTime = new Date(`1970-01-01T${timeString}:00`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      times.push({ value: timeString, label: displayTime });
    }
  }
  return times;
};

const AppointmentForm = ({
  instructors = [],
  instructorsLoading = false,
  instructorsError = null,
  courses = [],
  coursesLoading = false,
  onSubmit,
  onCancel,
  loading = false,
  editingAppointment = null,
  selectedDate = null,
  className = ""
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const timeOptions = generateTimeOptions();

  const isPastDate = (date: Date) => {
    const today = startOfDay(new Date());
    const checkDate = startOfDay(date);
    return isBefore(checkDate, today);
  };

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      instructorId: editingAppointment?.instructorId?.toString() || '',
      courseId: editingAppointment?.courseId?.toString() || '',
      date: editingAppointment?.date ? new Date(editingAppointment.date) : selectedDate || undefined,
      startTime: editingAppointment?.startTime || '',
      endTime: editingAppointment?.endTime || '',
      location: editingAppointment?.location || '',
    },
  });

  const handleSubmit = (data: any) => {
    const formattedData = {
      ...data,
      instructorId: parseInt(data.instructorId),
      courseId: parseInt(data.courseId),
      date: format(data.date, 'yyyy-MM-dd'),
    };
    onSubmit(formattedData);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Instructor Dropdown */}
              <FormField
                control={form.control}
                name="instructorId"
                render={({ field }) => (
                  <InstructorDropdown
                    instructors={instructors}
                    loading={instructorsLoading}
                    error={instructorsError}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select an instructor"
                    required={true}
                    label="Instructor"
                  />
                )}
              />

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Course <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled={coursesLoading || loading}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={coursesLoading ? "Loading..." : "Select course"} />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course?.id} value={course?.id?.toString()}>
                              {course?.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={loading}
                          className={cn(
                            "h-10 justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        disabled={(date) => isPastDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Time <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.slice(0, -1).map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Time <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.slice(1).map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Room 101, Online"
                    {...field}
                    disabled={loading}
                    className="h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingAppointment ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingAppointment ? 'Update Slot' : 'Create Slot'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;