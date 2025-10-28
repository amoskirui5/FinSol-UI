import { 
  CREATE_ORGANIZATION,
  GET_ORGANIZATIONS,
  GET_ORGANIZATION_BY_ID,
  UPDATE_ORGANIZATION,
  DELETE_ORGANIZATION,
  REACTIVATE_ORGANIZATION
} from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { 
  CreateOrganizationRequest, 
  UpdateOrganizationRequest, 
  OrganizationFilters,
  OrganizationResponse,
  PaginatedOrganizationResponse
} from '../types/Organizations/organizationTypes';

// Create Organization
export const createOrganization = async (data: CreateOrganizationRequest): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(CREATE_ORGANIZATION, data);
  return response.data;
};

// Get Organizations with pagination and filtering  
export const getOrganizations = async (filters: OrganizationFilters): Promise<PaginatedOrganizationResponse> => {
  const response = await axiosInstance.get(GET_ORGANIZATIONS, {
    params: {
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
      sortBy: filters.sortBy,
      sortDescending: filters.sortDescending,
      organizationName: filters.organizationName || undefined,
      businessRegistrationNumber: filters.businessRegistrationNumber || undefined,
      industry: filters.industry || undefined,
      city: filters.city || undefined,
      country: filters.country || undefined,
      primaryEmail: filters.primaryEmail || undefined,
      isActive: filters.isActive
    }
  });
  return response.data;
};

// Get Organization by ID
export const getOrganizationById = async (id: string): Promise<OrganizationResponse> => {
  const response = await axiosInstance.get(`${GET_ORGANIZATION_BY_ID}/${id}`);
  return response.data;
};

// Update Organization
export const updateOrganization = async (id: string, data: UpdateOrganizationRequest): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.put(`${UPDATE_ORGANIZATION}/${id}`, data);
  return response.data;
};

// Delete Organization (soft delete)
export const deleteOrganization = async (id: string): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.delete(`${DELETE_ORGANIZATION}/${id}`);
  return response.data;
};

// Reactivate Organization
export const reactivateOrganization = async (id: string): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(`${REACTIVATE_ORGANIZATION}/${id}/reactivate`, {});
  return response.data;
};
