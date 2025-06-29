import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { adminUserListReducer } from "./adminReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  adminUserList: adminUserListReducer
  // add other reducers here
});

export default rootReducer;