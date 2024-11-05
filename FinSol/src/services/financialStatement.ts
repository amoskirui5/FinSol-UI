import { FETCH_TRIAL_BALANCE } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { TrialBalanceResponse } from "../types/Financials/FinancialTypes";

export const fetchTrialBalance = async (startDate?: string, endDate?: string): Promise<TrialBalanceResponse> => {
    const response = await axiosInstance.get(FETCH_TRIAL_BALANCE,
        {
            params: {
                startDate, endDate
            }
        });
    return response.data;
}