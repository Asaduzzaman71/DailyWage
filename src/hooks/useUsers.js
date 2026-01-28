// hooks/useUsers.js
import { useQuery } from '@tanstack/react-query';
import { userService } from "../services";

const fetchUsers = async (params) => {
  console.log("fetching users with params:", params )
  const { data } = await userService.getUserList({params});
  return data;
};

export const useUsers = (params = {}) => {
  // The queryKey must include the parameters
  // This tells React Query to cache data separately for each unique set of params
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
};