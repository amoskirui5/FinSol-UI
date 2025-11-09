import { ALL_SYSTEM_ROLES } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { RoleListResponse } from "../types/System/systemRolesTypes";

export const getAllSystemRoles = async (): Promise<RoleListResponse> => {
    const response = await axiosInstance.get<RoleListResponse>(ALL_SYSTEM_ROLES);
    return { ...response.data };
}