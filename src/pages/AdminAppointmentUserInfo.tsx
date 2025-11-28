import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Calendar, Phone, Mail, User, FileText } from 'lucide-react';

import { getAppointmentSlotUserInfo } from '@/redux/actions/appointmentAction';
import { RootState, AppDispatch } from '@/redux/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const formatTime = (time: string | undefined) => {
  if (!time) return '-';
  const [hours = '', minutes = ''] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const AdminAppointmentUserInfo: React.FC = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector((state: RootState) => state.adminAppointmentUserInfo);

  useEffect(() => {
    if (slotId) {
      dispatch(getAppointmentSlotUserInfo(Number(slotId)));
    }
  }, [dispatch, slotId]);

  const appointment = data;
  const appointmentSlot = appointment?.appointmentSlot;

  const renderInfoRow = (label: string, value: React.ReactNode) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-100 last:border-0 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{value ?? '-'}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} className="px-0 hover:bg-transparent text-purple-600 dark:text-purple-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Appointment Booking Details</h1>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-300">Loading booking info...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && appointment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-sm dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <User className="w-5 h-5" /> Learner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {renderInfoRow('Name', `${appointment.userFirstName || ''} ${appointment.userLastName || ''}`.trim() || '-')}
                {renderInfoRow('Email', (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{appointment.userEmail || '-'}</span>
                    {appointment.isEmailVerified ? (
                      <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">Unverified</Badge>
                    )}
                  </div>
                ))}
                {renderInfoRow('Phone', (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{appointment.userPhone || '-'}</span>
                    {appointment.isPhoneVerified ? (
                      <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">Unverified</Badge>
                    )}
                  </div>
                ))}
                {renderInfoRow('Course', appointment.courseName || 'N/A')}
                {renderInfoRow('Permit Number', appointment.permitNumber || 'N/A')}
                {renderInfoRow('Permit Issue Date', appointment.learnerPermitIssueDate ? format(parseISO(appointment.learnerPermitIssueDate), 'dd MMM yyyy') : 'N/A')}
                {renderInfoRow('Permit Expiration Date', appointment.permitExpirationDate ? format(parseISO(appointment.permitExpirationDate), 'dd MMM yyyy') : 'N/A')}
                {renderInfoRow('Driving Experience', appointment.drivingExperience || 'N/A')}
                {renderInfoRow('License From Another Country', appointment.isLicenceFromAnotherCountry ? 'Yes' : 'No')}
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="w-5 h-5" /> Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {renderInfoRow('Appointment ID', appointment.appointmentId)}
                {renderInfoRow('Type', appointment.appointmentType || 'N/A')}
                {renderInfoRow('Status', (
                  <Badge className="bg-purple-100 text-purple-700 border border-purple-200">{appointment.appointmentStatus || 'N/A'}</Badge>
                ))}
                {renderInfoRow('Hours Booked', appointment.hoursConsumed)}
                {renderInfoRow('Amount Paid', appointment.amountPaid ? `$${appointment.amountPaid}` : 'N/A')}
                {renderInfoRow('Note', appointment.note || 'N/A')}
                {renderInfoRow('Booked At', appointment.appointmentCreatedAt ? format(parseISO(appointment.appointmentCreatedAt), 'dd MMM yyyy, p') : 'N/A')}
                {renderInfoRow('Slot Schedule', appointmentSlot ? `${format(parseISO(appointmentSlot.date), 'dd MMM yyyy')} • ${formatTime(appointmentSlot.startTime)} - ${formatTime(appointmentSlot.endTime)}` : 'N/A')}
                {renderInfoRow('Instructor ID', appointmentSlot?.instructorId ?? 'N/A')}
                {renderInfoRow('Price Per Slot', appointmentSlot?.pricePerSlot ? `$${appointmentSlot.pricePerSlot}` : 'N/A')}
              </CardContent>
            </Card>

            <Card className="shadow-sm dark:border-gray-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <FileText className="w-5 h-5" /> Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {renderInfoRow('Appointment Slot ID', appointment.availableAppointmentSlotId)}
                {renderInfoRow('Course ID', appointment.userCourseId ?? 'N/A')}
                {renderInfoRow('Location', appointmentSlot?.location || 'N/A')}
                {renderInfoRow('Slot Created', appointmentSlot?.createdAt ? format(parseISO(appointmentSlot.createdAt), 'dd MMM yyyy, p') : 'N/A')}
                {renderInfoRow('Slot Updated', appointmentSlot?.updatedAt ? format(parseISO(appointmentSlot.updatedAt), 'dd MMM yyyy, p') : 'N/A')}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentUserInfo;
