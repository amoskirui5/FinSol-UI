import { UUID } from "crypto";
import { GET_ALL_MEMBER_ACCOUNTS_SETTINGS } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { MemberAccountSettingsDetailsResponse, RegisterMemberAccountDTO } from "../types/MemberAccount/memberAccountTypes";

export const registerMemberAccountSettings = async (member: RegisterMemberAccountDTO): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.post(`${GET_ALL_MEMBER_ACCOUNTS_SETTINGS}`, member);
    return response.data;
  }
  
  export const updateMemberAccountSettings = async (id:UUID,member: RegisterMemberAccountDTO): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.put(GET_ALL_MEMBER_ACCOUNTS_SETTINGS+`/${id}`, member);
    return response.data;
  }
  
  export const fetchMemberAccountSettings=async():Promise<MemberAccountSettingsDetailsResponse>=>{
    const response = await axiosInstance.get(GET_ALL_MEMBER_ACCOUNTS_SETTINGS);
    return response.data;
  }