import api from "@/utils/axios";
import {
  APPOINTMENT_SLOTS_REQUEST,
  APPOINTMENT_SLOTS_SUCCESS,
  APPOINTMENT_SLOTS_FAIL,
  APPOINTMENT_SLOT_CREATE_REQUEST,
  APPOINTMENT_SLOT_CREATE_SUCCESS,
  APPOINTMENT_SLOT_CREATE_FAIL,
  APPOINTMENT_SLOT_UPDATE_REQUEST,
  APPOINTMENT_SLOT_UPDATE_SUCCESS,
  APPOINTMENT_SLOT_UPDATE_FAIL,
  APPOINTMENT_SLOT_DELETE_REQUEST,
  APPOINTMENT_SLOT_DELETE_SUCCESS,
  APPOINTMENT_SLOT_DELETE_FAIL,
  BOOK_DIRECT_APPOINTMENT_REQUEST,
  BOOK_DIRECT_APPOINTMENT_SUCCESS,
  BOOK_DIRECT_APPOINTMENT_FAILURE,
  BOOK_DIRECT_APPOINTMENT_RESET,
  USER_APPOINTMENTS_REQUEST,
  USER_APPOINTMENTS_SUCCESS,
  USER_APPOINTMENTS_FAIL
} from "../constants/appointmentConstants";



// Types
export interface AppointmentSlot {
  id: number;
  instructorId: number;
  courseId?: number;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: number;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  pricePerSlot?: number;
  instructorName?: string;
  courseTitle?: string;
}

export interface BookDirectAppointmentPayload {
  availableAppointmentSlotId: number;
  hoursToConsume: number;
  amountPaid: number;
  note?: string;
  learnerPermitIssueDate?: string;
  permitNumber?: string;
  permitExpirationDate?: string;
  drivingExperience?: string;
  isLicenceFromAnotherCountry: boolean;
}

