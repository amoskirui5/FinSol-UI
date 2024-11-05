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
  