export interface LoanTypeDetails {
    loanTypeId: string;
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
}