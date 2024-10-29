import { UUID } from "crypto";
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


export interface MemberAccountSettingsDetailsResponse {
  data: MemberAccountsListResponseDTO[];
  success: boolean;
  message: string;
  errors: string[];
}

export interface ReceiptItemDTO {
  key: string;
  loanNo?: string;
  loanAppId?: string;
  description: string;
  amountDue: number;
  amountReceipted: number;
  accountType: MemberAccountType
}

export interface ReceiptItemResponse {
  data: ReceiptItemDTO[];
  success: boolean;
  message: string;
  errors: string[];
}

export interface CreateMemberReceiptRequestDTO {
  memberId: UUID;
  amount: number
  receiptDate: string
  receiptMethod: string;
  description: string
  debitAccountId: UUID
  transactionReference?: string
  receiptItems: ReceiptItemDTO[]
}
