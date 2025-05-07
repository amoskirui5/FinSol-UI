import { CREATE_MEMBER_NEXT_OF_KIN, DELETE_MEMBER_NEXT_OF_KIN, GET_ALL_MEMBERS, GET_MEMBER_BY_ID, GET_MEMBER_NEXT_OF_KIN_BY_MEMBER_ID, REGISTER_MEMBER, UPDATE_MEMBER_DETAILS, UPDATE_MEMBER_NEXT_OF_KIN } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { UUID } from "crypto";
import { PaginationOptions } from "../types/paginationTypes";
import { CreateMemberNextOfKinDto, CreateMemberRegistrationRequestDTO, MemberDetailsResponse, MemberNextOfKinDto, PaginatedMemberListResponse, UpdateMemberNextOfKinDto } from "../types/Member/memberTypes";

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

export const fetchNextOfKinById = async (id: string): Promise<MemberNextOfKinDto> => {
  const response = await axiosInstance.get(`${CREATE_MEMBER_NEXT_OF_KIN}/${id}`);
  return response.data;
};

export const createNextOfKin = async (data: CreateMemberNextOfKinDto): Promise<MemberNextOfKinDto> => {
  const response = await axiosInstance.post(CREATE_MEMBER_NEXT_OF_KIN, data);
  return response.data;
};

export const updateNextOfKin = async (id: string, data: UpdateMemberNextOfKinDto): Promise<void> => {
  await axiosInstance.put(`${UPDATE_MEMBER_NEXT_OF_KIN}/${id}`, data);
};

export const deleteNextOfKin = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${DELETE_MEMBER_NEXT_OF_KIN}/${id}`);
};

export const fetchNextOfKinByMemberId = async (memberId: string): Promise<MemberNextOfKinDto[]> => {
  const response = await axiosInstance.get(`${GET_MEMBER_NEXT_OF_KIN_BY_MEMBER_ID}?memberId=${memberId}`);
  return response.data;
}