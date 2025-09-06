// Guest booking with registration reducer
import { AnyAction } from 'redux';
import { 
  BOOK_GUEST_APPOINTMENT_REQUEST,
  BOOK_GUEST_APPOINTMENT_SUCCESS, 
  BOOK_GUEST_APPOINTMENT_FAILURE, 
  BOOK_GUEST_APPOINTMENT_RESET 
} from "../constants/appointmentConstants";

interface BookGuestAppointmentState {
  loading: boolean;
  success: boolean;
  message: string | null;
  error: string | null;
  data: any;
}

const bookGuestAppointmentInitialState: BookGuestAppointmentState = {
  loading: false,
  success: false,
  message: null,
  error: null,
  data: null
};

export const bookGuestAppointmentReducer = (
  state = bookGuestAppointmentInitialState,
  action: AnyAction
): BookGuestAppointmentState => {
  switch (action.type) {
    case BOOK_GUEST_APPOINTMENT_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        message: null,
        error: null,
        data: null
      };
    case BOOK_GUEST_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        message: "Appointment booked successfully and account created",
        error: null,
        data: action.payload
      };
    case BOOK_GUEST_APPOINTMENT_FAILURE:
      return {
        ...state,
        loading: false,
        success: false,
        message: null,
        error: action.payload,
        data: null
      };
    case BOOK_GUEST_APPOINTMENT_RESET:
      return bookGuestAppointmentInitialState;
    default:
      return state;
  }
};
