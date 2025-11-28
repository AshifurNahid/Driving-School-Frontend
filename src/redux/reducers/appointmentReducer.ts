// src/redux/reducers/appointmentReducers.ts

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
  APPOINTMENT_SLOT_ASSIGN_REQUEST,
  APPOINTMENT_SLOT_ASSIGN_SUCCESS,
  APPOINTMENT_SLOT_ASSIGN_FAIL,
  APPOINTMENT_SLOT_ASSIGN_RESET,
  APPOINTMENT_SLOT_BULK_REQUEST,
  APPOINTMENT_SLOT_BULK_SUCCESS,
  APPOINTMENT_SLOT_BULK_FAIL,
  APPOINTMENT_SLOT_BULK_RESET,
  BOOK_DIRECT_APPOINTMENT_REQUEST,
  BOOK_DIRECT_APPOINTMENT_SUCCESS,
  BOOK_DIRECT_APPOINTMENT_FAILURE,
  BOOK_DIRECT_APPOINTMENT_RESET,
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
  ADMIN_APPOINTMENT_CANCEL_RESET,
  ADMIN_APPOINTMENT_USER_INFO_REQUEST,
  ADMIN_APPOINTMENT_USER_INFO_SUCCESS,
  ADMIN_APPOINTMENT_USER_INFO_FAIL
} from '../constants/appointmentConstants';

// Interface for appointment slot
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

// Interface for appointment slots state
interface AppointmentSlotsState {
  loading: boolean;
  appointmentSlots: AppointmentSlot[];
  error: string | null;
}

// Initial state
const initialAppointmentSlotsState: AppointmentSlotsState = {
  loading: false,
  appointmentSlots: [],
  error: null,
};

// Appointment slots reducer (existing)
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
        appointmentSlots: Array.isArray(action.payload) ? action.payload : [],
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

interface AppointmentSlotBulkState {
  loading: boolean;
  success: boolean;
  data: any | null;
  error: string | null;
}

const initialAppointmentSlotBulkState: AppointmentSlotBulkState = {
  loading: false,
  success: false,
  data: null,
  error: null,
};

// User Appointments State Interface
interface UserAppointmentsState {
  loading: boolean;
  appointments: any[]; // Using any for now, will be UserAppointmentItem[] from types
  error: string | null;
}

// Initial state for user appointments
const initialUserAppointmentsState: UserAppointmentsState = {
  loading: false,
  appointments: [],
  error: null,
};

// User appointments reducer
export const userAppointmentsReducer = (
  state = initialUserAppointmentsState,
  action: any
): UserAppointmentsState => {
  switch (action.type) {
    case USER_APPOINTMENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case USER_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: Array.isArray(action.payload) ? action.payload : [],
        error: null,
      };
    case USER_APPOINTMENTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Appointment slot create reducer (existing)
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

export const appointmentSlotBulkReducer = (
  state = initialAppointmentSlotBulkState,
  action: any
): AppointmentSlotBulkState => {
  switch (action.type) {
    case APPOINTMENT_SLOT_BULK_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case APPOINTMENT_SLOT_BULK_SUCCESS:
      return { ...state, loading: false, success: true, data: action.payload, error: null };
    case APPOINTMENT_SLOT_BULK_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case APPOINTMENT_SLOT_BULK_RESET:
      return initialAppointmentSlotBulkState;
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

// Appointment slot update reducer (existing)
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

// Appointment slot delete reducer (existing)
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

interface AppointmentSlotAssignState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialAppointmentSlotAssignState: AppointmentSlotAssignState = {
  loading: false,
  success: false,
  error: null,
};

export const appointmentSlotAssignReducer = (
  state = initialAppointmentSlotAssignState,
  action: any
): AppointmentSlotAssignState => {
  switch (action.type) {
    case APPOINTMENT_SLOT_ASSIGN_REQUEST:
      return { ...state, loading: true, error: null };
    case APPOINTMENT_SLOT_ASSIGN_SUCCESS:
      return { ...state, loading: false, success: true, error: null };
    case APPOINTMENT_SLOT_ASSIGN_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case APPOINTMENT_SLOT_ASSIGN_RESET:
      return initialAppointmentSlotAssignState;
    default:
      return state;
  }
};

// NEW: Book Direct Appointment State
interface BookDirectAppointmentState {
  loading: boolean;
  success: boolean;
  message: string | null;
  error: string | null;
  data: any;
}

const bookDirectAppointmentInitialState: BookDirectAppointmentState = {
  loading: false,
  success: false,
  message: null,
  error: null,
  data: null,
};

// NEW: Book Direct Appointment Reducer
export const bookDirectAppointmentReducer = (
  state = bookDirectAppointmentInitialState,
  action: any
): BookDirectAppointmentState => {
  switch (action.type) {
    case BOOK_DIRECT_APPOINTMENT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        error: null
      };
    
    case BOOK_DIRECT_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: action.payload.message,
        error: null,
        data: action.payload.data
      };
    
    case BOOK_DIRECT_APPOINTMENT_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        message: null,
        error: action.payload,
        data: null
      };
    
    case BOOK_DIRECT_APPOINTMENT_RESET:
      return bookDirectAppointmentInitialState;
    
    default:
      return state;
  }
};

