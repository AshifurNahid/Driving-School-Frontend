
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, AlertCircle } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'available':
      return {
        variant: 'outline' as const,
        className: 'text-green-600 border-green-600 text-xs',
        text: 'Available'
      };
    case 'booked':
      return {
        variant: 'default' as const,
        className: 'bg-blue-600 text-xs',
        text: 'Booked'
      };
    case 'unavailable':
      return {
        variant: 'destructive' as const,
        className: 'text-xs',
        text: 'Unavailable'
      };
    default:
      return {
        variant: 'outline' as const,
        className: 'text-xs',
        text: status
      };
  }
};

export const formatTimeSlot = (startTime: string, endTime: string) => {
  return `${startTime} - ${endTime}`;
};

export const isAppointmentEditable = (status: string) => {
  return status !== 'booked';
};
