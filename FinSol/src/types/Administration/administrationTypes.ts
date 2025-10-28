import { BaseResponseDTO } from '../BaseResponseDTO';

// User Management DTOs
export interface UserRole {
  roleId: string;
  roleName: string;
  description?: string;
  permissions: string[];
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

export interface SystemUser {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: string;
  createdDate: string;
  roles: UserRole[];
  organizationId: string;
  department?: string;
  position?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
  roleIds: string[];
  organizationId: string;
  department?: string;
  position?: string;
  sendWelcomeEmail: boolean;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleIds: string[];
  department?: string;
  position?: string;
  isActive: boolean;
}

export interface UserRoleRequest {
  roleName: string;
  description?: string;
  permissions: string[];
}

export interface PasswordResetRequest {
  userId: string;
  newPassword: string;
  confirmPassword: string;
  requirePasswordChange: boolean;
}

// Access Control DTOs
export interface Permission {
  permissionId: string;
  permissionName: string;
  description: string;
  module: string;
  action: string;
}

export interface AccessLog {
  logId: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Blocked';
  details?: string;
}

export interface AccessLogFilter {
  userId?: string;
  action?: string;
  resource?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
}

// Response DTOs
export interface UsersResponse extends BaseResponseDTO {
  data: {
    items: SystemUser[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface UserResponse extends BaseResponseDTO {
  data: SystemUser;
}

export interface UserRolesResponse extends BaseResponseDTO {
  data: UserRole[];
}

export interface PermissionsResponse extends BaseResponseDTO {
  data: Permission[];
}

export interface AccessLogsResponse extends BaseResponseDTO {
  data: {
    items: AccessLog[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}