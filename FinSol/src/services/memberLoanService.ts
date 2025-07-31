import { CREATE_MEMBER_LOAN_APPLICATION, CREATE_MEMBER_LOAN_APPROVAL, CREATE_MEMBER_LOAN_DISBURSEMENT, CREATE_MEMBER_LOAN_STAGE, FETCH_LOAN_APPLICATION_BY_ID, FETCH_LOAN_APPROVAL_BY_ID, FETCH_LOAN_ELIGIBILITY, FETCH_MEMBER_LOAN_APPLICATION } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BaseResponseDTO } from "../types/BaseResponseDTO";
import { LoanApprovalRequest, LoanDisbursementRequestDTO, LoanToMemberDisbursementRequest } from "../types/loanTypeTypes";
import { CreateLoanApplicationRequest, LoanApplicationByIdResponse, LoanApprovalByIdResponse, LoanElegibilityResponse, LoanStagingRequestDTO, PaginatedLoanApplicationList } from "../types/MemberLoan/memberLoanTypes";
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

export const fetchLoanDetailsById = async (loanId: string): Promise<LoanApplicationByIdResponse>=>{
  const response = await axiosInstance.get(FETCH_LOAN_APPLICATION_BY_ID+ `/${loanId}`);
  return response.data;
}

export const submitLoanApproval = async (data: LoanApprovalRequest):Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(CREATE_MEMBER_LOAN_APPROVAL, data);
  return response.data;
};


export const submitLoanDisbursement = async (data: LoanToMemberDisbursementRequest):Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(CREATE_MEMBER_LOAN_DISBURSEMENT, data);
  return response.data;
};


export const fetchLoanApprovalDetailsById = async (loanId: string): Promise<LoanApprovalByIdResponse>=>{
  
  const response = await axiosInstance.get(FETCH_LOAN_APPROVAL_BY_ID+ `/${loanId}`);

  return response.data;
}

export const StageLoanDisbursement = async (data: LoanStagingRequestDTO): Promise<BaseResponseDTO> => {
  const response = await axiosInstance.post(CREATE_MEMBER_LOAN_STAGE, data);
  return response.data;
}