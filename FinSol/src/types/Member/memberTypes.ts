import { Gender } from "../../enums/enums";

export interface CreateMemberRegistrationRequestDTO {
    firstName: string;
    otherName: string;
    memberNumber: string;
    email: string;
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    workPlace?: string;
    workType?: string;
    dateOfBirth?: Date;
    dateJoined: Date;
    nationalID?: string;
    passportNumber?: string;
    taxPIN?: string;
}

export interface MemberFormProps {
    isUpdate?: boolean;
}

export interface MemberListDto {
    memberId: string; 
    firstName: string;
    otherName: string;
    memberNumber: string;
    email?: string;
    phoneNumber?: string;
    bankAccount?: string;
    bankName?: string;
    workPlace?: string; 
    workType?: string;
    dateOfBirth?: Date | null; 
    nationalID?: string;
    passportNumber?: string;
    taxPIN?: string;
    dateJoined: Date; 
    gender?:Gender
  }
  
  export interface PaginatedMemberListResponse {
    data: {
        items: MemberListDto[]; 
        totalRecords: number;
        pageNumber: number;
        pageSize: number;
        totalPages: number;
    };
    success: boolean;
    message: string;
    errors: string[];
}

export interface MemberDetailsResponse {
    data: MemberListDto;
    success: boolean;
    message: string;
    errors: string[];
  }

  export interface MonthlyRepayment {
    month: number;
    year: number;
    amountPaid: number;
    interestPaid: number;
    principalPaid: number;
    paymentDate: string;
  }

  export interface LoanStatement {
    loanId: string;
    loanNumber: string;
    totalLoanAmount: number;
    monthlyRepaymentAmount: number;
    outstandingBalance: number;
    totalPaidAmount: number;
    interestRate: number;
    dueDate: string;
    monthlyRepayments: MonthlyRepayment[];
  }
  
  export interface Deposit {
    depositDate: string;
    amount: number;
    depositType: string;
    notes: string;
  }
  
  export interface MonthlyDeposit {
    totalMonthlyDeposit: number;
    depositMonth: number;
    depositYear: number;
    deposits: Deposit[];
  }
  
  export interface MemberStatementData {
    memberId: string;
    loanStatements: LoanStatement[];
    monthlyDeposits: MonthlyDeposit[];
  }
  export interface RepaymentTableProps {
    repayments: MonthlyRepayment[];
  }

  export interface LoanTableProps {
    loans: LoanStatement[];
  }

  export interface DepositDetailsTableProps {
    deposits: Deposit[];
  }
  
  export interface DepositTableProps {
    deposits: MonthlyDeposit[];
  }
  export interface MemberSelectionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onMemberSelect: (member: { memberId: string; firstName: string; otherName: string }) => void;
  }
  
  export interface MemberSelectFieldProps {
    selectedMember: MemberListDto | null;
    onMemberSelect: (member: MemberListDto) => void;
  }
  export interface MemberNextOfKinDto {
    kinId: string;
    memberId: string;
    firstName: string;
    otherName: string;
    email?: string;
    contact?: string;
    isActive: boolean;
  }
  
  export interface CreateMemberNextOfKinDto {
    memberId: string;
    firstName: string;
    otherName: string;
    email?: string;
    contact?: string;
  }
  
  export interface UpdateMemberNextOfKinDto {
    firstName: string;
    otherName: string;
    email?: string;
    contact?: string;
    isActive: boolean;
    memberId: string;
  }