import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAdminUsers } from "@/redux/actions/adminAction";
import { RootState } from "@/redux/store";

export const useAdminUsers = (pageNumber = 1, pageSize = 20) => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.adminUserList);

  useEffect(() => {
    dispatch(getAdminUsers(pageNumber, pageSize) as any);
  }, [dispatch, pageNumber, pageSize]);

  return { users, loading, error };
};