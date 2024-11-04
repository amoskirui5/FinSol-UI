import { FETCH_MEMBER_GENERAL_STATEMENT } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { MemberStatementData } from "../types/Member/memberTypes";

export const fetchMemberStatementByMemberId=async(id:string):Promise<MemberStatementData>=>{
  console.log(id);
  
    const response = await axiosInstance.get(FETCH_MEMBER_GENERAL_STATEMENT+`${id}`);
    return response.data;
}