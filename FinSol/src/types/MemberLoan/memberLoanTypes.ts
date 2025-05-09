import { UUID } from "crypto";
import { LoanStatus } from "../../enums/enums";

export interface CreateLoanApplicationRequest {
  applicationDate: string;
  loanTypeId: string;
  memberId: string;
  repayPeriod: number;
  amount: number;
}

export interface LoanApplicationList {
  loanNumber: string;
  loanId: string;
  applicationDate: string;
  loanType: string;
  loanTypeId: string;
  memberNumber: string;
  memberName?: string;
  memberId: string;
  repayPeriod: number;
  amount: number;
  loanStatus: LoanStatus
}

export interface PaginatedLoanApplicationList {
  data: {
    items: LoanApplicationList[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
  errors: string[];
}

export interface LoanInfoResponseDTO {
  memberId: UUID;
  memberName: string;
  memberNumber: string;
  totalDeposits: number;
  maxLoanQualified: number;
  maxRepayPeriod: number;
  loanBalance: number;
  hasExistingLoan: boolean
  status: string;
}

export interface LoanElegibilityResponse {
  data: LoanInfoResponseDTO
  success: boolean;
  message: string;
  errors: string[];
}


export interface LoanApplicationByIdResponse {
  data: LoanApplicationList;
  success: boolean;
  message: string;
  errors: string[];
}

export interface LoanApprovalListDTO {
  loanNumber: string;
  loanId: string;
  approvalDate: string;
  loanType: string;
  loanTypeId: string;
  memberNumber: string;
  memberName: string
  memberId: string;
  repayPeriod: number;
  amount: number;
  loanStatus?: LoanStatus
}

export interface LoanApprovalByIdResponse {
  data: LoanApprovalListDTO;
  success: boolean;
  message: string;
  errors: string[];
}