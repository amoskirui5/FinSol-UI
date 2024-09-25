import { GET_ALL_MEMBERS, GET_MEMBER_BY_ID, REGISTER_MEMBER, UPDATE_MEMBER_DETAILS } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { UUID } from "crypto";
import { PaginationOptions } from "../types/paginationTypes";
import { CreateMemberRegistrationRequestDTO, MemberDetailsResponse, PaginatedMemberListResponse } from "../types/Member/memberTypes";

export const registerMember = async (member: CreateMemberRegistrationRequestDTO): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(`${REGISTER_MEMBER}`, member);
  return response.data;
}

export const updateMember = async (id:UUID,member: CreateMemberRegistrationRequestDTO): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.put(UPDATE_MEMBER_DETAILS+`/${id}`, member);
  return response.data;
}

export const fetchMemberById=async(id:UUID):Promise<MemberDetailsResponse>=>{
  const response = await axiosInstance.get(GET_MEMBER_BY_ID+`/${id}`);
  return response.data;
}

export const fetchAllMembers = async (options: PaginationOptions): Promise<PaginatedMemberListResponse> => {
  const response = await axiosInstance.get(GET_ALL_MEMBERS, {
      params: {
          pageNumber: options.pageNumber,
          pageSize: options.pageSize,
          searchTerm: options.searchTerm,
          searchField: options.searchField,
      },
  });
  return response.data;
};

