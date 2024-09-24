import { GET_ALL_MEMBERS, GET_MEMBER_BY_ID, REGISTER_MEMBER } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { CreateMemberRegistrationRequestDTO } from "../types/Member/MemberRegistrationRequestDTO";
import { UUID } from "crypto";
import { MemberListDto, PaginatedMemberListResponse } from "../types/Member/MemberListresponseDTO";
import { PaginationOptions } from "../types/paginationTypes";

export const registerMember = async (member: CreateMemberRegistrationRequestDTO): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(`${REGISTER_MEMBER}`, member);
  return response.data;
}

export const updateMember = async (id:UUID,member: CreateMemberRegistrationRequestDTO): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.put({REGISTER_MEMBER}+`/${id}`, member);
  return response.data;
}

export const getMemberById=async(id:UUID):Promise<MemberListDto>=>{
  const response = await axiosInstance.get({GET_MEMBER_BY_ID}+`/${id}`);
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

