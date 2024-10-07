import { MemberAccountType } from "../../enums/enums";

  
  export interface MemberAccountsListResponseDTO {
    accountId: string;
    accountType: MemberAccountType;
    description: string;
    minimumAmount: number;
    maximumAmount: number;
    isWithdrawable: boolean;
    canGuarantee: boolean;
    isActive: boolean;
    creditAccountNumberId: string;
  }

  export interface RegisterMemberAccountDTO {
    accountType: MemberAccountType;
    description: string;
    minimumAmount: number;
    creditAccountNumberId: string;
    maximumAmount: number;
    isWithdrawable: boolean;
    canGuarantee: boolean;
  }
  
  
  export interface MemberAccountSettingsDetailsResponse{
    data: MemberAccountsListResponseDTO[];
    success: boolean;
    message: string;
    errors: string[];
  }

export interface CreateMemberReceiptRequestDTO {
  memberId: string;
  amount: number;
  receiptDate: string;
  receiptMethod: string;
  debitAccountId: string;
  transactionReference?: string;
  description: string;
  receiptItems : ReceiptItemDTO[]
}

export interface ReceiptItemDTO {
  key: string;
  loanNo?:string;
  description: string;
  amountDue: number;
  amountReceipted: number;
  accountType: MemberAccountType
}
