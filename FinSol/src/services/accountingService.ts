import { GET_ACCOUNT_CLASS, REGISTER_ACCOUNT_CLASS } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { AccountClassResponse, RegisterAccountClassDTO } from "../types/accountingTypes";

export const registerAccountClass = async (params: RegisterAccountClassDTO): Promise<void> => {
    await axiosInstance.post(REGISTER_ACCOUNT_CLASS, params);

}

export const getAccountClass = async (): Promise<AccountClassResponse> => {
    const response=await axiosInstance.get(GET_ACCOUNT_CLASS);
    return response.data

}