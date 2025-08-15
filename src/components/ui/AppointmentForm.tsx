// components/ui/AppointmentForm.tsx

import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
    <Card className={cn("bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {editingAppointment ? 'Edit Appointment Slot' : 'Create Appointment Slot'}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {editingAppointment 
            ? 'Update the appointment slot details below' 
            : 'Set up a new time slot for student appointments'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Instructor and Course Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Course Selection */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Course
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange} disabled={coursesLoading}>
                        <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                          <SelectValue placeholder={coursesLoading ? "Loading courses..." : "Select a course"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <SelectItem value="0" className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <span className="font-medium text-blue-600 dark:text-blue-400">All Courses</span>
                          </SelectItem>
                          {courses.map((course) => (
                            <SelectItem 
                              key={course?.id} 
                              value={course?.id?.toString()} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {course?.title}
                                </span>
                                {course?.description && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                    {course.description}
                                  </span>
                                )}
                              </div>
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

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Selection */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Date
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
                              !field.value && "text-gray-500 dark:text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setCalendarOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-white dark:bg-gray-800"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60">
                          {timeOptions.slice(0, -1).map((time) => (
                            <SelectItem 
                              key={time.value} 
                              value={time.value}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
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

              {/* End Time */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20">
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60">
                          {timeOptions.slice(1).map((time) => (
                            <SelectItem 
                              key={time.value} 
                              value={time.value}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
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

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                    <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter location (e.g., Room 101, Building A, Online)"
                      {...field}
                      className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 dark:text-gray-400">
                    Specify where the appointment will take place
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="submit" 
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{editingAppointment ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    <span>{editingAppointment ? 'Update Slot' : 'Create Slot'}</span>
                  </div>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                className="h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={loading}
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;