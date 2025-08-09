import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import {
  adminUserListReducer,
  adminUserDetailsReducer,
  adminUserDeleteReducer,
  adminRoleListReducer,
  adminCourseListReducer
} from "./adminReducer";
import { courseListReducer, enrolledCoursesReducer } from "./courseReducer";
import { userCourseListReducer } from "./userCourseReducer";
// import {reviewReducer} from "./reviewReducer";
import {
  appointmentSlotsReducer,
  appointmentSlotCreateReducer,
  appointmentSlotUpdateReducer,
  appointmentSlotDeleteReducer,
  bookDirectAppointmentReducer  // NEW
} from "./appointmentReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  adminUserList: adminUserListReducer,
  adminUserDetails: adminUserDetailsReducer,
  adminUserDelete: adminUserDeleteReducer,
  adminRoleList: adminRoleListReducer,
  adminCourseList:adminCourseListReducer,
  userCourseList: userCourseListReducer,
  guest_course: courseListReducer,
  enrolled_course:enrolledCoursesReducer,
  // course_reviews: reviewReducer,
  
  appointmentSlots: appointmentSlotsReducer,
  appointmentSlotCreate: appointmentSlotCreateReducer,
  appointmentSlotUpdate: appointmentSlotUpdateReducer,
  appointmentSlotDelete: appointmentSlotDeleteReducer,
  bookDirectAppointment: bookDirectAppointmentReducer // NEW

  
  // add other reducers here
});
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;