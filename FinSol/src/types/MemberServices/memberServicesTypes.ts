import { BaseResponseDTO } from '../BaseResponseDTO';

// Enhanced Member Services DTOs
export interface MemberDeposit {
  depositId: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  depositType: 'share_capital' | 'savings' | 'fixed_deposit' | 'special_deposit';
  amount: number;
  depositDate: string;
  maturityDate?: string;
  interestRate?: number;
  status: 'active' | 'matured' | 'withdrawn' | 'closed';
  accountNumber: string;
  description?: string;
  createdBy: string;
  createdDate: string;
}

export interface CreateMemberDepositRequest {
  memberId: string;
  depositType: 'share_capital' | 'savings' | 'fixed_deposit' | 'special_deposit';
  amount: number;
  depositDate: string;
  maturityDate?: string;
  interestRate?: number;
  accountNumber: string;
  description?: string;
  paymentMethod: string;
  referenceNumber?: string;
}

export interface MemberShareCapital {
  shareId: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  shareType: 'ordinary' | 'preference' | 'bonus';
  numberOfShares: number;
  shareValue: number;
  totalValue: number;
  purchaseDate: string;
  certificateNumber: string;
  status: 'active' | 'transferred' | 'redeemed';
  dividendRate?: number;
  lastDividendDate?: string;
  createdBy: string;
  createdDate: string;
}

export interface CreateShareCapitalRequest {
  memberId: string;
  shareType: 'ordinary' | 'preference' | 'bonus';
  numberOfShares: number;
  shareValue: number;
  purchaseDate: string;
  certificateNumber: string;
  dividendRate?: number;
  paymentMethod: string;
  referenceNumber?: string;
}

// Loan Management Enhanced DTOs
export interface LoanApplication {
  applicationId: string;
  applicationNumber: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  loanTypeId: string;
  loanTypeName: string;
  requestedAmount: number;
  approvedAmount?: number;
  repaymentPeriod: number;
  interestRate: number;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'disbursed' | 'cancelled';
  purpose: string;
  collateralOffered?: string;
  guarantorsRequired: number;
  guarantorsProvided: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingLoans: number;
  creditScore?: number;
  riskRating: 'low' | 'medium' | 'high';
  comments?: string;
  processedBy?: string;
  documents: LoanDocument[];
  guarantors: LoanGuarantor[];
}

export interface LoanDocument {
  documentId: string;
  documentType: string;
  documentName: string;
  filePath: string;
  uploadDate: string;
  uploadedBy: string;
  verified: boolean;
}

export interface LoanGuarantor {
  guarantorId: string;
  memberId: string;
  memberNumber: string;
  memberName: string;
  guaranteedAmount: number;
  guarantorType: 'member' | 'external';
  relationshipToApplicant: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalDate?: string;
  comments?: string;
}

export interface CreateLoanApplicationRequest {
  memberId: string;
  loanTypeId: string;
  requestedAmount: number;
  repaymentPeriod: number;
  purpose: string;
  collateralOffered?: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingLoans: number;
}

export interface LoanApproval {
  approvalId: string;
  applicationId: string;
  approvedAmount: number;
  approvedTerm: number;
  approvedInterestRate: number;
  approvalDate: string;
  approvedBy: string;
  conditions?: string;
  disbursementInstructions?: string;
  status: 'pending_disbursement' | 'disbursed' | 'cancelled';
}

export interface CreateLoanApprovalRequest {
  applicationId: string;
  approvedAmount: number;
  approvedTerm: number;
  approvedInterestRate: number;
  conditions?: string;
  disbursementInstructions?: string;
}

export interface LoanDisbursement {
  disbursementId: string;
  approvalId: string;
  applicationId: string;
  memberId: string;
  disbursedAmount: number;
  disbursementDate: string;
  disbursementMethod: 'bank_transfer' | 'cash' | 'cheque' | 'mobile_money';
  accountNumber?: string;
  bankName?: string;
  chequeNumber?: string;
  referenceNumber: string;
  disbursedBy: string;
  status: 'completed' | 'pending' | 'failed';
  fees: DisbursementFee[];
}

export interface DisbursementFee {
  feeType: string;
  amount: number;
  description: string;
}

export interface CreateLoanDisbursementRequest {
  approvalId: string;
  disbursedAmount: number;
  disbursementDate: string;
  disbursementMethod: 'bank_transfer' | 'cash' | 'cheque' | 'mobile_money';
  accountNumber?: string;
  bankName?: string;
  chequeNumber?: string;
  referenceNumber: string;
  fees: DisbursementFee[];
}

// Loan Eligibility DTOs
export interface LoanEligibility {
  memberId: string;
  memberNumber: string;
  memberName: string;
  membershipDuration: number;
  isEligible: boolean;
  eligibilityFactors: EligibilityFactor[];
  maxLoanAmount: number;
  recommendedAmount: number;
  creditScore: number;
  riskRating: 'low' | 'medium' | 'high';
  existingLoans: ExistingLoan[];
  savingsBalance: number;
  shareCapitalBalance: number;
}

export interface EligibilityFactor {
  factor: string;
  status: 'met' | 'not_met' | 'partial';
  description: string;
  weight: number;
}

export interface ExistingLoan {
  loanId: string;
  loanNumber: string;
  loanType: string;
  originalAmount: number;
  outstandingBalance: number;
  monthlyRepayment: number;
  status: string;
}

// Response DTOs
export interface MemberDepositsResponse extends BaseResponseDTO {
  data: {
    items: MemberDeposit[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalAmount: number;
  };
}

export interface MemberShareCapitalResponse extends BaseResponseDTO {
  data: {
    items: MemberShareCapital[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalShares: number;
    totalValue: number;
  };
}

export interface LoanApplicationsResponse extends BaseResponseDTO {
  data: {
    items: LoanApplication[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface LoanApplicationResponse extends BaseResponseDTO {
  data: LoanApplication;
}

export interface LoanApprovalsResponse extends BaseResponseDTO {
  data: {
    items: LoanApproval[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface LoanDisbursementsResponse extends BaseResponseDTO {
  data: {
    items: LoanDisbursement[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalDisbursed: number;
  };
}

export interface LoanEligibilityResponse extends BaseResponseDTO {
  data: LoanEligibility;
}