// Admin appointments management interfaces and reducers
interface AdminAppointmentsState {
  loading: boolean;
  appointments: any[];
  pagination: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  error: string | null;
}

const initialAdminAppointmentsState: AdminAppointmentsState = {
  loading: false,
  appointments: [],
  pagination: null,
  error: null,
};

// Admin previous appointments reducer
export const adminPreviousAppointmentsReducer = (
  state = initialAdminAppointmentsState,
  action: any
): AdminAppointmentsState => {
  switch (action.type) {
    case ADMIN_PREVIOUS_APPOINTMENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_PREVIOUS_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: action.payload.data.items || [],
        pagination: {
          totalCount: action.payload.data.totalCount,
          pageNumber: action.payload.data.pageNumber,
          pageSize: action.payload.data.pageSize,
          totalPages: action.payload.data.totalPages,
          hasNextPage: action.payload.data.hasNextPage,
          hasPreviousPage: action.payload.data.hasPreviousPage,
        },
        error: null,
      };
    case ADMIN_PREVIOUS_APPOINTMENTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Admin upcoming appointments reducer
export const adminUpcomingAppointmentsReducer = (
  state = initialAdminAppointmentsState,
  action: any
): AdminAppointmentsState => {
  switch (action.type) {
    case ADMIN_UPCOMING_APPOINTMENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_UPCOMING_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: action.payload.data.items || [],
        pagination: {
          totalCount: action.payload.data.totalCount,
          pageNumber: action.payload.data.pageNumber,
          pageSize: action.payload.data.pageSize,
          totalPages: action.payload.data.totalPages,
          hasNextPage: action.payload.data.hasNextPage,
          hasPreviousPage: action.payload.data.hasPreviousPage,
        },
        error: null,
      };
    case ADMIN_UPCOMING_APPOINTMENTS_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Admin appointment status update reducer
interface AdminAppointmentUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialAdminAppointmentUpdateState: AdminAppointmentUpdateState = {
  loading: false,
  success: false,
  error: null,
};

export const adminAppointmentStatusUpdateReducer = (
  state = initialAdminAppointmentUpdateState,
  action: any
): AdminAppointmentUpdateState => {
  switch (action.type) {
    case ADMIN_APPOINTMENT_STATUS_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_APPOINTMENT_STATUS_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case ADMIN_APPOINTMENT_STATUS_UPDATE_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    default:
      return state;
  }
};

// Admin appointment cancel state and reducer
interface AdminAppointmentCancelState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialAdminAppointmentCancelState: AdminAppointmentCancelState = {
  loading: false,
  success: false,
  error: null,
};

export const adminAppointmentCancelReducer = (
  state = initialAdminAppointmentCancelState,
  action: any
): AdminAppointmentCancelState => {
  switch (action.type) {
    case ADMIN_APPOINTMENT_CANCEL_REQUEST:
      return { ...state, loading: true, error: null, success: false };
    case ADMIN_APPOINTMENT_CANCEL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
      };
    case ADMIN_APPOINTMENT_CANCEL_FAIL:
      return { ...state, loading: false, success: false, error: action.payload };
    case ADMIN_APPOINTMENT_CANCEL_RESET:
      return initialAdminAppointmentCancelState;
    default:
      return state;
  }
};

// Admin appointment slot user info state and reducer
interface AdminAppointmentUserInfoState {
  loading: boolean;
  data: any;
  error: string | null;
}

const initialAdminAppointmentUserInfoState: AdminAppointmentUserInfoState = {
  loading: false,
  data: null,
  error: null,
};

export const adminAppointmentUserInfoReducer = (
  state = initialAdminAppointmentUserInfoState,
  action: any
): AdminAppointmentUserInfoState => {
  switch (action.type) {
    case ADMIN_APPOINTMENT_USER_INFO_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_APPOINTMENT_USER_INFO_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
    case ADMIN_APPOINTMENT_USER_INFO_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};