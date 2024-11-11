
import { UUID } from "crypto";

export interface LoanType {
    loanTypeId: UUID;
    loanName: string;
    interestRate: number;
    interestRateType: string;
    interestRateMethod: string;
    processingFee: number;
    maxRepayPeriodInMonths: number;
    membershipDurationRequirementInMonths: number;
    minimumLoanAmount: number;
    maximumLoanAmount: number;
    gracePeriodInMonths: number;
    latePaymentFee: number;
    isCollateralRequired: boolean;
    isGuarantorRequired: boolean;
    chartOfAccountName: string;
    chartOfAccountId: UUID,
    interestChartOfAccountId: string;
    penaltyChartOfAccountId: string;
    depositMultiplier: number;
    penaltyFee: number;

}

export interface LoanTypeTableProps {
    loanTypes: LoanType[];
    onViewDetails: (id: UUID) => void;
    onEdit: (id: UUID) => void;
    onDelete: (id: string) => void;
    onRegister: () => void;
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}

export interface LoanTypeCreationRequestDTO {
    loanName: string;
    accountId: number;
    gracePeriodInMonths: number;
    maxRepayPeriodInMonths: number;
    membershipDurationRequirementInMonths: number;
    isGuarantorRequired: boolean;
    interestRate: number;
    interestRateMethod: string;
    interestRateType: string;
    isCollateralRequired: boolean;
    latePaymentFee: number;
    maximumLoanAmount: number;
    minimumLoanAmount: number;
    processingFee: number;
    interestAccountId: string;
    penaltyAccountId: string;
    depositMultiplier: number;
    penaltyFee: number;
}

export interface LoanTypeDetailsResponse {
    data: LoanType;
    success: boolean;
    message: string;
    errors: string[];
}

export interface PaginatedLoanTypeResponse {
    data: {
        items: LoanType[];
        totalRecords: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    };
    success: boolean;
    message: string;
    errors: string[];
}

export interface LoanApprovalRequest {
    approvalDate: Date;
    amount: number;
    comments?: string;
    repaymentPeriod: number;
    loanApplicationsId?: string
}

export interface LoanApprovalFormProps {
    initialValues: LoanApprovalRequest;
    onSubmit: (values: LoanApprovalRequest) => void;
    loading?: boolean;
}

export interface LoanDisbursementRequestDTO {
    dateDisbursed: string;
    amount: number;
    accountNumber: string;
    approvalId?: string;
    loanAppId?: string;
    memberId?: string;
    paymentMethod: string;
    transactionReference: string;
    loanId: string;
    debitAccountId: string;
    loanTypeId: string
}
