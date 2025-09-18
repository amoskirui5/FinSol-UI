// Organization API Types based on backend specification

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errors: string[];
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  errors: string[];
  data: {
    items: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

// Following existing pattern - simplified response types
export interface OrganizationResponse {
  success: boolean;
  message: string;
  errors: string[];
  data: Organization;
}

export interface PaginatedOrganizationResponse {
  success: boolean;
  message: string;
  errors: string[];
  data: {
    items: Organization[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface Organization {
  organizationId: string;
  organizationName: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  logo: string;
  website: string;
  description: string;
  primaryContactName: string;
  primaryEmail: string;
  primaryPhoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranchCode: string;
  swiftCode: string;
  establishedDate: string;
  industry: string;
  employeeCount: number;
  licenseNumber: string;
  licenseExpiryDate: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

export interface CreateOrganizationRequest {
  organizationName: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  logo?: string;
  website?: string;
  description?: string;
  primaryContactName: string;
  primaryEmail: string;
  primaryPhoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranchCode: string;
  swiftCode?: string;
  establishedDate: string;
  industry: string;
  employeeCount: number;
  licenseNumber: string;
  licenseExpiryDate: string;
}

export interface UpdateOrganizationRequest {
  organizationName: string;
  logo?: string;
  website?: string;
  description?: string;
  primaryContactName: string;
  primaryEmail: string;
  primaryPhoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankBranchCode: string;
  swiftCode?: string;
  industry: string;
  employeeCount: number;
  licenseNumber: string;
  licenseExpiryDate: string;
}

export interface OrganizationFilters {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
  organizationName?: string;
  businessRegistrationNumber?: string;
  industry?: string;
  city?: string;
  country?: string;
  primaryEmail?: string;
  isActive?: boolean;
}

export interface OrganizationFormValues extends Omit<CreateOrganizationRequest, 'establishedDate' | 'licenseExpiryDate'> {
  establishedDate: Date | null;
  licenseExpiryDate: Date | null;
}

// Common industry options
export const INDUSTRIES = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Agriculture',
  'Transportation',
  'Energy',
  'Construction',
  'Hospitality',
  'Other'
] as const;

// Country options (focusing on Kenya and common countries)
export const COUNTRIES = [
  { value: 'KE', label: 'Kenya' },
  { value: 'UG', label: 'Uganda' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
] as const;

// Kenyan cities
export const KENYAN_CITIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Malindi',
  'Kitale',
  'Garissa',
  'Kakamega',
  'Nyeri',
  'Machakos',
] as const;
