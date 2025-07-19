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
  loanStatus: LoanStatus;
  memberLoanGuarantors: GuarantorList[];
  loanApproval: LoanApprovalListDTO;
  loanDisbursement: LoanDisbursementListDTO;
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
  loanId?: string;
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
  approvedAmount: number;
  loanStatus?: LoanStatus
}

export interface LoanApprovalByIdResponse {
  data: LoanApprovalListDTO;
  success: boolean;
  message: string;
  errors: string[];
}

export interface Guarantor {
  loanGuarantorId: string;
  memberNumber?: string;
  name?: string;
  guaranteedAmount: number;
  guarantorMemberId: string;
  guaranteeDate: string;
}

export interface AddGuarantorRequest {
  loanId: string;
  guarantorMemberId: string;
  guaranteedAmount: number;
  guaranteeDate: string;
}

export interface GuarantorList {
  guarantorMemberId: string;
  loanGuarantorId?: string;
  guarantorMemberName: string;
  memberNumber?: string;
  guaranteedAmount: number;
  guaranteeDate: string;
  loanId: string;
}

export interface UpdateGuarantorRequest {
  loanId: string;
  loanGuarantorId: string;
  guarantorMemberId: string;
  guaranteedAmount: number;
  guaranteeDate: string;
}

export interface LoanDisbursementListDTO {
  loanId: string;
  disbursementDate: string;
  disbursedAmount: number;
}

export interface LoanStagingRequestDTO {
  memberId: string;
  loanApplicationId: string;
  amount: number;
  transactionDate: string;
  description?: string;
}