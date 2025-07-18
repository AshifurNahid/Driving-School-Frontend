import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, User, MapPin, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import api from '@/utils/axios';

const SetAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setError('');
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    api.get(`/appointment-slots/date/${dateStr}?courseId=0`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.data && Array.isArray(res.data.data)) ? res.data.data : [];
        setSlots(data);
      })
      .catch(err => {
        if (err.response && err.response.status === 500) {
          setError('Server error. Please try again later or contact support.');
        } else {
          setError(err?.response?.data?.message || err.message || 'Failed to fetch slots');
        }
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CalendarIcon className="h-10 w-10 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-base">
            Choose a date and see available slots
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Calendar Card - Large Date Picker */}
          <Card className="flex-1 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-md rounded-xl flex flex-col items-center justify-center py-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-300 text-center mb-4">
                Select a Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-2xl border-2 border-blue-200 dark:border-blue-700 p-6 bg-white dark:bg-gray-900 shadow"
                  style={{ width: '340px', height: '340px' }}
                />
              </div>
              {selectedDate && (
                <div className="mt-6 text-center">
                  <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                    {format(selectedDate, 'EEEE')}
                  </div>
                  <div className="text-base text-gray-500 dark:text-gray-300">
                    {format(selectedDate, 'MMMM dd, yyyy')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Slots Card */}
          <Card className="flex-1 bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 shadow-md rounded-xl py-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-700 dark:text-blue-300 text-center mb-4">
                Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-10 w-10 text-blue-400 dark:text-blue-300 mb-2 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-300 font-medium">Loading slots...</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-10 w-10 text-red-500 mb-2" />
                    <p className="text-red-600 font-semibold mb-2">Error</p>
                    <p className="text-gray-500 dark:text-gray-300 text-sm text-center">{error}</p>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <CalendarIcon className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-600 dark:text-gray-300 font-semibold mb-2">No slots available</p>
                    <p className="text-gray-500 dark:text-gray-300 text-sm text-center">
                      Try selecting a different date
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`rounded-lg border px-5 py-4 flex flex-col gap-2 ${
                          slot.status === 1
                            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-2 font-semibold ${
                            slot.status === 1 ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <Clock className="h-4 w-4" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            slot.status === 1 ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                          }`}>
                            {slot.status === 1 ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {slot.status === 1 ? 'Available' : 'Booked'}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {slot.instructorName || slot.instructorId}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {slot.location}
                          </span>
                          {slot.courseTitle && (
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {slot.courseTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetAvailability;