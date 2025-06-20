
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppointment } from '@/contexts/AppointmentContext';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { Clock, User, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { BookedAppointment } from '@/types/appointment';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const BookAppointment = () => {
  const { user } = useUser();
  const { availabilities, bookAppointment, getAvailableSlots } = useAppointment();
  const [selectedAdmin, setSelectedAdmin] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  // Get unique admins who have set availability
  const admins = Array.from(
    new Map(
      availabilities.map(avail => [avail.adminId, { id: avail.adminId, name: avail.adminName }])
    ).values()
  );

  // Get available dates for selected admin
  const availableDates = selectedAdmin
    ? availabilities
        .filter(avail => avail.adminId === selectedAdmin)
        .filter(avail => {
          // Only show dates that have available slots
          const availableSlots = avail.slots.filter(slot => !slot.isBooked);
          return availableSlots.length > 0;
        })
        .map(avail => new Date(avail.date))
    : [];

  // Get available slots for selected admin and date
  const availableSlots = selectedAdmin && selectedDate
    ? getAvailableSlots(selectedAdmin, format(selectedDate, 'yyyy-MM-dd'))
    : [];

  const handleBooking = () => {
    if (!user || !selectedAdmin || !selectedDate || !selectedSlot) return;

    const slot = availableSlots.find(s => s.id === selectedSlot);
    const admin = admins.find(a => a.id === selectedAdmin);
    
    if (!slot || !admin) return;

    const appointment: BookedAppointment = {
      id: `${user.id}-${selectedAdmin}-${format(selectedDate, 'yyyy-MM-dd')}-${slot.startTime}`,
      adminId: selectedAdmin,
      adminName: admin.name,
      learnerId: user.id,
      learnerName: user.name,
      date: format(selectedDate, 'yyyy-MM-dd'),
      startTime: slot.startTime,
      endTime: slot.endTime,
      note,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookAppointment(appointment);
    setIsBookingDialogOpen(false);
    toast({
      title: "Appointment Booked Successfully!",
      description: `Your appointment with ${admin.name} on ${format(selectedDate, 'MMM dd, yyyy')} at ${slot.startTime} has been confirmed.`,
    });

    // Reset form
    setSelectedAdmin('');
    setSelectedDate(undefined);
    setSelectedSlot('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5" />
        <h2 className="text-2xl font-bold">Book Physical Appointment</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Step 1: Select Instructor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              Choose Instructor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {admins.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No instructors have set their availability yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Please check back later.</p>
                </div>
              ) : (
                admins.map((admin) => {
                  const adminAvailabilities = availabilities.filter(avail => 
                    avail.adminId === admin.id && 
                    avail.slots.some(slot => !slot.isBooked) &&
                    new Date(avail.date) >= new Date()
                  );
                  
                  return (
                    <div
                      key={admin.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAdmin === admin.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                      onClick={() => {
                        setSelectedAdmin(admin.id);
                        setSelectedDate(undefined);
                        setSelectedSlot('');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${admin.name}`} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {adminAvailabilities.length} available day(s)
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Select Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              Pick Available Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedAdmin ? (
              <p className="text-muted-foreground text-center py-8">
                Please select an instructor first.
              </p>
            ) : availableDates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No available dates for this instructor.
              </p>
            ) : (
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot('');
                  }}
                  disabled={(date) => {
                    const isInPast = date < new Date();
                    const isAvailable = availableDates.some(
                      availDate => format(availDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                    );
                    return isInPast || !isAvailable;
                  }}
                  className="rounded-md border w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {availableDates.length} available day(s) shown
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 3: Select Time Slot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              Select Time Slot
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted-foreground text-center py-8">
                Please select a date first.
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No available time slots for this date.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  {availableSlots.length} slot(s) available
                </p>
                
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot === slot.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {slot.startTime} - {slot.endTime}
                  </Button>
                ))}
                
                {selectedSlot && (
                  <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Your Appointment</DialogTitle>
                        <DialogDescription>
                          Please review your appointment details and add any notes.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Appointment Summary</Label>
                          <div className="p-3 bg-accent rounded-lg">
                            <p><strong>Instructor:</strong> {admins.find(a => a.id === selectedAdmin)?.name}</p>
                            <p><strong>Date:</strong> {selectedDate && format(selectedDate, 'EEEE, MMM dd, yyyy')}</p>
                            <p><strong>Time:</strong> {availableSlots.find(s => s.id === selectedSlot)?.startTime} - {availableSlots.find(s => s.id === selectedSlot)?.endTime}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="note">Purpose/Notes (Optional)</Label>
                          <Textarea
                            id="note"
                            placeholder="Please describe the purpose of this appointment or any specific topics you'd like to discuss..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <Button onClick={handleBooking} className="w-full">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;
