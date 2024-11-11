import { UUID } from "crypto";
import { DELETE_ACCOUNT_ClASS, DELETE_CHART_OF_ACCOUNT, EDIT_ACCOUNT_CLASS, EDIT_CHARTS_OF_ACCOUNT, GET_ACCOUNT_CLASS, GET_ACCOUNT_CLASS_BY_ID, GET_CHART_OF_ACCOUNT, GET_CHART_OF_ACCOUNT_BY_ID, REGISTER_ACCOUNT_CLASS, REGISTER_CHARTS_OF_ACCOUNT } from "../constants/apiEndpoints";
import axiosInstance from "../interceptors/globaInterceptor";
import { AccountClassResponse, AccountClassResponseById, ChartOfAccount, ChartOfAccountResponse, ChartOfAccountResponseById, EditChartOfAccountDTO, RegisterAccountClassDTO, RegisterAccountDTO } from "../types/accountingTypes";
import { BaseResponseDTO } from "../types/BaseResponseDTO";

export const registerAccountClass = async (params: RegisterAccountClassDTO): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.post(REGISTER_ACCOUNT_CLASS, params);
    return response.data;
}

export const getAccountClass = async (): Promise<AccountClassResponse> => {
    const response = await axiosInstance.get(GET_ACCOUNT_CLASS);
    return response.data

}


export const getAccountClassById = async (id: UUID): Promise<AccountClassResponseById> => {
    const response = await axiosInstance.get(GET_ACCOUNT_CLASS_BY_ID + `/${id}`);
    return response.data

}

export const editAccountClass = async (id: string, params: RegisterAccountClassDTO): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.put(`${EDIT_ACCOUNT_CLASS}/${id}`, params);
    return response.data


}

export const registerChartOfAccount = async (params: RegisterAccountDTO): Promise<void> => {
    await axiosInstance.post(REGISTER_CHARTS_OF_ACCOUNT, params);

}

export const editChartOfAccount = async (id: string, params: EditChartOfAccountDTO): Promise<void> => {
    await axiosInstance.put(`${EDIT_CHARTS_OF_ACCOUNT}/${id}`, params);

}

export const getChartOfAccounts = async (): Promise<ChartOfAccountResponse> => {

    const response = await axiosInstance.get(GET_CHART_OF_ACCOUNT);
    return response.data

}

export const getChartOfAccountsById = async (id: UUID): Promise<ChartOfAccountResponseById> => {
    const response = await axiosInstance.get(GET_CHART_OF_ACCOUNT_BY_ID + `/${id}`);
    return response.data

}

export const deleteChartOfAccounts = async (id: UUID): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.put(DELETE_CHART_OF_ACCOUNT + `/${id}`);
    return response.data

}


export const deleteAccountClass = async (id: UUID): Promise<BaseResponseDTO> => {
    const response = await axiosInstance.put(DELETE_ACCOUNT_ClASS + `/${id}`);
    return response.data

}