// Get appointment slots by date
export const getAppointmentSlotsByDate = (date: string) => async (dispatch: any) => {
  try {
    dispatch({ type: APPOINTMENT_SLOTS_REQUEST });
    
    const { data } = await api.get(`/appointment-slots/date/${date}`);
    
    // Ensure we handle both array responses and potential nested response objects
    const appointmentSlots = Array.isArray(data) ? data : 
                             (data.data && Array.isArray(data.data)) ? data.data : [];
    
    dispatch({
      type: APPOINTMENT_SLOTS_SUCCESS,
      payload: appointmentSlots,
    });
  } catch (error: any) {
    dispatch({
      type: APPOINTMENT_SLOTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Create appointment slot
export const createAppointmentSlot = (appointmentData: {
  instructorId: number;
  courseId: number;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
}) => async (dispatch: any) => {
  try {
    dispatch({ type: APPOINTMENT_SLOT_CREATE_REQUEST });
    
    // Always set status to 1 for new appointments
    const dataWithStatus = {
      ...appointmentData,
      status: 1 // Ensure status is 1 for create
    };
    
    const { data } = await api.post('/appointment-slots', dataWithStatus);
    
    dispatch({
      type: APPOINTMENT_SLOT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: APPOINTMENT_SLOT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Update appointment slot
export const updateAppointmentSlot = (
  id: number,
  appointmentData: {
    instructorId: number;
    courseId: number;
    date: string;
    startTime: string;
    endTime: string;
    location?: string;
  }
) => async (dispatch: any) => {
  try {
    dispatch({ type: APPOINTMENT_SLOT_UPDATE_REQUEST });
    
    // Always set status to 1 for updates
    const dataWithStatus = {
      ...appointmentData,
      status: 1 // Ensure status is 1 for update
    };
    
    const { data } = await api.put(`/appointment-slots/${id}`, dataWithStatus);
    
    dispatch({
      type: APPOINTMENT_SLOT_UPDATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: APPOINTMENT_SLOT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete appointment slot using DELETE API
export const deleteAppointmentSlot = (id: number) => async (dispatch: any) => {
  try {
    dispatch({ type: APPOINTMENT_SLOT_DELETE_REQUEST });

    await api.delete(`/appointment-slots/${id}`);

    dispatch({
      type: APPOINTMENT_SLOT_DELETE_SUCCESS,
      payload: id,
    });
  } catch (error: any) {
    dispatch({
      type: APPOINTMENT_SLOT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// New Book Direct Appointment Actions
export const bookDirectAppointmentRequest = () => ({
  type: BOOK_DIRECT_APPOINTMENT_REQUEST
});

export const bookDirectAppointmentSuccess = (data: any) => ({
  type: BOOK_DIRECT_APPOINTMENT_SUCCESS,
  payload: data
});

export const bookDirectAppointmentFailure = (error: string) => ({
  type: BOOK_DIRECT_APPOINTMENT_FAILURE,
  payload: error
});

export const bookDirectAppointmentReset = () => ({
  type: BOOK_DIRECT_APPOINTMENT_RESET
});

// Book Direct Appointment Thunk
// Fixed bookDirectAppointment action in appointmentAction.ts

export const bookDirectAppointment = (payload: BookDirectAppointmentPayload) => {
  return async (dispatch: any) => {
    console.log("Starting booking process with payload:", payload);
    dispatch(bookDirectAppointmentRequest());
    
    try {
      console.log("Making API request to /appointments/direct");
      const response = await api.post('/appointments/direct', payload);
      console.log("API response received:", response.data);
      
      const { status, data } = response.data;

      // Check if the booking was successful based on status code
      if (status?.code === "200") {
        // SUCCESS CASE
        console.log("Booking successful, processing success response");
        
        // Format appointment data for display in the modal
        // Now using the complete appointmentSlot data from the response
        const formattedAppointmentData = {
          id: data.id,
          status: data.status || 'Booked',
          createdAt: data.createdAt,
          appointmentSlot: data.appointmentSlot ? {
            date: data.appointmentSlot.date,
            startTime: data.appointmentSlot.startTime,
            endTime: data.appointmentSlot.endTime,
            instructorId: data.appointmentSlot.instructorId,
            instructorName: data.appointmentSlot.instructorName || `Instructor ${data.appointmentSlot.instructorId}`,
            location: data.appointmentSlot.location || "School Location",
            // Add additional details that might be useful
            price: data.appointmentSlot.pricePerSlot || data.amountPaid || 0
          } : {
            // Fallback if slot data is somehow missing
            date: data.learnerPermitIssueDate || new Date().toISOString().split('T')[0],
            startTime: "Scheduled", 
            endTime: "Scheduled", 
            instructorName: "Assigned Instructor",
            location: "Driving School Location"
          }
        };
        
        console.log("Dispatching success with formatted data:", formattedAppointmentData);
        
        dispatch(bookDirectAppointmentSuccess({
          message: status.message || 'Appointment booked successfully!',
          data: formattedAppointmentData
        }));
        
      } else {
        // API returned non-200 status code (like AppointmentSlot.AlreadyBooked)
        console.log("Booking failed with status:", status);
        const errorMessage = status?.message || 'Failed to book appointment';
        dispatch(bookDirectAppointmentFailure(errorMessage));
      }
      
    } catch (error: any) {
      console.log("API error occurred:", error);
      
      // Handle different error scenarios
      let errorMessage = 'Failed to book appointment';
      
      if (error?.response?.data?.status?.message) {
        // Error response with status structure
        errorMessage = error.response.data.status.message;
      } else if (error?.response?.data?.message) {
        // Error response with direct message
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Network or other errors
        errorMessage = error.message;
      }
      
      console.log("Dispatching failure with error:", errorMessage);
      dispatch(bookDirectAppointmentFailure(errorMessage));
    }
  };
};

// Get user appointments
export const getUserAppointments = (userId: number) => async (dispatch: any) => {
  try {
    dispatch({ type: USER_APPOINTMENTS_REQUEST });
    
    const { data } = await api.get(`/appointments/user/${userId}`);
    
    // Get appointments from the response - handle both direct array or nested data object
    const userAppointments = Array.isArray(data) ? data : 
                           (data.data && Array.isArray(data.data)) ? data.data : [];
    
    dispatch({
      type: USER_APPOINTMENTS_SUCCESS,
      payload: userAppointments,
    });
  } catch (error: any) {
    dispatch({
      type: USER_APPOINTMENTS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};