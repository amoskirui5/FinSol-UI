import axiosInstance from '../interceptors/globaInterceptor';
import {
  FETCH_TRIAL_BALANCE,
  FETCH_BALANCE_SHEET,
  FETCH_PROFIT_LOSS,
  FETCH_CASH_FLOW,
  EXPORT_TRIAL_BALANCE,
  EXPORT_BALANCE_SHEET,
  EXPORT_PROFIT_LOSS,
  EXPORT_CASH_FLOW
} from '../constants/apiEndpoints';
import {
  TrialBalanceResponse,
  BalanceSheetDataResponse,
  ProfitLossResponse,
  CashFlowResponse,
  FinancialReportRequest
} from '../types/Financials/EnhancedFinancialTypes';

// Enhanced Financial Reporting Services
export const getTrialBalance = async (filter: FinancialReportRequest): Promise<TrialBalanceResponse> => {
  const response = await axiosInstance.get(FETCH_TRIAL_BALANCE, {
    params: filter,
  });
  return response.data;
};

export const getBalanceSheet = async (filter: FinancialReportRequest): Promise<BalanceSheetDataResponse> => {
  const response = await axiosInstance.get(FETCH_BALANCE_SHEET, {
    params: filter,
  });
  return response.data;
};

export const getProfitLoss = async (filter: FinancialReportRequest): Promise<ProfitLossResponse> => {
  const response = await axiosInstance.get(FETCH_PROFIT_LOSS, {
    params: filter,
  });
  return response.data;
};

export const getCashFlow = async (filter: FinancialReportRequest): Promise<CashFlowResponse> => {
  const response = await axiosInstance.get(FETCH_CASH_FLOW, {
    params: filter,
  });
  return response.data;
};

// Export Services
export const exportTrialBalance = async (filter: FinancialReportRequest, format: 'excel' | 'pdf'): Promise<Blob> => {
  const response = await axiosInstance.get(EXPORT_TRIAL_BALANCE, {
    params: { ...filter, format },
    responseType: 'blob',
  });
  return response.data;
};

export const exportBalanceSheet = async (filter: FinancialReportRequest, format: 'excel' | 'pdf'): Promise<Blob> => {
  const response = await axiosInstance.get(EXPORT_BALANCE_SHEET, {
    params: { ...filter, format },
    responseType: 'blob',
  });
  return response.data;
};

export const exportProfitLoss = async (filter: FinancialReportRequest, format: 'excel' | 'pdf'): Promise<Blob> => {
  const response = await axiosInstance.get(EXPORT_PROFIT_LOSS, {
    params: { ...filter, format },
    responseType: 'blob',
  });
  return response.data;
};

export const exportCashFlow = async (filter: FinancialReportRequest, format: 'excel' | 'pdf'): Promise<Blob> => {
  const response = await axiosInstance.get(EXPORT_CASH_FLOW, {
    params: { ...filter, format },
    responseType: 'blob',
  });
  return response.data;
};