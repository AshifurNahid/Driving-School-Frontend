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
} from "../constants/appointmentConstants";

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
    
    const { data } = await api.post('/appointment-slots', appointmentData);
    
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
    
    const { data } = await api.put(`/appointment-slots/${id}`, appointmentData);
    
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

// Delete appointment slot
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
