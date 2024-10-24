import { CREATE_MEMBER_LOAN_APPLICATION, FETCH_LOAN_ELIGIBILITY, FETCH_MEMBER_LOAN_APPLICATION } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { CreateLoanApplicationRequest, LoanElegibilityResponse, PaginatedLoanApplicationList } from "../types/MemberLoan/memberLoanTypes";
import { PaginationOptions } from "../types/paginationTypes";

export const submitLoanApplication = async (data: CreateLoanApplicationRequest):Promise<BaseResponseDTO> => {
    const response = await axiosInstance.post(CREATE_MEMBER_LOAN_APPLICATION, data);
    return response.data;
  };
  
export const fetchLoanApplications = async (options: PaginationOptions): Promise<PaginatedLoanApplicationList> => {
  const response = await axiosInstance.get(FETCH_MEMBER_LOAN_APPLICATION, {
      params: {
          pageNumber: options.pageNumber,
          pageSize: options.pageSize,
          searchTerm: options.searchTerm,
          searchField: options.searchField,
      },
  });
  return response.data;
};

export const fetchLoanEligibility = async (memberId: string, loanTypeId?: string): Promise<LoanElegibilityResponse> => {
  const url = loanTypeId 
    ? `${FETCH_LOAN_ELIGIBILITY}/${memberId}?loanTypeId=${loanTypeId}` 
    : `${FETCH_LOAN_ELIGIBILITY}/${memberId}`;

  const response = await axiosInstance.get(url);
  return response.data;
}
