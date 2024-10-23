export interface CreateLoanApplicationRequest {
    applicationDate: string;
    loanTypeId: string;
    memberNumber: string;
    repayPeriod: number;
    amount: number;
  }

  export interface LoanApplicationList {
    loanNumber:string;
    applicationDate:string;
    loanType:string;
    memberNumber:string;
    repayPeriod: number;
    amount:number
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