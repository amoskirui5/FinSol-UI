import { UUID } from "crypto";

export interface UserRole {
  name: string;
}

export interface User {
  id: UUID;
  firstName: string;
  otherName: string;
  roles: UserRole[];
  email: string;
  isActive: boolean;
}
export interface UserRegistrationFormValues {
  firstName: string;
  otherName: string;
  roleName: string;
  email: string;
}

export interface UserRegistrationFormProps {
  onSubmit: (values: UserRegistrationFormValues) => void;
}

export interface UsersListResponse {
  data: User[];
  success: boolean;
  message: string;
  errors: string[];
}


export interface UserListProps {
  users: User[];
  onStatusChange: (id: number, isActive: boolean) => void;
}