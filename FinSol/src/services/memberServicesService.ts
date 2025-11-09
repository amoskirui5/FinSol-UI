import axiosInstance from '../interceptors/globaInterceptor';
import {
  GET_MEMBER_DEPOSITS,
  CREATE_MEMBER_DEPOSIT,
  GET_MEMBER_SHARE_CAPITAL,
  CREATE_SHARE_CAPITAL,
  GET_LOAN_APPLICATIONS,
  GET_LOAN_APPLICATION_BY_ID,
  GET_LOAN_APPROVALS,
  GET_LOAN_DISBURSEMENTS
} from '../constants/apiEndpoints';
import {
  MemberDepositsResponse,
  CreateMemberDepositRequest,
  MemberShareCapitalResponse,
  CreateShareCapitalRequest,
  LoanApplicationsResponse,
  LoanApplicationResponse,
  LoanApprovalsResponse,
  LoanDisbursementsResponse
} from '../types/MemberServices/memberServicesTypes';
import { PaginationOptions } from '../types/paginationTypes';

// Member Deposits Services
export const getMemberDeposits = async (options: PaginationOptions): Promise<MemberDepositsResponse> => {
  const response = await axiosInstance.get(GET_MEMBER_DEPOSITS, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

export const createMemberDeposit = async (depositData: CreateMemberDepositRequest): Promise<void> => {
  await axiosInstance.post(CREATE_MEMBER_DEPOSIT, depositData);
};

// Share Capital Services
export const getMemberShareCapital = async (options: PaginationOptions): Promise<MemberShareCapitalResponse> => {
  const response = await axiosInstance.get(GET_MEMBER_SHARE_CAPITAL, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

export const createShareCapital = async (shareData: CreateShareCapitalRequest): Promise<void> => {
  await axiosInstance.post(CREATE_SHARE_CAPITAL, shareData);
};

// Enhanced Loan Management Services
export const getLoanApplications = async (options: PaginationOptions): Promise<LoanApplicationsResponse> => {
  const response = await axiosInstance.get(GET_LOAN_APPLICATIONS, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

export const getLoanApplicationById = async (applicationId: string): Promise<LoanApplicationResponse> => {
  const response = await axiosInstance.get(`${GET_LOAN_APPLICATION_BY_ID}/${applicationId}`);
  return response.data;
};

// Loan Approvals Services
export const getLoanApprovals = async (options: PaginationOptions): Promise<LoanApprovalsResponse> => {
  const response = await axiosInstance.get(GET_LOAN_APPROVALS, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};

// Loan Disbursements Services
export const getLoanDisbursements = async (options: PaginationOptions): Promise<LoanDisbursementsResponse> => {
  const response = await axiosInstance.get(GET_LOAN_DISBURSEMENTS, {
    params: {
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      searchTerm: options.searchTerm,
    },
  });
  return response.data;
};