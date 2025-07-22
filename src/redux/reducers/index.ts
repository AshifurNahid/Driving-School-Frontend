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
// import {reviewReducer} from "./reviewReducer";
import {
  appointmentSlotsReducer,
  appointmentSlotCreateReducer,
  appointmentSlotUpdateReducer,
  appointmentSlotDeleteReducer,
} from "./appointmentReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  adminUserList: adminUserListReducer,
  adminUserDetails: adminUserDetailsReducer,
  adminUserDelete: adminUserDeleteReducer,
  adminRoleList: adminRoleListReducer,
  adminCourseList:adminCourseListReducer,
  guest_course: courseListReducer,
  enrolled_course:enrolledCoursesReducer,
  // course_reviews: reviewReducer,
  
  appointmentSlots: appointmentSlotsReducer,
  appointmentSlotCreate: appointmentSlotCreateReducer,
  appointmentSlotUpdate: appointmentSlotUpdateReducer,
  appointmentSlotDelete: appointmentSlotDeleteReducer,
  // add other reducers here
});

export default rootReducer;