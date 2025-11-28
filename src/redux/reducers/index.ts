import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import {
  adminUserListReducer,
  adminUserDetailsReducer,
  adminUserDeleteReducer,
  adminRoleListReducer,
  adminCourseListReducer,
  adminRegionListReducer
} from "./adminReducer";
import { courseListReducer, enrolledCoursesReducer } from "./courseReducer";
import { userCourseDetailsReducer, userCourseListReducer } from "./userCourseReducer";
// import {reviewReducer} from "./reviewReducer";
import {
  appointmentSlotsReducer,
  appointmentSlotCreateReducer,
  appointmentSlotUpdateReducer,
  appointmentSlotDeleteReducer,
  appointmentSlotAssignReducer,
  appointmentSlotBulkReducer,
  bookDirectAppointmentReducer,
  userAppointmentsReducer,
  adminPreviousAppointmentsReducer,
  adminUpcomingAppointmentsReducer,
  adminAppointmentStatusUpdateReducer,
  adminAppointmentCancelReducer,
  adminAppointmentUserInfoReducer
} from "./appointmentReducer";
import { bookGuestAppointmentReducer } from "./guestBookingReducer";
import { instructorListReducer } from "./instructorReducers";
import {
  slotPricingListReducer,
  slotPricingCreateReducer,
  slotPricingUpdateReducer,
  slotPricingDeleteReducer,
  slotPricingDetailsReducer
} from "./slotPricingReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  adminUserList: adminUserListReducer,
  adminUserDetails: adminUserDetailsReducer,
  adminUserDelete: adminUserDeleteReducer,
  adminRoleList: adminRoleListReducer,
  adminCourseList:adminCourseListReducer,
  userCourseList: userCourseListReducer,
  userCourseDetails: userCourseDetailsReducer,
  guest_course: courseListReducer,
  enrolled_course:enrolledCoursesReducer,
  // course_reviews: reviewReducer,
  
  appointmentSlots: appointmentSlotsReducer,
  appointmentSlotCreate: appointmentSlotCreateReducer,
  appointmentSlotUpdate: appointmentSlotUpdateReducer,
  appointmentSlotDelete: appointmentSlotDeleteReducer,
  appointmentSlotAssign: appointmentSlotAssignReducer,
  appointmentSlotBulkCreate: appointmentSlotBulkReducer,
  bookDirectAppointment: bookDirectAppointmentReducer,
  bookGuestAppointment: bookGuestAppointmentReducer,
  userAppointments: userAppointmentsReducer,
  adminPreviousAppointments: adminPreviousAppointmentsReducer,
  adminUpcomingAppointments: adminUpcomingAppointmentsReducer,
  adminAppointmentStatusUpdate: adminAppointmentStatusUpdateReducer,
  adminAppointmentCancel: adminAppointmentCancelReducer,
  adminAppointmentUserInfo: adminAppointmentUserInfoReducer,
  
  instructorList: instructorListReducer,
  regionList: adminRegionListReducer,

  // Slot Pricing reducers
  slotPricingList: slotPricingListReducer,
  slotPricingCreate: slotPricingCreateReducer,
  slotPricingUpdate: slotPricingUpdateReducer,
  slotPricingDelete: slotPricingDeleteReducer,
  slotPricingDetails: slotPricingDetailsReducer,
  
  // add other reducers here
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;