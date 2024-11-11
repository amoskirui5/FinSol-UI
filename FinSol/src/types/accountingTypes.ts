import { UUID } from "crypto";

export interface AccountClass {
  id: UUID;
  name: string;
  description: string;
}

export interface RegisterAccountClassDTO {
  className: string,
  description: string,

}

export interface AccountClassResponse {
  data: AccountClass[];
  success: boolean;
  message: string;
  errors: string[];
}


export interface ChartOfAccount {
  id: UUID;
  accountName: string;
  classId: string;
  className: string;
  description: string;
  isReceiptable: boolean;
  isPayable: boolean;
}

export interface RegisterAccountDTO {
  accountName: string,
  classId: UUID,
  description: string,
  accountCode: string,
  isReceiptable: boolean,
  isPayable: boolean
}
export interface EditChartOfAccountDTO {
  accountName: string,
  classId: UUID,
  description: string,
  accountCode: string,
  isReceiptable: boolean,
  isPayable: boolean

}

export interface ChartOfAccountResponse {
  data: ChartOfAccount[];
  success: boolean;
  message: string;
  errors: string[];
}


export interface ChartOfAccountResponseById {
  data: ChartOfAccount;
  success: boolean;
  message: string;
  errors: string[];
}

export interface AccountClassResponseById {
  data: AccountClass;
  success: boolean;
  message: string;
  errors: string[];
}