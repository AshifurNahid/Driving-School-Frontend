
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useUser } from '@/contexts/UserContext';
import { format, addMinutes, parse } from 'date-fns';
import { Clock, Plus, Trash2, Save, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { AppointmentAvailability, TimeSlot } from '@/types/appointment';

const SetAvailability = () => {
  const { user } = useUser();
  const { addAvailability, availabilities, deleteAvailability, updateAvailability } = useAppointment();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [duration, setDuration] = useState<number>(30);
  const [maxPerDay, setMaxPerDay] = useState<number>(8);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');

  const saveAvailability = () => {
    if (!user || selectedDates.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one date and ensure you're logged in.",
        variant: "destructive",
      });
      return;
    }

    selectedDates.forEach(date => {
      const slots: TimeSlot[] = [];
      const start = parse(startTime, 'HH:mm', new Date());
      const end = parse(endTime, 'HH:mm', new Date());
      
      let current = start;
      let slotCount = 0;

      while (current < end && slotCount < maxPerDay) {
        const slotEnd = addMinutes(current, duration);
        if (slotEnd <= end) {
          slots.push({
            id: `${format(current, 'HH:mm')}-${format(slotEnd, 'HH:mm')}`,
            startTime: format(current, 'HH:mm'),
            endTime: format(slotEnd, 'HH:mm'),
            isBooked: false,
          });
          slotCount++;
        }
        current = slotEnd;
      }

      const availability: AppointmentAvailability = {
        id: `${user.id}-${format(date, 'yyyy-MM-dd')}`,
        adminId: user.id,
        adminName: user.name,
        date: format(date, 'yyyy-MM-dd'),
        slots,
        maxAppointmentsPerDay: maxPerDay,
        duration,
      };

      // Check if availability already exists for this date
      const existingAvailability = availabilities.find(
        avail => avail.adminId === user.id && avail.date === format(date, 'yyyy-MM-dd')
      );

      if (existingAvailability) {
        updateAvailability(existingAvailability.id, availability);
      } else {
        addAvailability(availability);
      }
    });

    toast({
      title: "Availability Saved",
      description: `Your availability has been set for ${selectedDates.length} day(s)`,
    });

    setSelectedDates([]);
  };

  const adminAvailabilities = availabilities.filter(avail => avail.adminId === user?.id);

  const handleDeleteAvailability = (id: string) => {
    deleteAvailability(id);
    toast({
      title: "Availability Removed",
      description: "Time slots have been deleted successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Set Your Availability</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configure Your Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Available Dates (Click multiple dates)</Label>
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={setSelectedDates}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              {selectedDates.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedDates.length} date(s) selected
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Appointment Duration</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxPerDay">Max appointments per day</Label>
                <Input
                  id="maxPerDay"
                  type="number"
                  value={maxPerDay}
                  onChange={(e) => setMaxPerDay(Number(e.target.value))}
                  min={1}
                  max={20}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Available From</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endTime">Available Until</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={saveAvailability} 
              disabled={selectedDates.length === 0}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Availability Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {adminAvailabilities.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No availability set yet. Configure your schedule!
                </p>
              ) : (
                adminAvailabilities
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((availability) => (
                    <div key={availability.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{format(new Date(availability.date), 'MMM dd, yyyy')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {availability.slots.filter(slot => !slot.isBooked).length} available • {availability.slots.filter(slot => slot.isBooked).length} booked
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAvailability(availability.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {availability.slots.map((slot) => (
                          <Badge
                            key={slot.id}
                            variant={slot.isBooked ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {slot.startTime}
                            {slot.isBooked && ` (${slot.bookedByName})`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SetAvailability;
