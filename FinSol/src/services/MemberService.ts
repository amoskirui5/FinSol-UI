import { GET_MEMBER_BY_ID, REGISTER_MEMBER } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { CreateMemberRegistrationRequestDTO } from "../types/Member/MemberRegistrationRequestDTO";
import { UUID } from "crypto";
import { MemberListDto } from "../types/Member/MemberListresponseDTO";

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

