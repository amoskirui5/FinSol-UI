
export interface SystemRoles {
    roleName: string;
    isActive: boolean;
  }

  export interface RoleListResponse {
    data: SystemRoles[];
    success: boolean;
    message: string;
    errors: string[];
  }