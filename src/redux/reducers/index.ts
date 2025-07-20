import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import {
  adminUserListReducer,
  adminUserDetailsReducer,
  adminUserDeleteReducer,
  adminRoleListReducer,
  adminCourseListReducer
} from "./adminReducer";
import { courseListReducer } from "./courseReducer";
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
  
  appointmentSlots: appointmentSlotsReducer,
  appointmentSlotCreate: appointmentSlotCreateReducer,
  appointmentSlotUpdate: appointmentSlotUpdateReducer,
  appointmentSlotDelete: appointmentSlotDeleteReducer,
  // add other reducers here
});

export default rootReducer;