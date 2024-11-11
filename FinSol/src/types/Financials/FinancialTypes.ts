export interface TrialBalanceEntry {
    accountName: string;
    debit: number;
    credit: number;
  }
  
  export interface TrialBalanceResponse {
    data: {
      entries: TrialBalanceEntry[];
      totalDebit: number;
      totalCredit: number;
      startdate: string;
      enddate: string;
    };
    success: boolean;
    message: string;
    errors: string[];
  }
  
  type AmountsByYear = {
    [year: string]: number;
  };

  export interface Totals {
    assets: AmountsByYear;
    liabilities: AmountsByYear;
    equity: AmountsByYear;
}

  
  export interface BalanceSheetEntry {
    accountName: string;
    amountsByYear: AmountsByYear;
  }
  
  export interface BalanceSheetResponse {
    data: {
      assets: BalanceSheetEntry[];
      liabilities: BalanceSheetEntry[];
      equity: BalanceSheetEntry[];
      totalAssetsByYear: AmountsByYear;
      totalLiabilitiesByYear: AmountsByYear;
      totalEquityByYear: AmountsByYear;
    };
    success: boolean;
    message: string;
    errors: string[];
  }

  export interface CashbookRecord {
    transactionId:string;
    transactionDescription: string;
    debit: number;
    credit: number;
    balance: number;
    transactionDate:Date
  }

  
  export interface CashbookRecordResponse {
    data:CashbookRecord[],
    success: boolean;
    message: string;
    errors: string[];
  }