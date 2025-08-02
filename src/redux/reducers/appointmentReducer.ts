import {
  APPOINTMENT_SLOTS_REQUEST,
  APPOINTMENT_SLOTS_SUCCESS,
  APPOINTMENT_SLOTS_FAIL,
  APPOINTMENT_SLOT_CREATE_REQUEST,
  APPOINTMENT_SLOT_CREATE_SUCCESS,
  APPOINTMENT_SLOT_CREATE_FAIL,
  APPOINTMENT_SLOT_CREATE_RESET,
  APPOINTMENT_SLOT_UPDATE_REQUEST,
  APPOINTMENT_SLOT_UPDATE_SUCCESS,
  APPOINTMENT_SLOT_UPDATE_FAIL,
  APPOINTMENT_SLOT_UPDATE_RESET,
  APPOINTMENT_SLOT_DELETE_REQUEST,
  APPOINTMENT_SLOT_DELETE_SUCCESS,
  APPOINTMENT_SLOT_DELETE_FAIL,
  APPOINTMENT_SLOT_DELETE_RESET,
} from "../constants/appointmentConstants";

// Interface for appointment slot
interface AppointmentSlot {
  id: number;
  instructorId: number;
  courseId?: number; // Added property for courseId
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: number;
  createdById: number;
  updatedById: number;
  createdAt: string;
  updatedAt: string;
  pricePerSlot?: number; // Added property for pricePerSlot
}

// Interface for appointment slots state
interface AppointmentSlotsState {
  loading: boolean;
  appointmentSlots: AppointmentSlot[];
  error: string | null;
}

// Initial state
const initialAppointmentSlotsState: AppointmentSlotsState = {
  loading: false,
  appointmentSlots: [], // Ensure this is initialized as an empty array
  error: null,
};

// Appointment slots reducer
export const appointmentSlotsReducer = (
  state = initialAppointmentSlotsState,
  action: any
): AppointmentSlotsState => {
  switch (action.type) {
    case APPOINTMENT_SLOTS_REQUEST:
      return { ...state, loading: true, error: null };
    case APPOINTMENT_SLOTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentSlots: Array.isArray(action.payload) ? action.payload : [], // Ensure it's an array
        error: null,
      };
    case APPOINTMENT_SLOTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Interface for appointment slot create state
interface AppointmentSlotCreateState {
  loading: boolean;
  success: boolean;
  appointmentSlot: AppointmentSlot | null;
  error: string | null;
}

// Initial state for create
const initialAppointmentSlotCreateState: AppointmentSlotCreateState = {
  loading: false,
  success: false,
  appointmentSlot: null,
  error: null,
};

// Appointment slot create reducer
export const appointmentSlotCreateReducer = (
  state = initialAppointmentSlotCreateState,
  action: any
): AppointmentSlotCreateState => {
  switch (action.type) {
    case APPOINTMENT_SLOT_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case APPOINTMENT_SLOT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        appointmentSlot: action.payload,
        error: null,
      };
    case APPOINTMENT_SLOT_CREATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case APPOINTMENT_SLOT_CREATE_RESET:
      return initialAppointmentSlotCreateState;
    default:
      return state;
  }
};

// Interface for appointment slot update state
interface AppointmentSlotUpdateState {
  loading: boolean;
  success: boolean;
  appointmentSlot: AppointmentSlot | null;
  error: string | null;
}

// Initial state for update
const initialAppointmentSlotUpdateState: AppointmentSlotUpdateState = {
  loading: false,
  success: false,
  appointmentSlot: null,
  error: null,
};

// Appointment slot update reducer
export const appointmentSlotUpdateReducer = (
  state = initialAppointmentSlotUpdateState,
  action: any
): AppointmentSlotUpdateState => {
  switch (action.type) {
    case APPOINTMENT_SLOT_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case APPOINTMENT_SLOT_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        appointmentSlot: action.payload,
        error: null,
      };
    case APPOINTMENT_SLOT_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case APPOINTMENT_SLOT_UPDATE_RESET:
      return initialAppointmentSlotUpdateState;
    default:
      return state;
  }
};

// Interface for appointment slot delete state
interface AppointmentSlotDeleteState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

// Initial state for delete
const initialAppointmentSlotDeleteState: AppointmentSlotDeleteState = {
  loading: false,
  success: false,
  error: null,
};

// Appointment slot delete reducer
export const appointmentSlotDeleteReducer = (
  state = initialAppointmentSlotDeleteState,
  action: any
): AppointmentSlotDeleteState => {
  switch (action.type) {
    case APPOINTMENT_SLOT_DELETE_REQUEST:
      return { ...state, loading: true, error: null };
    case APPOINTMENT_SLOT_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case APPOINTMENT_SLOT_DELETE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case APPOINTMENT_SLOT_DELETE_RESET:
      return initialAppointmentSlotDeleteState;
    default:
      return state;
  }
};
