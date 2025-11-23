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
  APPOINTMENT_SLOT_ASSIGN_REQUEST,
  APPOINTMENT_SLOT_ASSIGN_SUCCESS,
  APPOINTMENT_SLOT_ASSIGN_FAIL,
  BOOK_DIRECT_APPOINTMENT_REQUEST,
  BOOK_DIRECT_APPOINTMENT_SUCCESS,
  BOOK_DIRECT_APPOINTMENT_FAILURE,
  BOOK_DIRECT_APPOINTMENT_RESET,
  BOOK_GUEST_APPOINTMENT_REQUEST,
  BOOK_GUEST_APPOINTMENT_SUCCESS,
  BOOK_GUEST_APPOINTMENT_FAILURE,
  BOOK_GUEST_APPOINTMENT_RESET,
  USER_APPOINTMENTS_REQUEST,
  USER_APPOINTMENTS_SUCCESS,
  USER_APPOINTMENTS_FAIL,
  ADMIN_PREVIOUS_APPOINTMENTS_REQUEST,
  ADMIN_PREVIOUS_APPOINTMENTS_SUCCESS,
  ADMIN_PREVIOUS_APPOINTMENTS_FAIL,
  ADMIN_UPCOMING_APPOINTMENTS_REQUEST,
  ADMIN_UPCOMING_APPOINTMENTS_SUCCESS,
  ADMIN_UPCOMING_APPOINTMENTS_FAIL,
  ADMIN_APPOINTMENT_STATUS_UPDATE_REQUEST,
  ADMIN_APPOINTMENT_STATUS_UPDATE_SUCCESS,
  ADMIN_APPOINTMENT_STATUS_UPDATE_FAIL,
  ADMIN_APPOINTMENT_CANCEL_REQUEST,
  ADMIN_APPOINTMENT_CANCEL_SUCCESS,
  ADMIN_APPOINTMENT_CANCEL_FAIL,
  APPOINTMENT_SLOT_BULK_REQUEST,
  APPOINTMENT_SLOT_BULK_SUCCESS,
  APPOINTMENT_SLOT_BULK_FAIL,
  APPOINTMENT_SLOT_BULK_RESET
} from "../constants/appointmentConstants";



// Types
export interface AppointmentSlot {
  id: number;
  instructorId: number;
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
  isLicenceFromAnotherCountry?: boolean;
}

export interface BookGuestAppointmentPayload {
  appointment_info: {
    availableAppointmentSlotId: number;
    hoursToConsume: number;
    amountPaid: number;
    note?: string;
    learnerPermitIssueDate?: string;
    permitNumber?: string;
    permitExpirationDate?: string;
    drivingExperience?: string;
    isLicenceFromAnotherCountry: boolean;
  };
  user_info: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
  };
  isLicenceFromAnotherCountry: boolean;
}

export interface BulkAppointmentSlotPayload {
  startDate: string;
  endDate: string;
  startTime: string;
  slotDurationMinutes: number;
  slotNumber: number;
  slotIntervalMinutes: number;
  instructorId?: number | null;
  location?: string;
}

const getAppointmentErrorMessage = (error: any) => {
  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === 'string') {
      return data;
    }

    if (data.status?.message) {
      return data.status.message;
    }

    if (data.message) {
      return data.message;
    }
  }

  return error?.message || 'An unexpected error occurred';
};

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
      payload: getAppointmentErrorMessage(error),
    });
  }
};

// Create appointment slot
export const createAppointmentSlot = (appointmentData: {
  instructorId: number;
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
      payload: getAppointmentErrorMessage(error),
    });
  }
};

// Update appointment slot
export const updateAppointmentSlot = (
  id: number,
  appointmentData: {
    instructorId: number;
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
      payload: getAppointmentErrorMessage(error),
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
      payload: getAppointmentErrorMessage(error),
    });
  }
};

export const assignInstructorToSlot = (slotId: number, instructorId: number) => async (dispatch: any) => {
  try {
    dispatch({ type: APPOINTMENT_SLOT_ASSIGN_REQUEST });

    const { data } = await api.put('/appointment-slots/assign-instructor', {
      slotId,
      instructorId,
    });

    dispatch({
      type: APPOINTMENT_SLOT_ASSIGN_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: APPOINTMENT_SLOT_ASSIGN_FAIL,
      payload: getAppointmentErrorMessage(error),
    });
  }
};

