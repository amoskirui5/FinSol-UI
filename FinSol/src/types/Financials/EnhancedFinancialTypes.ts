import { BaseResponseDTO } from '../BaseResponseDTO';

// Enhanced Financial Reporting DTOs
export interface ProfitLossEntry {
  accountId: string;
  accountName: string;
  accountCode: string;
  currentPeriod: number;
  previousPeriod: number;
  variance: number;
  variancePercentage: number;
  category: 'revenue' | 'cost_of_sales' | 'operating_expenses' | 'other_income' | 'other_expenses';
}

export interface ProfitLossStatement {
  reportDate: string;
  periodStart: string;
  periodEnd: string;
  comparisonPeriodStart?: string;
  comparisonPeriodEnd?: string;
  revenue: ProfitLossEntry[];
  costOfSales: ProfitLossEntry[];
  operatingExpenses: ProfitLossEntry[];
  otherIncome: ProfitLossEntry[];
  otherExpenses: ProfitLossEntry[];
  totals: {
    totalRevenue: number;
    totalCostOfSales: number;
    grossProfit: number;
    totalOperatingExpenses: number;
    operatingProfit: number;
    totalOtherIncome: number;
    totalOtherExpenses: number;
    netProfit: number;
    previousTotalRevenue?: number;
    previousGrossProfit?: number;
    previousOperatingProfit?: number;
    previousNetProfit?: number;
  };
}

export interface CashFlowEntry {
  accountId: string;
  accountName: string;
  amount: number;
  category: 'operating' | 'investing' | 'financing';
  subCategory: string;
}

export interface CashFlowStatement {
  reportDate: string;
  periodStart: string;
  periodEnd: string;
  operatingActivities: CashFlowEntry[];
  investingActivities: CashFlowEntry[];
  financingActivities: CashFlowEntry[];
  totals: {
    netCashFromOperating: number;
    netCashFromInvesting: number;
    netCashFromFinancing: number;
    netChangeInCash: number;
    beginningCashBalance: number;
    endingCashBalance: number;
  };
}

// Enhanced Balance Sheet DTOs
export interface BalanceSheetData {
  reportDate: string;
  currentAssets: BalanceSheetItem[];
  fixedAssets: BalanceSheetItem[];
  otherAssets: BalanceSheetItem[];
  currentLiabilities: BalanceSheetItem[];
  longTermLiabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalLiabilitiesAndEquity: number;
}

export interface BalanceSheetItem {
  accountId: string;
  accountName: string;
  accountCode: string;
  amount: number;
  previousAmount?: number;
}

// Enhanced Cashbook DTOs
export interface CashbookEntry {
  entryId: string;
  date: string;
  reference: string;
  description: string;
  account: string;
  receipts: number;
  payments: number;
  balance: number;
  transactionType: 'receipt' | 'payment';
  documentNumber?: string;
  approvedBy?: string;
}

export interface CashbookSummary {
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
  periodStart: string;
  periodEnd: string;
}

export interface CashbookReport {
  entries: CashbookEntry[];
  summary: CashbookSummary;
}

// Financial Report Request DTOs
export interface FinancialReportRequest {
  startDate: string;
  endDate: string;
  comparisonStartDate?: string;
  comparisonEndDate?: string;
  includeZeroBalances?: boolean;
  organizationId?: string;
}

export interface CashbookReportRequest {
  startDate: string;
  endDate: string;
  accountId?: string;
  transactionType?: 'receipt' | 'payment' | 'all';
  includeApprovedOnly?: boolean;
}

// Response DTOs
export interface ProfitLossResponse extends BaseResponseDTO {
  data: ProfitLossStatement;
}

export interface CashFlowResponse extends BaseResponseDTO {
  data: CashFlowStatement;
}

export interface BalanceSheetDataResponse extends BaseResponseDTO {
  data: BalanceSheetData;
}

export interface CashbookResponse extends BaseResponseDTO {
  data: CashbookReport;
}

// Export for existing types
export * from './FinancialTypes';