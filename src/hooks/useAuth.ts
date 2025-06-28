import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export const useAuth = () => {
  const { userInfo, loading, error } = useSelector((state: RootState) => state.auth);
  return { userInfo, loading, error };
};