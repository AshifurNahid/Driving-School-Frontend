import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/redux/store";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  return userInfo ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;