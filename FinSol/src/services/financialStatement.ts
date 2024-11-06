import { FETCH_BALANCE_SHEET, FETCH_TRIAL_BALANCE } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { BalanceSheetResponse, TrialBalanceResponse } from "../types/Financials/FinancialTypes";

export const fetchTrialBalance = async (startDate?: string, endDate?: string): Promise<TrialBalanceResponse> => {
    const response = await axiosInstance.get(FETCH_TRIAL_BALANCE,
        {
            params: {
                startDate, endDate
            }
        });
    return response.data;
}

export const fetchBalanceSheet = async (years: number[] | null): Promise<BalanceSheetResponse> => {
    const payload = years || [];
    const response = await axiosInstance.post(FETCH_BALANCE_SHEET, payload);
    return response.data;
}