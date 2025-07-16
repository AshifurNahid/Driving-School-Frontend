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

const rootReducer = combineReducers({
  auth: authReducer,
  adminUserList: adminUserListReducer,
  adminUserDetails: adminUserDetailsReducer,
  adminUserDelete: adminUserDeleteReducer,
  adminRoleList: adminRoleListReducer,
  adminCourseList:adminCourseListReducer,
  courseList: courseListReducer,
  
  // add other reducers here
});

export default rootReducer;