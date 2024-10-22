import { CREATE_MEMBER_LOAN_APPLICATION, FETCH_MEMBER_LOAN_APPLICATION } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { CreateLoanApplicationRequest, PaginatedLoanApplicationList } from "../types/MemberLoan/memberLoanTypes";

export const submitLoanApplication = async (data: CreateLoanApplicationRequest):Promise<BaseResponseDTO> => {
    const response = await axiosInstance.post(CREATE_MEMBER_LOAN_APPLICATION, data);
    return response.data;
  };

  export const fetchLoanApplications = async ():Promise<PaginatedLoanApplicationList>=>{
    const response = await axiosInstance.post(FETCH_MEMBER_LOAN_APPLICATION);
    return response.data;
  }