import { CREATE_FINANCIAL_YEAR, DELETE_FINANCIAL_YEAR, GET_FINANCIAL_YEARS, UPDATE_FINANCIAL_YEAR } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { FinancialYear, FinancialYearApiPayload, UpdateFinancialYearApiPayload, FinancialYearListResponse } from "../types/Settings/financialYearTypes";

export const saveFinancialYear = async (financialYear: FinancialYearApiPayload): Promise<FinancialYear> => {
  const response = await axiosInstance.post(CREATE_FINANCIAL_YEAR, financialYear);
  return response.data;
}

export const updateFinancialYear = async (financialYear: UpdateFinancialYearApiPayload): Promise<FinancialYear> => {
  const response = await axiosInstance.put(UPDATE_FINANCIAL_YEAR, financialYear);
  return response.data;
}

export const deleteFinancialYear = async (financialYearId: string): Promise<void> => {
  await axiosInstance.delete(`${DELETE_FINANCIAL_YEAR}/${financialYearId}`);
}

export const fetchFinancialYears = async (): Promise<FinancialYearListResponse> => {
  const response = await axiosInstance.get(GET_FINANCIAL_YEARS);
  return response.data;
}