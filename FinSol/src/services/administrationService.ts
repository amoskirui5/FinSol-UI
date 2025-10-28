import axiosInstance from '../interceptors/globaInterceptor';
import { 
  GET_SYSTEM_USERS, 
  CREATE_SYSTEM_USER, 
  UPDATE_SYSTEM_USER, 
  DELETE_SYSTEM_USER,
  GET_USER_BY_ID,
  RESET_USER_PASSWORD,
  DEACTIVATE_USER,
  ACTIVATE_USER,
  GET_USER_ROLES,
  CREATE_USER_ROLE,
  UPDATE_USER_ROLE,
  DELETE_USER_ROLE,
  GET_PERMISSIONS,
  GET_ACCESS_LOGS,
  EXPORT_ACCESS_LOGS
} from '../constants/apiEndpoints';
import {
  UsersResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserRoleRequest,
  UserRolesResponse,
  PermissionsResponse,
  AccessLogsResponse,
  AccessLogFilter,
  PasswordResetRequest
} from '../types/Administration/administrationTypes';
import { PaginationOptions } from '../types/paginationTypes';

// User Management Services
export const getSystemUsers = async (options: PaginationOptions): Promise<UsersResponse> => {
  const response = await axiosInstance.get(GET_SYSTEM_USERS, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
      searchField: options.searchField,
    },
  });
  return response.data;
};

export const getUserById = async (userId: string): Promise<UserResponse> => {
  const response = await axiosInstance.get(`${GET_USER_BY_ID}/${userId}`);
  return response.data;
};

export const createSystemUser = async (userData: CreateUserRequest): Promise<UserResponse> => {
  const response = await axiosInstance.post(CREATE_SYSTEM_USER, userData);
  return response.data;
};

export const updateSystemUser = async (userId: string, userData: UpdateUserRequest): Promise<UserResponse> => {
  const response = await axiosInstance.put(`${UPDATE_SYSTEM_USER}/${userId}`, userData);
  return response.data;
};

export const deleteSystemUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`${DELETE_SYSTEM_USER}/${userId}`);
};

export const resetUserPassword = async (passwordResetData: PasswordResetRequest): Promise<void> => {
  await axiosInstance.post(RESET_USER_PASSWORD, passwordResetData);
};

export const deactivateUser = async (userId: string): Promise<void> => {
  await axiosInstance.put(`${DEACTIVATE_USER}/${userId}`);
};

export const activateUser = async (userId: string): Promise<void> => {
  await axiosInstance.put(`${ACTIVATE_USER}/${userId}`);
};

// Role Management Services
export const getUserRoles = async (): Promise<UserRolesResponse> => {
  const response = await axiosInstance.get(GET_USER_ROLES);
  return response.data;
};

export const createUserRole = async (roleData: UserRoleRequest): Promise<UserRolesResponse> => {
  const response = await axiosInstance.post(CREATE_USER_ROLE, roleData);
  return response.data;
};

export const updateUserRole = async (roleId: string, roleData: UserRoleRequest): Promise<UserRolesResponse> => {
  const response = await axiosInstance.put(`${UPDATE_USER_ROLE}/${roleId}`, roleData);
  return response.data;
};

export const deleteUserRole = async (roleId: string): Promise<void> => {
  await axiosInstance.delete(`${DELETE_USER_ROLE}/${roleId}`);
};

export const getPermissions = async (): Promise<PermissionsResponse> => {
  const response = await axiosInstance.get(GET_PERMISSIONS);
  return response.data;
};

// Access Logs Services
export const getAccessLogs = async (filter: AccessLogFilter, options: PaginationOptions): Promise<AccessLogsResponse> => {
  const response = await axiosInstance.get(GET_ACCESS_LOGS, {
    params: {
      ...filter,
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

export const exportAccessLogs = async (filter: AccessLogFilter, format: 'excel' | 'pdf'): Promise<Blob> => {
  const response = await axiosInstance.get(EXPORT_ACCESS_LOGS, {
    params: { ...filter, format },
    responseType: 'blob',
  });
  return response.data;
};