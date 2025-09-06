import api from "@/utils/axios";
import {
  BOOK_GUEST_APPOINTMENT_REQUEST,
  BOOK_GUEST_APPOINTMENT_SUCCESS,
  BOOK_GUEST_APPOINTMENT_FAILURE,
  BOOK_GUEST_APPOINTMENT_RESET
} from '../constants/appointmentConstants';
import { BookGuestAppointmentPayload } from './appointmentAction';

// Action creators
export const bookGuestAppointmentRequest = () => ({
  type: BOOK_GUEST_APPOINTMENT_REQUEST
});

export const bookGuestAppointmentSuccess = (data: any) => ({
  type: BOOK_GUEST_APPOINTMENT_SUCCESS,
  payload: data
});

export const bookGuestAppointmentFailure = (error: string) => ({
  type: BOOK_GUEST_APPOINTMENT_FAILURE,
  payload: error
});

export const bookGuestAppointmentReset = () => ({
  type: BOOK_GUEST_APPOINTMENT_RESET
});

// Guest appointment booking thunk action
export const bookGuestAppointment = (payload: BookGuestAppointmentPayload) => {
  return async (dispatch: any) => {
    console.log("Starting guest booking process with payload:", payload);
    dispatch(bookGuestAppointmentRequest());
    
    try {
      console.log("Making API request to /appointments-with-registration");
      const response = await api.post('/appointments-with-registration', payload);
      console.log("API response received:", response.data);
      
      const { status, data } = response.data;

      // Check if the booking was successful based on status code
      if (status?.code === "200") {
        // SUCCESS CASE
        console.log("Guest booking successful, processing success response");
        
        // Format appointment data for display in the modal
        dispatch(bookGuestAppointmentSuccess({
          id: data.id,
          status: data.status,
          createdAt: data.createdAt,
          appointmentSlot: {
            date: data.appointmentSlot.date,
            startTime: data.appointmentSlot.startTime,
            endTime: data.appointmentSlot.endTime,
            instructorName: data.instructorName || `Instructor ${data.instructorId}`,
            location: data.appointmentSlot.location || 'Driving School',
            price: data.amountPaid
          }
        }));
      } else {
        // ERROR CASE WITH STATUS
        console.error("Booking failed with status", status);
        const errorMessage = status?.message || "Failed to book appointment";
        dispatch(bookGuestAppointmentFailure(errorMessage));
      }
    } catch (error: any) {
      // EXCEPTION CASE
      console.error("Exception during booking:", error);
      let errorMessage = "An error occurred while booking your appointment";
      
      if (error.response) {
        // Server returned an error response
        console.error("Server error response:", error.response.data);
        errorMessage = error.response.data?.message || 
                      error.response.data?.error ||
                      "Server error: " + error.response.status;
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        errorMessage = "No response received from server";
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        errorMessage = error.message;
      }
      
      dispatch(bookGuestAppointmentFailure(errorMessage));
    }
  };
};