export const createBulkAppointmentSlots = (payload: BulkAppointmentSlotPayload) => async (dispatch: any) => {
  try {
    dispatch({ type: APPOINTMENT_SLOT_BULK_REQUEST });

    const sanitizedPayload = {
      ...payload,
      instructorId: payload.instructorId ?? 0,
    };

    const { data } = await api.post('/appointment-slots/bulk', sanitizedPayload);

    dispatch({
      type: APPOINTMENT_SLOT_BULK_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: APPOINTMENT_SLOT_BULK_FAIL,
      payload: getAppointmentErrorMessage(error),
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

// Guest Booking with Registration Actions
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

// Guest Booking with Registration Thunk
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

// Admin appointment management types
export interface AdminAppointmentItem {
  id: number;
  userId: number;
  availableAppointmentSlotId: number;
  userCourseId: number | null;
  appointmentType: string;
  hoursConsumed: number;
  amountPaid: number;
  note: string;
  learnerPermitIssueDate: string;
  permitNumber: string;
  permitExpirationDate: string;
  drivingExperience: string;
  isLicenceFromAnotherCountry: boolean;
  status: string;
  createdAt: string;
  appointmentSlot: {
    id: number;
    instructorId: number;
    courseId: number;
    date: string;
    startTime: string;
    endTime: string;
    location: string | null;
    status: number;
    createdById: number;
    updatedById: number;
    createdAt: string;
    updatedAt: string;
    pricePerSlot: number;
  };
  userCourse: any | null;
}

export interface AdminAppointmentResponse {
  status: {
    code: string;
    message: string;
  };
  data: {
    items: AdminAppointmentItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Get admin previous appointments
export const getAdminPreviousAppointments = (pageNumber: number = 1, pageSize: number = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: ADMIN_PREVIOUS_APPOINTMENTS_REQUEST });
    
    const { data }: { data: AdminAppointmentResponse } = await api.get(`/appointments/previous?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    
    // Check if the response indicates no appointments found
    if (data.status?.code === "Appointments.NotFound") {
      // Treat as successful response with empty data
      dispatch({
        type: ADMIN_PREVIOUS_APPOINTMENTS_SUCCESS,
        payload: {
          status: data.status,
          data: {
            items: [],
            totalCount: 0,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
      });
    } else {
      dispatch({
        type: ADMIN_PREVIOUS_APPOINTMENTS_SUCCESS,
        payload: data,
      });
    }
  } catch (error: any) {
    // Check for specific 404 errors for appointment endpoints
    if (error.response?.status === 404) {
      // Handle 404 as no appointments found (endpoint might not be available)
      dispatch({
        type: ADMIN_PREVIOUS_APPOINTMENTS_SUCCESS,
        payload: {
          status: { code: "Appointments.NotFound", message: "No appointments found." },
          data: {
            items: [],
            totalCount: 0,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
      });
    } else {
      dispatch({
        type: ADMIN_PREVIOUS_APPOINTMENTS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

// Get admin upcoming appointments
export const getAdminUpcomingAppointments = (pageNumber: number = 1, pageSize: number = 10) => async (dispatch: any) => {
  try {
    dispatch({ type: ADMIN_UPCOMING_APPOINTMENTS_REQUEST });
    
    const { data }: { data: AdminAppointmentResponse } = await api.get(`/appointments/upcoming?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    
    // Check if the response indicates no appointments found
    if (data.status?.code === "Appointments.NotFound") {
      // Treat as successful response with empty data
      dispatch({
        type: ADMIN_UPCOMING_APPOINTMENTS_SUCCESS,
        payload: {
          status: data.status,
          data: {
            items: [],
            totalCount: 0,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
      });
    } else {
      dispatch({
        type: ADMIN_UPCOMING_APPOINTMENTS_SUCCESS,
        payload: data,
      });
    }
  } catch (error: any) {
    // Check for specific 404 errors for appointment endpoints
    if (error.response?.status === 404) {
      // Handle 404 as no appointments found (endpoint might not be available)
      dispatch({
        type: ADMIN_UPCOMING_APPOINTMENTS_SUCCESS,
        payload: {
          status: { code: "Appointments.NotFound", message: "No appointments found." },
          data: {
            items: [],
            totalCount: 0,
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
      });
    } else {
      dispatch({
        type: ADMIN_UPCOMING_APPOINTMENTS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  }
};

// Update appointment status (approve/reject)
export const updateAppointmentStatus = (appointmentId: number, status: string) => async (dispatch: any) => {
  try {
    dispatch({ type: ADMIN_APPOINTMENT_STATUS_UPDATE_REQUEST });
    
    const { data } = await api.put(`/appointments/${appointmentId}/status`, { status });
    
    dispatch({
      type: ADMIN_APPOINTMENT_STATUS_UPDATE_SUCCESS,
      payload: { id: appointmentId, status, data },
    });
  } catch (error: any) {
    dispatch({
      type: ADMIN_APPOINTMENT_STATUS_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Cancel appointment
export const cancelAppointment = (appointmentId: number, cancellationReason: string) => async (dispatch: any) => {
  try {
    dispatch({ type: ADMIN_APPOINTMENT_CANCEL_REQUEST });
    
    console.log('Canceling appointment:', appointmentId, 'with reason:', cancellationReason);
    
    const { data } = await api.put(`/appointments/${appointmentId}/cancel`, { 
      cancellationReason 
    });
    
    console.log('Cancel response:', data);
    
    dispatch({
      type: ADMIN_APPOINTMENT_CANCEL_SUCCESS,
      payload: { id: appointmentId, cancellationReason, data },
    });
  } catch (error: any) {
    console.error('Cancel appointment error:', error);
    dispatch({
      type: ADMIN_APPOINTMENT_CANCEL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};