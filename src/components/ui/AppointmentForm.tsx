// components/ui/AppointmentForm.tsx

import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Save, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Validation schema
const appointmentSchema = z.object({
  instructorId: z.string().optional(),
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
      times.push({ value: timeString, label: timeString });
    }
  }
  return times;
};

const normalizeTimeValue = (time?: string | null) => {
  if (!time) return '';

  const [hours, minutes] = time.split(':');
  if (!hours || !minutes) return '';

  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const AppointmentForm = ({
  instructors = [],
  instructorsLoading = false,
  instructorsError = null,
  onSubmit,
  onCancel,
  loading = false,
  editingAppointment = null,
  selectedDate = null,
  className = ""
}) => {
  const timeOptions = generateTimeOptions();

  const defaultValues = {
    instructorId: editingAppointment?.instructorId ? editingAppointment.instructorId.toString() : '',
    date: editingAppointment?.date ? new Date(editingAppointment.date) : selectedDate || undefined,
    startTime: normalizeTimeValue(editingAppointment?.startTime),
    endTime: normalizeTimeValue(editingAppointment?.endTime),
    location: editingAppointment?.location || '',
  };

  const form = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
    });
  }, [editingAppointment, selectedDate, form]);

  const handleSubmit = (data: any) => {
    const instructorId = data.instructorId ? parseInt(data.instructorId) : null;

    const formattedData = {
      ...data,
      instructorId,
      date: format(data.date, 'yyyy-MM-dd'),
    };
    onSubmit(formattedData);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Card className={cn("bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 border-gray-200/50 dark:border-gray-700/50 shadow-xl", className)}>
      <CardContent className="space-y-6 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Instructor Selection */}
            <FormField
              control={form.control}
              name="instructorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    Instructor
                  </FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
                        <SelectValue placeholder="Select an instructor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 shadow-xl z-[70]">
                        {instructorsLoading ? (
                          <div className="p-4 text-center text-gray-500 flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading instructors...
                          </div>
                        ) : instructorsError ? (
                          <div className="p-4 text-center text-red-500">Error loading instructors</div>
                        ) : instructors.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No instructors available</div>
                        ) : (
                          instructors.map((instructor) => (
                            <SelectItem 
                              key={instructor.id} 
                              value={instructor.id.toString()}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                            >
                              { instructor.instructor_name || `Instructor ${instructor.id}`}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection - Full Width */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                      <CalendarIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    Date
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <Input
                        type="date"
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        onChange={(e) => {
                          const selectedDate = e.target.value ? new Date(`${e.target.value}T00:00:00`) : undefined;
                          field.onChange(selectedDate);
                        }}
                        className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-white" />
                      </div>
                      Start Time
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
                          <SelectValue placeholder="Select start time" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 shadow-xl z-[70]">
                          {timeOptions.slice(0, -1).map((time) => (
                            <SelectItem 
                              key={time.value} 
                              value={time.value}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
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
                    <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-white" />
                      </div>
                      End Time
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60 shadow-xl z-[70]">
                          {timeOptions.slice(1).map((time) => (
                            <SelectItem 
                              key={time.value} 
                              value={time.value}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
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
                  <FormLabel className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                    Location
                    <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter location (e.g., Room 101, Building A, Online)"
                      {...field}
                      className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
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
                className="h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
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